import CustomChat from "./CustomChat"
import rimaImg from "../assets/svg/rima_msg_logo.svg"
import linkedInImg from "../assets/svg/linkedin_hr.svg";
import { useTranslation } from "react-i18next";

function LinkedInOutreachHr() {
    const { t } = useTranslation()
    const listedData = {
        header: `${t("rima.linkedin_outreacher.heading")}`, label: `${t("rima.linkedin_outreacher.heading")}`, description: `${t("rima.linkedin_outreacher.description")}`,
        form: { label_1: `${t("rima.linkedin_outreacher.target_audience")}`, placeholder_1: `${t("rima.linkedin_outreacher.target_placeholder")}`, label_2: `${t("rima.custom_instructions")}`, placeholder_2: `${t("rima.custom_instructions_placeholder")}` },
        initialMessage: `${t("rima.initial_message")}`,
        agentName: "Rima",
        agentImg: rimaImg,
        headerLogo: linkedInImg
    }
    return (
        <CustomChat listedProps={listedData} />
    )
}

export default LinkedInOutreachHr
