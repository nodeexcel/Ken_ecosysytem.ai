import CustomChat from "./CustomChat"
import constanceImg from "../assets/svg/constance_msg_logo.svg"
import youtubeImg from "../assets/svg/youtube_content.svg";

function YoutubeScriptContent() {
    const listedData = {
        header: "YouTube Script Writer", label: "YouTube Script Writer", description: "Generate a YouTube video script.",
        form: { label_1: "Topic", placeholder_1: "Ex. AI Revolution in Digital Ma..", label_2: "Custom Instructions (Optional)", placeholder_2: "Anything you want to tell the AI" },
        initialMessage: "Unable to generate a balance sheet: The uploaded document is not a bank statement; it is an eBook or informational guide related to health and wellness. No financial data available for extraction. Please upload an actual bank statement for accurate balance sheet creation",
        agentName: "Constance",
        agentImg: constanceImg,
        headerLogo: youtubeImg
    }
    return (
        <CustomChat listedProps={listedData} />
    )
}

export default YoutubeScriptContent
