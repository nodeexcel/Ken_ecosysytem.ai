import CustomChat from "./CustomChat"
import taraImg from "../assets/svg/tara_msg_logo.svg"
import meetingImg from "../assets/svg/meeting_notes_coo.svg";

function MeetingNotesCoo() {
    const listedData = {
        header: "Meeting Notes Generator", label: "Meeting Notes Generator", description: "Generate concise notes based on meeting transcripts.",
        form: { label_1: "Meeting Transcript", placeholder_1: "Choisir un fichier", label_2: "Custom Instructions (Optional)", placeholder_2: "Anything you want to tell the AI" },
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
