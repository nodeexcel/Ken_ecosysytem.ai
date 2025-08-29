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
import presentation from "../assets/svg/presentation.svg"
import meetingNotes from "../assets/svg/meeting_notes.svg"
import whatsapp from "../assets/svg/whats_app.svg"
import youtube from "../assets/svg/youtube.svg"
import linkedin from "../assets/svg/linked_in.svg"
import twitter from  "../assets/svg/twitter.svg"
import creation from "../assets/svg/creation.svg"
import campaign from "../assets/svg/campaign.svg"
import callCalling from "../assets/svg/call_calling.svg"
import agents from "../assets/svg/agents.svg"
import smartChatbot from "../assets/svg/smart_chatbot.svg"
import faq from "../assets/svg/faq.svg"
import user_guide from "../assets/svg/user_guide.svg"
import customer_email from "../assets/svg/customer_email.svg"
import inbound from "../assets/svg/inbound.svg"
import job_description from "../assets/svg/job_description.svg"
import balancesheet from "../assets/svg/balancesheet.svg"
import profit from "../assets/svg/profit.svg"
import sales from "../assets/svg/sales.svg"
import roi from "../assets/svg/roi.svg"
import article from "../assets/svg/article.svg"
import start_seo from "../assets/svg/start_seo.svg"
import search from "../assets/svg/search.svg"
import resume from "../assets/svg/resume.svg"
import interviewer from "../assets/svg/interviewer.svg"




import { useDispatch } from "react-redux";
import { getAgentSkillsData } from "../store/agentSkillsSlice";
import { useNavigate } from "react-router-dom";



function AllAgentsSkills() {
    const { t } = useTranslation()
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const allAgentsData = [
        {
            name: "Tara",
            role: t("coo"),
            gradient: "bg-gradient-to-br from-[#CEBFFD] to-[#CEBFFD]",
            image: taraImg,
            path: "coo",
            cardStyles: "border-[#CEBFFD] bg-[#F6F3FF]",
            cardContent: [{ header: t("skills.tara_content1_header"), content: t("skills.tara_content1_description"), img: presentation, tab:"presentation"  },
            { header: t("skills.tara_content2_header"), content: t("skills.tara_content2_description"), img: meetingNotes, tab: "meeting_notes" },
            { header:t("skills.tara_content3_header"), content: t("skills.tara_content3_description"), img: whatsapp, tab: "connect_whatsApp" }
            ]
        },
        {
            name: "Constance",
            role: t("content_creation"),
            gradient: "bg-gradient-to-br from-[#F8DDFF] to-[#F8DDFF]",
            image: constanceImg,
            path: "content-creation",
            cardStyles: "border-[#F8DDFF] bg-[#FDF6FF]",
            cardContent: [{ header: t("skills.constance_content1_header"), content: t("skills.constance_content1_description"), img: youtube, tab: "youtube" },
            { header: t("skills.constance_content2_header"), content: t("skills.constance_content2_description"), img: linkedin, tab: "linkedin" },
            { header: t("skills.constance_content3_header"), content: t("skills.constance_content3_description"), img: twitter, tab: "x_post" },
            { header: t("skills.constance_content4_header"), content: t("skills.constance_content4_description"), img: creation, tab: "creation_studio" }
            ]
        },
        {
            name: "Tom",
            role: t("phone_outreach"),
            gradient: "bg-gradient-to-br from-[#DBE5FF] to-[#DBE5FF]",
            image: tomImg,
            path: "phone",
            cardStyles: "border-[#DBE5FF] bg-[#F2F5FF]",
            cardContent: [
                { header: t("skills.tom_content1_header"), content: t("skills.tom_content1_description"), img: campaign, tab: "call-campaigns" },
                { header: t("skills.tom_content2_header"), content: t("skills.tom_content2_description"), img: callCalling, tab: "cold_calling" },
                // { header: "Phone Numbers", content: "Manage and assign business phone numbers easily.", img: tomSkillImg2 },
                // { header: "Call Agents", content: "Add and manage your call support agents.", img: tomSkillImg3 },
                // { header: "Outbound Calls", content: "Automate and scale your outbound call operations.", img: tomSkillImg5 },
                // { header: "Inbound Calls", content: "Handle inbound calls with efficiency and automation.", img: tomSkillImg6 }
            ]
        },
        {
            name: "Seth",
            role: t("appointment_setter"),
            gradient: "bg-gradient-to-br from-[#FFE4C5] to-[#FFE4C5]",
            image: sethImg,
            path: "appointment-setter",
            cardStyles: "border-[#FFE4C5] bg-[#FFFDFA]",
            cardContent: [{ header: t("skills.seth_content1_header"), content: t("skills.seth_content1_description"), img: agents, tab: "agents" },
                // { header: "Conversations", content: "Monitor and review all customer communications.", img: sethSkillImg2 },
                // { header: "Analytics", content: "Track performance metrics and campaign insights.", img: sethSkillImg3 }
            ]
        },
        {
            name: "Calina",
            role: t("customer_support"),
            gradient: "bg-gradient-to-br from-[#E3F6ED] to-[#E3F6ED]",
            image: calinaImg,
            path: "customer-support",
            cardStyles: "border-[#E3F6ED] bg-[#EFFFF7]",
            cardContent: [{ header: t("skills.calina_content1_header"), content: t("skills.calina_content1_description"), img: smartChatbot, tab: "smart_bot" },
            { header:t("skills.calina_content2_header"), content: t("skills.calina_content2_description"), img: faq, tab: "faq_generator" },
            { header: t("skills.calina_content3_header"), content: t("skills.calina_content3_description"), img: user_guide, tab: "user_guide" },
            { header: t("skills.calina_content4_header"), content: t("skills.calina_content4_description"), img: customer_email, tab: "email" }
            ]
        },
        {
            name: "Rebecca",
            role: t("receptionist"),
            gradient: "bg-gradient-to-br from-[#DBE5FF] to-[#DBE5FF]",
            image: rebeccaImg,
            path: "phone",
            cardStyles: "border-[#DBE5FF] bg-[#F2F5FF]",
            cardContent: [{ header: t("skills.rebecca_content1_header"), content: t("skills.rebecca_content1_description"), img: inbound, tab: "inbound-calls" }]
        },
        {
            name: "Emile",
            role: t("email"),
            gradient: "bg-gradient-to-br from-[#CEBFFD] to-[#CEBFFD]",
            image: emileImg,
            path: "campaigns",
            cardStyles: "border-[#CEBFFD] bg-[#F7F4FF]",
            cardContent: [{ header: t("skills.emile_content1_header"), content: t("skills.emile_content1_description"), img: campaign, tab: "campaigns" },
                // { header: "Calendar", content: "Schedule meetings and deadlines in one place.", img: emileSkillImg2 }
            ]
        },
        {
            name: "Rima",
            role: t("hr"),
            gradient: "bg-gradient-to-br from-[#FFE4C5] to-[#FFE4C5]",
            image: rimaImg,
            path: "hr",
            cardStyles: "border-[#FFE4C5] bg-[#FFF7EE]",
            cardContent: [{ header: t("skills.rima_content1_header"), content: t("skills.rima_content1_description"), img: job_description, tab: "job_description_writer" },
            { header:t("skills.rima_content2_header"), content: t("skills.rima_content2_description"), img: resume, tab: "resume_screener" },
            { header: t("skills.rima_content3_header"), content: t("skills.rima_content3_description"), img: interviewer, tab: "interview_planner" },
            { header: t("skills.rima_content4_header"), content: t("skills.rima_content4_description"), img: linkedin, tab: "linkedin" }
            ]
        },
        {
            name: "Finn",
            role: t("accouting"),
            gradient: "bg-gradient-to-br from-[#E3F6ED] to-[#E3F6ED]",
            image: finnImg,
            path: "accounting",
            cardStyles: "border-[#E3F6ED] bg-[#F4FDF9]",
            cardContent: [{ header: t("skills.finn_content1_header"), content: t("skills.finn_content1_description"), img: balancesheet, tab: "balance_sheet" },
            { header: t("skills.finn_content2_header"), content: t("skills.finn_content2_description"), img: profit, tab: "profit_loss_calculator" },
            { header: t("skills.finn_content3_header"), content: t("skills.finn_content3_description"), img: sales, tab: "sales_forecaster" },
            { header: t("skills.finn_content4_header"), content: t("skills.finn_content4_description"), img: roi, tab: "roi_calculator" }
            ]
        },
        {
            name: "Sandro",
            role: t("seo_name"),
            gradient: "bg-gradient-to-br from-[#F8DDFF] to-[#F8DDFF]",
            image: sandroImg,
            path: "seo",
            cardStyles: "border-[#F8DDFF] bg-[#FDF3FF]",
            cardContent: [{ header: t("skills.sandro_content1_header"), content: t("skills.sandro_content1_description"), img: article, tab: "articles" },
            { header: t("skills.sandro_content2_header"), content: t("skills.sandro_content2_description"), img: start_seo, tab: "automation" },
            { header: t("skills.sandro_content3_header"), content: t("skills.sandro_content3_description"), img: search, tab: "audit" }
            ]
        },
    ];


    const handleNavigate = (path, tab) => {
        dispatch(getAgentSkillsData(tab))
        navigate(`/dashboard/${path}`)
    }


    return (
        <div className="w-full py-4 px-20 h-screen overflow-auto flex flex-col gap-6">
            <h1 className="text-[24px] font-[600] text-[#1E1E1E] pb-2">{t("skills.all_agents")}</h1>
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
                                <div key={card.header} onClick={() => handleNavigate(each.path, card.tab)} className={`w-full cursor-pointer hover:opacity-70 sm:w-[40%] lg:w-[23%] border ${each.cardStyles} p-[14px] rounded-[8px] flex flex-col gap-[16px]`}>
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
