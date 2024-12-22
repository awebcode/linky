"use client";
import React from "react";
import { Button } from "@/components/ui/button"; // Shadcn button component
import { WithTooltip } from "@/components/common/WithTooltip";
import { ThemeToggle } from "@/components/common/ThemeToggle";
import UserAvatar from "@/components/common/UserAvatar";
import UserActionDropdown from "./user-action-dropdown";
import { useIsMobile } from "@/hooks/use-mobile"; // Hook to detect mobile
import { useUser } from "@/hooks/use-user";
import { userMenuItems } from "@/constants/chat/menus";
import { NAVIGATION_MENUS,  useNavStore, type NavId } from "@/hooks/useNavStore";

export const ChatSideNavigation: React.FC = () => {
  const { activeNav, setActiveNav } = useNavStore();
  const { user } = useUser();
  const isMobile = useIsMobile(); // Detect if it's a mobile device

  // Filter Navigation by position
  const topNavigation = NAVIGATION_MENUS.filter((nav) => nav.navPosition === "top");
  const middleNavigation = NAVIGATION_MENUS.filter((nav) => nav.navPosition === "middle");
  const bottomNavigation = NAVIGATION_MENUS.filter((nav) => nav.navPosition === "bottom");

  // On mobile, only show Navigation that are mobile-specific
  const mobileNavigation = NAVIGATION_MENUS.filter((nav) => nav.isMobile);

  // Render nav buttons
  const renderNavButton = (
    id: string,
    label: string,
    Icon: React.ComponentType<{ className?: string }>,
    isActive: boolean
  ) => (
    <WithTooltip key={id} text={label} side={isMobile ? "top" : "right"}>
      <Button
        size={"icon"}
        variant={isActive ? "default" : "outline"}
        onClick={() => setActiveNav(id as NavId)}
      >
        <Icon className="h-8 w-8" />
      </Button>
    </WithTooltip>
  );

  return (
    <aside
      className={`${
        isMobile
          ? "px-1 fixed bottom-0 left-0 w-screen flex items-center justify-around gap-2 bg-background text-muted-foreground border-t py-2"
          : "w-20 h-screen flex flex-col justify-between bg-background text-muted-foreground"
      }`}
    >
      {/* Top Section for Both Desktop and Mobile */}
      <div
        className={`flex ${
          isMobile ? "justify-evenly gap-2" : "flex-col items-center space-y-4 py-4"
        }`}
      >
        {(isMobile ? mobileNavigation : topNavigation).map((nav) =>
          renderNavButton(nav.id, nav.label, nav.icon, activeNav === nav.id)
        )}
      </div>

      {/* Middle Section for Desktop Only */}
      {!isMobile && (
        <div className={`flex flex-col items-center space-y-4 py-4`}>
          {middleNavigation.map((nav) =>
            renderNavButton(nav.id, nav.label, nav.icon, activeNav === nav.id)
          )}
        </div>
      )}

      {/* Bottom Section (for Both Desktop and Mobile) */}
      {!isMobile && (
        <div className={`flex flex-col items-center space-y-4 py-4`}>
          {bottomNavigation.map((nav) =>
            renderNavButton(nav.id, nav.label, nav.icon, activeNav === nav.id)
          )}
        </div>
      )}

      {/* Theme Toggle and User Profile on Both Mobile and Desktop */}
      <div
        className={`flex ${
          isMobile ? "justify-evenly gap-2" : "flex-col items-center space-y-4 py-4"
        }`}
      >
        {/* Theme Toggle */}
        <ThemeToggle />

        {/* Only show user profile on mobile */}
        {isMobile && (
          <UserActionDropdown
            asChild={false}
            trigger={<UserAvatar user={user} />}
            items={userMenuItems}
          />
        )}
      </div>

      {/* Desktop user profile dropdown */}
      {!isMobile && (
        <div className={`flex flex-col items-center space-y-4 py-4`}>
          <UserActionDropdown
            asChild={false}
            trigger={<UserAvatar user={user} />}
            items={userMenuItems}
          />
        </div>
      )}
    </aside>
  );
};
