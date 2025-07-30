interface BottomNavigationProps {
  activeTab: string;
  onTabChange: (tab: "discover" | "matches" | "messages" | "profile") => void;
}

export default function BottomNavigation({ activeTab, onTabChange }: BottomNavigationProps) {
  const tabs = [
    { id: "discover" as const, icon: "search", label: "Discover" },
    { id: "matches" as const, icon: "heart", label: "Matches" },
    { id: "messages" as const, icon: "comment", label: "Messages" },
    { id: "profile" as const, icon: "user", label: "Profile" },
  ];

  return (
    <nav className="fixed bottom-0 left-1/2 transform -translate-x-1/2 max-w-md w-full bg-white border-t border-gray-200">
      <div className="flex justify-around py-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex flex-col items-center py-2 px-4 ${
              activeTab === tab.id ? "text-primary" : "text-gray-400 hover:text-gray-600"
            }`}
          >
            <i className={`fas fa-${tab.icon} text-lg`}></i>
            <span className="text-xs mt-1">{tab.label}</span>
            {tab.id === "messages" && (
              <div className="absolute top-1 right-3 w-2 h-2 bg-primary rounded-full"></div>
            )}
          </button>
        ))}
      </div>
    </nav>
  );
}
