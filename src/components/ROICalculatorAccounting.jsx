import CustomChat from "./CustomChat"
import finnImg from "../assets/svg/finn_msg_logo.svg"
import roiCalculatorImg from "../assets/svg/roi_calculator_accounting.svg";
import { useTranslation } from "react-i18next";

function ROICalculatorAccounting() {
    const { t } = useTranslation()
    const listedData = {
        header: t("skills.finn_content4_header"), label: t("skills.finn_content4_header"), description: t("finn_accounting.roi_calculator_descr"),
        form: { filesStatus:true,label_1:t("finn_accounting.financial_data"), placeholder_1:t("finn_accounting.financial_data"), label_2: t("rima.custom_instructions"), placeholder_2: t("rima.custom_instructions_placeholder") },
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
