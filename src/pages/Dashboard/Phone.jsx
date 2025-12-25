import { useEffect, useState } from "react";
import PhoneNumberList from '../../components/PhoneNumberList'
import CallAgentsPage from '../../components/CallAgent'
import CallCampaign from '../../components/CallCampaign'
import PhoneDashboard from '../../components/PhoneDashboard'
import OutBoundCalls from "../../components/OutboundCalls";
import InBoundCalls from "../../components/InboundCalls";
import dashboardProfile from '../../assets/svg/dashboard_profile.svg'
import { useDispatch, useSelector } from "react-redux";
import { getNavbarData } from "../../store/navbarSlice";
import tomImg from "../../assets/svg/tom_logo.svg"
import rebeccaImg from "../../assets/svg/rebecca_logo.svg"
import TutorialPlay from '../../assets/svg/WatchTutorialGrey.svg'
import { MdOutlineKeyboardArrowLeft } from "react-icons/md";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import ColdCallingScriptPhone from "../../components/ColdCallingScriptPhone";
import { X, EllipsisVertical } from "lucide-react";
import { discardSkillsData } from "../../store/agentSkillsSlice";


const PhonePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeSidebarItem, setActiveSidebarItem] = useState("dashboard");
  const [sidebarStatus, setSideBarStatus] = useState(false)
  const [expandedSubmenus, setExpandedSubmenus] = useState(new Set());
  const dispatch = useDispatch();
  const navbarDetails = useSelector((state) => state.navbar);
  const navigate = useNavigate()

  const { t } = useTranslation();

  const sideMenuList = [
    {
      label: t("phone.dashboard"),
      path: "dashboard",
      header: `Tom & Rebecca,${t("phone.phone")} `,
    },
    {
      label: t("phone.phone_number"),
      path: "phone-numbers",
      header: `Tom & Rebecca,${t("phone.phone")} `,
    },
    {
      label: t("phone.call_agents"),
      path: "call-agents",
      header: `Tom & Rebecca,${t("phone.phone")} `,
    },
    {
      label: t("phone.call_campaigns"),
      path: "call-campaigns",
      header: "Tom",
    },
    {
      label: t("phone.outbound_calls"),
      path: "outbound-calls",
      header: "Tom",
    },
    {
      label: t("phone.inbound_calls"),
      path: "inbound-calls",
      header: "Rebecca",
    },
  ];

  // Helper to update URL param for active tab (state follows URL)
  const handleTabChange = (tabPath) => {
    setSearchParams({ tab: tabPath }, { replace: true });
  };

  const handleSectionRedirect = (sectionKey) => {
    // Check top-level items first
    let target = sideMenuList.find((item) => item.path === sectionKey);

    // If not found, check sub-menus
    if (!target) {
      for (const item of sideMenuList) {
        if (item.subMenu) {
          const subItem = item.subMenu.find((sub) => sub.path === sectionKey);
          if (subItem) {
            target = subItem;
            break;
          }
        }
      }
    }

    if (target) {
      dispatch(getNavbarData(target.header));
      handleTabChange(target.path);
    }
  };

  // Initialize URL with default tab if not present on mount
  useEffect(() => {
    const tabFromUrl = searchParams.get("tab");
    const initialExpanded = new Set();
    if (!tabFromUrl) {
      setSearchParams({ tab: "dashboard" }, { replace: true });
    } else {
      // Auto-expand outreach submenu if one of its children is active on mount
      if (tabFromUrl === "call-campaigns" || tabFromUrl === "outbound-calls") {
        initialExpanded.add("outreach");
      }
      if (initialExpanded.size > 0) {
        setExpandedSubmenus(initialExpanded);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync active tab with URL query param when URL changes
  useEffect(() => {
    const tabFromUrl = searchParams.get("tab") || "dashboard";
    setActiveSidebarItem(tabFromUrl);
    // Auto-expand outreach submenu if one of its children is active
    setExpandedSubmenus((prev) => {
      const newSet = new Set(prev);
      if (tabFromUrl === "call-campaigns" || tabFromUrl === "outbound-calls") {
        newSet.add("outreach");
      }
      return newSet;
    });
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
      <div className="bg-[#ffffff] lg:w-[232px] w-full mb-5 flex flex-col gap-3 px-[12px] py-[11px] border-b border-gray-200">
        <div className="flex gap-3">
          <div className="flex justify-center items-center bg-gray-200 rounded-full w-12 h-12">
            <img
              src={rebeccaImg}
              alt="rebecca"
              className="w-8 h-8 rounded-full object-contain scale-150"
            />
          </div>

          <div className="flex flex-col">
            <h1 className="text-[#1E1E1E] text-[15px] font-[400]">Rebecca</h1>
            <p className="text-[#5A687C] text-[13px] font-[300]">
              {t("phone.phone_outreach")}
            </p>
          </div>

        </div>
        {/* Watch Tutorial Button */}
        <button
          onClick={() => {
            console.log("Watch Tutorial clicked");
          }}
          className="w-full flex items-center justify-center gap-2 px-2 py-2 bg-white border border-[#E1E4EA] rounded-xl text-[#1E1E1E] font-[600] text-sm hover:bg-[#F8F9FB] transition-colors cursor-pointer"
        >
          <img src={TutorialPlay} className="w-4 h-4" />
          <span className="text-[13px] font-[300]">{t("watch_tutorial") || "Watch Tutorial"}</span>
        </button>
        <hr className="border border-transparent w-full" />
      </div>
    );
  }

  return (
    <div className="h-full w-full relative">
      <div className="lg:hidden flex absolute top-4 right-4 z-[9999] cursor-pointer" onClick={() => setSideBarStatus(true)} ><EllipsisVertical size={24} color='#1e1e1e' /></div>
      <div className="flex h-screen flex-col md:flex-row items-start gap-8 relative w-full mt-2">
        {/* Sidebar */}
        <div className="lg:flex hidden flex-col bg-white gap-4 border border-[#D6D6D6] min-w-[272px] ml-2 rounded-r-2xl rounded-tl-none rounded-bl-none fixed h-[calc(100vh-105px)] mt-2 mb-8 overflow-y-auto">
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
            {sideMenuList.map((item, i) => {
              const isActive = activeSidebarItem === item.path;
              const hasSubMenu = item.subMenu && item.subMenu.length > 0;
              const isExpanded = expandedSubmenus.has(item.path);
              const hasActiveSubItem = hasSubMenu && item.subMenu.some((sub) => sub.path === activeSidebarItem);

              return (
                <div key={i} className="w-full">
                  <div
                    onClick={() => {
                      if (hasSubMenu) {
                        setExpandedSubmenus((prev) => {
                          const newSet = new Set(prev);
                          if (isExpanded) {
                            newSet.delete(item.path);
                          } else {
                            newSet.add(item.path);
                          }
                          return newSet;
                        });
                      } else {
                        dispatch(getNavbarData(item.header));
                        handleTabChange(item.path);
                      }
                    }}
                    className={`flex justify-center group md:justify-start items-center gap-1.5 px-2 py-2 relative self-stretch w-full flex-[0_0_auto] rounded-2xl cursor-pointer ${isActive || hasActiveSubItem
                      ? "bg-[#E9E8F9]"
                      : "text-[#5A687C] hover:bg-[#F9F8FF]"
                      }`}
                  >
                    <span className={`font-[400] text-[14px] ml-3 ${isActive || hasActiveSubItem ? "text-[#000000]" : "text-grey-200 group-hover:text-[#1E1E1E]"}`}>
                      {item.label}
                    </span>
                  </div>
                  {hasSubMenu && isExpanded && (
                    <div className="ml-4 mt-1 flex flex-col gap-1">
                      {item.subMenu.map((subItem, subIndex) => {
                        const isSubActive = activeSidebarItem === subItem.path;
                        return (
                          <div
                            key={subIndex}
                            onClick={(e) => {
                              e.stopPropagation();
                              dispatch(getNavbarData(subItem.header));
                              handleTabChange(subItem.path);
                            }}
                            className={`flex justify-center group md:justify-start items-center gap-1.5 px-2 py-2 relative self-stretch w-full flex-[0_0_auto] rounded-2xl cursor-pointer ${isSubActive
                              ? "bg-[#E9E8F9]"
                              : "text-[#5A687C] hover:bg-[#F9F8FF]"
                              }`}
                          >
                            <span className={`font-[400] text-[14px] ml-3 ${isSubActive ? "text-[#000000]" : "text-grey-200 group-hover:text-[#1E1E1E]"}`}>
                              {subItem.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
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
              {sideMenuList.map((item, i) => {
                const isActive = activeSidebarItem === item.path;
                const hasSubMenu = item.subMenu && item.subMenu.length > 0;
                const isExpanded = expandedSubmenus.has(item.path);
                const hasActiveSubItem = hasSubMenu && item.subMenu.some((sub) => sub.path === activeSidebarItem);

                return (
                  <div key={i} className="w-full">
                    <div
                      onClick={() => {
                        if (hasSubMenu) {
                          setExpandedSubmenus((prev) => {
                            const newSet = new Set(prev);
                            if (isExpanded) {
                              newSet.delete(item.path);
                            } else {
                              newSet.add(item.path);
                            }
                            return newSet;
                          });
                        } else {
                          dispatch(getNavbarData(item.header));
                          handleTabChange(item.path);
                          setSideBarStatus(false);
                        }
                      }}
                      className={`flex justify-center group md:justify-start items-center gap-1.5 px-2 py-2 relative self-stretch w-full flex-[0_0_auto] rounded-2xl cursor-pointer ${isActive || hasActiveSubItem
                        ? "bg-[#E9E8F9]"
                        : "text-[#5A687C] hover:bg-[#F9F8FF]"
                        }`}
                    >
                      <span className={`font-[400] text-[14px] ml-3 ${isActive || hasActiveSubItem ? "text-[#000000]" : "text-grey-200 group-hover:text-[#1E1E1E]"}`}>
                        {item.label}
                      </span>
                    </div>
                    {hasSubMenu && isExpanded && (
                      <div className="ml-4 mt-1 flex flex-col gap-1">
                        {item.subMenu.map((subItem, subIndex) => {
                          const isSubActive = activeSidebarItem === subItem.path;
                          return (
                            <div
                              key={subIndex}
                              onClick={(e) => {
                                e.stopPropagation();
                                dispatch(getNavbarData(subItem.header));
                                handleTabChange(subItem.path);
                                setSideBarStatus(false);
                              }}
                            className={`flex justify-center group md:justify-start items-center gap-1.5 px-2 py-2 relative self-stretch w-full flex-[0_0_auto] rounded-2xl cursor-pointer ${isSubActive
                              ? "bg-[#E9E8F9]"
                              : "text-[#5A687C] hover:bg-[#F9F8FF]"
                              }`}
                          >
                            <span className={`font-[400] text-[14px] ml-3 ${isSubActive ? "text-[#000000]" : "text-grey-200 group-hover:text-[#1E1E1E]"}`}>
                              {subItem.label}
                            </span>
                          </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      }
    </div >
  );
};

export default PhonePage;
