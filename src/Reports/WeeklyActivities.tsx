import { CalendarIcon } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@Components/Shadcn/card";
interface WeeklyActivitiesProps {
  weeklyActivity: {
    day: string;
    completed: number;
    isToday: boolean;
  }[];
  maxCompleted: number;
}
export function WeeklyActivities({
  weeklyActivity,
  maxCompleted,
}: WeeklyActivitiesProps) {
  return (
    <Card className="glass-card border-white/20">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <CalendarIcon className="w-5 h-5" />
          This Week's Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {weeklyActivity.map((day, index) => (
            <div key={index} className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span
                  className={
                    day.isToday
                      ? "text-blue-400 font-semibold"
                      : "text-gray-400"
                  }
                >
                  {day.day}
                </span>
                <span className="text-white font-medium">
                  {day.completed} completed
                </span>
              </div>
              <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all"
                  style={{
                    width: `${(day.completed / maxCompleted) * 100}%`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
