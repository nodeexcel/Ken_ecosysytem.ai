import CustomChat from "./CustomChat"
import rimaImg from "../assets/svg/rima_msg_logo.svg"
import linkedInImg from "../assets/svg/linkedin_hr.svg";

function LinkedInOutreachHr() {
    const listedData = {
        header: "LinkedIn Outreacher", label: "LinkedIn Outreacher", description: "Generate a personalized outreach email for LinkedIn connections.",
        form: { label_1: "Target Audience", placeholder_1: "Ex.: Industry professionals, po..", label_2: "Custom Instructions (Optional)", placeholder_2: "Anything you want to tell the AI" },
        initialMessage: "Unable to generate a balance sheet: The uploaded document is not a bank statement; it is an eBook or informational guide related to health and wellness. No financial data available for extraction. Please upload an actual bank statement for accurate balance sheet creation",
        agentName: "Rima",
        agentImg: rimaImg,
        headerLogo: linkedInImg
    }
    return (
        <CustomChat listedProps={listedData} />
    )
}

export default LinkedInOutreachHr
