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
import tomImg from "../../assets/svg/tom_logo.svg"
import rebeccaImg from "../../assets/svg/rebecca_logo.svg"
import { MdOutlineKeyboardArrowLeft } from "react-icons/md";
import { useNavigate } from "react-router-dom";


const PhonePage = () => {
  const [activeSidebarItem, setActiveSidebarItem] = useState("dashboard");
  const dispatch = useDispatch();
  const navbarDetails = useSelector((state) => state.navbar);
  const navigate = useNavigate()

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
      return <div className="bg-[#F0EFFF] w-[232px] mb-5 flex gap-3 p-[12px] rounded-[9px]">
        <div className="w-[35px] h-[45px] flex justify-center items-center">
          <img src={rebeccaImg} alt={"rebecca"} className="object-fit" />
        </div>
        <div className="flex flex-col">
          <h1 className="text-[#1E1E1E] text-[16px] font-[600]">Rebecca</h1>
          <p className="text-[#5A687C] text-[14px] font-[400]">Receptionist</p>
        </div>
      </div>
    } else if (navbarDetails.label === "Tom & Rebecca, Phone") {
      return <div className="bg-[#F0EFFF] w-[232px] mb-5 flex gap-3 p-[12px] rounded-[9px]">
        <div className="w-[64.43pxpx] h-[39px] flex justify-center items-center">
          <img src={tomImg} alt={"tome"} className="object-fit" />
          <img src={rebeccaImg} alt={"rebecca"} className="object-fit" />
        </div>
        <div className="flex flex-col">
          <h1 className="text-[#1E1E1E] text-[16px] font-[600]">Tom & Rebecca</h1>
          <p className="text-[#5A687C] text-[14px] font-[400]">Phone,Receptionist</p>
        </div>
      </div>
    } else {
      return <div className="bg-[#F0EFFF] w-[232px] mb-5 flex gap-3 p-[12px] rounded-[9px]">
        <div className="w-[35px] h-[45px] flex justify-center items-center">
          <img src={tomImg} alt={"tome"} className="object-fit" />
        </div>
        <div className="flex flex-col">
          <h1 className="text-[#1E1E1E] text-[16px] font-[600]">Tom</h1>
          <p className="text-[#5A687C] text-[14px] font-[400]">Phone</p>
        </div>
      </div>
    }
  }

  return (
    <div className="h-full w-full">
      <div className="flex h-screen flex-col md:flex-row items-start gap-8 relative w-full">
        {/* Sidebar */}
        <div className="flex flex-col bg-white gap-8 border-r border-[#E1E4EA] w-[272px] h-full">
          <div className=''>
            <div className='flex justify-between items-center cursor-pointer w-fit' onClick={() => navigate("/dashboard")}>
              <div className="flex gap-2 items-center h-[57px]">
                <MdOutlineKeyboardArrowLeft size={25} />
                <h1 className="text-[20px] font-[600]">Phone</h1>
              </div>
            </div>
            <hr className='text-[#E1E4EA]' />
          </div>
          <div className="flex flex-col w-full items-start gap-2 relative px-2">
            {renderImg()}
            {sideMenuList.map((item, i) => (
              <div
                key={i}
                onClick={() => {
                  dispatch(getNavbarData(item.header))
                  setActiveSidebarItem(item.path)
                }}
                className={`flex items-center gap-2 px-3 py-2 rounded-md cursor-pointer w-full ${activeSidebarItem === item.path
                  ? "bg-[#EDF3FF] text-black"
                  : "text-gray-600 hover:bg-gray-100"
                  }`}
              >
                {item.icon}
                <span className="text-[14px] font-[400]">{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="w-full overflow-x-hidden">{renderMainContent()}</div>
      </div>
    </div>
  );
};

export default PhonePage;
