import { useState } from "react";
import PhoneNumberList from '../../components/PhoneNumberList'
import CallAgentsPage from '../../components/CallAgent'
import CallCampaign from '../../components/CallCampaign'
import PhoneDashboard from '../../components/PhoneDashboard'
import { CallAgent, FourBox, Phone, PhoneCampaign, OutboundCall, InboundCall } from "../../icons/icons";
import OutBoundCalls from "../../components/OutboundCalls";
import InBoundCalls from "../../components/InboundCalls";


const sideMenuList = [
  { label: "Dashboard", icon: <FourBox />, path: "dashboard" },
  { label: "Phone Numbers", icon: <Phone />, path: "phone-numbers" },
  { label: "Call Agents", icon: <CallAgent />, path: "call-agents" },
  { label: "Call Campaigns", icon: <PhoneCampaign />, path: "call-campaigns" },
  { label: "Outbound Calls", icon: <OutboundCall />, path: "outbound-calls" },
  { label: "Inbound Calls", icon: <InboundCall />, path: "inbound-calls" },
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
        return <OutBoundCalls />;
      case "inbound-calls":
        return <InBoundCalls />;
      default:
        return <PhoneDashboard />;
    }
  };

  return (
    <div className="h-full w-full bg-[#F6F7F9]">
      <div className="flex flex-col md:flex-row items-start gap-8 relative pl-4 py-3 w-full">
        {/* Sidebar */}
        <div className="flex flex-col w-full md:w-[200px] items-start gap-2 relative">
          <div className="bg-[#E1E4EA] rounded-lg w-[153px] h-[153px]"></div>
          {sideMenuList.map((item, i) => (
            <div
              key={i}
              onClick={() => setActiveSidebarItem(item.path)}
              className={`flex items-center gap-2 px-3 py-2 rounded-md cursor-pointer w-full ${activeSidebarItem === item.path
                ? "bg-[#E1E5EA] text-black"
                : "text-gray-600 hover:bg-gray-100"
                }`}
            >
              {item.icon}
              <span className="onest text-[14px] font-[400]">{item.label}</span>
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
