import CustomChat from "./CustomChat"
import calinaImg from "../assets/svg/calina_msg_logo.svg"
import faqImg from "../assets/svg/faq_customer_support.svg";

function FaqCustomerSupport() {
    const listedData = {
        header: "FAQ Generator", label: "FAQ Generator", description: "Create a comprehensive FAQ section for your brand or product.",
        form: { label_1: "Additional Questions", placeholder_1: "Ex.: Warranty information, ass...", label_2: "Custom Instructions (Optional)", placeholder_2: "Anything you want to tell the AI" },
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
