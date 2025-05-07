import React, { useState } from "react";
import { BarChart2, Phone, Users, PhoneIncoming, PhoneOutgoing } from "lucide-react";

import PhoneDashboard from "../components/PhoneDashboard";
import PhoneNumberList from "../components/PhoneNumberList";
import CallAgentsPage from "../components/CallAgent";
import CallCampaign from "../components/CallCompaign";


const sideMenuList = [
  { label: "Dashboard", icon: <BarChart2 size={18} />, path: "dashboard" },
  { label: "Phone Numbers", icon: <Phone size={18} />, path: "phone-numbers" },
  { label: "Call Agents", icon: <Users size={18} />, path: "call-agents" },
  { label: "Call Campaigns", icon: <BarChart2 size={18} />, path: "call-campaigns" },
  { label: "Outbound Calls", icon: <PhoneOutgoing size={18} />, path: "outbound-calls" },
  { label: "Inbound Calls", icon: <PhoneIncoming size={18} />, path: "inbound-calls" },
];

const PhonePage = () => {
  const [activeSidebarItem, setActiveSidebarItem] = useState("dashboard");

  const renderMainContent = () => {
    switch (activeSidebarItem) {
      case "phone-numbers":
        return <PhoneNumberList />;
      case "call-agents":
        return <CallAgentsPage />;
      case "call-campaigns":
        return <CallCampaign />;
      case "outbound-calls":
        return <div>Outbound Calls</div>;
      case "inbound-calls":
        return <div>Inbound Calls</div>;
      default:
        return <PhoneDashboard />;
    }
  };

  return (
    <div className="h-full w-full bg-[#F6F7F9]">
      <div className="flex flex-col md:flex-row items-start gap-8 relative pl-4 py-3 w-full">
        {/* Sidebar */}
        <div className="flex flex-col w-full md:w-[200px] items-start gap-2 relative">
          <div className="bg-[#E1E4EA] rounded-lg w-[180px] h-[180px]" />
          {sideMenuList.map((item, i) => (
            <div
              key={i}
              onClick={() => setActiveSidebarItem(item.path)}
              className={`flex items-center gap-2 px-3 py-2 rounded-md cursor-pointer w-full ${
                activeSidebarItem === item.path
                  ? "bg-[#E1E5EA] text-black"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {item.icon}
              <span className="onest text-sm font-medium">{item.label}</span>
            </div>
          ))}
        </div>

        {/* Main Content */}
        <div className="w-full overflow-x-hidden">{renderMainContent()}</div>
      </div>
    </div>
  );
};

export default PhonePage;
