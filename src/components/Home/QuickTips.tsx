import { Button } from "../Shadcn/button";
import { Card, CardHeader, CardTitle, CardContent } from "../Shadcn/card";

interface QuickTipsProps {
  onNavigate: (section: string) => void;
}
export function QuickTips({ onNavigate }: QuickTipsProps) {
  return (
    <Card className="glass-card border-white/20">
      <CardHeader>
        <CardTitle className="text-white">Quick Tips 💡</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
            <p className="text-sm text-blue-300 font-medium mb-1">
              Stay Organized
            </p>
            <p className="text-xs text-gray-400">
              Use categories to group similar tasks and keep your workflow
              clean.
            </p>
          </div>
          <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20">
            <p className="text-sm text-green-300 font-medium mb-1">
              Set Due Dates
            </p>
            <p className="text-xs text-gray-400">
              Add due dates to tasks to never miss an important deadline.
            </p>
          </div>
          <div className="p-3 rounded-lg bg-purple-500/10 border border-purple-500/20">
            <p className="text-sm text-purple-300 font-medium mb-1">
              Check Reports
            </p>
            <p className="text-xs text-gray-400">
              View your productivity trends and completed tasks statistics.
            </p>
          </div>
        </div>
        <Button
          onClick={() => onNavigate("guide")}
          variant="outline"
          className="w-full"
        >
          View Full Guide
        </Button>
      </CardContent>
    </Card>
  );
}
