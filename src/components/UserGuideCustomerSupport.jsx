import CustomChat from "./CustomChat"
import calinaImg from "../assets/svg/calina_msg_logo.svg"
import userGuideImg from "../assets/svg/user_guide_customer_support.svg";

function UserGuideCustomerSupport() {
    const listedData = {
        header: "User Guide Generator", label: "User Guide Generator", description: "Generate a comprehensive user guide for your product.",
        form: { label_1: "Additional Details", placeholder_1: "Ex.: Troubleshooting tips, war...", label_2: "Custom Instructions (Optional)", placeholder_2: "Anything you want to tell the AI" },
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
