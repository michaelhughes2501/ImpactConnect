interface BottomNavigationProps {
  activeTab: string;
  onTabChange: (tab: "discover" | "matches" | "messages" | "profile" | "resources") => void;
}

export default function BottomNavigation({ activeTab, onTabChange }: BottomNavigationProps) {
  const tabs = [
    { id: "discover" as const, icon: "search", label: "Yard" },
    { id: "matches" as const, icon: "heart", label: "Connects" },
    { id: "messages" as const, icon: "comment", label: "Kites" },
    { id: "resources" as const, icon: "hands-helping", label: "Lifeline" },
    { id: "profile" as const, icon: "user", label: "My Info" },
  ];

  return (
    <nav className="fixed bottom-0 left-1/2 transform -translate-x-1/2 max-w-md w-full bg-white border-t border-gray-200 shadow-[0_-2px_10px_rgba(0,0,0,0.04)]">
      <div className="flex justify-around py-2">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              aria-current={isActive ? "page" : undefined}
              className={`flex flex-col items-center py-2 px-3 relative rounded-lg transition-colors ${
                isActive ? "text-primary bg-primary/10" : "text-gray-400 hover:text-gray-600 hover:bg-gray-50"
              }`}
            >
              <i className={`fas fa-${tab.icon} text-lg transition-transform ${isActive ? "scale-110" : ""}`}></i>
              <span className={`text-xs mt-1 ${isActive ? "font-medium" : ""}`}>{tab.label}</span>
              {tab.id === "messages" && (
                <div className="absolute top-1 right-2 w-2 h-2 bg-primary rounded-full"></div>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
