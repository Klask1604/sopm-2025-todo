import { useState } from "react";
import { motion } from "framer-motion";
import { Task } from "@Types/index";
import { useData } from "@Contexts/DataContext";
import { TaskCard } from "@Tasks/TaskCard";
import { format, isToday, isTomorrow, isPast, parseISO } from "date-fns";
import { ChevronRight } from "lucide-react";
import { cn } from "@Lib/utils";

interface TaskListProps {
  tasks: Task[];
  showCompleted?: boolean;
  setEditingTask: (task: Task) => void;
}

export function TaskList({
  tasks,
  showCompleted = true,
  setEditingTask,
}: TaskListProps) {
  const { categories } = useData();
  const [showCompletedSection, setShowCompletedSection] = useState(true);
  const [showCanceledSection, setShowCanceledSection] = useState(false);

  // Separate tasks by status
  const activeTasks = tasks.filter(
    (t) => t.status !== "completed" && t.status !== "canceled"
  );
  const completedTasks = tasks.filter((t) => t.status === "completed");
  const canceledTasks = tasks.filter((t) => t.status === "canceled");

  const groupTasksByDate = (taskList: Task[]) => {
    return taskList.reduce((acc, task) => {
      if (!task.due_date) {
        if (!acc["No Due Date"]) acc["No Due Date"] = [];
        acc["No Due Date"].push(task);
        return acc;
      }

      const dueDate = parseISO(task.due_date);
      let dateKey: string;

      if (isToday(dueDate)) {
        dateKey = "Today";
      } else if (isTomorrow(dueDate)) {
        dateKey = "Tomorrow";
      } else if (isPast(dueDate) && task.status === "upcoming") {
        dateKey = "Overdue";
      } else {
        dateKey = format(dueDate, "EEEE - dd MMM yyyy");
      }

      if (!acc[dateKey]) acc[dateKey] = [];
      acc[dateKey].push(task);
      return acc;
    }, {} as Record<string, Task[]>);
  };

  const activeGrouped = groupTasksByDate(activeTasks);
  const sortedActiveGroups = Object.entries(activeGrouped).sort(([a], [b]) => {
    const order = ["Overdue", "Today", "Tomorrow"];
    const aIndex = order.indexOf(a);
    const bIndex = order.indexOf(b);
    if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
    if (aIndex !== -1) return -1;
    if (bIndex !== -1) return 1;
    return 0;
  });

  if (tasks.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="text-center py-12 glass-card rounded-lg border border-white/10"
      >
        <p className="text-gray-400">No tasks yet. Create your first task!</p>
      </motion.div>
    );
  }

  // Dacă showCompleted = false, verificăm dacă avem canceled sau completed tasks
  if (!showCompleted) {
    // Detectăm ce tip de tasks avem
    const hasCanceled = canceledTasks.length > 0;

    // Decidem ce să afișăm bazat pe ce avem
    const tasksToShow = hasCanceled ? canceledTasks : completedTasks;
    const viewTitle = hasCanceled ? "Canceled" : "Completed";

    const groupedTasks = groupTasksByDate(tasksToShow);
    const sortedGroups = Object.entries(groupedTasks).sort(([a], [b]) => {
      const order = ["Today", "Tomorrow"];
      const aIndex = order.indexOf(a);
      const bIndex = order.indexOf(b);
      if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
      if (aIndex !== -1) return -1;
      if (bIndex !== -1) return 1;
      return 0;
    });

    if (sortedGroups.length === 0) {
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="text-center py-12 glass-card rounded-lg border border-white/10"
        >
          <p className="text-gray-400">No {viewTitle.toLowerCase()} tasks.</p>
        </motion.div>
      );
    }

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="space-y-6"
      >
        {sortedGroups.map(([date, groupTasks], groupIndex) => (
          <motion.div
            key={date}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: groupIndex * 0.1 }}
          >
            <div className="flex items-center gap-2 mb-2 px-1">
              <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
                {date}
              </h2>
              <div className="h-px flex-1 bg-white/5" />
              <span className="text-xs text-gray-500">
                {groupTasks.length} task{groupTasks.length !== 1 ? "s" : ""}
              </span>
            </div>

            <div className="space-y-1">
              {groupTasks.map((task, index) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  category={categories.find((c) => c.id === task.category_id)}
                  onEdit={() => setEditingTask(task)}
                  variant="list"
                  index={index}
                />
              ))}
            </div>
          </motion.div>
        ))}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Active Tasks */}
      {sortedActiveGroups.map(([date, groupTasks], groupIndex) => (
        <motion.div
          key={date}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: groupIndex * 0.1 }}
        >
          <div className="flex items-center gap-2 mb-2 px-1">
            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
              {date}
            </h2>
            <div className="h-px flex-1 bg-white/50" />
            <span className="text-xs text-gray-500">
              {groupTasks.length} task{groupTasks.length !== 1 ? "s" : ""}
            </span>
          </div>

          <div className="space-y-1">
            {groupTasks.map((task, index) => (
              <TaskCard
                key={task.id}
                task={task}
                category={categories.find((c) => c.id === task.category_id)}
                onEdit={() => setEditingTask(task)}
                index={index}
              />
            ))}
          </div>
        </motion.div>
      ))}

      {/* Completed Tasks Section */}
      {showCompleted && completedTasks.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: sortedActiveGroups.length * 0.1 }}
          className="pt-4 border-t border-white/5"
        >
          <button
            onClick={() => setShowCompletedSection(!showCompletedSection)}
            className="flex items-center gap-2 mb-2 px-1 hover:text-white text-gray-400 transition-colors w-full"
          >
            <ChevronRight
              className={cn(
                "w-4 h-4 transition-transform",
                showCompletedSection && "rotate-90"
              )}
            />
            <h2 className="text-sm font-semibold uppercase tracking-wider">
              Completed
            </h2>
            <div className="h-px flex-1 bg-white/5" />
            <span className="text-xs text-gray-500">
              {completedTasks.length}
            </span>
          </button>

          {showCompletedSection && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="space-y-1"
            >
              {completedTasks.map((task, index) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  category={categories.find((c) => c.id === task.category_id)}
                  onEdit={() => setEditingTask(task)}
                  index={index}
                />
              ))}
            </motion.div>
          )}
        </motion.div>
      )}

      {/* Canceled Tasks Section */}
      {showCompleted && canceledTasks.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.3,
            delay: (sortedActiveGroups.length + 1) * 0.1,
          }}
          className="pt-4 border-t border-white/5"
        >
          <button
            onClick={() => setShowCanceledSection(!showCanceledSection)}
            className="flex items-center gap-2 mb-2 px-1 hover:text-white text-gray-400 transition-colors w-full"
          >
            <ChevronRight
              className={cn(
                "w-4 h-4 transition-transform",
                showCanceledSection && "rotate-90"
              )}
            />
            <h2 className="text-sm font-semibold uppercase tracking-wider">
              Canceled
            </h2>
            <div className="h-px flex-1 bg-white/5" />
            <span className="text-xs text-gray-500">
              {canceledTasks.length}
            </span>
          </button>

          {showCanceledSection && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="space-y-1"
            >
              {canceledTasks.map((task, index) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  category={categories.find((c) => c.id === task.category_id)}
                  onEdit={() => setEditingTask(task)}
                  index={index}
                />
              ))}
            </motion.div>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}
