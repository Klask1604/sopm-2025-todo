import { Calendar } from "lucide-react";
import { Button } from "@Components/Shadcn/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@Components/Shadcn/card";

interface TomorrowPreviewProps {
  stats: {
    tomorrow: number;
  };
  onNavigate: (section: string, filter?: string) => void;
}
export function TomorrowPreview({ stats, onNavigate }: TomorrowPreviewProps) {
  return (
    <>
      {stats.tomorrow > 0 && (
        <Card className="glass-card border-white/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Coming Up Tomorrow
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-300">
              You have{" "}
              <span className="font-bold text-white">{stats.tomorrow}</span>{" "}
              task
              {stats.tomorrow !== 1 ? "s" : ""} scheduled for tomorrow.
            </p>
            <Button
              onClick={() => onNavigate("tasks", "all")}
              variant="ghost"
              className="mt-3 text-blue-400 hover:text-blue-300"
            >
              View all tasks →
            </Button>
          </CardContent>
        </Card>
      )}
    </>
  );
}