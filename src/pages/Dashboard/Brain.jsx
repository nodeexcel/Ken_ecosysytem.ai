import React, { useState } from "react";
import { Contact, FileText, Settings } from "lucide-react";
import Contacts from "../../components/Contacts";
import Knowledge from "../../components/Knowledge";
import Integration from "../../components/Integration";

const sideMenuItems = [
  { label: "Contacts", icon: Contact, path: "contacts" },
  { label: "Knowledge", icon: FileText, path: "knowledge" },
  { label: "Integration", icon: Settings, path: "integration" },
];

const BrainAI = () => {
  const [activePath, setActivePath] = useState("contacts");

  const renderMainContent = () => {
    switch (activePath) {
      case "contacts":
        return <Contacts />;
      case "knowledge":
        return <Knowledge />;
      case "integration":
        return <Integration />;
      default:
        return null;
    }
  };

  return (
    <div className="h-full w-full bg-[#F6F7F9]">
      <div className="flex flex-col md:flex-row items-start gap-8 p-4 w-full">
        {/* Sidebar */}
        <div className="flex flex-col w-full md:w-[153px] items-start gap-2">
          {sideMenuItems.map((item, i) => {
            const Icon = item.icon;
            const isActive = activePath === item.path;

            return (
              <button
                key={i}
                onClick={() => setActivePath(item.path)}
                className={`flex items-center justify-start gap-1.5 px-2 py-1.5 w-full h-auto rounded ${
                  isActive ? "bg-[#e1e5ea] text-black" : "text-[#5A687C]"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span
                  className={`font-normal text-sm tracking-[-0.28px] leading-5 ${
                    isActive ? "text-text-black" : "text-text-grey"
                  }`}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Main Content */}
        <div className="w-full overflow-x-hidden">{renderMainContent()}</div>
      </div>
    </div>
  );
};

export default BrainAI;
