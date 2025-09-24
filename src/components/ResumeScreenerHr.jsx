import CustomChat from "./CustomChat"
import rimaImg from "../assets/svg/rima_msg_logo.svg"
import resumeImg from "../assets/svg/resume_screener_hr.svg";
import { useTranslation } from "react-i18next";

function ResumeScreenerHr() {
    const { t } = useTranslation()
    const listedData = {
        header: `${t("resume_screener.heading")}`, label: `${t("resume_screener.heading")}`, description: `${t("resume_screener.resume_description")}`,
        form: { label_1: `${t("resume_screener.resume_content")}`, placeholder_1: `${t("settings.tab_1_list.enter")}`, label_2: `${t("resume_screener.resume_label2")}`, placeholder_2: `${t("resume_screener.resume_placeholder2")}`},
        initialMessage: `${t("resume_screener.resume_initial_message")}`,
        agentName: "Rima",
        agentImg: rimaImg,
        headerLogo: resumeImg
    }
    return (
        <CustomChat listedProps={listedData} />
    )
}

export default ResumeScreenerHr
