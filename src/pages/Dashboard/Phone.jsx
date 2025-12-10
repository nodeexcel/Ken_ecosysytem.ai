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
import TutorialPlay from '../../assets/svg/WatchTutorial.svg'
import { MdOutlineKeyboardArrowLeft } from "react-icons/md";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import ColdCallingScriptPhone from "../../components/ColdCallingScriptPhone";
import { BsThreeDots } from "react-icons/bs";
import { X } from "lucide-react";
import { discardSkillsData } from "../../store/agentSkillsSlice";


const PhonePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
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
    // { label: t("phone.cold_calling"), icon: <HeadPhonesIcon status={activeSidebarItem == "cold_calling"} />, hoverIcon: <HeadPhonesIcon hover={true} />, path: "cold_calling", header: `Tom & Rebecca,${t("phone.phone")} ` },
  ];

  // Helper to update URL param for active tab (state follows URL)
  const handleTabChange = (tabPath) => {
    setSearchParams({ tab: tabPath }, { replace: true });
  };

  const handleSectionRedirect = (sectionKey) => {
    const target = sideMenuList.find((item) => item.path === sectionKey);
    if (target) {
      dispatch(getNavbarData(target.header));
      handleTabChange(target.path);
    }
  };

  // Initialize URL with default tab if not present on mount
  useEffect(() => {
    if (!searchParams.get("tab")) {
      setSearchParams({ tab: "dashboard" }, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync active tab with URL query param when URL changes
  useEffect(() => {
    const tabFromUrl = searchParams.get("tab") || "dashboard";
    setActiveSidebarItem(tabFromUrl);
  }, [searchParams]);

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
        return <PhoneDashboard onNavigateSection={handleSectionRedirect} />;
    }
  };

  useEffect(() => {
    if (navbarDetails?.label === "Rebecca") {
      setSearchParams({ tab: "inbound-calls" }, { replace: true });
      dispatch(getNavbarData('Rebecca'))
    }

  }, [navbarDetails])

  const renderImg = () => {
    return (
      <div className="bg-[#ffffff] lg:w-[232px] w-full mb-5 flex flex-col gap-3 p-[12px] rounded-[9px]">
        <div className="flex gap-3">
        <div className="flex justify-center items-center">
          <img src={rebeccaImg} alt={"rebecca"} className="object-fit" />
        </div>
        <div className="flex flex-col">
          <h1 className="text-[#1E1E1E] text-[16px] font-[600]">Rebecca</h1>
          <p className="text-[#5A687C] text-[14px] font-[400]">{t("phone.phone_outreach")}</p>
        </div>
      </div>
        {/* Watch Tutorial Button */}
        <button
          onClick={() => {
            console.log("Watch Tutorial clicked");
          }}
          className="w-full flex items-center justify-center gap-2 px-2 py-2.5 bg-white border border-[#E1E4EA] rounded-xl text-[#1E1E1E] font-[600] text-sm hover:bg-[#F8F9FB] transition-colors cursor-pointer"
        >
          <img src={TutorialPlay} className="w-5 h-5" />
          <span className="text-md font-md">{t("watch_tutorial") || "Watch Tutorial"}</span>
        </button>
        <hr className="border border-gray-200 w-full mt-2" />
      </div>
    );
  }

  return (
    <div className="h-full w-full relative">
      <div className="lg:hidden flex absolute top-4 right-4 z-[9999] cursor-pointer" onClick={() => setSideBarStatus(true)} ><BsThreeDots size={24} color='#1e1e1e' /></div>
      <div className="flex h-screen flex-col md:flex-row items-start gap-8 relative w-full">
        {/* Sidebar */}
        <div className="lg:flex hidden flex-col bg-white gap-4 border border-[#D6D6D6] min-w-[272px] rounded-r-2xl rounded-tl-none rounded-bl-none fixed h-[calc(100vh-89px)] mt-2 mb-8 overflow-y-auto">
          <div className=''>
            <div className='flex justify-between items-center cursor-pointer w-fit' onClick={() => {
              navigate("/dashboard")
              dispatch(discardSkillsData())
            }}>
              {/* <div className="flex gap-4 pl-3 items-center h-[57px]"> */}
                {/* <LeftArrow /> */}
                {/* <h1 className="text-[20px] font-[600]">{t("phone.phone")}</h1>
              </div> */}
            </div>
          </div>
          <div className="flex flex-col w-full items-start gap-2 relative px-3">
            {renderImg()}
            {sideMenuList.map((item, i) => (
              <div
                key={i}
                onClick={() => {
                  dispatch(getNavbarData(item.header))
                  handleTabChange(item.path)
                }}
                className={`flex items-center gap-2 px-3 py-2 group cursor-pointer w-full rounded-2xl ${activeSidebarItem === item.path
                  ? "bg-[#E9E8F9] text-[#000000]"
                  : "text-[#000000] hover:bg-[#F9F8FF] hover:text-[#1E1E1E]"
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
        <div className="w-full lg:ml-[280px] overflow-hidden pr-0 py-8 pl-3 lg:pl-0 lg:pr-4 lg:py-3">
          {renderMainContent()}
        </div>
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
                    handleTabChange(item.path)
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
