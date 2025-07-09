import { useTranslation } from "react-i18next"
import taraImg from "../assets/svg/tara_logo.svg";
import constanceImg from "../assets/svg/constance_logo.svg";
import tomImg from "../assets/svg/tom_logo.svg";
import sethImg from "../assets/svg/seth_logo.svg";
import calinaImg from "../assets/svg/calina_logo.svg";
import rebeccaImg from "../assets/svg/rebecca_logo.svg";
import emileImg from "../assets/svg/emile_logo.svg";
import rimaImg from "../assets/svg/rima_logo.svg";
import finnImg from "../assets/svg/finn_logo.svg";
import sandroImg from "../assets/svg/sandro_logo.svg";
import taraSkillImg1 from "../assets/svg/skills_tara_1.svg";
import taraSkillImg2 from "../assets/svg/skills_tara_2.svg";
import taraSkillImg3 from "../assets/svg/skills_tara_3.svg";
import constanceSkillImg1 from "../assets/svg/skills_constance_1.svg";
import constanceSkillImg2 from "../assets/svg/skills_constance_2.svg";
import constanceSkillImg3 from "../assets/svg/skills_constance_3.svg";
import constanceSkillImg4 from "../assets/svg/skills_constance_4.svg";
import tomSkillImg1 from "../assets/svg/skills_tom_1.svg";
import tomSkillImg2 from "../assets/svg/skills_tom_2.svg";
import tomSkillImg3 from "../assets/svg/skills_tom_3.svg";
import tomSkillImg4 from "../assets/svg/skills_tom_4.svg";
import tomSkillImg5 from "../assets/svg/skills_tom_5.svg";
import tomSkillImg6 from "../assets/svg/skills_tom_6.svg";
import sethSkillImg1 from "../assets/svg/skills_seth_1.svg";
import sethSkillImg2 from "../assets/svg/skills_seth_2.svg";
import sethSkillImg3 from "../assets/svg/skills_seth_3.svg";
import calinaSkillImg1 from "../assets/svg/skills_calina_1.svg";
import calinaSkillImg2 from "../assets/svg/skills_calina_2.svg";
import calinaSkillImg3 from "../assets/svg/skills_calina_3.svg";
import calinaSkillImg4 from "../assets/svg/skills_calina_4.svg";
import rebeccaSkillImg1 from "../assets/svg/skills_rebecca_1.svg";
import emileSkillImg1 from "../assets/svg/skills_emile_1.svg";
import emileSkillImg2 from "../assets/svg/skills_emile_2.svg";
import rimaSkillImg1 from "../assets/svg/skills_rima_1.svg";
import rimaSkillImg2 from "../assets/svg/skills_rima_2.svg";
import rimaSkillImg3 from "../assets/svg/skills_rima_3.svg";
import finnSkillImg1 from "../assets/svg/skills_finn_1.svg";
import finnSkillImg2 from "../assets/svg/skills_finn_2.svg";
import finnSkillImg3 from "../assets/svg/skills_finn_3.svg";
import finnSkillImg4 from "../assets/svg/skills_finn_4.svg";
import sandroSkillImg1 from "../assets/svg/skills_sandro_1.svg";
import sandroSkillImg2 from "../assets/svg/skills_sandro_2.svg";
import sandroSkillImg3 from "../assets/svg/skills_sandro_3.svg";



function AllAgentsSkills() {
    const { t } = useTranslation()
    const allAgentsData = [
        {
            name: "Tara",
            role: t("coo"),
            gradient: "bg-gradient-to-br from-[#CEBFFD] to-[#CEBFFD]",
            image: taraImg,
            cardStyles: "border-[#CEBFFD] bg-[#F6F3FF]",
            cardContent: [{ header: "Presentations", content: "Create engaging presentations quickly and effortlessly.", img: taraSkillImg1 },
            { header: "Meeting Notes Generator", content: "Summarize meetings into clear, actionable notes.", img: taraSkillImg2 },
            { header: "Connect WhatsApp", content: "Link WhatsApp for instant customer communication.", img: taraSkillImg3 }
            ]
        },
        {
            name: "Constance",
            role: t("content_creation"),
            gradient: "bg-gradient-to-br from-[#F8DDFF] to-[#F8DDFF]",
            image: constanceImg,
            cardStyles: "border-[#F8DDFF] bg-[#FDF6FF]",
            cardContent: [{ header: "YouTube Script Writer", content: "Write compelling scripts for YouTube videos.", img: constanceSkillImg1 },
            { header: "LinkedIn Nuke", content: "Automate LinkedIn messaging and outreach campaigns.", img: constanceSkillImg2 },
            { header: "X Post Generator", content: "Craft posts optimized for X (formerly Twitter).", img: constanceSkillImg3 },
            { header: "Creation Studio", content: "Central hub for content and campaign creation.", img: constanceSkillImg4 }
            ]
        },
        {
            name: "Tom",
            role: t("phone_outreach"),
            gradient: "bg-gradient-to-br from-[#DBE5FF] to-[#DBE5FF]",
            image: tomImg,
            cardStyles: "border-[#DBE5FF] bg-[#F2F5FF]",
            cardContent: [{ header: "Cold Calling Script", content: "Generate persuasive cold calling sales scripts.", img: tomSkillImg1 },
            { header: "Phone Numbers", content: "Manage and assign business phone numbers easily.", img: tomSkillImg2 },
            { header: "Call Agents", content: "Add and manage your call support agents.", img: tomSkillImg3 },
            { header: "Call Campaigns", content: "Launch and track automated outbound call campaigns.", img: tomSkillImg4 },
            { header: "Outbound Calls", content: "Automate and scale your outbound call operations.", img: tomSkillImg5 },
            { header: "Inbound Calls", content: "Handle inbound calls with efficiency and automation.", img: tomSkillImg6 }
            ]
        },
        {
            name: "Seth",
            role: t("appointment_setter"),
            gradient: "bg-gradient-to-br from-[#FFE4C5] to-[#FFE4C5]",
            image: sethImg,
            cardStyles: "border-[#FFE4C5] bg-[#FFFDFA]",
            cardContent: [{ header: "Agents", content: "Manage agent performance and availability in real time.", img: sethSkillImg1 },
            { header: "Conversations", content: "Monitor and review all customer communications.", img: sethSkillImg2 },
            { header: "Analytics", content: "Track performance metrics and campaign insights.", img: sethSkillImg3 }
            ]
        },
        {
            name: "Calina",
            role: t("customer_support"),
            gradient: "bg-gradient-to-br from-[#E3F6ED] to-[#E3F6ED]",
            image: calinaImg,
            cardStyles: "border-[#E3F6ED] bg-[#EFFFF7]",
            cardContent: [{ header: "Smart Chatbot Generator", content: "Build intelligent chatbots without coding skills.", img: calinaSkillImg1 },
            { header: "FAQ Generator", content: "Auto-generate FAQs based on customer queries.", img: calinaSkillImg2 },
            { header: "User Guide Generator", content: "Create user guides from product descriptions.", img: calinaSkillImg3 },
            { header: "Customer Email Responder", content: "Automate replies to common customer emails.", img: calinaSkillImg4 }
            ]
        },
        {
            name: "Rebecca",
            role: t("receptionist"),
            gradient: "bg-gradient-to-br from-[#DBE5FF] to-[#DBE5FF]",
            image: rebeccaImg,
            cardStyles: "border-[#DBE5FF] bg-[#F2F5FF]",
            cardContent: [{ header: "Cold Calling Script", content: "Automate and scale your outbound call operations.", img: rebeccaSkillImg1 }]
        },
        {
            name: "Emile",
            role: t("email"),
            gradient: "bg-gradient-to-br from-[#CEBFFD] to-[#CEBFFD]",
            image: emileImg,
            cardStyles: "border-[#CEBFFD] bg-[#F7F4FF]",
            cardContent: [{ header: "Campaigns Generator", content: "Build multi-channel marketing campaigns instantly.", img: emileSkillImg1 },
            { header: "Calendar", content: "Schedule meetings and deadlines in one place.", img: emileSkillImg2 }
            ]
        },
        {
            name: "Rima",
            role: t("hr"),
            gradient: "bg-gradient-to-br from-[#FFE4C5] to-[#FFE4C5]",
            image: rimaImg,
            cardStyles: "border-[#FFE4C5] bg-[#FFF7EE]",
            cardContent: [{ header: "Job Description Writer", content: "Write clear, role-specific job descriptions fast.", img: rimaSkillImg1 },
            { header: "Resume Screener", content: "Automatically filter and rank resumes efficiently.", img: rimaSkillImg2 },
            { header: "Interview Planner", content: "Organize interviews and coordinate with candidates.", img: rimaSkillImg3 },
            { header: "LinkedIn Outreacher", content: "Automate LinkedIn networking and lead generation.", img: constanceSkillImg2 }
            ]
        },
        {
            name: "Finn",
            role: t("accouting"),
            gradient: "bg-gradient-to-br from-[#E3F6ED] to-[#E3F6ED]",
            image: finnImg,
            cardStyles: "border-[#E3F6ED] bg-[#F4FDF9]",
            cardContent: [{ header: "Balance Sheet Generator", content: "Create accurate balance sheets in seconds.", img: finnSkillImg1 },
            { header: "Profit Loss Calculator", content: "Instantly calculate your business profit and loss.", img: finnSkillImg2 },
            { header: "Sales Forecaster", content: "Predict future sales with AI-powered insights.", img: finnSkillImg3 },
            { header: "ROI Calculator", content: "Measure return on investment for any campaign.", img: finnSkillImg4 }
            ]
        },
        {
            name: "Sandro",
            role: t("seo_name"),
            gradient: "bg-gradient-to-br from-[#F8DDFF] to-[#F8DDFF]",
            image: sandroImg,
            cardStyles: "border-[#F8DDFF] bg-[#FDF3FF]",
            cardContent: [{ header: "Articles Generator", content: "Produce high-quality articles in minutes.", img: sandroSkillImg1 },
            { header: "Start SEO Automation", content: "Automate SEO tasks and content optimization.", img: sandroSkillImg2 },
            { header: "SEO Audit", content: "Run detailed SEO audits to improve rankings.", img: sandroSkillImg3 }
            ]
        },
    ];
    return (
        <div className="w-full py-4 px-20 h-screen overflow-auto flex flex-col gap-6">
            <h1 className="text-[24px] font-[600] text-[#1E1E1E] pb-2">All Agents</h1>
            <div className="h-full w-full py-5 flex flex-col gap-8">
                {allAgentsData.map((each) => (
                    <div key={each.name} className="flex flex-col gap-6 pb-4">
                        <div className="flex items-center gap-2">
                            <div className={`h-[54px] w-[54px] rounded-[27px] flex justify-center items-center px-[13px] ${each.gradient}`}>
                                <img src={each.image} className="object-fit" />
                            </div>
                            <div className="text-[#1E1E1E] font-[400] text-[18px]">
                                <h2 className="font-[600]">{each.name}</h2>
                                <p>{each.role}</p>
                            </div>
                        </div>
                        <div className="flex gap-4 w-full flex-wrap">
                            {each.cardContent.map((card) => (
                                <div key={card.header} className={`w-full sm:w-[40%] lg:w-[23%] border ${each.cardStyles} p-[14px] rounded-[8px] flex flex-col gap-[16px]`}>
                                    <div>
                                        <img src={card.img} alt={card.header} className="object-fit" />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <h2 className="text-[#1E1E1E] font-[600] text-[18px]">{card.header}</h2>
                                        <p className="text-[#5A687C] font-[400] text-[16px]">{card.content}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

        </div>
    )
}

export default AllAgentsSkills
