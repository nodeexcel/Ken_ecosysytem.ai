import CustomChat from "./CustomChat"
import calinaImg from "../assets/svg/calina_msg_logo.svg"
import emailImg from "../assets/svg/email_customer_support.svg";

function EmailCustomerSupport() {
    const listedData = {
        header: "Customer Email Responder", label: "Customer Email Responder", description: "Respond to customer emails in an efficient and personalized manner.",
        form: { label_1: "Email Content", placeholder_1: "Ex.: 'l received a damaged ite..", label_2: "Custom Instructions (Optional)", placeholder_2: "Anything you want to tell the AI" },
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
