import { useQuery } from "@tanstack/react-query";
import type { Message, Match, User } from "@shared/schema";
import { CURRENT_USER_ID } from "@/lib/currentUser";

interface BottomNavigationProps {
  activeTab: string;
  onTabChange: (tab: "discover" | "matches" | "messages" | "profile" | "resources") => void;
}

export default function BottomNavigation({ activeTab, onTabChange }: BottomNavigationProps) {
  const { data: recentMessages = [] } = useQuery<
    (Message & { match: Match; otherUser: User })[]
  >({
    queryKey: ["/api/messages/recent", CURRENT_USER_ID],
  });
  const hasUnread = recentMessages.some(
    (m) => !m.isRead && m.senderId !== CURRENT_USER_ID
  );

  const tabs = [
    { id: "discover" as const, icon: "search", label: "Yard" },
    { id: "matches" as const, icon: "heart", label: "Connects" },
    { id: "messages" as const, icon: "comment", label: "Kites" },
    { id: "resources" as const, icon: "hands-helping", label: "Lifeline" },
    { id: "profile" as const, icon: "user", label: "My Info" },
  ];

  return (
    <nav className="fixed bottom-0 left-1/2 transform -translate-x-1/2 max-w-md w-full bg-white border-t border-gray-200 shadow-[0_-2px_10px_rgba(0,0,0,0.04)] pb-[env(safe-area-inset-bottom)]">
      <div className="flex justify-around py-1.5">
    <nav className="fixed bottom-0 left-1/2 transform -translate-x-1/2 max-w-md w-full bg-white border-t border-gray-200 shadow-[0_-2px_10px_rgba(0,0,0,0.04)]">
      <div className="flex justify-around py-2">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              aria-current={isActive ? "page" : undefined}
              className={`flex flex-col items-center justify-center gap-0.5 py-2 px-3 relative rounded-lg min-w-[56px] transition-all duration-150 ease-out active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 ${
                isActive
                  ? "text-primary"
                  : "text-gray-400 hover:text-gray-600 hover:bg-gray-50"
              }`}
            >
              <span
                className={`absolute -top-1.5 left-1/2 -translate-x-1/2 h-0.5 rounded-full bg-primary transition-all duration-150 ${
                  isActive ? "w-6 opacity-100" : "w-0 opacity-0"
                }`}
              />
              <i className={`fas fa-${tab.icon} text-lg`}></i>
              <span className={`text-[11px] leading-none ${isActive ? "font-semibold" : "font-medium"}`}>
                {tab.label}
              </span>
              {tab.id === "messages" && (
                <div className="absolute top-1 right-2 w-2 h-2 bg-primary rounded-full ring-2 ring-white"></div>
              className={`flex flex-col items-center py-2 px-3 relative rounded-lg transition-colors ${
                isActive ? "text-primary bg-primary/10" : "text-gray-400 hover:text-gray-600 hover:bg-gray-50"
              }`}
            >
              <i className={`fas fa-${tab.icon} text-lg transition-transform ${isActive ? "scale-110" : ""}`}></i>
              <span className={`text-xs mt-1 ${isActive ? "font-medium" : ""}`}>{tab.label}</span>
              {tab.id === "messages" && hasUnread && (
                <div className="absolute top-1 right-2 w-2 h-2 bg-primary rounded-full"></div>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
