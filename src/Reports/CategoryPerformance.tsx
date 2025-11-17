import { Card, CardContent, CardHeader, CardTitle } from "@Components/Shadcn/card";
import { CategoryStats } from "@/types";
interface CategoryPerformanceProps {
  categoriesStats: CategoryStats[];
}
export function CategoryPerformance({
  categoriesStats,
}: CategoryPerformanceProps) {
  return (
    <Card className="glass-card border-white/20">
      <CardHeader>
        <CardTitle className="text-white">Category Performance</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {categoriesStats.length === 0 ? (
            <p className="text-gray-400 text-center py-8">No categories yet</p>
          ) : (
            categoriesStats.map((category) => (
              <div key={category.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: category.color }}
                    />
                    <span className="text-white font-medium">
                      {category.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-gray-400">
                      {category.completed}/{category.total} tasks
                    </span>
                    <span className="text-white font-semibold">
                      {category.completionRate}%
                    </span>
                  </div>
                </div>
                <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${category.completionRate}%`,
                      backgroundColor: category.color,
                    }}
                  />
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}