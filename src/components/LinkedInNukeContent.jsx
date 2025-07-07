import CustomChat from "./CustomChat"
import constanceImg from "../assets/svg/constance_msg_logo.svg"
import linkedinImg from "../assets/svg/linkedin_hr.svg";

function LinkedInNukeContent() {
    const options = [{ label: "Professional 🤵", key: "professional" }, { label: "Casual 😎", key: "casual" }, { label: "Friendly 😊", key: "friendly" },
    { label: "Formal 🎩", key: "formal" }, { label: "Inspirational 🌟", key: "inspirational" }, { label: "Humorous 😅", key: "humorous" }
    ]

    const listedData = {
        header: "LinkedIn Nuke", label: "LinkedIn Nuke", description: "Create engaging LinkedIn posts.",
        form: { label_1: "Topic", placeholder_1: "Ex. AI Revolution in Digital Ma..", label_2: "Custom Instructions (Optional)", placeholder_2: "Anything you want to tell the AI", label_3: "Tone", placeholder_3: "Select tone", options: options },
        initialMessage: "Unable to generate a balance sheet: The uploaded document is not a bank statement; it is an eBook or informational guide related to health and wellness. No financial data available for extraction. Please upload an actual bank statement for accurate balance sheet creation",
        agentName: "Constance",
        agentImg: constanceImg,
        headerLogo: linkedinImg
    }
    return (
        <CustomChat listedProps={listedData} />
    )
}

export default LinkedInNukeContent
