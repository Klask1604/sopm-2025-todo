import { useData } from "@Contexts/DataContext";
import { isToday, isThisWeek, isThisMonth, parseISO } from "date-fns";
import { CategoryStats } from "@/types";
import { CategoryPerformance } from "./CategoryPerformance";
import { OverviewSection } from "./OverviewSection";

export function ReportsSection() {
  const { tasks, categories } = useData();

  // Overall Stats
  const stats = {
    total: tasks.length,
    completed: tasks.filter((t) => t.status === "completed").length,
    active: tasks.filter(
      (t) => t.status === "upcoming" || t.status === "overdue"
    ).length,
    completedToday: tasks.filter(
      (t) =>
        t.status === "completed" &&
        t.updated_at &&
        isToday(parseISO(t.updated_at))
    ).length,
    completedThisWeek: tasks.filter(
      (t) =>
        t.status === "completed" &&
        t.updated_at &&
        isThisWeek(parseISO(t.updated_at))
    ).length,
    completedThisMonth: tasks.filter(
      (t) =>
        t.status === "completed" &&
        t.updated_at &&
        isThisMonth(parseISO(t.updated_at))
    ).length,
  };

  const completionRate =
    stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

  // Category Stats
  const categoryStats: CategoryStats[] = categories
    .map((cat) => {
      const categoryTasks = tasks.filter((t) => t.category_id === cat.id);
      const completed = categoryTasks.filter(
        (t) => t.status === "completed"
      ).length;
      const active = categoryTasks.filter(
        (t) => t.status === "upcoming" || t.status === "overdue"
      ).length;
      const rate =
        categoryTasks.length > 0
          ? Math.round((completed / categoryTasks.length) * 100)
          : 0;

      return {
        ...cat,
        total: categoryTasks.length,
        completed,
        active,
        completionRate: rate,
      };
    })
    .sort((a, b) => b.total - a.total);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">
          Reports & Analytics 📊
        </h1>
        <p className="text-gray-400">
          Track your productivity and task completion trends.
        </p>
      </div>

      {/* Overview Cards */}
      <OverviewSection
        total={stats.total}
        completed={stats.completed}
        active={stats.active}
        completionRate={completionRate}
      />
      {/* Category Performance */}
      <CategoryPerformance categoriesStats={categoryStats} />
    </div>
  );
}