import CustomChat from "./CustomChat"
import calinaImg from "../assets/svg/calina_msg_logo.svg"
import userGuideImg from "../assets/svg/user_guide_customer_support.svg";
import { useTranslation } from "react-i18next";

function UserGuideCustomerSupport() {
    const { t } = useTranslation()
    const listedData = {
        header: t("skills.calina_content3_header"), label: t("skills.calina_content3_header"), description: t("calina.user_guide_descr"),
        form: { label_1: t("calina.additional_details"), placeholder_1: t("calina.additional_details_placeholder"), label_2: t("rima.custom_instructions"), placeholder_2: t("rima.custom_instructions_placeholder") },
        initialMessage: "Unable to generate a balance sheet: The uploaded document is not a bank statement; it is an eBook or informational guide related to health and wellness. No financial data available for extraction. Please upload an actual bank statement for accurate balance sheet creation",
        agentName: "Caline",
        agentImg: calinaImg,
        headerLogo: userGuideImg
    }
    return (
        <CustomChat listedProps={listedData} />
    )
}

export default UserGuideCustomerSupport
