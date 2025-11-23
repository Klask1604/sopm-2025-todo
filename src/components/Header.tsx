import { useState } from "react";
import { useAuth } from "@Contexts/AuthContext";
import { Button } from "@Components/Shadcn/button";
import { Avatar, AvatarFallback, AvatarImage } from "@Components/Shadcn/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@Components/Shadcn/dropdown-menu";
import { LogOut, User, Menu } from "lucide-react";
import { ProfileDialog } from "@Components/ProfileDialog";

interface HeaderProps {
  onToggleMainSidebar: () => void;
}

export function Header({ onToggleMainSidebar }: HeaderProps) {
  const { profile, signOut } = useAuth();
  const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false);

  return (
    <>
      <header className="h-16 border-b border-b-white/10 glass backdrop-blur-xl">
        <div className="h-full px-4 md:px-6 flex items-center justify-between">
          <div className="flex items-center gap-2 md:gap-4">
            {/* Main Sidebar Toggle - Mobile */}
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleMainSidebar}
              className="lg:hidden text-gray-300 hover:text-white"
            >
              <Menu className="w-5 h-5" />
            </Button>

            <img src="../assets/logo.png" alt="Logo" className="w-40 h-auto" />
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 md:gap-3 hover:bg-white/5 rounded-lg p-2 transition-colors">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={profile?.avatar_url} />
                    <AvatarFallback className="bg-blue-500 text-white">
                      {profile?.display_name?.[0]?.toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm text-gray-300 hidden md:block">
                    {profile?.display_name || profile?.email}
                  </span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-56 glass-card border-white/20"
                align="end"
              >
                <div className="px-2 py-1.5">
                  <p className="text-sm font-medium text-white">
                    {profile?.display_name || "User"}
                  </p>
                  <p className="text-xs text-gray-400">{profile?.email}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => setIsProfileDialogOpen(true)}
                  className="cursor-pointer"
                >
                  <User className="w-4 h-4 mr-2" />
                  Edit Profile
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={signOut}
                  className="cursor-pointer text-red-400 focus:text-red-400"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <ProfileDialog
        open={isProfileDialogOpen}
        onOpenChange={setIsProfileDialogOpen}
      />
    </>
  );
}
