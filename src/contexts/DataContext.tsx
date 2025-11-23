import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../config/supabase";
import { Task, Category } from "../types";
import { useAuth } from "./AuthContext";

interface DataContextType {
  tasks: Task[];
  categories: Category[];
  loading: boolean;
  error: string | null;
  addTask: (
    task: Omit<
      Task,
      "id" | "user_id" | "created_at" | "updated_at" | "order_index"
    >
  ) => Promise<void>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  addCategory: (name: string, color?: string) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  updateCategory: (id: string, updates: Partial<Category>) => Promise<void>;
  refreshData: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useData must be used within DataProvider");
  }
  return context;
};

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const ensureDefaultCategory = async (userId: string) => {
    console.log("🔍 Checking for default category...");

    try {
      const checkPromise = supabase
        .from("categories")
        .select("*")
        .eq("user_id", userId)
        .eq("is_default", true)
        .maybeSingle();

      const timeoutPromise = new Promise<any>((resolve) =>
        setTimeout(() => resolve({ data: null }), 1500)
      );

      const result = await Promise.race([checkPromise, timeoutPromise]);

      if (result.data) {
        console.log("✅ Default category exists");
        return;
      }

      console.log("⚠️ Creating General category...");
      const { data, error } = await supabase
        .from("categories")
        .insert({
          name: "General",
          color: "#3b82f6",
          user_id: userId,
          is_default: true,
        })
        .select()
        .single();

      if (data && !error) {
        console.log("✅ Default category created:", data);
        setCategories((prev) => [data, ...prev]);
      }
    } catch (error) {
      console.error("❌ Error in ensureDefaultCategory:", error);
    }
  };

  const loadData = async () => {
    if (!user) {
      setTasks([]);
      setCategories([]);
      setLoading(false);
      return;
    }

    console.log("📊 Loading data for user:", user.id);

    // NU setăm loading=true pentru refresh-uri ulterioare
    // Doar la primul load
    const isInitialLoad = tasks.length === 0 && categories.length === 0;
    if (isInitialLoad) {
      setLoading(true);
    }

    const absoluteTimeout = setTimeout(() => {
      console.warn("⏰ Data loading timeout - continuing anyway");
      setLoading(false);
    }, 4000);

    try {
      // Ensure default category (non-blocking)
      if (isInitialLoad) {
        ensureDefaultCategory(user.id);
      }

      // Încarcă categoriile
      const catPromise = supabase
        .from("categories")
        .select("*")
        .eq("user_id", user.id)
        .order("is_default", { ascending: false });

      const catTimeout = new Promise<any>((resolve) =>
        setTimeout(() => {
          console.warn("⏰ Categories timeout");
          resolve({ data: [], error: null });
        }, 2000)
      );

      const catResult = await Promise.race([catPromise, catTimeout]);
      if (catResult.data) {
        setCategories(catResult.data);
        console.log("✅ Loaded categories:", catResult.data.length);
      }

      // Încarcă tasks
      const taskPromise = supabase
        .from("tasks")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      const taskTimeout = new Promise<any>((resolve) =>
        setTimeout(() => {
          console.warn("⏰ Tasks timeout");
          resolve({ data: [], error: null });
        }, 2000)
      );

      const taskResult = await Promise.race([taskPromise, taskTimeout]);
      if (taskResult.data) {
        setTasks(taskResult.data);
        console.log("✅ Loaded tasks:", taskResult.data.length);
      }
    } catch (err) {
      console.error("❌ Error loading data:", err);
    } finally {
      clearTimeout(absoluteTimeout);
      console.log("🏁 loadData finished");
      setLoading(false);
    }
  };

  const refreshData = async () => {
    console.log("🔄 Refreshing data...");
    await loadData();
  };

  useEffect(() => {
    if (user) {
      loadData();
    } else {
      setTasks([]);
      setCategories([]);
      setLoading(false);
    }
  }, [user?.id]);

  // Real-time subscriptions - simplificat
  useEffect(() => {
    if (!user || loading) return;

    console.log("🔄 Setting up real-time subscriptions");

    const tasksChannel = supabase
      .channel(`tasks_${user.id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "tasks",
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          console.log("🔄 Real-time tasks change:", payload.eventType);
          // Auto-refresh pentru siguranță
          loadData();
        }
      )
      .subscribe();

    const categoriesChannel = supabase
      .channel(`categories_${user.id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "categories",
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          console.log("🔄 Real-time categories change:", payload.eventType);
          // Auto-refresh pentru siguranță
          loadData();
        }
      )
      .subscribe();

    return () => {
      console.log("🔌 Unsubscribing from real-time");
      tasksChannel.unsubscribe();
      categoriesChannel.unsubscribe();
    };
  }, [user?.id, loading]);

  // ============================================
  // TASK OPERATIONS - Cu auto-refresh
  // ============================================

  const addTask = async (
    task: Omit<
      Task,
      "id" | "user_id" | "created_at" | "updated_at" | "order_index"
    >
  ) => {
    if (!user) throw new Error("User not authenticated");

    console.log("➕ Adding task:", task.title);

    const { data, error } = await supabase
      .from("tasks")
      .insert({
        ...task,
        user_id: user.id,
        order_index: tasks.length,
      })
      .select()
      .single();

    if (error) {
      console.error("❌ Error adding task:", error);
      throw error;
    }

    console.log("✅ Task added:", data.id);

    // AUTO-REFRESH pentru a vedea schimbarea imediat
    await refreshData();
  };

  const updateTask = async (id: string, updates: Partial<Task>) => {
    console.log("✏️ Updating task:", id);

    const { error } = await supabase.from("tasks").update(updates).eq("id", id);

    if (error) {
      console.error("❌ Error updating task:", error);
      throw error;
    }

    console.log("✅ Task updated");

    // AUTO-REFRESH
    await refreshData();
  };

  const deleteTask = async (id: string) => {
    console.log("🗑️ Deleting task:", id);

    const { error } = await supabase.from("tasks").delete().eq("id", id);

    if (error) {
      console.error("❌ Error deleting task:", error);
      throw error;
    }

    console.log("✅ Task deleted");

    // AUTO-REFRESH
    await refreshData();
  };

  // ============================================
  // CATEGORY OPERATIONS - Cu auto-refresh
  // ============================================

  const addCategory = async (name: string, color: string = "#3b82f6") => {
    if (!user) throw new Error("User not authenticated");

    console.log("➕ Adding category:", name);

    const { data, error } = await supabase
      .from("categories")
      .insert({
        name,
        color,
        user_id: user.id,
        is_default: false,
      })
      .select()
      .single();

    if (error) {
      console.error("❌ Error adding category:", error);
      throw error;
    }

    console.log("✅ Category added:", data.id);

    // AUTO-REFRESH
    await refreshData();
  };

  const updateCategory = async (id: string, updates: Partial<Category>) => {
    console.log("✏️ Updating category:", id);

    // Nu permite modificarea flag-ului is_default
    const { is_default, ...safeUpdates } = updates;

    const { error } = await supabase
      .from("categories")
      .update(safeUpdates)
      .eq("id", id);

    if (error) {
      console.error("❌ Error updating category:", error);
      throw error;
    }

    console.log("✅ Category updated");

    // AUTO-REFRESH
    await refreshData();
  };

  const deleteCategory = async (id: string) => {
    const category = categories.find((c) => c.id === id);
    if (!category) {
      throw new Error("Category not found");
    }

    if (category.is_default) {
      throw new Error("Cannot delete default category");
    }

    console.log("🗑️ Deleting category:", id);

    const defaultCategory = categories.find((c) => c.is_default);
    if (!defaultCategory) throw new Error("Default category not found");

    // Move all tasks to default category
    const tasksToMove = tasks.filter((t) => t.category_id === id);
    console.log("📦 Moving tasks to default category:", tasksToMove.length);

    for (const task of tasksToMove) {
      await supabase
        .from("tasks")
        .update({ category_id: defaultCategory.id })
        .eq("id", task.id);
    }

    // Delete category
    const { error } = await supabase.from("categories").delete().eq("id", id);
    if (error) {
      console.error("❌ Error deleting category:", error);
      throw error;
    }

    console.log("✅ Category deleted");

    // AUTO-REFRESH
    await refreshData();
  };

  const value = {
    tasks,
    categories,
    loading,
    error,
    addTask,
    updateTask,
    deleteTask,
    addCategory,
    deleteCategory,
    updateCategory,
    refreshData,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};
