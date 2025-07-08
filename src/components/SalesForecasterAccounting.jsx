import CustomChat from "./CustomChat"
import finnImg from "../assets/svg/finn_msg_logo.svg"
import salesForecasterImg from "../assets/svg/sales_forecaster_accounting.svg";

function SalesForecasterAccounting() {
    const listedData = {
        header: "Sales Forecaster", label: "Sales Forecaster", description: "Forecast and predict sales based on current trends.",
        form: { label_1: "Sales Data File", placeholder_1: "Sales Data File", label_2: "Custom Instructions (Optional)", placeholder_2: "Anything you want to tell the AI" },
        initialMessage: "Unable to generate a balance sheet: The uploaded document is not a bank statement; it is an eBook or informational guide related to health and wellness. No financial data available for extraction. Please upload an actual bank statement for accurate balance sheet creation",
        agentName: "Finn",
        agentImg: finnImg,
        headerLogo: salesForecasterImg
    }
    return (
        <CustomChat listedProps={listedData} />
    )
}

export default SalesForecasterAccounting
