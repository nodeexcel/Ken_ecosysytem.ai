import CustomChat from "./CustomChat"
import finnImg from "../assets/svg/finn_msg_logo.svg"
import balanceSheetImg from "../assets/svg/balance_sheet_accounting.svg";

function BalanceSheetAccounting() {
    const listedData = {
        header: "Balance Sheet Generator", label: "Balance Sheet Generator", description: "Generate a balance sheet based on your bank statement.",
        form: { label_1: "Bank Statement File", placeholder_1: "Bank Statement File", label_2: "Custom Instructions (Optional)", placeholder_2: "Anything you want to tell the AI" },
        initialMessage: "Unable to generate a balance sheet: The uploaded document is not a bank statement; it is an eBook or informational guide related to health and wellness. No financial data available for extraction. Please upload an actual bank statement for accurate balance sheet creation",
        agentName: "Finn",
        agentImg: finnImg,
        headerLogo: balanceSheetImg
    }
    return (
        <CustomChat listedProps={listedData} />
    )
}

export default BalanceSheetAccounting
