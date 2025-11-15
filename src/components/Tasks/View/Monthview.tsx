import { useState } from "react";
import { Task, Category } from "@Types/index";
import { TaskCard } from "@Tasks/TaskCard";
import { Button } from "@Components/Shadcn/button";
import {
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  format,
  isSameDay,
  parseISO,
  addMonths,
  subMonths,
  isToday,
  startOfWeek,
  endOfWeek,
  isSameMonth,
} from "date-fns";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { cn } from "@Lib/utils";

interface MonthViewProps {
  tasks: Task[];
  categories: Category[];
  setEditingTask: (task: Task) => void;
}

export function MonthView({
  tasks,
  categories,
  setEditingTask,
}: MonthViewProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);

  // Get all days to display (including padding days from prev/next month)
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const calendarDays = eachDayOfInterval({
    start: calendarStart,
    end: calendarEnd,
  });

  const getTasksForDay = (day: Date) => {
    return tasks.filter((task) => {
      if (!task.due_date) return false;
      return isSameDay(parseISO(task.due_date), day);
    });
  };

  const handlePreviousMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
    setSelectedDay(null);
  };

  const handleNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
    setSelectedDay(null);
  };

  const handleToday = () => {
    setCurrentMonth(new Date());
    setSelectedDay(new Date());
  };

  const selectedDayTasks = selectedDay ? getTasksForDay(selectedDay) : [];

  return (
    <div className="h-full flex flex-col lg:flex-row relative">
      {/* Calendar Grid */}
      <div className="flex-1 flex flex-col min-h-0">
        {/* Month Navigation */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 md:p-4 border-b border-white/10 gap-3 flex-shrink-0">
          <div className="flex items-center gap-2 justify-center sm:justify-start">
            <Button
              variant="ghost"
              size="sm"
              onClick={handlePreviousMonth}
              className="text-gray-400 hover:text-white h-8 w-8 p-0"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>

            <h2 className="text-lg md:text-xl font-semibold text-white min-w-[160px] text-center">
              {format(currentMonth, "MMMM yyyy")}
            </h2>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleNextMonth}
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

        {/* Day Headers */}
        <div className="grid grid-cols-7 border-b border-white/10 flex-shrink-0">
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
            <div
              key={day}
              className="p-1 md:p-2 text-center text-[10px] md:text-xs font-semibold text-gray-400 uppercase tracking-wider"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="flex-1 grid grid-cols-7 gap-px bg-white/5 overflow-y-auto">
          {calendarDays.map((day, index) => {
            const dayTasks = getTasksForDay(day);
            const isCurrentDay = isToday(day);
            const isCurrentMonth = isSameMonth(day, currentMonth);
            const isSelected = selectedDay && isSameDay(day, selectedDay);

            return (
              <button
                key={index}
                onClick={() => setSelectedDay(day)}
                className={cn(
                  "min-h-[60px] md:min-h-[80px] lg:min-h-[100px] p-1 md:p-2 text-left bg-slate-900 hover:bg-slate-800 transition-colors",
                  !isCurrentMonth && "opacity-40",
                  isSelected && "ring-2 ring-blue-500 bg-blue-500/10",
                  isCurrentDay && !isSelected && "ring-2 ring-blue-400/50"
                )}
              >
                <div className="flex items-center justify-between mb-1">
                  <span
                    className={cn(
                      "text-xs md:text-sm font-medium",
                      isCurrentDay
                        ? "text-blue-400 font-bold"
                        : isCurrentMonth
                        ? "text-white"
                        : "text-gray-500"
                    )}
                  >
                    {format(day, "d")}
                  </span>
                  {dayTasks.length > 0 && (
                    <span
                      className={cn(
                        "text-[10px] md:text-xs px-1 md:px-1.5 py-0.5 rounded-full",
                        isCurrentDay
                          ? "bg-blue-500/30 text-blue-300"
                          : "bg-white/10 text-gray-400"
                      )}
                    >
                      {dayTasks.length}
                    </span>
                  )}
                </div>

                {/* Task dots */}
                <div className="flex flex-wrap gap-0.5 md:gap-1">
                  {dayTasks.slice(0, 3).map((task) => {
                    const category = categories.find(
                      (c) => c.id === task.category_id
                    );
                    return (
                      <div
                        key={task.id}
                        className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full"
                        style={{
                          backgroundColor: category?.color || "#3b82f6",
                        }}
                        title={task.title}
                      />
                    );
                  })}
                  {dayTasks.length > 3 && (
                    <span className="text-[10px] text-gray-500">
                      +{dayTasks.length - 3}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Day Tasks Panel */}
      {selectedDay && (
        <>
          {/* Mobile: Bottom Sheet / Overlay */}
          <div
            className="lg:hidden fixed inset-0 bg-black/50 z-40"
            onClick={() => setSelectedDay(null)}
          />
          <div
            className={cn(
              "fixed bottom-0 left-0 right-0 lg:relative lg:w-80 bg-slate-900 border-white/10 flex flex-col z-50",
              "lg:border-l",
              "rounded-t-2xl lg:rounded-none",
              "max-h-[70vh] lg:max-h-none lg:h-auto",
              "shadow-2xl lg:shadow-none"
            )}
          >
            {/* Header */}
            <div className="p-4 border-b border-white/10 flex items-center justify-between flex-shrink-0">
              <div>
                <h3 className="text-base md:text-lg font-semibold text-white">
                  {format(selectedDay, "EEEE, MMMM d")}
                </h3>
                <p className="text-sm text-gray-400 mt-1">
                  {selectedDayTasks.length} task
                  {selectedDayTasks.length !== 1 ? "s" : ""}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedDay(null)}
                className="text-gray-400 hover:text-white h-8 w-8 p-0 lg:hidden"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Tasks List */}
            <div className="flex-1 p-4 space-y-2 overflow-y-auto">
              {selectedDayTasks.length === 0 ? (
                <div className="flex items-center justify-center h-full text-gray-500 text-sm">
                  No tasks for this day
                </div>
              ) : (
                selectedDayTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    category={categories.find((c) => c.id === task.category_id)}
                    onEdit={() => setEditingTask(task)}
                    variant="month"
                  />
                ))
              )}
            </div>

            {/* Close Button - Desktop only */}
            <div className="hidden lg:block p-4 border-t border-white/10 flex-shrink-0">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedDay(null)}
                className="w-full text-gray-400"
              >
                Close
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
