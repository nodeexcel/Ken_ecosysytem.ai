import { useState } from "react";
import { RightArrowIcon } from "../icons/icons";
import { SelectDropdown } from "./Dropdown";

function CustomerSupportChatBotForm() {
    const [formData, setFormData] = useState({ bot_name: "", role: "", personality: "", prompt: "" })
    const [errors, setErrors] = useState({})
    const [step, setStep] = useState(1)
    const [statusSteps, setStatusSteps] = useState({ step1: false, step2: false, step3: false, step4: false })


    const PersonalityOptions = [
        { label: "Friendly", key: "friendly" },
        { label: "Professional", key: "professional" },
        { label: "Energetic", key: "energetic" },
        { label: "Relaxed", key: "relaxed" },
        { label: "Results-Oriented", key: "results_oriented" },
        { label: "Direct", key: "direct" },
        { label: "Emphatic", key: "emphatic" },
    ]

    const RoleOptions = [
        { label: "Friendly", key: "friendly" },
        { label: "Professional", key: "professional" },
        { label: "Energetic", key: "energetic" },
        { label: "Relaxed", key: "relaxed" },
        { label: "Results-Oriented", key: "results_oriented" },
        { label: "Direct", key: "direct" },
        { label: "Emphatic", key: "emphatic" },
    ]

    const handleChange = (e) => {

    }

    const handleContinue = (nextStep) => {
        // setStatusSteps((prev) => ({ ...prev, [`step${step}`]: true }))
    }

    const handleCancel = (value) => {
        setStatusSteps({ step1: false, step2: false, step3: false, step4: false })
    }

    const handleSelectSteps = (selectStep) => {
        if (statusSteps[`step${selectStep}`]) {
            setStep(selectStep)
        } else if (!statusSteps.step1) {
            setStep(1)
        }
        else if (!statusSteps.step2) {
            setStep(2)
        }
        else if (!statusSteps.step3) {
            setStep(3)
        }
        else {
            setStep(selectStep)
        }
    }

    return (
        <div className="py-4 pr-2 h-screen overflow-auto flex flex-col gap-4 w-full">
            <h1 className="text-[#1E1E1E] font-[600] text-[24px]">Create New Chatbot</h1>
            <div className="h-full flex flex-col gap-4 w-full">
                <div className="bg-white rounded-[14px] border border-[#E1E4EA] p-[17px] flex flex-col gap-3">
                    <div className="flex justify-between items-center" onClick={() => {
                        handleSelectSteps(1)
                    }}>
                        <div className='flex items-center gap-2'>
                            <p className={`${step === 1 ? 'bg-[#675FFF]' : statusSteps.step1 ? 'bg-[#34C759]' : 'bg-[#000000]'} h-[30px] w-[30px] flex justify-center items-center rounded-[10px] text-white`}>{statusSteps.step1 ? <CheckIcon /> : '1'}</p>
                            <p className={`text-[14px] font-[600] ${step === 1 ? 'text-[#675FFF]' : 'text-[#000000]'}`}>Bot Details</p>
                        </div>
                        {step !== 1 && <RightArrowIcon />}
                    </div>
                    {step === 1 && <div className="flex flex-col gap-5">
                        <hr style={{ color: "#E1E4EA" }} />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                            <div className="flex flex-col gap-1.5 w-full">
                                <label className="text-sm font-medium text-[#1e1e1e]">
                                    Bot Name<span className="text-[#675fff]">*</span>
                                </label>
                                <input
                                    type="text"
                                    name='bot_name'
                                    value={formData?.bot_name}
                                    onChange={handleChange}
                                    className={`w-full bg-white p-2 rounded-lg border ${errors.agent_name ? 'border-red-500' : 'border-[#e1e4ea]'} focus:outline-none focus:border-[#675FFF]`}
                                    placeholder="Ex. Ecosystem"
                                />
                                {errors.agent_name && <p className="text-red-500 text-sm mt-1">{errors.agent_name}</p>}
                            </div>

                        </div>

                        <hr style={{ color: "#E1E4EA" }} />

                        <div className="flex items-center gap-2">
                            <button onClick={() => {
                                handleContinue(2)
                            }} className="px-5 rounded-[7px] w-[200px] py-[7px] text-center bg-[#675FFF] border-[1.5px] border-[#5F58E8] text-white">Continue</button>
                            <button onClick={() => handleCancel(1)} className="px-5 rounded-[7px] w-[200px] py-[7px] text-center border-[1.5px] border-[#E1E4EA] text-[#5A687C]">Cancel</button>
                        </div>

                    </div>}
                </div>
            </div>
        </div>
    )
}

export default CustomerSupportChatBotForm
