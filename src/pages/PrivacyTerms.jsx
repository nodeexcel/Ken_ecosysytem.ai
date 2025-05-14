import { useState } from "react";
import { PrivacyIcon, TermsIcon } from "../icons/icons";
import TermsAndConditions from "../components/TermsAndConditions";
import PrivacyPolicy from "../components/PrivacyPolicy";
import logo from '/ecosystem_logo.svg'
import { useLocation, useNavigate } from "react-router-dom";


const sideMenuList = [
    { label: "Privacy Policy", icon: <PrivacyIcon />, path: "/privacy-policy" },
    { label: "Terms and Conditions", icon: <TermsIcon />, path: "/terms-conditions" },
];

const PrivacyTerms = () => {
    const location=useLocation()
    const [activeSidebarItem, setActiveSidebarItem] = useState(location.pathname);
    const navigate=useNavigate()

    console.log(location.pathname)

    const handleSelect = (path)=>{
        setActiveSidebarItem(path)
        navigate(path)
    }


    const renderMainContent = () => {
        switch (activeSidebarItem) {
            case "/terms-conditions":
                return <TermsAndConditions />;
            default:
                return <PrivacyPolicy />;
        }
    };

    return (
        <div className="h-full w-full bg-[#F6F7F9] p-4">
            <div className="flex justify-center items-center rounded-lg gap-2 mb-4 p-6 bg-[#E7E6F9]">
                <div>
                    <img src={logo} alt="logo" className="w-[47.15px] h-[52px]" />
                </div>
                <h1 className="text-[28px] font-semibold text-[#1E1E1E]">Ecosysteme.ai</h1>
            </div>
            <div className="flex flex-col md:flex-row items-start gap-8 relative pl-4 py-3 w-full">
                {/* Sidebar */}
                <div className="flex flex-col w-full md:w-[222px] items-start gap-2 relative">
                    {sideMenuList.map((item, i) => (
                        <div
                            key={i}
                            onClick={() => handleSelect(item.path)}
                            className={`flex items-center gap-2 p-2 rounded-md cursor-pointer w-full ${activeSidebarItem === item.path
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

export default PrivacyTerms;
