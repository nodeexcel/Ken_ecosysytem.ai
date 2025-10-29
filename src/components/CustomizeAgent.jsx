import { X } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { SketchPicker } from "react-color"
import { DeleteIcon, UploadIcon } from "../icons/icons"
import { testAgentChat } from "../api/appointmentSetter"
import { v4 as uuidv4 } from 'uuid';
import { useTranslation } from "react-i18next"
import { addAvatars, getAvatars, intregateWebsiteChat, testChatBotById, updateWebsiteChatById } from "../api/customerSupport"

function CustomizeAgent({ customIntegartion, setCustomStatus, agentId, editDataId, websiteData }) {
    const [activeTab, setActiveTab] = useState("customize")
    const [isIntegrationSuccess, setIntegrationSuccess] = useState(false);
    const [formData, setFormData] = useState({
        selected_avatar_url: "",
        agent_name: "",
        colour: "#F1F1F1",
        domain: "",
        first_message: "",
        agent_id: ""
    });

    const [errors, setErrors] = useState({
        selected_avatar_url: "",
        agent_name: "",
        colour: "#F1F1F1",
        domain: "",
        first_message: "",
        agent_id: ""
    })
    const [domainError, setDomainError] = useState("");


    const validateForm = () => {
        const newErrors = {};

        if (!formData.agent_name.trim()) newErrors.agent_name = "Agent name is required";
        if (!formData.colour.trim()) newErrors.colour = "Colour name is required";
        if (!formData.domain) newErrors.domain = "Domain name is required";
        if (!formData.first_message) newErrors.first_message = "First message is required";
        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    const [colorPickerStatus, setColorPickerStatus] = useState(false)
    const colorPickerRef = useRef()
    const { t } = useTranslation()

    const [message, setMessage] = useState("")
    const [messages, setMessages] = useState([]);
    const [chatbotIntegrate, setChatbotIntegrate] = useState("chat_bubble")
    const [code, setCode] = useState("")
    const [avatarList, setAvatarList] = useState([]);

    const agentChatRef = useRef()
    const [uploadImage, SetuploadImage] = useState("")

    useEffect(() => {
        if (formData.avatar) {
            setMessages([
                { id: uuidv4(), sender: "agent", isUser: false, text: `I'm ${(formData.avatar.slice(0, 1).toUpperCase()) + formData.avatar.slice(1)}, your appointment setter. How can I assist you today?` }
            ])
        } else {
            setMessages([
                { id: uuidv4(), sender: "agent", isUser: false, text: "I'm your AI assistant. How can I assist you today?" }
            ])
        }
    }, [formData])


    useEffect(() => {
        if (agentChatRef.current) {
            agentChatRef.current.scrollTo({
                top: agentChatRef.current.scrollHeight,
                behavior: 'smooth',
            });
        }
    }, [messages]);


    const isValidDomain = (str) =>
        /^https?:\/\/[^\s$.?#].[^\s]*$/i.test(str.trim());

    const handleRemoveDomain = (index) => {
        const newDomains = formData.domain.filter((_, i) => i !== index);
        setFormData((prev) => ({ ...prev, domain: newDomains }));
    };

    const handleAddDomain = () => {
        let newDomain = formData.domainInput?.trim();
        if (!newDomain) return;

        if (!/^https?:\/\//i.test(newDomain)) {
            newDomain = "https://" + newDomain;
        }

        if (!isValidDomain(newDomain)) {
            setDomainError("Please enter a valid domain (include http:// or https://)");
            return;
        }

        if (formData.domain?.includes(newDomain)) {
            setDomainError("Domain already exists in the input.");
            return;
        }

        const newDomains = [...(formData.domain || []), newDomain];
        setFormData((prev) => ({
            ...prev,
            domain: newDomains,
            domainInput: "",
        }));

        setDomainError("");
    };


    const tabs = [{ label: t("calina.customize"), key: "customize" }, { label: t("calina.share"), key: "share" }]


    const chatbotOptions = [{
        key: "chat_bubble", label: t("calina.display_a_chat_bubble"), content: t("calina.display_a_chat_bubble_descr"), is_recommended: true
    }, {
        key: "iframe", label: t("calina.integrate_via_frame"), content: t("calina.integrate_via_frame_descr"), is_recommended: false
    }]

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }))
        setErrors((prev) => ({ ...prev, [name]: '' }))
    }

    const handleChangeColor = (e) => {
        setFormData((prev) => ({ ...prev, colour: e.hex }))
        setErrors((prev) => ({ ...prev, colour: '' }))
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

    const fetchAvatars = async () => {
        try {
            const response = await getAvatars();
            console.log("callling", response)
            if (response.status === 200 || response.status === 201) {
                const avatars = response.data?.success || [];
                // map API data to your component structure
                const formattedAvatars = avatars.map((item) => ({
                    id: item.id,
                    name: item.avatar_name,
                    url: item.avatar_url,
                }));
                setAvatarList(formattedAvatars);
            } else {
                console.error("Failed to fetch smart bots");
                setLoading(false)
            }
        } catch (error) {
            console.error("Error fetching smart bots:", error);
            setLoading(false)
        }
    }
    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const payload = new FormData();
        payload.append("avatar_name", "Agent");
        payload.append("avatar_image", file);
        for (let [key, value] of payload.entries()) {
            console.log(`${key}:`, value);
        }

        handleSubmit(payload);
        e.target.value = "";
    };

    const handleSubmit = async (payload) => {
        if (!payload) return;

        try {
            const response = await addAvatars(payload);
            console.log("Upload response:", response);

            if (response.status === 201) {
                console.log("Avatar uploaded successfully");
                fetchAvatars();
            } else {
                console.error("Failed to upload avatar:", response.statusText);
            }
        } catch (error) {
            console.error("Error uploading avatar:", error);
        }
    };

    useEffect(() => {
        fetchAvatars()
    }, []);

    useEffect(() => {
        if (websiteData) {
            setIntegrationSuccess(true);
        }
    }, [websiteData]);

    useEffect(() => {
        if (websiteData) {
            setFormData({
                selected_avatar_url: websiteData.selected_avatar_url || "",
                agent_name: websiteData.agent_name || "",
                colour: websiteData.colour || "#F1F1F1",
                domain: websiteData.domain || "",
                first_message: websiteData.first_message || "",
                agent_id: ""
            });
        }

    }, [websiteData]);


    const handleSubmitForm = async () => {
        if (!validateForm()) {
            console.log("Form validation failed", errors);
            return;
        }

        const payload = {
            ...formData,
            agent_id: agentId || editDataId || "",
            domain: Array.isArray(formData.domain)
                ? formData.domain
                : formData.domain.split(',').map(d => d.trim())
        };
        delete payload.domainInput;
        try {
            // setLoading(true)
            let response;
            if (editDataId) {
                console.log("Updating SmartBot...");
                response = await updateWebsiteChatById(editDataId, payload);
            } else {
                console.log("Creating SmartBot...");
                response = await intregateWebsiteChat(payload);
            }
            console.log(response)
            if (response.status === 201 || response.status === 200) {
                console.log("link bot intregrate successfully==========")
                // setCustomStatus(false)
                setIntegrationSuccess(true);
                // Switch to Share tab after successful creation/update
                setActiveTab("share");
            } else {
                console.log("link-bot intregration failed ")
            }
        } catch (error) {
            console.log(error)
        } 
    };

    useEffect(() => {
        const currentAgentId = agentId || editDataId || "AGENT_ID_PLACEHOLDER";
        const baseUrl = window.location.origin.includes("localhost")
            ? "http://localhost:3091"
            : "https://www.app.ecosysteme.ai";

        if (chatbotIntegrate === "chat_bubble") {
            const embedScript = `<script>
document.addEventListener("DOMContentLoaded", () => {
  var e = document.createElement("iframe");
  e.src = "${baseUrl}/embededChatbot?id=${currentAgentId}";
  const i = innerWidth < 768, o = i ? "90%" : "420px", t = i ? "calc(100vh - 100px)" : "600px";
  Object.assign(e.style, {
    position: "fixed",
    bottom: "0",
    right: i ? "5%" : "30px",
    border: "none",
    zIndex: "1000",
    width: o,
    height: t,
    borderRadius: "10px"
  });
  document.body.appendChild(e);
  window.addEventListener("message", n => {
    const d = n.data;
    if (d && typeof d === "object") {
      if (d.chatbotOpen === true) {
        e.style.width = o;
        e.style.height = t;
      } else if (d.chatbotOpen === false) {
        e.style.width = "50px";
        e.style.height = "70px";
      }
    }
  });
});
</script>`;
            setCode(embedScript);
        } else {
            const iframeCode = `<iframe src="${baseUrl}/embededChatbot?id=${currentAgentId}" style="position: fixed; bottom: 0px; right: 30px; border: none; z-index: 1000; width: 420px; height: 600px; border-radius: 10px;"></iframe>`;
            setCode(iframeCode);
        }
    }, [chatbotIntegrate, agentId, editDataId]);



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
                        <h1 className="text-[#1E1E1E] text-[20px] font-[600]">{customIntegartion.label}</h1>
                        <div className="bg-[#F2F2F7] p-[4px] flex rounded-[13px]">
                            {tabs.map((each) => {
                                const isDisabled = each.key === "share" && !isIntegrationSuccess;
                                return (
                                    <p
                                        key={each.key}
                                        onClick={() => !isDisabled && setActiveTab(each.key)} // prevent click
                                        className={`py-[7px] px-[20px] text-[16px] font-[500] rounded-[10px] cursor-pointer
          ${activeTab === each.key ? 'bg-[#fff] text-[#1E1E1E]' : 'text-[#5A687C]'}
          ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
                                    >
                                        {each.label}
                                    </p>
                                );
                            })}
                        </div>
                    </div>
                    {activeTab === "customize" ? <div className="w-full flex gap-5">
                        <div className="w-[60%]">
                            <h1 className="text-[#1E1E1E] font-[600] text-[16px] pb-4">{t("calina.personalize_your_chatbox")}</h1>
                            <div className="flex flex-col gap-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                                    <div className="flex flex-col gap-1.5 w-full">
                                        <label className="text-sm font-medium text-[#1e1e1e]">
                                            {t("calina.display_name")}
                                        </label>
                                        <input
                                            type="text"
                                            name='agent_name'
                                            value={formData?.agent_name}
                                            onChange={handleChange}
                                            className={`w-full bg-white p-2 rounded-lg border ${errors.agent_name ? 'border-red-500' : 'border-[#e1e4ea]'} focus:outline-none focus:border-[#675FFF]`}
                                            placeholder="Finn"
                                        />
                                        {errors.agent_name && <p className="text-red-500 text-sm mt-1">{errors.agent_name}</p>}
                                    </div>
                                    <div ref={colorPickerRef} className="flex flex-col gap-1.5 w-full">
                                        <label className="text-sm font-medium text-[#1e1e1e]">
                                            {t("calina.color")}
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                name='color'
                                                value={formData?.colour.slice(1)}
                                                onFocus={() => setColorPickerStatus(true)}
                                                className={`w-full bg-white py-2 px-14 cursor-pointer rounded-lg border ${errors.colour ? 'border-red-500' : 'border-[#e1e4ea]'} focus:outline-none focus:border-[#675FFF]`}
                                                placeholder="ffffff"
                                            />
                                            <div className={`w-[22px] h-[22px] top-2 absolute left-2 rounded-[4px]`} style={{ backgroundColor: formData?.colour }}></div>
                                            <hr style={{ color: "#E1E4EA", width: "17px", transform: "rotate(-90deg)", position: "absolute", top: 19, left: 35 }} />
                                            {colorPickerStatus && <div className="absolute z-[9999]"><SketchPicker onChange={handleChangeColor} /></div>}
                                        </div>
                                        {errors.color && <p className="text-red-500 text-sm mt-1">{errors.color}</p>}
                                    </div>
                                </div>
                                <div className="w-full">
                                    <label className="text-sm font-medium text-[#1e1e1e]">
                                        {t("calina.avatar")}
                                    </label>
                                    <div className="flex items-center gap-5">
                                        <div className="border border-[#E1E4EA] justify-around flex flex-col items-center w-[148px] h-[148px] p-[10px] rounded-[10px]">
                                            <div className="rounded-full h-[63px] w-[63px] flex justify-center items-center bg-[#F0EFFF]">
                                                {formData.selected_avatar_url ? (
                                                    (() => {
                                                        const selectedAvatar = avatarList.find(
                                                            (avatar) => avatar.url === formData.selected_avatar_url
                                                        );
                                                        return selectedAvatar ? (
                                                            <img
                                                                src={selectedAvatar.url}
                                                                alt={selectedAvatar.name}
                                                                className="object-cover h-[55px] w-[55px] rounded-full"
                                                            />
                                                        ) : (
                                                            <div className="text-[#5A687C] text-sm font-medium">No Avatar</div>
                                                        );
                                                    })()
                                                ) : (
                                                    <div className="text-[#5A687C] text-sm font-medium">No Avatar</div>
                                                )}
                                            </div>

                                            {formData.selected_avatar_url && (
                                                <div
                                                    className="cursor-pointer hover:opacity-70 transition-opacity"
                                                    onClick={() => setFormData(prev => ({ ...prev, selected_avatar_url: "" }))}
                                                >
                                                    <DeleteIcon />
                                                </div>
                                            )}
                                        </div>
                                        <div className="h-[148px] border-r border-[#E1E4EA]"></div>
                                        <div className="flex gap-2 flex-wrap">
                                            {avatarList.map((each) => (
                                                <div key={each.id} onClick={() => setFormData((prev) => ({ ...prev, selected_avatar_url: each.url }))} className={`rounded-full h-[63px] w-[63px] cursor-pointer ${formData.selected_avatar_url === each.url && 'border-2 border-[#675FFF]'} flex justify-center items-center bg-[#F0EFFF]`}>
                                                    <img src={each.url} alt={each.name} className="object-cover h-[55px] w-[55px] rounded-full" />
                                                </div>
                                            ))}
                                            <input
                                                type="file"
                                                accept="image/*"
                                                id="avatar-upload"
                                                style={{ display: "none" }}
                                                onChange={handleImageUpload}
                                            />
                                            <label htmlFor="avatar-upload">
                                                <div className="rounded-full h-[63px] w-[63px] flex justify-center items-center bg-[#F0EFFF] cursor-pointer">
                                                    <UploadIcon />
                                                </div>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-1.5 w-full">
                                    <label className="text-sm font-medium text-[#1e1e1e]">
                                        {t("calina.intro_chat")}
                                    </label>
                                    <textarea
                                        name='first_message'
                                        onChange={handleChange}
                                        value={formData?.first_message}
                                        rows={4}
                                        className={`w-full bg-white p-2 rounded-lg border  ${errors.first_message ? 'border-red-500' : 'border-[#e1e4ea]'} resize-none focus:outline-none focus:border-[#675FFF]`}
                                        placeholder="Hello"
                                    />
                                    {errors.first_message && <p className="text-red-500 text-sm mt-1">{errors.first_message}</p>}
                                </div>
                                <div className="flex flex-col gap-1.5 w-full">
                                    <label className="text-sm font-medium text-[#1e1e1e]">
                                        {t("calina.domain_name")}
                                    </label>

                                    <div
                                        className={`flex flex-wrap gap-2 items-center w-full bg-white p-2 rounded-lg border ${errors.domain || domainError ? "border-red-500" : "border-[#e1e4ea]"
                                            } focus-within:border-[#675FFF]`}
                                    >
                                        {Array.isArray(formData.domain) &&
                                            formData.domain.map((domain, index) => (
                                                <div
                                                    key={index}
                                                    className="flex items-center bg-[#F0EFFF] text-[#1E1E1E] px-3 py-1 rounded-full"
                                                >
                                                    <span>{domain}</span>
                                                    <button
                                                        type="button"
                                                        className="ml-2 text-gray-500 hover:text-red-500"
                                                        onClick={() => handleRemoveDomain(index)}
                                                    >
                                                        <X size={14} />
                                                    </button>
                                                </div>
                                            ))}

                                        <input
                                            type="text"
                                            name="domainInput"
                                            value={formData.domainInput || ""}
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                setFormData((prev) => ({ ...prev, domainInput: value }));
                                                if (domainError && value.trim() !== "") setDomainError("");
                                            }}
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter") {
                                                    e.preventDefault();
                                                    handleAddDomain();
                                                }
                                            }}
                                            placeholder={t("calina.domain_name_placeholder")}
                                            className="flex-grow border-none focus:outline-none bg-transparent"
                                        />
                                    </div>

                                    {formData.domainInput?.trim() && (
                                        <button
                                            type="button"
                                            className="text-[#675FFF] text-sm mt-1 hover:underline text-left"
                                            onClick={handleAddDomain}
                                        >
                                            + Add "{formData.domainInput}"
                                        </button>
                                    )}

                                    {(errors.domain || domainError) && (
                                        <p className="text-red-500 text-sm mt-1">
                                            {domainError || errors.domain}
                                        </p>
                                    )}
                                </div>
                                <div className="flex items-center gap-2">
                                    <button onClick={
                                        handleSubmitForm
                                    } className="px-5 rounded-[7px] cursor-pointer w-[200px] py-[7px] text-center bg-[#675FFF] border-[1.5px] border-[#5F58E8] text-white"> {websiteData ? t("brain_ai.update") : t("brain_ai.create")}</button>
                                    {/* <button onClick={() => handleCancel(3)} className="px-5 cursor-pointer rounded-[7px] w-[200px] py-[7px] text-center border-[1.5px] border-[#E1E4EA] text-[#5A687C]">{t("cancel")}</button> */}
                                </div>
                            </div>
                        </div>
                        <div className="w-[40%]">
                            <h1 className="text-[#1E1E1E] font-[600] text-[16px]">{t("calina.preview")}</h1>
                            <div className="py-6 flex gap-6 w-full">
                                <div className="h-[466px] relative border border-[#E1E4EA] rounded-lg">
                                    <div className="bg-[#F5F7FF] rounded-y-lg rounded-t-lg p-2 mb-4 flex items-center gap-3">
                                        <div className="rounded-full h-[63px] w-[63px] flex justify-center items-center bg-[#F0EFFF]">
                                            {formData.selected_avatar_url ? (
                                                (() => {
                                                    const selectedAvatar = avatarList.find(
                                                        (avatar) => avatar.id === formData.selected_avatar_url
                                                    );
                                                    return selectedAvatar ? (
                                                        <img
                                                            src={selectedAvatar.url}
                                                            alt={selectedAvatar.name}
                                                            className="object-cover h-[55px] w-[55px] rounded-full"
                                                        />
                                                    ) : (
                                                        <div className="text-[#5A687C] text-sm font-medium">?</div>
                                                    );
                                                })()
                                            ) : (
                                                <div className="text-[#5A687C] text-sm font-medium">?</div>
                                            )}
                                        </div>
                                        <div className="font-[600] text-[18px] text-[#1E1E1E]">
                                            {formData.avatar ? `${(formData.avatar.slice(0, 1).toUpperCase()) + formData.avatar.slice(1)} (AI Agent)` : "AI Agent"}
                                        </div>
                                    </div>
                                    <div className="flex flex-col justify-between h-full">
                                        <div ref={agentChatRef} className="px-4 overflow-auto max-h-[300px] mb-2">
                                            {messages.map((msg,) => (
                                                <div key={msg.id} className="flex flex-col">
                                                    {msg.isUser && (
                                                        <div className="flex items-center gap-1 mt-1 ml-auto w-fit max-w-[80%]">
                                                            <div className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-100 text-[11px] text-[#675FFF] font-[600]">U</div>
                                                            <span className="text-xs text-gray-500">User</span>
                                                        </div>
                                                    )}
                                                    {msg.id === "typing" ? <div className="pl-[40px] pt-3 flex "><span className="three-dots" /></div> : <div
                                                        className={`w-fit max-w-[80%] text-[12px] font-[400] p-3 rounded-lg ${!msg.isUser ? "mr-auto my-1 bg-[#F2F2F7] text-[#5A687C]" : "my-1 ml-auto bg-[#675FFF] text-white"
                                                            }`}
                                                    >
                                                        <p className="text-sm">{msg.text}</p>
                                                    </div>}
                                                </div>
                                            ))}
                                        </div>
                                        <div className="mt-auto p-4 flex gap-2 bg-[#F0EFFF] rounded-b-lg absolute bottom-0">
                                            <input
                                                type="text"
                                                value={message}
                                                onChange={(e) => setMessage(e.target.value)}
                                                disabled
                                                placeholder={t("type_message")}
                                                className="flex w-full border bg-white border-[#E1E4EA] focus:outline-none focus:border-[#675FFF] rounded-lg px-4 py-2 text-[#5A687C]"
                                            />
                                            <button
                                                disabled
                                                className="px-6 py-2 font-[500] text-[16px] bg-[#675FFF] border-[1.5px] border-[#5F58E8] text-white rounded-lg"
                                            >
                                                {t("send")}
                                            </button>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div> :
                        <div className="w-full flex flex-col gap-3">
                            <div className="flex items-center justify-between">
                                <h1 className="text-[#1E1E1E] font-[600] text-[16px] pb-4">{t("calina.integrate_your_chatbox")}</h1>
                                <p className="text-[#FF9500] font-[400] text-[16px]">{t("calina.actions_required_from_you")}</p>
                            </div>
                            <ul className="flex w-full gap-2">
                                {chatbotOptions.map((each) => (
                                    <li key={each.key} className={`border w-[50%] ${each.key === chatbotIntegrate ? 'border-[#675FFF]' : 'border-[#E1E4EA]'} bg-[#fff] flex cursor-pointer gap-3 p-[12px] rounded-[12px]`} onClick={() => setChatbotIntegrate(each.key)}>
                                        <div className="flex gap-3 pl-2">
                                            <div className="pt-5">
                                                <input style={{ accentColor: "#675FFF", width: "20px", height: "20px" }} className="" type="radio" checked={each.key === chatbotIntegrate} />
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                <div className="flex items-center justify-between py-1">
                                                    <h2 className="text-[#1E1E1E] text-[16px] font-[500]">{each.label}</h2>
                                                    {each.is_recommended && <p className="text-[#1E1E1E] font-[400] text-[14px] rounded-[40px] py-[8px] px-[12px] bg-[#F0EFFF]">{t("calina.recommended")}</p>}
                                                </div>
                                                <p className="text-[#5A687C] text-[14px] font-[400]">{each.content}</p>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                            <div className="flex flex-col gap-3">
                                <h1 className="text-[#1E1E1E] font-[600] text-[16px]">{t("calina.config")}</h1>
                                <div className="flex flex-col gap-1">
                                    <h2 className="text-[#1E1E1E] font-[600] text-[14px]">{t("calina.install_following_code")}</h2>
                                    <p className="text-[#5A687C] font-[400] text-[12px]">{t("calina.place_code")}</p>
                                </div>
                                <>
                                    <div className="flex items-center justify-between pb-1">
                                        <p className="text-[#1E1E1E] font-[500] text-[14px]">{t("calina.add_code_here")}</p>
                                        <button
                                            className="border-[1.5px] cursor-pointer rounded-[7px] py-[4px] px-[14px] border-[#5F58E8] text-[#675FFF] text-[16px] font-[500]"
                                            onClick={() => {
                                                navigator.clipboard.writeText(code)
                                                    .then(() => {
                                                        // optional: show feedback to user

                                                    })
                                                    .catch((err) => console.error("Failed to copy: ", err));
                                            }}
                                        >
                                            {t("calina.copy")}
                                        </button>
                                    </div>

                                    <textarea
                                        name="code"
                                        value={code}
                                        rows={10}
                                        readOnly
                                        className="w-full text-[14px] font-mono bg-gray-50 p-3 rounded-lg border border-[#e1e4ea] resize-none focus:outline-none"
                                    />
                                </>

                            </div>
                        </div>}
                </div>
            </div>
        </div >
    )
}

export default CustomizeAgent
