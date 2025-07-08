import CustomChat from "./CustomChat"
import finnImg from "../assets/svg/finn_msg_logo.svg"
import roiCalculatorImg from "../assets/svg/roi_calculator_accounting.svg";

function ROICalculatorAccounting() {
    const listedData = {
        header: "ROI Calculator", label: "ROI Calculator", description: "Calculate ROI on your projects based on uploaded financial data.",
        form: { label_1: "Financial Data File", placeholder_1: "Financial Data File", label_2: "Custom Instructions (Optional)", placeholder_2: "Anything you want to tell the AI" },
        initialMessage: "Unable to generate a balance sheet: The uploaded document is not a bank statement; it is an eBook or informational guide related to health and wellness. No financial data available for extraction. Please upload an actual bank statement for accurate balance sheet creation",
        agentName: "Finn",
        agentImg: finnImg,
        headerLogo: roiCalculatorImg
    }
    return (
        <CustomChat listedProps={listedData} />
    )
}

export default ROICalculatorAccounting
