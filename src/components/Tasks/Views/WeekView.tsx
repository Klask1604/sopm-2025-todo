import { useState } from "react";
import { Task, Category } from "@Types/index";
import { TaskCard } from "@Tasks/TaskCard";
import { Button } from "@Components/Shadcn/button";
import {
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isSameDay,
  parseISO,
  addWeeks,
  subWeeks,
  isToday,
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@Lib/utils";

interface WeekViewProps {
  tasks: Task[];
  categories: Category[];
  setEditingTask: (task: Task) => void;
}

export function WeekView({ tasks, categories, setEditingTask }: WeekViewProps) {
  const [currentWeekStart, setCurrentWeekStart] = useState(
    startOfWeek(new Date(), { weekStartsOn: 1 }) // Luni = start
  );

  const weekDays = eachDayOfInterval({
    start: currentWeekStart,
    end: endOfWeek(currentWeekStart, { weekStartsOn: 1 }),
  });

  const getTasksForDay = (day: Date) => {
    return tasks.filter((task) => {
      if (!task.due_date) return false;
      return isSameDay(parseISO(task.due_date), day);
    });
  };

  const handlePreviousWeek = () => {
    setCurrentWeekStart(subWeeks(currentWeekStart, 1));
  };

  const handleNextWeek = () => {
    setCurrentWeekStart(addWeeks(currentWeekStart, 1));
  };

  const handleToday = () => {
    setCurrentWeekStart(startOfWeek(new Date(), { weekStartsOn: 1 }));
  };

  return (
    <div className="h-full flex flex-col">
      {/* Week Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 md:p-4 border-b border-white/10 gap-3">
        <div className="flex items-center gap-2 justify-center sm:justify-start">
          <Button
            variant="ghost"
            size="sm"
            onClick={handlePreviousWeek}
            className="text-gray-400 hover:text-white h-8 w-8 p-0"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>

          <div className="text-center min-w-[180px]">
            <h2 className="text-base md:text-lg font-semibold text-white">
              {format(currentWeekStart, "MMMM yyyy")}
            </h2>
            <p className="text-xs md:text-sm text-gray-400">
              {format(currentWeekStart, "dd MMM")} -{" "}
              {format(
                endOfWeek(currentWeekStart, { weekStartsOn: 1 }),
                "dd MMM"
              )}
            </p>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleNextWeek}
            className="text-gray-400 hover:text-white h-8 w-8 p-0"
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={handleToday}
          className="text-blue-400 hover:text-blue-300"
        >
          Today
        </Button>
      </div>

      {/* Scroll Hint on Mobile */}
      <div className="md:hidden text-center py-2 text-xs text-gray-400 border-b border-white/10">
        👈 Swipe to see all days 👉
      </div>

      {/* Week Grid - Horizontal scroll on mobile, grid on desktop */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden md:overflow-x-hidden">
        <div className="flex md:grid md:grid-cols-7 gap-2 p-3 md:p-4 min-w-max md:min-w-0 h-full">
          {weekDays.map((day, index) => {
            const dayTasks = getTasksForDay(day);
            const isCurrentDay = isToday(day);

            return (
              <div
                key={index}
                className="flex flex-col border-2 rounded-lg overflow-hidden flex-shrink-0 w-[85vw] sm:w-64 md:w-auto"
                style={{
                  borderColor: isCurrentDay
                    ? "rgb(59 130 246)"
                    : "rgba(255,255,255,0.1)",
                  backgroundColor: isCurrentDay
                    ? "rgba(59, 130, 246, 0.05)"
                    : "rgba(15, 23, 42, 0.3)",
                }}
              >
                {/* Day Header */}
                <div
                  className={cn(
                    "p-3 text-center border-b flex-shrink-0",
                    isCurrentDay
                      ? "bg-blue-500/20 border-blue-500/30"
                      : "bg-white/5 border-white/10"
                  )}
                >
                  <div
                    className={cn(
                      "text-xs uppercase tracking-wider font-semibold",
                      isCurrentDay ? "text-blue-400" : "text-gray-500"
                    )}
                  >
                    {format(day, "EEE")}
                  </div>
                  <div
                    className={cn(
                      "text-xl md:text-2xl font-bold mt-1",
                      isCurrentDay ? "text-blue-400" : "text-white"
                    )}
                  >
                    {format(day, "d")}
                  </div>
                  {dayTasks.length > 0 && (
                    <div
                      className={cn(
                        "text-xs mt-1 px-2 py-0.5 rounded-full inline-block",
                        isCurrentDay
                          ? "bg-blue-500/30 text-blue-300"
                          : "bg-white/10 text-gray-400"
                      )}
                    >
                      {dayTasks.length} task{dayTasks.length !== 1 ? "s" : ""}
                    </div>
                  )}
                </div>

                {/* Tasks for this day */}
                <div className="flex-1 p-2 space-y-2 overflow-y-auto min-h-0">
                  {dayTasks.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-gray-500 text-xs">
                      No tasks
                    </div>
                  ) : (
                    dayTasks.map((task) => (
                      <TaskCard
                        key={task.id}
                        task={task}
                        category={categories.find(
                          (c) => c.id === task.category_id
                        )}
                        onEdit={() => setEditingTask(task)}
                        variant="week"
                      />
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
