import CustomChat from "./CustomChat"
import rimaImg from "../assets/svg/rima_msg_logo.svg"
import resumeImg from "../assets/svg/resume_screener_hr.svg";

function ResumeScreenerHr() {
    const listedData = {
        header: "Resume Screener", label: "Resume Screener", description: "Develop a tool to screen resumes effectively.",
        form: { label_1: "Resume Content", placeholder_1: "Enter", label_2: "Custom Instructions (Optional)", placeholder_2: "Anything you want to tell the AI" },
        initialMessage: "Unable to generate a balance sheet: The uploaded document is not a bank statement; it is an eBook or informational guide related to health and wellness. No financial data available for extraction. Please upload an actual bank statement for accurate balance sheet creation",
        agentName: "Rima",
        agentImg: rimaImg,
        headerLogo: resumeImg
    }
    return (
        <CustomChat listedProps={listedData} />
    )
}

export default ResumeScreenerHr
