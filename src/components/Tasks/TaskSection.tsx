import { useState, useEffect } from "react";
import { motion, AnimatePresence, Transition } from "framer-motion";
import { useData } from "@Contexts/DataContext";
import { Button } from "@Components/Shadcn/button";
import { TaskDialog } from "@Tasks/TaskDialog";
import { CategoryDialog } from "@Components/CategoryDialog";
import { TaskList } from "@Tasks/Views/Listview";
import { TasksSidebar } from "@Tasks/TaskSidebar";
import { KanbanView } from "@Tasks/Views/KanbanView";
import { WeekView } from "@Tasks/Views/WeekView";
import { MonthView } from "@Tasks/Views/Monthview";
import {
  Plus,
  LayoutList,
  LayoutGrid,
  CalendarDays,
  Calendar,
  Filter,
} from "lucide-react";
import { isToday } from "date-fns";
import { Task } from "@Types/index";

interface TasksSectionProps {
  initialFilter?: string;
}

type ViewMode = "list" | "kanban" | "week" | "month";

const viewVariants = {
  initial: { opacity: 0, scale: 0.95, y: 10 },
  animate: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.95, y: -10 },
};

const viewTransition: Transition = {
  type: "tween",
  ease: "easeOut",
  duration: 0.2,
};

export function TasksSection({ initialFilter = "all" }: TasksSectionProps) {
  const { tasks, categories } = useData();
  const [selectedCategory, setSelectedCategory] =
    useState<string>(initialFilter);
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  useEffect(() => {
    setSelectedCategory(initialFilter);
  }, [initialFilter]);

  const filteredTasks = (() => {
    if (selectedCategory === "completed") {
      return tasks.filter((t) => t.status === "completed");
    }
    if (selectedCategory === "canceled") {
      return tasks.filter((t) => t.status === "canceled");
    }
    if (selectedCategory === "all") {
      return tasks;
    }
    if (selectedCategory === "today") {
      return tasks.filter((t) => t.due_date && isToday(new Date(t.due_date)));
    }
    return tasks.filter((t) => t.category_id === selectedCategory);
  })();

  const getTitle = () => {
    if (selectedCategory === "all") return "Inbox";
    if (selectedCategory === "today") return "Today";
    if (selectedCategory === "completed") return "Completed";
    if (selectedCategory === "canceled") return "Canceled";
    const category = categories.find((c) => c.id === selectedCategory);
    return category?.name || "My Tasks";
  };

  const showCompletedSection =
    selectedCategory !== "completed" && selectedCategory !== "canceled";

  const viewModes = [
    {
      id: "list" as ViewMode,
      icon: <LayoutList className="w-4 h-4" />,
      label: "List",
    },
    {
      id: "kanban" as ViewMode,
      icon: <LayoutGrid className="w-4 h-4" />,
      label: "Kanban",
    },
    {
      id: "week" as ViewMode,
      icon: <CalendarDays className="w-4 h-4" />,
      label: "Week",
    },
    {
      id: "month" as ViewMode,
      icon: <Calendar className="w-4 h-4" />,
      label: "Month",
    },
  ];

  return (
    <div className="flex h-full relative">
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Tasks Sidebar Component */}
      <TasksSidebar
        categories={categories}
        tasks={tasks}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        onOpenCategoryDialog={() => setIsCategoryDialogOpen(true)}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto flex flex-col">
        <div className="p-4 md:p-6 w-full flex-1 flex flex-col">
          {/* Header with View Toggle */}
          <motion.div
            className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsSidebarOpen(true)}
                className="lg:hidden text-gray-300 hover:text-white p-3 rounded-lg bg-blue-600/80"
              >
                <Filter className="w-5 h-5 mr-2" /> Filters
              </Button>

              <h1 className="text-2xl font-bold text-white">{getTitle()}</h1>
            </div>

            <div className="flex items-center gap-2">
              {/* View Mode Toggle */}
              <div className="flex items-center gap-1 bg-slate-900/50 rounded-lg p-1">
                {viewModes.map((mode) => (
                  <Button
                    key={mode.id}
                    variant={viewMode === mode.id ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode(mode.id)}
                    className="gap-2 transition-all duration-200"
                    title={mode.label}
                  >
                    {mode.icon}
                    <span className="hidden md:inline">{mode.label}</span>
                  </Button>
                ))}
              </div>

              {/* Add Task Button */}
              {selectedCategory !== "completed" &&
                selectedCategory !== "canceled" && (
                  <Button
                    onClick={() => setIsTaskDialogOpen(true)}
                    className="bg-blue-500 hover:bg-blue-600"
                    size="sm"
                  >
                    <Plus className="w-4 h-4 md:mr-2" />
                    <span className="hidden md:inline">Add Task</span>
                  </Button>
                )}
            </div>
          </motion.div>

          {/* View Content with Animations */}
          <div className="flex-1">
            <AnimatePresence mode="wait">
              <motion.div
                key={viewMode}
                variants={viewVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={viewTransition}
                className="h-full"
              >
                {viewMode === "list" && (
                  <TaskList
                    tasks={filteredTasks}
                    showCompleted={showCompletedSection}
                    setEditingTask={setEditingTask}
                  />
                )}
                {viewMode === "kanban" && (
                  <KanbanView
                    tasks={filteredTasks}
                    categories={categories}
                    setEditingTask={setEditingTask}
                  />
                )}
                {viewMode === "week" && (
                  <WeekView
                    tasks={filteredTasks}
                    categories={categories}
                    setEditingTask={setEditingTask}
                  />
                )}
                {viewMode === "month" && (
                  <MonthView
                    tasks={filteredTasks}
                    categories={categories}
                    setEditingTask={setEditingTask}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </main>

      <TaskDialog open={isTaskDialogOpen} onOpenChange={setIsTaskDialogOpen} />
      <CategoryDialog
        open={isCategoryDialogOpen}
        onOpenChange={setIsCategoryDialogOpen}
      />
      {editingTask && (
        <TaskDialog
          open={true}
          onOpenChange={() => setEditingTask(null)}
          task={editingTask}
        />
      )}
    </div>
  );
}
