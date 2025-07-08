import CustomChat from "./CustomChat"
import finnImg from "../assets/svg/finn_msg_logo.svg"
import profitLossImg from "../assets/svg/profit_loss_calculator_accounting.svg";

function ProfitLossCalculatorAccounting() {
    const listedData = {
        header: "Profit Loss Calculator", label: "Profit Loss Calculator", description: "Calculate profit and loss and get provided with insights.",
        form: { label_1: "Financial Data File", placeholder_1: "Financial Data File", label_2: "Custom Instructions (Optional)", placeholder_2: "Anything you want to tell the AI" },
        initialMessage: "Unable to generate a balance sheet: The uploaded document is not a bank statement; it is an eBook or informational guide related to health and wellness. No financial data available for extraction. Please upload an actual bank statement for accurate balance sheet creation",
        agentName: "Finn",
        agentImg: finnImg,
        headerLogo: profitLossImg
    }
    return (
        <CustomChat listedProps={listedData} />
    )
}

export default ProfitLossCalculatorAccounting
