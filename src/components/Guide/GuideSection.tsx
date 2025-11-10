import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@Components/Shadcn/card";
import {
  Inbox,
  Calendar,
  Tag,
  Plus,
  CheckCircle2,
  Edit,
  Trash2,
  Settings,
  BarChart3,
} from "lucide-react";

export function GuideSection() {
  const sections = [
    {
      title: "Getting Started",
      icon: Inbox,
      color: "blue",
      steps: [
        {
          title: "Create Your First Task",
          description:
            "Click the 'Add Task' button in the Tasks section to create a new task. Give it a title, description, and due date.",
          icon: Plus,
        },
        {
          title: "Organize with Categories",
          description:
            "Create custom categories to organize your tasks by project, context, or priority. Access category management from the Tasks section.",
          icon: Tag,
        },
        {
          title: "Set Due Dates",
          description:
            "Add due dates and times to your tasks to keep track of deadlines. Tasks will automatically appear in Today view when due.",
          icon: Calendar,
        },
      ],
    },
    {
      title: "Task Management",
      icon: CheckCircle2,
      color: "green",
      steps: [
        {
          title: "Complete Tasks",
          description:
            "Click the checkbox next to any task to mark it as complete. Completed tasks will move to the Completed section.",
          icon: CheckCircle2,
        },
        {
          title: "Edit Tasks",
          description:
            "Click the edit icon on any task to modify its details, change category, update due date, or add descriptions.",
          icon: Edit,
        },
        {
          title: "Delete Tasks",
          description:
            "Remove tasks you no longer need by clicking the trash icon. This action cannot be undone.",
          icon: Trash2,
        },
      ],
    },
    {
      title: "Views & Navigation",
      icon: Calendar,
      color: "purple",
      steps: [
        {
          title: "Inbox - All Active Tasks",
          description:
            "View all your upcoming and overdue tasks in one place. This is your main task list.",
          icon: Inbox,
        },
        {
          title: "Today - Focus on What Matters",
          description:
            "See only the tasks due today. Perfect for daily planning and staying focused on immediate priorities.",
          icon: Calendar,
        },
        {
          title: "Completed - Track Your Progress",
          description:
            "Review all your completed tasks. Great for reflecting on what you've accomplished.",
          icon: CheckCircle2,
        },
      ],
    },
    {
      title: "Categories",
      icon: Tag,
      color: "orange",
      steps: [
        {
          title: "Create Categories",
          description:
            "Click 'Manage Categories' in Tasks section to create new categories. Choose a name and color for easy identification.",
          icon: Plus,
        },
        {
          title: "Edit Categories",
          description:
            "Rename categories or change their colors anytime. Click the edit icon next to any category in the manager.",
          icon: Edit,
        },
        {
          title: "Default Category",
          description:
            "The 'General' category is your default and cannot be deleted. It's perfect for uncategorized tasks.",
          icon: Settings,
        },
      ],
    },
    {
      title: "Reports & Analytics",
      icon: BarChart3,
      color: "pink",
      steps: [
        {
          title: "Track Your Progress",
          description:
            "Visit the Reports section to see your completion rate, weekly activity, and task statistics.",
          icon: BarChart3,
        },
        {
          title: "Category Performance",
          description:
            "See how you're performing in each category with completion rates and task counts.",
          icon: Tag,
        },
        {
          title: "Weekly Activity",
          description:
            "View a breakdown of tasks completed each day of the week to identify your most productive days.",
          icon: Calendar,
        },
      ],
    },
  ];

  const tips = [
    {
      title: "Use Categories Wisely",
      description:
        "Create categories for different areas of your life: Work, Personal, Health, etc. This helps you focus on specific contexts.",
      color: "blue",
    },
    {
      title: "Review Daily",
      description:
        "Start each day by checking your Today view. This helps you prioritize and ensures nothing falls through the cracks.",
      color: "green",
    },
    {
      title: "Set Realistic Due Dates",
      description:
        "Don't overload yourself. Set achievable due dates and adjust them as needed to reduce stress.",
      color: "purple",
    },
    {
      title: "Celebrate Completions",
      description:
        "Check your Reports section regularly to see your progress. Celebrating small wins keeps you motivated!",
      color: "orange",
    },
  ];

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">User Guide 📚</h1>
        <p className="text-gray-400">
          Learn how to make the most of your task management app.
        </p>
      </div>

      {/* Guide Sections */}
      {sections.map((section, sectionIndex) => {
        const SectionIcon = section.icon;
        return (
          <Card key={sectionIndex} className="glass-card border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-lg bg-${section.color}-500/20 flex items-center justify-center`}
                >
                  <SectionIcon
                    className={`w-5 h-5 text-${section.color}-400`}
                  />
                </div>
                {section.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {section.steps.map((step, stepIndex) => {
                const StepIcon = step.icon;
                return (
                  <div key={stepIndex} className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
                        <StepIcon className="w-4 h-4 text-gray-400" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-white mb-1">
                        {step.title}
                      </h4>
                      <p className="text-sm text-gray-400">
                        {step.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        );
      })}

      {/* Pro Tips */}
      <Card className="glass-card border-white/20 bg-gradient-to-br from-yellow-500/10 to-orange-500/10">
        <CardHeader>
          <CardTitle className="text-white">💡 Pro Tips</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tips.map((tip, index) => (
            <div
              key={index}
              className="p-4 rounded-lg bg-white/5 border border-white/10"
            >
              <h4 className="font-semibold text-white mb-2">{tip.title}</h4>
              <p className="text-sm text-gray-400">{tip.description}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Keyboard Shortcuts (Future Feature) */}
      <Card className="glass-card border-white/20">
        <CardHeader>
          <CardTitle className="text-white">
            ⌨️ Keyboard Shortcuts (Coming Soon)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-400 text-sm">
            Keyboard shortcuts will be available in a future update to help you
            work even faster!
          </p>
        </CardContent>
      </Card>
    </div>
  );
}