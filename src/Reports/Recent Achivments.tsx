import { Award, CalendarIcon, TrendingUp } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@Components/Shadcn/card";
interface RecentAchivmentsProps {
  completedToday: number;
  completedThisWeek: number;
  completedThisMonth: number;
}
export function RecentAchivments({
  completedToday,
  completedThisWeek,
  completedThisMonth,
}: RecentAchivmentsProps) {
  return (
    <Card className="glass-card border-white/20">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Award className="w-5 h-5" />
          Milestones
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-4 rounded-lg bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-yellow-500/30 flex items-center justify-center">
              <Award className="w-5 h-5 text-yellow-400" />
            </div>
            <div>
              <p className="font-semibold text-white">Today's Progress</p>
              <p className="text-xs text-gray-400">
                {completedToday} tasks completed
              </p>
            </div>
          </div>
        </div>

        <div className="p-4 rounded-lg bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-blue-500/30 flex items-center justify-center">
              <CalendarIcon className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="font-semibold text-white">This Week</p>
              <p className="text-xs text-gray-400">
                {completedThisWeek} tasks completed
              </p>
            </div>
          </div>
        </div>

        <div className="p-4 rounded-lg bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-purple-500/30 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <p className="font-semibold text-white">This Month</p>
              <p className="text-xs text-gray-400">
                {completedThisMonth} tasks completed
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
