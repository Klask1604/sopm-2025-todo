import { Button } from "@Components/Shadcn/button";
import {
  Settings,
  Inbox,
  CheckCircle2,
  Tag,
  Star,
  X,
  XCircle,
} from "lucide-react";
import { Task, Category } from "@Types/index";
import { isToday } from "date-fns";
import { cn } from "@Lib/utils";

interface TasksSidebarProps {
  categories: Category[];
  tasks: Task[];
  selectedCategory: string;
  onSelectCategory: (categoryId: string) => void;
  onOpenCategoryDialog: () => void;
  isOpen: boolean;
  onClose: () => void;
}

export function TasksSidebar({
  categories,
  tasks,
  selectedCategory,
  onSelectCategory,
  onOpenCategoryDialog,
  isOpen,
  onClose,
}: TasksSidebarProps) {
  const getTaskCount = (filter: string) => {
    if (filter === "all")
      return tasks.filter(
        (t) => t.status === "upcoming" || t.status === "overdue"
      ).length;
    if (filter === "today") {
      return tasks.filter(
        (t) =>
          (t.status === "upcoming" || t.status === "overdue") &&
          t.due_date &&
          isToday(new Date(t.due_date))
      ).length;
    }
    if (filter === "completed")
      return tasks.filter((t) => t.status === "completed").length;
    if (filter === "canceled")
      return tasks.filter((t) => t.status === "canceled").length;
    return tasks.filter(
      (t) =>
        t.category_id === filter &&
        (t.status === "upcoming" || t.status === "overdue")
    ).length;
  };

  const handleCategorySelect = (categoryId: string) => {
    onSelectCategory(categoryId);
    onClose(); // Auto-close on mobile
  };

  return (
    <aside
      className={cn(
        " w-full lg:w-[350px] border-r border-r-white/10 bg-slate-900 p-4 overflow-y-auto transition-transform duration-300",
        // Mobile: fixed overlay
        "fixed inset-y-0 left-0 z-50 lg:relative",
        // Show/hide on mobile
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}
    >
      {/* Mobile Close Button */}
      <div className="flex items-center justify-between mb-4 lg:hidden">
        <h2 className="text-lg font-semibold text-white">Filters</h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="text-gray-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </Button>
      </div>

      <div className="space-y-6">
        {/* Categories Manager Button */}
        <Button
          onClick={onOpenCategoryDialog}
          variant="outline"
          className="w-full justify-start gap-2"
        >
          <Settings className="w-4 h-4" />
          Manage Categories
        </Button>

        {/* Main Views */}
        <div className="space-y-2">
          <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Views
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {/* Inbox */}
            <button
              onClick={() => handleCategorySelect("all")}
              className={cn(
                "flex flex-col items-start p-3 rounded-xl transition-all hover:scale-105",
                "bg-blue-600/30 border-2",
                selectedCategory === "all"
                  ? "border-blue-400 shadow-lg shadow-blue-500/20"
                  : "border-blue-600/50 hover:border-blue-500/70"
              )}
            >
              <Inbox className="w-5 h-5 text-white mb-2" />
              <div className="w-full flex items-end justify-between">
                <span className="text-xs font-medium text-white">Inbox</span>
                {getTaskCount("all") > 0 && (
                  <span className="text-xs font-semibold text-white">
                    {getTaskCount("all")}
                  </span>
                )}
              </div>
            </button>

            {/* Today */}
            <button
              onClick={() => handleCategorySelect("today")}
              className={cn(
                "flex flex-col items-start p-3 rounded-xl transition-all hover:scale-105",
                "bg-green-600/30 border-2",
                selectedCategory === "today"
                  ? "border-green-400 shadow-lg shadow-green-500/20"
                  : "border-green-600/50 hover:border-green-500/70"
              )}
            >
              <Star className="w-5 h-5 text-white mb-2" />
              <div className="w-full flex items-end justify-between">
                <span className="text-xs font-medium text-white">Today</span>
                {getTaskCount("today") > 0 && (
                  <div className="flex items-center gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                    <span className="text-xs font-semibold text-white">
                      {getTaskCount("today")}
                    </span>
                  </div>
                )}
              </div>
            </button>

            {/* Canceled */}
            <button
              onClick={() => handleCategorySelect("canceled")}
              className={cn(
                "flex flex-col items-start p-3 rounded-xl transition-all hover:scale-105",
                "bg-gray-600/30 border-2",
                selectedCategory === "canceled"
                  ? "border-gray-400 shadow-lg shadow-gray-500/20"
                  : "border-gray-600/50 hover:border-gray-500/70"
              )}
            >
              <XCircle className="w-5 h-5 text-white mb-2" />
              <div className="w-full flex items-end justify-between">
                <span className="text-xs font-medium text-white">Canceled</span>
                {getTaskCount("canceled") > 0 && (
                  <span className="text-xs font-semibold text-white">
                    {getTaskCount("canceled")}
                  </span>
                )}
              </div>
            </button>

            {/* Completed */}
            <button
              onClick={() => handleCategorySelect("completed")}
              className={cn(
                "flex flex-col items-start p-3 rounded-xl transition-all hover:scale-105",
                "bg-orange-600/30 border-2",
                selectedCategory === "completed"
                  ? "border-orange-400 shadow-lg shadow-orange-500/20"
                  : "border-orange-600/50 hover:border-orange-500/70"
              )}
            >
              <CheckCircle2 className="w-5 h-5 text-white mb-2" />
              <div className="w-full flex items-end justify-between">
                <span className="text-xs font-medium text-white">Done</span>
                {getTaskCount("completed") > 0 && (
                  <span className="text-xs font-semibold text-white">
                    {getTaskCount("completed")}
                  </span>
                )}
              </div>
            </button>
          </div>
        </div>

        {/* Categories */}
        <div>
          <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-2">
            <Tag className="w-3 h-3" />
            Categories
          </h3>
          <div className="space-y-1">
            {categories.length === 0 ? (
              <p className="px-3 py-2 text-sm text-gray-500 italic">
                No categories
              </p>
            ) : (
              categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategorySelect(category.id)}
                  className={cn(
                    "w-full flex items-center justify-between gap-3 px-3 py-2 rounded-lg transition-all group",
                    selectedCategory === category.id
                      ? "bg-blue-500/20 text-blue-400"
                      : "text-gray-300 hover:bg-white/5"
                  )}
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: category.color }}
                    />
                    <span className="truncate text-sm">{category.name}</span>
                  </div>
                  {getTaskCount(category.id) > 0 && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-white/10">
                      {getTaskCount(category.id)}
                    </span>
                  )}
                </button>
              ))
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}