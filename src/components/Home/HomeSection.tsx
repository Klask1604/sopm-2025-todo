import { useData } from "@Contexts/DataContext";
import { Inbox, Calendar, CheckCircle2, Clock } from "lucide-react";
import { isToday, isTomorrow, isPast } from "date-fns";
import { QuickStats } from "./QuickStats";
import { TomorrowPreview } from "./TomorrowPreview";
interface HomeSectionProps {
  onNavigate: (section: string, filter?: string) => void;
}

export function HomeSection({ onNavigate }: HomeSectionProps) {
  const { tasks } = useData();

  const stats = {
    total: tasks.filter(
      (task) => task.status === "upcoming" || task.status === "overdue"
    ).length,
    today: tasks.filter(
      (task) =>
        (task.status === "upcoming" || task.status === "overdue") &&
        task.due_date &&
        isToday(new Date(task.due_date))
    ).length,
    overdue: tasks.filter(
      (task) =>
        task.status === "upcoming" &&
        task.due_date &&
        isPast(new Date(task.due_date)) &&
        !isToday(new Date(task.due_date))
    ).length,
    completed: tasks.filter((task) => task.status === "completed").length,
    tomorrow: tasks.filter(
      (task) =>
        (task.status === "upcoming" || task.status === "overdue") &&
        task.due_date &&
        isTomorrow(new Date(task.due_date))
    ).length,
  };

  const quickActions = [
    {
      id: "inbox",
      title: "Inbox",
      count: stats.total,
      icon: Inbox,
      color: "blue",
      gradient: "from-blue-600/30 to-blue-800/30",
      onClick: () => onNavigate("tasks", "all"),
    },
    {
      id: "today",
      title: "Today",
      count: stats.today,
      icon: Calendar,
      color: "green",
      gradient: "from-green-600/30 to-green-800/30",
      onClick: () => onNavigate("tasks", "today"),
    },
    {
      id: "overdue",
      title: "Overdue",
      count: stats.overdue,
      icon: Clock,
      color: "red",
      gradient: "from-red-600/30 to-red-800/30",
      onClick: () => onNavigate("tasks", "all"),
    },
    {
      id: "completed",
      title: "Completed",
      count: stats.completed,
      icon: CheckCircle2,
      color: "purple",
      gradient: "from-purple-600/30 to-purple-800/30",
      onClick: () => onNavigate("tasks", "completed"),
    },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Welcome back! 👋</h1>
        <p className="text-gray-400">
          Here's what's happening with your tasks today.
        </p>
      </div>

      <QuickStats quickActions={quickActions} />

      <TomorrowPreview stats={stats} onNavigate={onNavigate} />
    </div>
  );
}