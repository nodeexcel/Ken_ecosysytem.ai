import { useNavigate } from 'react-router-dom'
import logo from '/ecosystem_logo.svg'

const staticData = {
    header: "Agent personality",
    list: [
        { header: "Friendly", description: "Warm, approachable, and conversational. Builds trust with ease." },
        { header: "Professional", description: "Clear, polite, and to-the-point. Business-like without being cold." },
        { header: "Energetic", description: "Enthusiastic, motivating, and full of positive drive. Sparks engagement." },
        { header: "Relaxed", description: "Casual, laid-back, and easygoing. Makes the lead feel at ease." },
        { header: "Results-Oriented", description: "Focused on outcomes, speaks with clarity and confidence. Keeps the discussion moving forward." },
        { header: "Direct", description: "Straight to the point, no fluff. Efficient and confident in guiding the prospect." },
        { header: "Empathetic", description: " Listens carefully, shows understanding, and adapts to the lead’s emotional state." }
    ]
}

function AgentPersonalityDocumentation() {
    const navigate = useNavigate()
    return (
        <div className="h-full w-full bg-[#F6F7F9]">
            <div className='flex justify-between p-4 items-center bg-[#E7E6F9]'>
                <div className="flex justify-center items-center gap-3">
                    <div>
                        <img src={logo} alt="logo" className="w-[47.15px] h-[52px]" />
                    </div>
                    <h1 className="text-[28px] font-semibold onest text-[#1E1E1E]">Ecosysteme.ai</h1>
                </div>
                <div>
                    <button onClick={() => navigate("/")} className='bg-[#675FFF] cursor-pointer border border-[#5F58E8] px-3 py-2 rounded-lg text-[#fff] text-[16px] font-[500]'>
                        Log in
                    </button>
                </div>
            </div>
            <div className="flex flex-col gap-4 mb-3 mx-auto max-w-[1068px] px-2">
                <h2 className="text-[44px] font-[600] text-[#1E1E1E] flex justify-center mt-6">{staticData.header}</h2>
                {staticData.list.map(each => (
                    <div key={each.header} className="flex flex-col gap-2 mb-3">
                        <h2 className="text-[20px] font-[600] text-[#1E1E1E]">{each.header}</h2>
                        <p className="text-[#5A687C] font-[400] text-[16px]">{each.description}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default AgentPersonalityDocumentation
