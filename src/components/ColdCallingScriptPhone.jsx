import CustomChat from "./CustomChat"
import finnImg from "../assets/svg/finn_msg_logo.svg"
import coldCallingImg from "../assets/svg/cold_calling_phone.svg";
import { useTranslation } from "react-i18next";

function ColdCallingScriptPhone() {
    const { t } = useTranslation()
    const options = [
        { label: `${t("chat_options.professional") + `🤵`}`, key: "professional" },
        { label: `${t("chat_options.casual") + `😎`}`, key: "casual" },
        { label: `${t("chat_options.friendly") + `😊`}`, key: "friendly" },
        { label: `${t("chat_options.formal") + `🎩`}`, key: "formal" },
        { label: `${t("chat_options.inspirational") + `🌟`}`, key: "inspirational" },
        { label: `${t("chat_options.humorous") + `😅`}`, key: "humorous" }
    ];

    const listedData = {
        header: t("phone.cold_calling"), label: t("skills.tom_content2_header"), description: t("phone.chat_descrip"),
        form: { label_1: t("phone.address"), placeholder_1: t("phone.address_placeholder"), label_2: t("rima.custom_instructions"), placeholder_2: t("rima.custom_instructions_placeholder"), label_3: t("tone"), placeholder_3: t("tone_placeholder"), options: options, label_4: t("phone.intention"), placeholder_4: t("phone.intention_placeholder") },
        initialMessage: "Unable to generate a balance sheet: The uploaded document is not a bank statement; it is an eBook or informational guide related to health and wellness. No financial data available for extraction. Please upload an actual bank statement for accurate balance sheet creation",
        agentName: "Finn",
        agentImg: finnImg,
        headerLogo: coldCallingImg
    }
    return (
        <CustomChat listedProps={listedData} />
    )
}

export default ColdCallingScriptPhone
