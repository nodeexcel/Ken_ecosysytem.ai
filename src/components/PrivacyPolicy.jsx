
import { useNavigate } from 'react-router-dom'
import logo from '/ecosystem_logo.svg'

const staticData = {
    header: "Privacy Policy",
    description: "BDR (“we”, “our”, or “us”) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your personal information when you use our website and services.",
    point1: {
        header: "1. Information We Collect",
        points: [{ label: "Personal Information: ", value: "Name, email, company name, phone number, billing info." },
        { label: "Usage Data: ", value: "Pages visited, time spent, browser type, IP address." },
        { label: "AI Interactions: ", value: "Data provided to and generated by AI agents." },
        { label: "Third-Party Data: ", value: "Integrations with third-party tools (e.g., CRM, email platforms)." }]
    },
    point2: {
        header: "2. How We Use Your Information",
        points: ["To deliver and improve our services.", "To personalize your experience.", "For customer support and communication.", "For billing and account management.", "To analyze usage and improve product functionality."],
    },
    point3: {
        header: "3. Data Sharing & Disclosure",
        description: "We do not sell your data. We may share your information:",
        points: ["With service providers under strict confidentiality.", "To comply with legal obligations.", "In case of a merger or acquisition."],
    },
    point4: {
        header: "4. Data Retention",
        description: "We retain data as long as your account is active or as needed for legal or business purposes."
    },
    point5: {
        header: "5. Security",
        description: "We implement industry-standard security measures including encryption, access controls, and regular audits."
    },
    point6: {
        header: "6. Your Rights",
        description: "You can request to access, correct, or delete your personal data by contacting us"
    },
    point7: {
        header: "7. Changes to This Policy",
        description: "We may update this Privacy Policy. We’ll notify you of significant changes via email or platform alerts."
    }
}

function PrivacyPolicy() {
    const navigate = useNavigate()
    return (
        <div className="h-full overflow-auto w-full bg-[#F6F7F9]">
            <div className='flex justify-between p-4 items-center bg-[#E7E6F9]'>
                <div className="flex justify-center items-center gap-3">
                    <div>
                        <img src={logo} alt="logo" className="w-[47.15px] h-[52px]" />
                    </div>
                    <h1 className="text-[28px] font-semibold onest text-[#1E1E1E]">Ecosysteme.ai</h1>
                </div>
                <div>
                    <button onClick={()=>navigate("/")} className='bg-[#675FFF] cursor-pointer border border-[#5F58E8] px-3 py-2 rounded-lg text-[#fff] text-[16px] font-[500]'>
                        Log in
                    </button>
                </div>
            </div>
            <div className="flex flex-col gap-5 mb-3 mx-auto max-w-[1068px] px-2">
                <h2 className="text-[44px] font-[600] text-[#1E1E1E] flex justify-center mt-6">{staticData.header}</h2>
                <p className="text-[#5A687C] font-[400] text-[16px]">{staticData.description}</p>
                <div className="flex flex-col gap-2">
                    <h2 className="text-[20px] font-[600] text-[#1E1E1E] mb-2">{staticData.point1.header}</h2>
                    {staticData.point1.points.map(each => (
                        <p key={each.label} className="mb-1 text-[#1E1E1E] font-[700] text-[16px]">{each.label}<span className="text-[#5A687C] font-[400]">{each.value}</span></p>
                    ))}
                </div>
                <div className="flex flex-col gap-2">
                    <h2 className="text-[20px] font-[600] text-[#1E1E1E] mb-2">{staticData.point2.header}</h2>
                    {staticData.point2.points.map(each => (
                        <ul key={each} style={{ listStyleType: "disc" }} className="pl-6">
                            <li className="mb-1 text-[16px] text-[#5A687C] font-[400]">{each}</li>
                        </ul>
                    ))}
                </div>
                <div className="flex flex-col gap-2">
                    <h2 className="text-[20px] font-[600] text-[#1E1E1E]">{staticData.point3.header}</h2>
                    <p className="text-[#5A687C] font-[400] text-[16px] my-2">{staticData.point3.description}</p>
                    {staticData.point3.points.map(each => (
                        <ul key={each} style={{ listStyleType: "disc" }} className="pl-6">
                            <li className="mb-1 text-[16px] text-[#5A687C] font-[400]">{each}</li>
                        </ul>
                    ))}
                </div>
                <div className="flex flex-col gap-2">
                    <h2 className="text-[20px] font-[600] text-[#1E1E1E]">{staticData.point4.header}</h2>
                    <p className="text-[#5A687C] font-[400] text-[16px] my-2">{staticData.point4.description}</p>
                </div>
                <div className="flex flex-col gap-2">
                    <h2 className="text-[20px] font-[600] text-[#1E1E1E]">{staticData.point5.header}</h2>
                    <p className="text-[#5A687C] font-[400] text-[16px] my-2">{staticData.point5.description}</p>
                </div>
                <div className="flex flex-col gap-2">
                    <h2 className="text-[20px] font-[600] text-[#1E1E1E]">{staticData.point6.header}</h2>
                    <p className="text-[#5A687C] font-[400] text-[16px] my-2">{staticData.point6.description}</p>
                </div>
                <div className="flex flex-col gap-2 mb-5">
                    <h2 className="text-[20px] font-[600] text-[#1E1E1E]">{staticData.point7.header}</h2>
                    <p className="text-[#5A687C] font-[400] text-[16px] my-2">{staticData.point7.description}</p>
                </div>
            </div>
        </div>
    )
}

export default PrivacyPolicy
