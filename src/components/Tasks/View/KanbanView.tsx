import { Task, Category } from "../../../types";
import { useData } from "../../../contexts/DataContext";
import { TaskCard } from "../TaskCard";
import { isToday, isPast, parseISO } from "date-fns";
import { cn } from "../../../lib/utils";
import { AlertCircle, CheckCircle2, Clock, Calendar } from "lucide-react";

interface KanbanViewProps {
  tasks: Task[];
  categories: Category[];
  setEditingTask: (task: Task) => void;
}

type KanbanColumn = "overdue" | "today" | "upcoming" | "completed";

interface Column {
  id: KanbanColumn;
  title: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
}

const columns: Column[] = [
  {
    id: "overdue",
    title: "Overdue",
    icon: <AlertCircle className="w-4 h-4" />,
    color: "text-red-400",
    bgColor: "bg-red-500/10 border-red-500/30",
  },
  {
    id: "today",
    title: "Today",
    icon: <Clock className="w-4 h-4" />,
    color: "text-blue-400",
    bgColor: "bg-blue-500/10 border-blue-500/30",
  },
  {
    id: "upcoming",
    title: "Upcoming",
    icon: <Calendar className="w-4 h-4" />,
    color: "text-purple-400",
    bgColor: "bg-purple-500/10 border-purple-500/30",
  },
  {
    id: "completed",
    title: "Completed",
    icon: <CheckCircle2 className="w-4 h-4" />,
    color: "text-green-400",
    bgColor: "bg-green-500/10 border-green-500/30",
  },
];

export function KanbanView({
  tasks,
  categories,
  setEditingTask,
}: KanbanViewProps) {
  const { updateTask } = useData();

  const getColumnForTask = (task: Task): KanbanColumn => {
    if (task.status === "completed") return "completed";

    if (task.due_date) {
      const dueDate = parseISO(task.due_date);
      if (isPast(dueDate) && !isToday(dueDate)) return "overdue";
      if (isToday(dueDate)) return "today";
    }

    return "upcoming";
  };

  const groupTasksByColumn = () => {
    const grouped: Record<KanbanColumn, Task[]> = {
      overdue: [],
      today: [],
      upcoming: [],
      completed: [],
    };

    tasks.forEach((task) => {
      const column = getColumnForTask(task);
      grouped[column].push(task);
    });

    return grouped;
  };

  const columnTasks = groupTasksByColumn();

  return (
    <div className="h-full overflow-x-auto overflow-y-hidden">
      {/* Scroll Hint on Mobile */}
      <div className="md:hidden text-center py-2 text-xs text-gray-400 border-b border-white/10">
        👈 Swipe horizontally to see all columns 👉
      </div>

      <div className="flex gap-3 md:gap-4 min-w-max p-3 md:p-4 pb-6">
        {columns.map((column) => (
          <div
            key={column.id}
            className="flex-shrink-0 w-[85vw] sm:w-72 md:w-80"
          >
            {/* Column Header */}
            <div
              className={cn(
                "flex items-center justify-between p-3 md:p-4 rounded-t-lg border-2",
                column.bgColor
              )}
            >
              <div className="flex items-center gap-2">
                <span className={column.color}>{column.icon}</span>
                <h3
                  className={cn(
                    "font-semibold text-sm md:text-base",
                    column.color
                  )}
                >
                  {column.title}
                </h3>
              </div>
              <span
                className={cn(
                  "text-xs px-2 py-1 rounded-full font-medium",
                  column.bgColor,
                  column.color
                )}
              >
                {columnTasks[column.id].length}
              </span>
            </div>

            {/* Column Content */}
            <div
              className={cn(
                "min-h-[400px] md:min-h-[500px] max-h-[calc(100vh-250px)] p-2 md:p-3 space-y-2 rounded-b-lg border-2 border-t-0 overflow-y-auto",
                column.bgColor
              )}
            >
              {columnTasks[column.id].length === 0 ? (
                <div className="flex items-center justify-center h-32 text-gray-500 text-sm">
                  No tasks
                </div>
              ) : (
                columnTasks[column.id].map((task) => (
                  <div
                    key={task.id}
                    draggable
                    className="cursor-move hover:scale-[1.02] transition-transform active:scale-95"
                  >
                    <TaskCard
                      task={task}
                      category={categories.find(
                        (c) => c.id === task.category_id
                      )}
                      onEdit={() => setEditingTask(task)}
                      variant="kanban"
                    />
                  </div>
                ))
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
