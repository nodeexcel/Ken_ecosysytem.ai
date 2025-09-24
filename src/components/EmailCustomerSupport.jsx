import CustomChat from "./CustomChat"
import calinaImg from "../assets/svg/calina_msg_logo.svg"
import emailImg from "../assets/svg/email_customer_support.svg";
import { useTranslation } from "react-i18next";

function EmailCustomerSupport() {
    const { t } = useTranslation()
    const listedData = {
        header: t("skills.calina_content4_header"), label: t("skills.calina_content4_header"), description: t("calina.customer_email_descr"),
        form: { label_1: t("calina.email_content"), placeholder_1: t("calina.email_content_placeholder"), label_2: t("rima.custom_instructions"), placeholder_2: t("rima.custom_instructions_placeholder") },
        initialMessage: "Unable to generate a balance sheet: The uploaded document is not a bank statement; it is an eBook or informational guide related to health and wellness. No financial data available for extraction. Please upload an actual bank statement for accurate balance sheet creation",
        agentName: "Caline",
        agentImg: calinaImg,
        headerLogo: emailImg
    }
    return (
        <CustomChat listedProps={listedData} />
    )
}

export default EmailCustomerSupport
