import CustomChat from "./CustomChat"
import calinaImg from "../assets/svg/calina_msg_logo.svg"
import faqImg from "../assets/svg/faq_customer_support.svg";
import { useTranslation } from "react-i18next";

function FaqCustomerSupport() {
    const { t } = useTranslation();
    const listedData = {
        header: t("skills.calina_content2_header"), label: t("skills.calina_content2_header"), description: t("calina.faq_generator_descr"),
        form: { label_1: t("calina.additional_questions"), placeholder_1: t("calina.additional_questions_placeholder"), label_2: t("rima.custom_instructions"), placeholder_2: t("rima.custom_instructions_placeholder") },
        initialMessage: "Unable to generate a balance sheet: The uploaded document is not a bank statement; it is an eBook or informational guide related to health and wellness. No financial data available for extraction. Please upload an actual bank statement for accurate balance sheet creation",
        agentName: "Caline",
        agentImg: calinaImg,
        headerLogo: faqImg
    }
    return (
        <CustomChat listedProps={listedData} />
    )
}

export default FaqCustomerSupport
