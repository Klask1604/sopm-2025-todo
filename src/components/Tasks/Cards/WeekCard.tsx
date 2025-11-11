import { Checkbox } from "@/components/Shadcn/checkbox";
import { cn } from "@/lib/utils";
import { Category } from "@/types";
import { Task } from "@/types";
import { motion } from "framer-motion";

interface WeekCardProps {
  task: Task;
  category?: Category;
  isCompleted: boolean;
  isCanceled: boolean;
  handleStatusChange: (checked: boolean) => void;
}

export function WeekCard({
  task,
  category,
  isCompleted,
  isCanceled,
  handleStatusChange,
}: WeekCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.15 }}
      className={cn(
        "group flex items-start gap-2 p-2 rounded-md transition-all bg-slate-800/50 hover:bg-slate-800 border border-white/5",
        isCompleted && "opacity-50",
        isCanceled && "opacity-40"
      )}
    >
      {/* Category dot */}
      {category && (
        <div
          className="w-2 h-2 rounded-full flex-shrink-0 mt-1.5"
          style={{ backgroundColor: category.color }}
        />
      )}

      {/* Content */}
      <div className="flex-1 min-w-0">
        <h3
          className={cn(
            "text-xs font-medium text-white line-clamp-2",
            isCompleted && "line-through text-gray-500",
            isCanceled && "line-through text-gray-600"
          )}
        >
          {task.title}
        </h3>
      </div>

      {/* Quick action - disabled pentru canceled */}
      <Checkbox
        checked={isCompleted}
        onCheckedChange={handleStatusChange}
        disabled={isCanceled}
        className={cn(
          "flex-shrink-0 w-3 h-3 mt-0.5 opacity-0 group-hover:opacity-100",
          isCanceled && "cursor-not-allowed"
        )}
      />
    </motion.div>
  );
}