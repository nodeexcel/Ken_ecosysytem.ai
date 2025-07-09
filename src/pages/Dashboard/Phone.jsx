import { useEffect, useState } from "react";
import PhoneNumberList from '../../components/PhoneNumberList'
import CallAgentsPage from '../../components/CallAgent'
import CallCampaign from '../../components/CallCampaign'
import PhoneDashboard from '../../components/PhoneDashboard'
import { CallAgent, FourBox, Phone, PhoneCampaign, OutboundCall, InboundCall, LeftArrow, HeadPhonesIcon } from "../../icons/icons";
import OutBoundCalls from "../../components/OutboundCalls";
import InBoundCalls from "../../components/InboundCalls";
import dashboardProfile from '../../assets/svg/dashboard_profile.svg'
import { useDispatch, useSelector } from "react-redux";
import { getNavbarData } from "../../store/navbarSlice";
import tomImg from "../../assets/svg/tom_logo.svg"
import rebeccaImg from "../../assets/svg/rebecca_logo.svg"
import { MdOutlineKeyboardArrowLeft } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import ColdCallingScriptPhone from "../../components/ColdCallingScriptPhone";
import { BsThreeDots } from "react-icons/bs";
import { X } from "lucide-react";


const PhonePage = () => {
  const [activeSidebarItem, setActiveSidebarItem] = useState("dashboard");
  const [sidebarStatus, setSideBarStatus] = useState(false)
  const dispatch = useDispatch();
  const navbarDetails = useSelector((state) => state.navbar);
  const navigate = useNavigate()

  const { t } = useTranslation();

  const sideMenuList = [
    { label: t("phone.dashboard"), icon: <FourBox status={activeSidebarItem == "dashboard"} />, hoverIcon: <FourBox hover={true} />, path: "dashboard", header: `Tom & Rebecca,${t("phone.phone")} ` },
    { label: t("phone.phone_numbers"), icon: <Phone status={activeSidebarItem == "phone-numbers"} />, hoverIcon: <Phone hover={true} />, path: "phone-numbers", header: `Tom & Rebecca,${t("phone.phone")} ` },
    { label: t("phone.call_agents"), icon: <CallAgent status={activeSidebarItem == "call-agents"} />, hoverIcon: <CallAgent hover={true} />, path: "call-agents", header: `Tom & Rebecca,${t("phone.phone")} ` },
    { label: t("phone.call_campaigns"), icon: <PhoneCampaign status={activeSidebarItem == "call-campaigns"} />, hoverIcon: <PhoneCampaign hover={true} />, path: "call-campaigns", header: "Tom" },
    { label: t("phone.outbound_calls"), icon: <OutboundCall status={activeSidebarItem == "outbound-calls"} />, hoverIcon: <OutboundCall hover={true} />, path: "outbound-calls", header: "Tom" },
    { label: t("phone.inbound_calls"), icon: <InboundCall status={activeSidebarItem == "inbound-calls"} />, hoverIcon: <InboundCall hover={true} />, path: "inbound-calls", header: "Rebecca" },
    { label: `Cold Calling`, icon: <HeadPhonesIcon status={activeSidebarItem == "cold_calling"} />, hoverIcon: <HeadPhonesIcon hover={true} />, path: "cold_calling", header: `Tom & Rebecca,${t("phone.phone")} ` },
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
      case "cold_calling":
        return <ColdCallingScriptPhone />;
      default:
        return <PhoneDashboard />;
    }
  };

  useEffect(() => {
    if (navbarDetails?.label === "Rebecca") {
      setActiveSidebarItem("inbound-calls")
      dispatch(getNavbarData('Rebecca'))
    }

  }, [navbarDetails])

  const renderImg = () => {
    if (navbarDetails.label === "Rebecca") {
      return <div className="bg-[#F7F7FF] border border-[#E9E8FF]  lg:w-[232px] w-full mb-5 flex gap-3 p-[12px] rounded-[9px]">
        <div className="flex justify-center items-center">
          <img src={rebeccaImg} alt={"rebecca"} className="object-fit" />
        </div>
        <div className="flex flex-col">
          <h1 className="text-[#1E1E1E] text-[16px] font-[600]">Rebecca</h1>
          <p className="text-[#5A687C] text-[14px] font-[400]">{t("phone.receptionist")}</p>
        </div>
      </div>
    } else if (navbarDetails.label === "Tom") {
      return <div className="bg-[#F7F7FF] border border-[#E9E8FF]  lg:w-[232px] w-full mb-5 flex gap-3 p-[12px] rounded-[9px]">
        <div className="flex justify-center items-center">
          <img src={tomImg} alt={"tome"} className="object-fit" />
        </div>
        <div className="flex flex-col">
          <h1 className="text-[#1E1E1E] text-[16px] font-[600]">Tom</h1>
          <p className="text-[#5A687C] text-[14px] font-[400]">{t("phone.phone_outreach")}</p>
        </div>
      </div>
    } else {
      return <div className="bg-[#F7F7FF] border border-[#E9E8FF]  lg:w-[232px] w-full mb-5 flex gap-3 p-[12px] rounded-[9px]">
        <div className="flex justify-center items-center">
          <img src={tomImg} alt={"tome"} className="object-fit" />
          <img src={rebeccaImg} alt={"rebecca"} className="object-fit" />
        </div>
        <div className="flex flex-col">
          <h1 className="text-[#1E1E1E] text-[16px] font-[600]">Tom & Rebecca</h1>
          <p className="text-[#5A687C] text-[14px] font-[400]">{t("phone.phone")}</p>
        </div>
      </div>
    }
  }

  return (
    <div className="h-full w-full relative">
      <div className="lg:hidden flex absolute top-4 right-4 z-[9999] cursor-pointer" onClick={() => setSideBarStatus(true)} ><BsThreeDots size={24} color='#1e1e1e' /></div>
      <div className="flex h-screen flex-col md:flex-row items-start gap-8 relative w-full">
        {/* Sidebar */}
        <div className="lg:flex hidden flex-col bg-white gap-8 border-r border-[#E1E4EA] w-[272px] h-full">
          <div className=''>
            <div className='flex justify-between items-center cursor-pointer w-fit' onClick={() => navigate("/dashboard")}>
              <div className="flex gap-4 pl-3 items-center h-[57px]">
                {/* <LeftArrow /> */}
                <h1 className="text-[20px] font-[600]">{t("phone.phone")}</h1>
              </div>
            </div>
            <hr className='text-[#E1E4EA]' />
          </div>
          <div className="flex flex-col w-full items-start gap-2 relative px-3">
            {renderImg()}
            {sideMenuList.map((item, i) => (
              <div
                key={i}
                onClick={() => {
                  dispatch(getNavbarData(item.header))
                  setActiveSidebarItem(item.path)
                }}
                className={`flex items-center gap-2 px-3 py-2 rounded-md group cursor-pointer w-full ${activeSidebarItem === item.path
                  ? "bg-[#F0EFFF] text-[#675FFF]"
                  : "text-[#5A687C] hover:bg-[#F9F8FF] hover:text-[#1E1E1E]"
                  }`}
              >
                {activeSidebarItem === item.path ? item.icon :
                  <div className="flex items-center gap-2"><div className='group-hover:hidden'>{item.icon}</div> <div className='hidden group-hover:block'>{item.hoverIcon}</div></div>
                }
                <span className="text-[16px] font-[400]">{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="w-full overflow-x-hidden pr-0 py-8 pl-3 lg:pl-0 lg:pr-4 lg:py-3">{renderMainContent()}</div>
      </div>
      {sidebarStatus &&
        <div className="lg:hidden fixed inset-0 bg-black/20 flex items-end z-50">
          <div className="flex relative flex-col bg-white gap-8 rounded-t-[20px] w-full max-h-[80%] overflow-auto py-8">
            <button
              className="absolute top-4 cursor-pointer right-4 text-[#1e1e1e]"
              onClick={() => {
                setSideBarStatus(false)
              }}
            >
              <X size={20} />
            </button>
            <div className=''>
              <div className='flex justify-center items-center cursor-pointer' onClick={() => navigate("/dashboard")}>
                <div className="flex gap-4 pl-3 items-center h-[57px]">
                  {/* <LeftArrow /> */}
                  <h1 className="text-[20px] font-[600]">{t("phone.phone")}</h1>
                </div>
              </div>
              <hr className='text-[#E1E4EA]' />
            </div>
            <div className="flex flex-col w-full items-start gap-2 relative px-5">
              {renderImg()}
              {sideMenuList.map((item, i) => (
                <div
                  key={i}
                  onClick={() => {
                    dispatch(getNavbarData(item.header))
                    setActiveSidebarItem(item.path)
                    setSideBarStatus(false)
                  }}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md group cursor-pointer w-full ${activeSidebarItem === item.path
                    ? "bg-[#F0EFFF] text-[#675FFF]"
                    : "text-[#5A687C] hover:bg-[#F9F8FF] hover:text-[#1E1E1E]"
                    }`}
                >
                  {activeSidebarItem === item.path ? item.icon :
                    <div className="flex items-center gap-2"><div className='group-hover:hidden'>{item.icon}</div> <div className='hidden group-hover:block'>{item.hoverIcon}</div></div>
                  }
                  <span className="text-[16px] font-[400]">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      }
    </div >
  );
};

export default PhonePage;
