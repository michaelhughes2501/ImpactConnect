import { useState } from "react";
import Header from "../components/header";
import BottomNavigation from "../components/bottom-navigation";
import Discover from "./discover";
import Matches from "./matches";
import Messages from "./messages";
import Profile from "./profile";

type Tab = "discover" | "matches" | "messages" | "profile";

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>("discover");

  const renderActiveTab = () => {
    switch (activeTab) {
      case "discover":
        return <Discover />;
      case "matches":
        return <Matches />;
      case "messages":
        return <Messages />;
      case "profile":
        return <Profile />;
      default:
        return <Discover />;
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen shadow-xl">
      <Header />
      <nav className="bg-white border-b border-gray-200 px-4">
        <div className="flex space-x-6">
          {[
            { id: "discover" as Tab, icon: "search", label: "Yard" },
            { id: "matches" as Tab, icon: "heart", label: "Connects" },
            { id: "messages" as Tab, icon: "comment", label: "Kites" },
            { id: "profile" as Tab, icon: "user", label: "My Info" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-3 px-1 border-b-2 font-medium text-sm flex items-center ${
                activeTab === tab.id
                  ? "border-primary text-primary"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <i className={`fas fa-${tab.icon} mr-2`}></i>
              {tab.label}
            </button>
          ))}
        </div>
      </nav>

      <main className="pb-20">
        {renderActiveTab()}
      </main>

      <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}
