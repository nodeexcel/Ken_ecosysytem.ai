import CustomChat from "./CustomChat"
import taraImg from "../assets/svg/tara_msg_logo.svg"
import meetingImg from "../assets/svg/meeting_notes_coo.svg";
import { useTranslation } from "react-i18next";

function MeetingNotesCoo() {
    const { t } = useTranslation()
    const listedData = {
        header: t("tara.meeting_notes"), label: t("tara.meeting_notes"), description: t("tara.generate_descrip"),
        form: { filesStatus:true,label_1: t("tara.meeting_transcript"), placeholder_1: t("choose_a_file"), label_2: t("rima.custom_instructions"), placeholder_2: t("rima.custom_instructions_placeholder") },
        initialMessage: "Unable to generate a balance sheet: The uploaded document is not a bank statement; it is an eBook or informational guide related to health and wellness. No financial data available for extraction. Please upload an actual bank statement for accurate balance sheet creation",
        agentName: "Tara",
        agentImg: taraImg,
        headerLogo: meetingImg
    }
    return (
        <CustomChat listedProps={listedData} />
    )
}

export default MeetingNotesCoo
