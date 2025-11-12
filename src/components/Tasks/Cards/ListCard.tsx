import { Button } from "@/components/Shadcn/button";
import { Checkbox } from "@/components/Shadcn/checkbox";
import { cn } from "@/lib/utils";
import { Category } from "@/types";
import { Task } from "@/types";
import { motion } from "framer-motion";
import { Pencil, Trash2 } from "lucide-react";

interface ListCardProps {
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

export function ListCard({
  task,
  category,
  cardVariants,
  isCompleted,
  isCanceled,
  statusBadge,
  dateBadge,
  onEdit,
  handleStatusChange,
  handleDelete,
}: ListCardProps) {
  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      className={cn(
        "group flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 px-3 sm:px-4 py-3 rounded-lg transition-all bg-slate-900",
        "hover:bg-white/5 border border-transparent hover:border-white/10",
        isCompleted && "opacity-50",
        isCanceled && "opacity-40"
      )}
    >
      {/* Checkbox - disabled pentru canceled */}
      <Checkbox
        checked={isCompleted}
        onCheckedChange={handleStatusChange}
        disabled={isCanceled}
        className={cn(
          "flex-shrink-0 w-5 h-5 rounded border-gray-600",
          "data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500 data-[state=checked]:text-white",
          isCanceled && "opacity-50 cursor-not-allowed"
        )}
      />

      {/* Status Badge - desktop */}
      {statusBadge && (
        <span
          className={cn(
            "flex-shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full border uppercase tracking-wider",
            statusBadge.colorClass,
            "hidden sm:inline-flex"
          )}
        >
          {statusBadge.text}
        </span>
      )}

      {/* Date Badge - desktop (Today/Tomorrow) */}
      {dateBadge && (
        <span
          className={cn(
            "flex-shrink-0 text-xs font-medium px-2.5 py-1 rounded-full border",
            dateBadge.colorClass,
            "hidden sm:inline-flex"
          )}
        >
          {dateBadge.text}
        </span>
      )}

      {/* Task Title */}
      <div className="flex-1 min-w-0">
        <h3
          className={cn(
            "text-base sm:text-sm font-medium",
            isCompleted && "line-through text-gray-500",
            isCanceled && "line-through text-gray-600"
          )}
        >
          {task.title}
        </h3>
        {task.description && (
          <p className="text-xs text-gray-400 mt-0.5 line-clamp-1 sm:hidden">
            {task.description}
          </p>
        )}
      </div>

      {/* Category - desktop */}
      {category && (
        <span
          className="flex-shrink-0 text-xs text-white font-medium px-2.5 py-1 rounded-full hidden sm:inline-flex"
          style={{
            color: category.color,
            backgroundColor: category.color + "30",
          }}
        >
          {category.name}
        </span>
      )}

      {/* Actions */}
      <div className="flex items-center gap-1 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
        <Button
          variant="ghost"
          size="sm"
          onClick={onEdit}
          className="h-8 w-8 sm:h-7 sm:w-7 p-0 text-gray-400 hover:text-white hover:bg-white/10"
        >
          <Pencil className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleDelete}
          className="h-8 w-8 sm:h-7 sm:w-7 p-0 text-gray-400 hover:text-red-400 hover:bg-red-500/10"
        >
          <Trash2 className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
        </Button>
      </div>

      {/* Mobile row 2 */}
      <div className="flex items-center gap-2 flex-wrap sm:hidden">
        {statusBadge && (
          <span
            className={cn(
              "flex-shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full border uppercase tracking-wider",
              statusBadge.colorClass
            )}
          >
            {statusBadge.text}
          </span>
        )}

        {dateBadge && (
          <span
            className={cn(
              "flex-shrink-0 text-xs font-medium px-2.5 py-1 rounded-full border",
              dateBadge.colorClass
            )}
          >
            {dateBadge.text}
          </span>
        )}

        {category && (
          <span
            className="flex-shrink-0 text-xs text-white font-medium px-2.5 py-1 rounded-full"
            style={{
              color: category.color,
              backgroundColor: category.color + "30",
            }}
          >
            {category.name}
          </span>
        )}
      </div>
    </motion.div>
  );
}