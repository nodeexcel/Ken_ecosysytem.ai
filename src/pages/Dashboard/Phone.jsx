import { useState } from "react";
import PhoneNumberList from '../../components/PhoneNumberList'
import CallAgentsPage from '../../components/CallAgent'
import CallCampaign from '../../components/CallCampaign'
import PhoneDashboard from '../../components/PhoneDashboard'
import { CallAgent, FourBox, Phone, PhoneCampaign, OutboundCall, InboundCall } from "../../icons/icons";
import OutBoundCalls from "../../components/OutboundCalls";
import InBoundCalls from "../../components/InboundCalls";
import dashboardProfile from '../../assets/svg/dashboard_profile.svg'
import { useDispatch, useSelector } from "react-redux";
import { getNavbarData } from "../../store/navbarSlice";
import tomImg from "../../assets/svg/tom.svg"
import rebeccaImg from "../../assets/svg/rebecca.svg"


const PhonePage = () => {
  const [activeSidebarItem, setActiveSidebarItem] = useState("dashboard");
  const dispatch = useDispatch();
  const navbarDetails = useSelector((state) => state.navbar)

  const sideMenuList = [
    { label: "Dashboard", icon: <FourBox status={activeSidebarItem == "dashboard"} />, path: "dashboard", header: "Tom & Rebecca, Phone" },
    { label: "Phone Numbers", icon: <Phone status={activeSidebarItem == "phone-numbers"} />, path: "phone-numbers", header: "Tom & Rebecca, Phone" },
    { label: "Call Agents", icon: <CallAgent status={activeSidebarItem == "call-agents"} />, path: "call-agents", header: "Tom, Outbound Calls" },
    { label: "Call Campaigns", icon: <PhoneCampaign status={activeSidebarItem == "call-campaigns"} />, path: "call-campaigns", header: "Tom, Outbound Calls" },
    { label: "Outbound Calls", icon: <OutboundCall status={activeSidebarItem == "outbound-calls"} />, path: "outbound-calls", header: "Tom, Outbound Calls" },
    { label: "Inbound Calls", icon: <InboundCall status={activeSidebarItem == "inbound-calls"} />, path: "inbound-calls", header: "Rebecca, Inbound Calls" },
  ];

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

  const renderImg = () => {
    if (navbarDetails.label === "Rebecca, Inbound Calls") {
      return <img src={rebeccaImg} alt={"rebecca"} className="object-fit" />
    } else if (navbarDetails.label === "Tom & Rebecca, Phone") {
      return <div className="flex absolute">
        <img src={tomImg} alt={"tom"} className="object-fit" />
        <img src={rebeccaImg} alt={"rebecca"} className="relative object-fit left-[-20px]" />
      </div>
    } else {
      return <img src={tomImg} alt={"tom"} className="object-fit" />
    }
  }

  return (
    <div className="h-full w-full bg-[#F6F7F9]">
      <div className="flex flex-col md:flex-row items-start gap-8 relative pl-4 py-3 w-full">
        {/* Sidebar */}
        <div className="flex flex-col w-full md:w-[200px] items-start gap-2 relative">
          <div className="w-[153px] h-[153px] flex justify-center items-center">
            {renderImg()}
          </div>
          {sideMenuList.map((item, i) => (
            <div
              key={i}
              onClick={() => {
                dispatch(getNavbarData(item.header))
                setActiveSidebarItem(item.path)
              }}
              className={`flex items-center gap-2 px-3 py-2 rounded-md cursor-pointer w-full ${activeSidebarItem === item.path
                ? "bg-[#E1E5EA] text-black"
                : "text-gray-600 hover:bg-gray-100"
                }`}
            >
              {item.icon}
              <span className="text-[14px] font-[400]">{item.label}</span>
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
