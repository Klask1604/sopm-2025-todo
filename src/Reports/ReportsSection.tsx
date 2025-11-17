import { useData } from "@Contexts/DataContext";
import {
  isToday,
  isThisWeek,
  isThisMonth,
  parseISO,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
} from "date-fns";
import { CategoryStats } from "@/types";
import { CategoryPerformance } from "./CategoryPerformance";
import { OverviewSection } from "./OverviewSection";
import { WeeklyActivities } from "./WeeklyActivities";
import { RecentAchivments } from "./Recent Achivments";

export function ReportsSection() {
  const { tasks, categories } = useData();

  // Overall Stats
  const stats = {
    total: tasks.length,
    completed: tasks.filter((t) => t.status === "completed").length,
    active: tasks.filter(
      (t) => t.status === "upcoming" || t.status === "overdue"
    ).length,
    completedToday: tasks.filter(
      (t) =>
        t.status === "completed" &&
        t.updated_at &&
        isToday(parseISO(t.updated_at))
    ).length,
    completedThisWeek: tasks.filter(
      (t) =>
        t.status === "completed" &&
        t.updated_at &&
        isThisWeek(parseISO(t.updated_at))
    ).length,
    completedThisMonth: tasks.filter(
      (t) =>
        t.status === "completed" &&
        t.updated_at &&
        isThisMonth(parseISO(t.updated_at))
    ).length,
  };

  const completionRate =
    stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

  // Category Stats
  const categoryStats: CategoryStats[] = categories
    .map((cat) => {
      const categoryTasks = tasks.filter((t) => t.category_id === cat.id);
      const completed = categoryTasks.filter(
        (t) => t.status === "completed"
      ).length;
      const active = categoryTasks.filter(
        (t) => t.status === "upcoming" || t.status === "overdue"
      ).length;
      const rate =
        categoryTasks.length > 0
          ? Math.round((completed / categoryTasks.length) * 100)
          : 0;

      return {
        ...cat,
        total: categoryTasks.length,
        completed,
        active,
        completionRate: rate,
      };
    })
    .sort((a, b) => b.total - a.total);

  // Weekly Activity
  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
  const weekEnd = endOfWeek(new Date(), { weekStartsOn: 1 });
  const daysOfWeek = eachDayOfInterval({ start: weekStart, end: weekEnd });

  const weeklyActivity = daysOfWeek.map((day) => {
    const completed = tasks.filter(
      (t) =>
        t.status === "completed" &&
        t.updated_at &&
        format(parseISO(t.updated_at), "yyyy-MM-dd") ===
          format(day, "yyyy-MM-dd")
    ).length;

    return {
      day: format(day, "EEE"),
      completed,
      isToday: isToday(day),
    };
  });

  const maxCompleted = Math.max(...weeklyActivity.map((d) => d.completed), 1);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">
          Reports & Analytics 📊
        </h1>
        <p className="text-gray-400">
          Track your productivity and task completion trends.
        </p>
      </div>

      {/* Overview Cards */}
      <OverviewSection
        total={stats.total}
        completed={stats.completed}
        active={stats.active}
        completionRate={completionRate}
      />

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Activity */}
        <WeeklyActivities
          weeklyActivity={weeklyActivity}
          maxCompleted={maxCompleted}
        />
        {/* Recent Achievements */}
        <RecentAchivments
          completedToday={stats.completedToday}
          completedThisWeek={stats.completedThisWeek}
          completedThisMonth={stats.completedThisMonth}
        />
      </div>

      {/* Category Performance */}
      <CategoryPerformance categoriesStats={categoryStats} />
    </div>
  );
}
