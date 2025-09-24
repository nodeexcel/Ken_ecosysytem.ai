import CustomChat from "./CustomChat"
import finnImg from "../assets/svg/finn_msg_logo.svg"
import balanceSheetImg from "../assets/svg/balance_sheet_accounting.svg";
import { useTranslation } from "react-i18next";

function BalanceSheetAccounting() {
    const { t } = useTranslation()
    const listedData = {
        header: t("skills.finn_content1_header"), label: t("skills.finn_content1_header"), description:t("finn_accounting.balance_sheet_descr"),
        form: { filesStatus:true,label_1: t("finn_accounting.bank_statement"), placeholder_1: t("finn_accounting.bank_statement"), label_2: t("rima.custom_instructions"), placeholder_2: t("rima.custom_instructions_placeholder") },
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
