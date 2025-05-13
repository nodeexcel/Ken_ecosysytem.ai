import { useState } from "react";
import { PrivacyIcon, TermsIcon } from "../../icons/icons";
import TermsAndConditions from "../../components/TermsAndConditions";
import PrivacyPolicy from "../../components/PrivacyPolicy";


const sideMenuList = [
    { label: "Privacy Policy", icon: <PrivacyIcon />, path: "privacy" },
    { label: "Terms and Conditions", icon: <TermsIcon />, path: "terms" },
];

const PrivacyTerms = () => {
    const [activeSidebarItem, setActiveSidebarItem] = useState("privacy");

    const renderMainContent = () => {
        switch (activeSidebarItem) {
            case "terms":
                return <TermsAndConditions />;
            default:
                return <PrivacyPolicy />;
        }
    };

    return (
        <div className="h-full w-full bg-[#F6F7F9]">
            <div className="flex flex-col md:flex-row items-start gap-8 relative pl-4 py-3 w-full">
                {/* Sidebar */}
                <div className="flex flex-col w-full md:w-[222px] items-start gap-2 relative">
                    {sideMenuList.map((item, i) => (
                        <div
                            key={i}
                            onClick={() => setActiveSidebarItem(item.path)}
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
