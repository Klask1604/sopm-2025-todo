import { Home, ListTodo, BarChart3, BookOpen, X } from "lucide-react";
import { cn } from "@Lib/utils";
import { Button } from "@Components/Shadcn/button";

interface MainSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

const menuItems = [
  { id: "home", label: "Home", icon: Home },
  { id: "tasks", label: "Tasks", icon: ListTodo },
  { id: "reports", label: "Reports", icon: BarChart3 },
  { id: "guide", label: "Guide", icon: BookOpen },
];

export function MainSidebar({
  activeSection,
  onSectionChange,
  isOpen,
  onClose,
}: MainSidebarProps) {
  const handleSectionChange = (section: string) => {
    onSectionChange(section);
    onClose(); // Auto-close on mobile after selection
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "border-r border-r-white/10 bg-slate-900/50 backdrop-blur-xl flex flex-col py-6 transition-transform duration-300",
          // Mobile: full width sidebar with overlay
          "fixed inset-y-0 left-0 z-50 w-64 lg:w-20",
          // Desktop: always visible, thin
          "lg:relative",
          // Show/hide on mobile
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Mobile Header */}
        <div className="flex items-center justify-between px-4 mb-6 lg:hidden">
          <h2 className="text-lg font-semibold text-white">Menu</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Menu Items */}
        <div className="flex flex-col items-stretch lg:items-center gap-2 px-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleSectionChange(item.id)}
                className={cn(
                  "group relative flex items-center gap-3 rounded-xl transition-all",
                  // Mobile: full width with text
                  "px-4 py-3 lg:flex-col lg:justify-center lg:w-14 lg:h-14 lg:p-0",
                  isActive
                    ? "bg-blue-500/20 text-blue-400 shadow-lg shadow-blue-500/20"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                )}
                title={item.label}
              >
                <Icon className="w-6 h-6 lg:mb-1" />
                <span className="text-sm font-medium lg:text-[10px]">
                  {item.label}
                </span>

                {/* Active indicator - only on desktop */}
                {isActive && (
                  <div className="hidden lg:block absolute -left-0.5 top-1/2 -translate-y-1/2 w-1 h-8 bg-blue-400 rounded-r-full" />
                )}
              </button>
            );
          })}
        </div>
      </aside>
    </>
  );
}
