import { useState } from "react";
import { motion, AnimatePresence, Transition } from "framer-motion";
import { MainSidebar } from "@Components/Layout/MainSidebar";
import { Header } from "@Components/Header";
import { HomeSection } from "@Components/Home/HomeSection";
import { TasksSection } from "@Components/Tasks/TasksSection";
import { ReportsSection } from "@Components/Reports/ReportsSection";
import { GuideSection } from "@Components/Guide/GuideSection";

const pageVariants = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 20 },
};

const pageTransition: Transition = {
  type: "tween",
  ease: "easeInOut",
  duration: 0.3,
};

export function Dashboard() {
  const [activeSection, setActiveSection] = useState<string>("home");
  const [taskFilter, setTaskFilter] = useState<string>("all");
  const [isMainSidebarOpen, setIsMainSidebarOpen] = useState(false);

  const handleNavigate = (section: string, filter?: string) => {
    setActiveSection(section);
    if (section === "tasks" && filter) {
      setTaskFilter(filter);
    }
  };

  const renderSection = () => {
    switch (activeSection) {
      case "home":
        return <HomeSection onNavigate={handleNavigate} />;
      case "tasks":
        return <TasksSection initialFilter={taskFilter} />;
      case "reports":
        return <ReportsSection />;
      case "guide":
        return <GuideSection />;
      default:
        return <HomeSection onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950">
      <Header onToggleMainSidebar={() => setIsMainSidebarOpen(true)} />

      <div className="flex h-[calc(100vh-4rem)]">
        <MainSidebar
          activeSection={activeSection}
          onSectionChange={setActiveSection}
          isOpen={isMainSidebarOpen}
          onClose={() => setIsMainSidebarOpen(false)}
        />

        <main className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={pageTransition}
              className="h-full"
            >
              {renderSection()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}