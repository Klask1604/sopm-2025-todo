import { motion } from "framer-motion";
import { Task, Category } from "@Types/index";
import { useData } from "@Contexts/DataContext";

import { cn } from "@Lib/utils";
import { format, parseISO, isToday, isTomorrow, isPast } from "date-fns";
import { ListCard } from "./Cards/ListCard";
import { KanbanCard } from "./Cards/KanbanCard";
import { WeekCard } from "./Cards/WeekCard";

interface TaskCardProps {
  task: Task;
  category?: Category;
  onEdit: () => void;
  variant?: "list" | "kanban" | "week" | "month";
  index?: number;
}

export function TaskCard({
  task,
  category,
  onEdit,
  variant = "list",
  index = 0,
}: TaskCardProps) {
  const { updateTask, deleteTask } = useData();

  const handleStatusChange = async (checked: boolean) => {
    await updateTask(task.id, {
      status: checked ? "completed" : "upcoming",
    });
  };

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this task?")) {
      await deleteTask(task.id);
    }
  };

  const isCompleted = task.status === "completed";
  const isCanceled = task.status === "canceled";

  // Get status badge text and color
  const getStatusBadge = () => {
    // Nu afișăm badge pentru completed (e taiat cu checkbox)
    if (isCompleted) return null;

    let text: string;
    let colorClass: string;

    if (isCanceled) {
      text = "CANCELED";
      colorClass = "bg-gray-500/20 text-gray-400 border-gray-500/30";
    } else if (task.due_date) {
      const dueDate = parseISO(task.due_date);
      if (isPast(dueDate) && !isToday(dueDate) && task.status === "upcoming") {
        text = "OVERDUE";
        colorClass = "bg-red-500/20 text-red-400 border-red-500/30";
      } else {
        text = "UPCOMING";
        colorClass = "bg-blue-500/20 text-blue-400 border-blue-500/30";
      }
    } else {
      text = "UPCOMING";
      colorClass = "bg-blue-500/20 text-blue-400 border-blue-500/30";
    }

    return { text, colorClass };
  };

  const statusBadge = getStatusBadge();

  // Date badge pentru Today/Tomorrow/Date
  const getDateBadge = () => {
    if (!task.due_date || isCompleted || isCanceled) return null;

    const dueDate = parseISO(task.due_date);
    let text: string;
    let colorClass: string;

    if (isToday(dueDate)) {
      text = "Today";
      colorClass = "bg-green-500/20 text-green-400 border-green-500/30";
    } else if (isTomorrow(dueDate)) {
      text = "Tomorrow";
      colorClass = "bg-blue-500/20 text-blue-400 border-blue-500/30";
    } else {
      text = format(dueDate, "MMM dd");
      colorClass = "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }

    return { text, colorClass };
  };

  const dateBadge = getDateBadge();

  // Animation variants for list view
  const cardVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.2,
        delay: index * 0.03, // Stagger effect
      },
    },
  };

  if (variant === "kanban") {
    return (
      <KanbanCard
        task={task}
        category={category}
        onEdit={onEdit}
        isCompleted={isCompleted}
        isCanceled={isCanceled}
        cardVariants={cardVariants}
        statusBadge={statusBadge}
        dateBadge={dateBadge}
        handleStatusChange={handleStatusChange}
        handleDelete={handleDelete}
      />
    );
  }

  if (variant === "week") {
    return (
      <WeekCard
        task={task}
        category={category}
        isCompleted={isCompleted}
        isCanceled={isCanceled}
        handleStatusChange={handleStatusChange}
      />
    );
  }

  if (variant === "month") {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.15 }}
        className={cn(
          "group flex items-center gap-2 p-2 rounded-md bg-slate-800/30 hover:bg-slate-800/50",
          isCompleted && "opacity-50",
          isCanceled && "opacity-40"
        )}
      >
        {category && (
          <div
            className="w-1.5 h-1.5 rounded-full flex-shrink-0"
            style={{ backgroundColor: category.color }}
          />
        )}
        <span
          className={cn(
            "text-xs text-white truncate",
            isCompleted && "line-through text-gray-500",
            isCanceled && "line-through text-gray-600"
          )}
        >
          {task.title}
        </span>
      </motion.div>
    );
  }

  return (
    <ListCard
      task={task}
      category={category}
      onEdit={onEdit}
      handleStatusChange={handleStatusChange}
      handleDelete={handleDelete}
      cardVariants={cardVariants}
      isCompleted={isCompleted}
      isCanceled={isCanceled}
      statusBadge={statusBadge}
      dateBadge={dateBadge}
    />
  );
}
