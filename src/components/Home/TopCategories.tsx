import { Tag, TrendingUp } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "../Shadcn/card";
import type { TopCategories } from "@/types";
interface TopCategoriesProps {
  topCategories: TopCategories[];
  onNavigate: (section: string, filter?: string) => void;
}
export function TopCategories({
  topCategories,
  onNavigate,
}: TopCategoriesProps) {
  return (
    <Card className="glass-card border-white/20">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Tag className="w-5 h-5" />
          Top Categories
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {topCategories.length === 0 ? (
          <p className="text-gray-400 text-sm py-4">
            No active tasks in categories
          </p>
        ) : (
          topCategories.map((category: TopCategories) => (
            <button
              key={category.id}
              onClick={() => onNavigate("tasks", category.id)}
              className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-white/5 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: category.color }}
                />
                <span className="text-white font-medium">{category.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-400">
                  {category.count} tasks
                </span>
                <TrendingUp className="w-4 h-4 text-gray-500 group-hover:text-white transition-colors" />
              </div>
            </button>
          ))
        )}
      </CardContent>
    </Card>
  );
}
