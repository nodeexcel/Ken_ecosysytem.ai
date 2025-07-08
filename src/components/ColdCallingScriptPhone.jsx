import CustomChat from "./CustomChat"
import finnImg from "../assets/svg/finn_msg_logo.svg"
import coldCallingImg from "../assets/svg/cold_calling_phone.svg";

function ColdCallingScriptPhone() {
    const options = [{ label: "Professional 🤵", key: "professional" }, { label: "Casual 😎", key: "casual" }, { label: "Friendly 😊", key: "friendly" },
    { label: "Formal 🎩", key: "formal" }, { label: "Inspirational 🌟", key: "inspirational" }, { label: "Humorous 😅", key: "humorous" }
    ]

    const listedData = {
        header: "Cold Calling", label: "Cold Calling Script", description: "Create engaging LinkedIn posts.",
        form: { label_1: "Addressee", placeholder_1: "Ex. Manager of a furniture store", label_2: "Custom Instructions (Optional)", placeholder_2: "Anything you want to tell the AI", label_3: "Tone", placeholder_3: "Select tone", options: options, label_4:"Intention", placeholder_4:"Ex. I want to start selling my p.." },
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
