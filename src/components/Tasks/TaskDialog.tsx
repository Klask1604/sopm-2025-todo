import { useState, useEffect } from "react";
import { useData } from "@Contexts/DataContext";
import { Task, TaskStatus } from "@Types/index";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@Components/Shadcn/dialog";
import { Button } from "@Components/Shadcn/button";
import { Input } from "@Components/Shadcn/input";
import { Label } from "@Components/Shadcn/label";
import { Textarea } from "@Components/Shadcn/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@Components/Shadcn/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@Components/Shadcn/popover";
import { Calendar } from "@Components/Shadcn/calendar";
import { TimePicker } from "@Components/Shadcn/time-picker";
import { Calendar as CalendarIcon } from "lucide-react";
import { format, parseISO } from "date-fns";
import { cn } from "@Lib/utils";

interface TaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task?: Task | null;
}

export function TaskDialog({ open, onOpenChange, task }: TaskDialogProps) {
  const { categories, addTask, updateTask } = useData();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [status, setStatus] = useState<TaskStatus>("upcoming");
  const [dueDate, setDueDate] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [timeValue, setTimeValue] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || "");
      setCategoryId(task.category_id);
      // ✅ Ensure status is always valid
      setStatus(task.status || "upcoming");
      if (task.due_date) {
        const date = parseISO(task.due_date);
        setSelectedDate(date);
        setTimeValue(format(date, "HH:mm"));
        setDueDate(task.due_date.slice(0, 16));
      } else {
        setSelectedDate(undefined);
        setTimeValue("");
        setDueDate("");
      }
    } else {
      // ✅ Reset all fields when creating new task
      setTitle("");
      setDescription("");
      setStatus("upcoming");
      const defaultCategory = categories.find((c) => c.is_default);
      if (defaultCategory) {
        setCategoryId(defaultCategory.id);
      }
      setSelectedDate(undefined);
      setTimeValue("");
      setDueDate("");
    }
  }, [task, categories]);
  // Update dueDate when date or time changes
  useEffect(() => {
    if (selectedDate) {
      const dateStr = format(selectedDate, "yyyy-MM-dd");
      const timeStr = timeValue || "00:00";
      setDueDate(`${dateStr}T${timeStr}`);
    } else {
      setDueDate("");
    }
  }, [selectedDate, timeValue]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !categoryId) return;

    try {
      setLoading(true);

      const taskData = {
        title: title.trim(),
        description: description.trim(),
        category_id: categoryId,
        status,
        due_date: dueDate || undefined,
      };

      if (task) {
        await updateTask(task.id, taskData);
      } else {
        await addTask(taskData);
      }

      onOpenChange(false);
      resetForm();
    } catch (error) {
      console.error("Error saving task:", error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setStatus("upcoming");
    setDueDate("");
    setSelectedDate(undefined);
    setTimeValue("");
    const defaultCategory = categories.find((c) => c.is_default);
    if (defaultCategory) {
      setCategoryId(defaultCategory.id);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] glass-card border-white/20">
        <DialogHeader>
          <DialogTitle className="text-white">
            {task ? "Edit Task" : "New Task"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter task title"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter task description"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select value={categoryId} onValueChange={setCategoryId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={status}
                onValueChange={(v) => setStatus(v as TaskStatus)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="upcoming">To Do</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="canceled">Canceled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Due Date</Label>
            <div className="grid grid-cols-2 gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !selectedDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate
                      ? format(selectedDate, "MMM dd, yyyy")
                      : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-auto p-0 bg-slate-800 border-white/20"
                  align="start"
                >
                  <Calendar
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    className="bg-slate-800"
                  />
                </PopoverContent>
              </Popover>
              <TimePicker value={timeValue} onChange={setTimeValue} />
            </div>
            {selectedDate && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSelectedDate(undefined);
                  setTimeValue("");
                }}
                className="text-xs text-gray-400 hover:text-white"
              >
                Clear date
              </Button>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading || !title.trim() || !categoryId}
            >
              {loading ? "Saving..." : task ? "Save Changes" : "Create Task"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
