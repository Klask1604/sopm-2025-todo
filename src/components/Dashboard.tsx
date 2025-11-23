import { useState } from "react";
import { MainSidebar } from "@Components/Layout/MainSidebar";
import { Header } from "@Components/Header";

export function Dashboard() {
  const [activeSection, setActiveSection] = useState<string>("home");
  const [isMainSidebarOpen, setIsMainSidebarOpen] = useState(false);

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

        <main className="flex-1 overflow-y-auto"></main>
      </div>
    </div>
  );
}
