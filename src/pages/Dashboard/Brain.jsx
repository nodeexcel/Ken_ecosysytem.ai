import React, { useState } from "react";
import Contacts from "../../components/Contacts";
import Knowledge from "../../components/Knowledge";
import Integration from "../../components/Integration";
import contact from '../../assets/svg/brain_contact.svg'
import knowledge from '../../assets/svg/brain_knowledge.svg'
import integration from '../../assets/svg/brain_integration.svg'
import { ContactIcon, IntegrationIcon, KnowledgeIcon, LeftArrow } from "../../icons/icons";
import { MdOutlineKeyboardArrowLeft } from "react-icons/md";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const BrainAI = () => {
  const [activePath, setActivePath] = useState("contacts");

  const navigate = useNavigate();
  const navbarDetails = useSelector((state) => state.navbar)

  const sideMenuItems = [
    { label: "Contacts", icon: <ContactIcon status={activePath == "contacts"} />, path: "contacts" },
    { label: "Knowledge", icon: <KnowledgeIcon status={activePath == "knowledge"} />, path: "knowledge" },
    { label: "Integration", icon: <IntegrationIcon status={activePath == "integration"} />, path: "integration" },
  ];

  const renderMainContent = () => {
    switch (activePath) {
      case "knowledge":
        return <Knowledge />;
      case "integration":
        return <Integration />;
      default:
        return <Contacts />;
    }
  };

  return (
    <div className="h-full w-full">
      <div className="flex h-screen flex-col md:flex-row items-start gap-8 relative w-full">
        {/* Sidebar */}
        {navbarDetails?.label !== "integrations" && <div className="flex flex-col bg-white gap-8 border-r border-[#E1E4EA] w-[272px] h-full">
          <div className=''>
            <div className='flex justify-between items-center cursor-pointer w-fit' onClick={() => navigate("/dashboard")}>
              {/* <MdOutlineKeyboardArrowLeft size={25} /> */}
              <div className="flex gap-4 pl-5 items-center h-[57px]">
                <LeftArrow/>
                <h1 className="text-[20px] font-[600]">Brain AI</h1>
              </div>
            </div>
            <hr className='text-[#E1E4EA]' />
          </div>
          <div className="flex flex-col w-full items-start gap-2 px-2">
            {sideMenuItems.map((item, i) => {
              const Icon = item.icon;
              const isActive = activePath === item.path;

              return (
                <button
                  key={i}
                  onClick={() => setActivePath(item.path)}
                  className={` cursor-pointer flex items-center justify-start gap-1.5 px-2 py-2 w-full h-auto rounded ${isActive ? "bg-[#F0EFFF] text-[#675FFF]" : "text-[#5A687C]"
                    }`}
                >
                  <div>
                    {Icon}
                  </div>
                  <span
                    className={`font-[400] text-[16px] ${isActive ? "text-[#675FFF]" : "text-[#5A687C]"
                      }`}
                  >
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>}

        {/* Main Content */}
        <div className="w-full h-full overflow-x-hidden py-3 pr-4">{renderMainContent()}</div>
      </div>
    </div>
  );
};

export default BrainAI;
