import CustomChat from "./CustomChat"
import rimaImg from "../assets/svg/rima_msg_logo.svg"
import jobImg from "../assets/svg/job_description_hr.svg";

function JobDescriptionHr() {
    const listedData = {
        header: "Job Description Writer", label: "Job Description Writer", description: "Create a precise job description for a candidate.",
        form: { label_1: "Job Role", placeholder_1: "Ex.: Marketing Manager, Soft..", label_2: "Custom Instructions (Optional)", placeholder_2: "Anything you want to tell the AI" },
        initialMessage: "Unable to generate a balance sheet: The uploaded document is not a bank statement; it is an eBook or informational guide related to health and wellness. No financial data available for extraction. Please upload an actual bank statement for accurate balance sheet creation",
        agentName: "Rima",
        agentImg: rimaImg,
        headerLogo: jobImg
    }
    return (
        <CustomChat listedProps={listedData} />
    )
}

export default JobDescriptionHr
