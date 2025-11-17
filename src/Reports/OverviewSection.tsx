import { CheckCircle2, Clock, Target, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@Components/Shadcn/card";
interface OverviewSectionProps {
  total: number;
  completed: number;
  active: number;
  completionRate: number;
}
export function OverviewSection({
  total,
  completed,
  active,
  completionRate,
}: OverviewSectionProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="glass-card border-white/20 bg-gradient-to-br from-blue-600/20 to-blue-800/20">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <Target className="w-8 h-8 text-blue-400" />
          </div>
          <p className="text-sm text-gray-300 mb-1">Total Tasks</p>
          <p className="text-3xl font-bold text-white">{total}</p>
        </CardContent>
      </Card>

      <Card className="glass-card border-white/20 bg-gradient-to-br from-green-600/20 to-green-800/20">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <CheckCircle2 className="w-8 h-8 text-green-400" />
          </div>
          <p className="text-sm text-gray-300 mb-1">Completed</p>
          <p className="text-3xl font-bold text-white">{completed}</p>
        </CardContent>
      </Card>

      <Card className="glass-card border-white/20 bg-gradient-to-br from-orange-600/20 to-orange-800/20">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <Clock className="w-8 h-8 text-orange-400" />
          </div>
          <p className="text-sm text-gray-300 mb-1">Active Tasks</p>
          <p className="text-3xl font-bold text-white">{active}</p>
        </CardContent>
      </Card>

      <Card className="glass-card border-white/20 bg-gradient-to-br from-purple-600/20 to-purple-800/20">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <TrendingUp className="w-8 h-8 text-purple-400" />
          </div>
          <p className="text-sm text-gray-300 mb-1">Completion Rate</p>
          <p className="text-3xl font-bold text-white">{completionRate}%</p>
        </CardContent>
      </Card>
    </div>
  );
}