import { Button } from "@/components/Shadcn/button";
import { Checkbox } from "@/components/Shadcn/checkbox";
import { cn } from "@/lib/utils";
import { Category } from "@/types";
import { Task } from "@/types";
import { motion } from "framer-motion";
import { Pencil } from "lucide-react";

interface KanbanCardProps {
  task: Task;
  category?: Category;
  onEdit: () => void;
  cardVariants: any;
  isCompleted: boolean;
  isCanceled: boolean;
  statusBadge: {
    text: string;
    colorClass: string;
  } | null;
  dateBadge: {
    text: string;
    colorClass: string;
  } | null;
  handleStatusChange: (checked: boolean) => void;
  handleDelete: () => void;
}

export function KanbanCard({
  task,
  category,
  isCompleted,
  isCanceled,
  statusBadge,
  dateBadge,
  onEdit,
  handleStatusChange,
}: KanbanCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "group flex items-start gap-2 p-3 rounded-lg transition-all bg-slate-800 hover:bg-slate-700 border border-white/10",
        isCompleted && "opacity-60",
        isCanceled && "opacity-40"
      )}
    >
      {/* Checkbox - disabled pentru canceled */}
      <Checkbox
        checked={isCompleted}
        onCheckedChange={handleStatusChange}
        disabled={isCanceled}
        className={cn(
          "flex-shrink-0 w-4 h-4 mt-0.5",
          isCanceled && "opacity-50 cursor-not-allowed"
        )}
      />

      {/* Content */}
      <div className="flex-1 min-w-0">
        <h3
          className={cn(
            "text-sm font-medium text-white line-clamp-2",
            isCompleted && "line-through text-gray-500",
            isCanceled && "line-through text-gray-600"
          )}
        >
          {task.title}
        </h3>

        <div className="flex flex-wrap items-center gap-1 mt-2">
          {/* Status Badge */}
          {statusBadge && (
            <span
              className={cn(
                "text-[10px] font-semibold px-1.5 py-0.5 rounded uppercase tracking-wider",
                statusBadge.colorClass
              )}
            >
              {statusBadge.text}
            </span>
          )}

          {/* Date Badge (Today/Tomorrow) */}
          {dateBadge && (
            <span
              className={cn(
                "text-[10px] font-medium px-1.5 py-0.5 rounded",
                dateBadge.colorClass
              )}
            >
              {dateBadge.text}
            </span>
          )}

          {/* Category */}
          {category && (
            <span
              className="text-[10px] px-1.5 py-0.5 rounded font-medium"
              style={{
                color: category.color,
                backgroundColor: category.color + "20",
              }}
            >
              {category.name}
            </span>
          )}
        </div>
      </div>

      {/* Actions - only on hover */}
      <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          variant="ghost"
          size="sm"
          onClick={onEdit}
          className="h-6 w-6 p-0 text-gray-400 hover:text-white"
        >
          <Pencil className="w-3 h-3" />
        </Button>
      </div>
    </motion.div>
  );
}
