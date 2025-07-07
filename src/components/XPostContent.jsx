import CustomChat from "./CustomChat"
import constanceImg from "../assets/svg/constance_msg_logo.svg"
import xImg from "../assets/svg/x_content.svg";

function XPostContent() {
    const listedData = {
        header: "X Post Generator", label: "X Post Generator", description: "Write creative posts for X.",
        form: { label_1: "Topic", placeholder_1: "Ex. AI Revolution in Digital Ma..", label_2: "Custom Instructions (Optional)", placeholder_2: "Anything you want to tell the AI", label_3: "Purpose", placeholder_3: "Ex. Make a funny post" },
        initialMessage: "Unable to generate a balance sheet: The uploaded document is not a bank statement; it is an eBook or informational guide related to health and wellness. No financial data available for extraction. Please upload an actual bank statement for accurate balance sheet creation",
        agentName: "Constance",
        agentImg: constanceImg,
        headerLogo: xImg
    }
    return (
        <CustomChat listedProps={listedData} />
    )
}

export default XPostContent
