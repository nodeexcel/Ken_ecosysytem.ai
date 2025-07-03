import { X } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { SketchPicker } from "react-color"

function CustomizeAgent({ customIntegartion, setCustomStatus }) {
    const [activeTab, setActiveTab] = useState("customize")
    const [formData, setFormData] = useState({ display_name: "", color: "#F1F1F1", introduction_to_chat: "", domains_name: "" })
    const [errors, setErrors] = useState({})
    const [colorPickerStatus, setColorPickerStatus] = useState(false)
    const colorPickerRef = useRef()

    const tabs = [{ label: "Customize", key: "customize" }, { label: "Share", key: "share" }]

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }))
        setErrors((prev) => ({ ...prev, [name]: '' }))
    }

    const handleChangeColor = (e) => {
        setFormData((prev) => ({ ...prev, color: e.hex }))
        setErrors((prev) => ({ ...prev, color: '' }))
        console.log(e, "color")
        setColorPickerStatus(false)
    }

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (colorPickerRef.current && !colorPickerRef.current.contains(event.target)) {
                setColorPickerStatus(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);


    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl w-full max-w-[80%] h-full max-h-[80%] overflow-auto p-6 relative shadow-lg">
                <button
                    className="absolute cursor-pointer top-4 right-4 text-gray-500 hover:text-gray-700"
                    onClick={() => {
                        setCustomStatus(false)
                    }}
                >
                    <X size={20} />
                </button>

                <div className='flex flex-col gap-6 py-4'>
                    <div className="flex items-center gap-3">
                        <div className="rounded-[12px] p-[10px] bg-[#EBEFFF]">
                            {customIntegartion.icon}
                        </div>
                        <h1 className="text-[#1E1E1E] text-[20px] font-[600]">Website</h1>
                        <div className="bg-[#F2F2F7] p-[4px] flex rounded-[13px]">
                            {tabs.map((each) => (
                                <p key={each.key} onClick={() => setActiveTab(each.key)} className={`py-[7px] cursor-pointer text-[16px] font-[500] px-[20px] ${activeTab === each.key ? 'bg-[#fff] rounded-[10px] text-[#1E1E1E]' : 'text-[#5A687C]'}`}>{each.label}</p>
                            ))}
                        </div>
                    </div>
                    <div className="w-full flex gap-5">
                        <div className="w-[70%]">
                            <h1 className="text-[#1E1E1E] font-[600] text-[16px] pb-4">Personalize your Chatbot</h1>
                            <div className="flex flex-col gap-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                                    <div className="flex flex-col gap-1.5 w-full">
                                        <label className="text-sm font-medium text-[#1e1e1e]">
                                            Display Name
                                        </label>
                                        <input
                                            type="text"
                                            name='display_name'
                                            value={formData?.display_name}
                                            onChange={handleChange}
                                            className={`w-full bg-white p-2 rounded-lg border ${errors.display_name ? 'border-red-500' : 'border-[#e1e4ea]'} focus:outline-none focus:border-[#675FFF]`}
                                            placeholder="Finn"
                                        />
                                        {errors.display_name && <p className="text-red-500 text-sm mt-1">{errors.display_name}</p>}
                                    </div>
                                    <div ref={colorPickerRef} className="flex flex-col gap-1.5 w-full">
                                        <label className="text-sm font-medium text-[#1e1e1e]">
                                            Color
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                name='color'
                                                value={formData?.color.slice(1)}
                                                onFocus={() => setColorPickerStatus(true)}
                                                className={`w-full bg-white py-2 px-14 cursor-pointer rounded-lg border ${errors.color ? 'border-red-500' : 'border-[#e1e4ea]'} focus:outline-none focus:border-[#675FFF]`}
                                                placeholder="ffffff"
                                            />
                                            <div className={`w-[22px] h-[22px] top-2 absolute left-2 rounded-[4px] ${formData?.color && `bg-[red]`}`}></div>
                                            {/* <hr style={{color:"red",}} className="top-2 absolute left-13"/> */}
                                            {colorPickerStatus && <div className="absolute z-[9999]"><SketchPicker onChange={handleChangeColor} /></div>}
                                        </div>
                                        {errors.color && <p className="text-red-500 text-sm mt-1">{errors.color}</p>}
                                    </div>

                                </div>
                                <div className="flex flex-col gap-1.5 w-full">
                                    <label className="text-sm font-medium text-[#1e1e1e]">
                                        Introduction to Chat
                                    </label>
                                    <textarea
                                        name='introduction_to_chat'
                                        onChange={handleChange}
                                        value={formData?.introduction_to_chat}
                                        rows={4}
                                        className={`w-full bg-white p-2 rounded-lg border  ${errors.introduction_to_chat ? 'border-red-500' : 'border-[#e1e4ea]'} resize-none focus:outline-none focus:border-[#675FFF]`}
                                        placeholder="Hello"
                                    />
                                    {errors.introduction_to_chat && <p className="text-red-500 text-sm mt-1">{errors.introduction_to_chat}</p>}
                                </div>
                                <div className="flex flex-col gap-1.5 w-full">
                                    <label className="text-sm font-medium text-[#1e1e1e]">
                                        Domains name
                                    </label>
                                    <input
                                        type="text"
                                        name='domain_name'
                                        value={formData?.domain_name}
                                        onChange={handleChange}
                                        className={`w-full bg-white p-2 rounded-lg border ${errors.domain_name ? 'border-red-500' : 'border-[#e1e4ea]'} focus:outline-none focus:border-[#675FFF]`}
                                        placeholder="Enter domain name"
                                    />
                                    {errors.domain_name && <p className="text-red-500 text-sm mt-1">{errors.domain_name}</p>}
                                </div>
                            </div>
                        </div>
                        <div className="w-[30%]">
                            <h1 className="text-[#1E1E1E] font-[600] text-[16px]">Preview</h1>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CustomizeAgent
