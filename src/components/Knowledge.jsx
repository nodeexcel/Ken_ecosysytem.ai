import { useEffect, useRef, useState } from "react";
import nodata from '../assets/svg/brainai_nodata.svg'
import emptySnippets from '../assets/svg/EmptySnippets.svg'
import letter from '../assets/svg/letter_t.svg'
import snippetsTop from "../assets/svg/Snippets1.svg"
import snippetsBottom from "../assets/svg/Snippets2.svg"
import fileTop from "../assets/svg/File1.svg"
import fileBottom from "../assets/svg/File2.svg"
import brainEmptyWebsite from "../assets/svg/BrainEmptyWebsite.svg"
import { Upload, X, Globe2, Folder, FileStack, Globe, File } from "lucide-react";
import EmptyChat from "../assets/svg/EmptyChat.svg"
import { Delete, Edit, Ellipsis, UploadIcon } from "../icons/icons";
import { deleteKnowledgeSnippets, getKnowledgeSnippets, knowledgeBase } from "../api/brainai";
import { useTranslation } from "react-i18next";






const staticData = [
  { header: "My company", description: "Lev" },
  { header: "Tool integrations", description: "No integrations connected for scheduling and tasks yet." },
  { header: "Skill improvement area", description: "Looking to improve in an unspecified area to help Lev grow." }
]

const NoData = ({ icon, title, description, onAction }) => (
  <div className="mt-3">
    <div className="w-full gap-3 min-h-[320px] flex flex-col justify-center items-center text-center">
      <div
        onClick={onAction}
        className={`cursor-pointer ${onAction ? "" : "pointer-events-none"} flex items-center justify-center bg-[#F1F1F1] rounded-full w-30 h-30`}
      >
        {icon}
      </div>
      <h1 className="text-[18px] font-semibold font-inter text-[#1E1E1E]">{title}</h1>
      <p className="text-[14px] text-[#868C98] font-inter max-w-[440px] leading-6">
        {description}
      </p>
    </div>
  </div>
)

const Knowledge = () => {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("website")
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [snippetDetails, setSnippetDetail] = useState("")
  const [websiteUrl, setWebsiteUrl] = useState("")
  const [formData, setFormData] = useState({ snippet: '', files: [], website: '' })
  const [loading, setLoading] = useState(false)
  const [knowledgeData, setKnowledgeData] = useState({})
  const [loadingData, setLoadingData] = useState(false);
  const [errors, setErrors] = useState({});
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [expandedSnippets, setExpandedSnippets] = useState({});
  const moreActionsRef = useRef();

  const { t } = useTranslation();

  const tabs = [
    { label: `${t("brain_ai.knowledge.websites")}`, key: "website", header: "Website" },
    { label: `${t("brain_ai.knowledge.files")}`, key: "files", header: "File" },
    { label: `${t("brain_ai.knowledge.snippets")}`, key: "snippets", header: "Snippet" },
  ]

  const modelData = {
    snippets: { label: `${t("brain_ai.knowledge.snippet_label")}` },
    website: { label: `${t("brain_ai.knowledge.website_label")}` },
    files: { label: `${t("brain_ai.knowledge.files_label")}` }
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Don't close if clicking inside the dropdown menu
      if (event.target.closest('[data-dropdown-menu]')) {
        return;
      }
      if (moreActionsRef.current && !moreActionsRef.current.contains(event.target)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev, [name]: value
    }))
    setErrors((prev) => ({ ...prev, [name]: '' }))
  }

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    setErrors((prev) => ({ ...prev, files: '' }))
    const file = e.target.files?.[0];
    if (file && file.type !== "application/pdf") {
      setErrors((prev) => ({ ...prev, files: `${t("brain_ai.knowledge.only_pdf_files_allowed")}` }));
      e.target.files = '';
      return;
    } else if (file) {
      setSelectedFile(file);
      setFormData((prev) => ({
        ...prev, files: file
      }))
      console.log('Selected file:', file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = () => {
    setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setErrors((prev) => ({ ...prev, files: '' }))
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type !== "application/pdf") {
      setErrors((prev) => ({ ...prev, files: `${t("brain_ai.knowledge.only_pdf_files_allowed")}` }));
      e.target.files = '';
      return;
    } else if (file) {
      setSelectedFile(file);
      setFormData((prev) => ({
        ...prev, files: file
      }))
      console.log('Dropped file:', file);
    }
  };

  const handleKnowledge = async (payload) => {
    try {
      setLoading(true)
      const response = await knowledgeBase(payload)
      if (response.status === 200) {
        setOpen(false)
        handleSnippetsData()
        setFormData({ snippet: '', files: [], website: '' })
      } else {
        setLoading(false)
      }

    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  const handleSnippetsData = async () => {
    setLoadingData(true)
    try {
      const response = await getKnowledgeSnippets()
      if (response.status === 200) {
        setKnowledgeData(response.data)
      }

    } catch (error) {
      console.log(error)
    } finally {
      setLoadingData(false)
    }
  }

  useEffect(() => {
    handleSnippetsData()
  }, [])

  const handleSubmit = () => {
    switch (activeTab) {
      case "website":
        if (!formData.website.trim()) {
          setErrors((prev) => ({ ...prev, website: `${t("brain_ai.knowledge.website_required")}` }))
          return
        }
        let websiteUrl = formData.website.trim();
        // If URL doesn't start with http:// or https://, prepend http://
        const urlLower = websiteUrl.toLowerCase();
        if (!urlLower.startsWith('http://') && !urlLower.startsWith('https://')) {
          websiteUrl = `http://${websiteUrl}`;
        }
        // Validate the final URL format
        if (!/^https?:\/\/\S+$/.test(websiteUrl)) {
          setErrors((prev) => ({ ...prev, website: `${t("brain_ai.knowledge.valid_website")}` }))
          return
        }
        const payload = {
          data: websiteUrl,
          data_type: activeTab
        }
        handleKnowledge(payload)
        return;
      case "files":
        if (formData.files?.length === 0) {
          setErrors((prev) => ({ ...prev, files: `${t("brain_ai.knowledge.files_required")}` }))
          return
        }
        const filePayload = {
          data: formData.files.name,
          file: formData.files,
          data_type: activeTab
        }
        handleKnowledge(filePayload)
        return;
      default:
        if (!formData.snippet.trim()) {
          setErrors((prev) => ({ ...prev, snippet: `${t("brain_ai.knowledge.snippet_required")}` }))
          return
        }
        const data = {
          data: formData.snippet,
          data_type: "snippet"
        }
        handleKnowledge(data)
        return;
    }
  }


  const renderHeader = () => {
    const tab = tabs.find((e) => e.key === activeTab)
    return tab.header
  }

  const handleDropdownClick = (index) => {
    setActiveDropdown(activeDropdown === index ? null : index);
  };

  const handleDelete = async (index, id) => {
    try {
      const response = await deleteKnowledgeSnippets(id)
      if (response.status === 200) {
        setActiveDropdown(null);
        const data = knowledgeData[activeTab]
        const updated = [...data];
        updated.splice(index, 1);
        setKnowledgeData((prev) => ({
          ...prev, [activeTab]: updated
        }));
      }
    } catch (error) {
      console.log(error)
    }
  }

const renderEmptyState = (tabKey, onAction) => {
  const config = {
    snippets: {
      icon: (
        <div className="relative w-18 h-18 flex items-center justify-center">
          <img
            src={snippetsTop}
            alt="No snippets"
            className="absolute top-5 left-1/2 -translate-x-1/2 w-60 h-20 object-contain z-10"
          />
          <img
            src={snippetsBottom}
            alt="No snippets"
            className="absolute bottom-3 left-1/2 -translate-x-1/2 w-20 h-18 object-contain "
          />
        </div>
      ),
      title: "No snippets added yet",
      desc: "Add key information, facts, and guidelines to help your AI understand your business better."
    },
    website: {
      icon: <img src={brainEmptyWebsite} alt="No websites" className="w-28 h-22 object-contain mt-2" />,
      title: "No websites connected",
      desc: "Connect your website so Brain AI can learn from your public pages and provide more accurate responses."
    },
    files: {
      icon: (
        <div className="relative w-20 h-20 flex items-center justify-center">
          <img src={fileTop} alt="No files" className="absolute top-5 left-1/2 -translate-x-1/2 w-30 h-20 object-contain z-10" />
          <img src={fileBottom} alt="No files" className="absolute bottom-1 left-1/2 -translate-x-1/2 w-36 h-16" />
        </div>
      ),
      title: "No files uploaded",
      desc: "Upload documents to teach your AI about internal processes, product details, or policies."
    }
  }

  const content = config[tabKey] || config.snippets

  return (
    <NoData
      icon={content.icon}
      title={content.title}
      description={content.desc}
      onAction={onAction}
    />
  )
}

  const renderFileName = (file) => {
    const filename = file.split('/').pop();
    return filename
  }


  const renderMainContent = () => {
    switch (activeTab) {
      case "website":
        return (
          <>
            {loadingData ? <div className="flex justify-center items-center h-[50vh]"><span className="loader" /></div> : knowledgeData?.website?.length > 0 ? <div className="mt-3">
              <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
                {knowledgeData?.website?.length > 0 && knowledgeData?.website.map((e, i) => <div key={e.id} className="bg-white p-4 rounded-xl border border-[#d6d6d6] shadow-sm flex justify-between items-center gap-3">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="bg-[#E4E3F2] rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0">
                      <Globe className="w-5 h-5 text-[#675FFF]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <a href={e.url} target="_blank" className="text-[14px] hover:underline hover:text-[#675FFF] font-[400] font-inter text-[#5A687C] break-words">{e.url}</a>
                    </div>
                  </div>
                  <div ref={moreActionsRef} className='relative flex-shrink-0'>
                    <button
                      onClick={() => handleDropdownClick(i)}
                      className="text-[#1e1e1e] p-2 cursor-pointer border border-[#d6d6d6] rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <Ellipsis fill="#1e1e1e" />
                    </button>
                    {activeDropdown === i && (
                      <div className="absolute right-2 top-7 w-26 rounded-md shadow-lg bg-white ring-1 ring-gray-300 ring-opacity-5 z-[99999]">
                        <div className="py-1">
                          <div className="py-1">
                            <button
                              className="block cursor-pointer w-full text-left px-4 py-1 text-[14px] font-[500] text-red-600 hover:rounded-lg"
                              onClick={() => {
                                handleDelete(i, e.id)
                              }}
                            >
                              <div className="flex items-center gap-2">{<Delete />} <span>{t("delete")}</span> </div>
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>)}
              </div>
            </div> :
              renderEmptyState("website", () => {
                setOpen(true);
                setActiveDropdown(null);
                setActiveTab("website");
              })}
          </>
        )
        
      case "snippets":
        return (
          <>
            {loadingData ? <div className="flex justify-center items-center h-[50vh]"><span className="loader" /></div> : knowledgeData?.snippets?.length > 0 ? <div className="mt-3">
              <div className="w-full flex flex-col gap-4 rounded-2xl">
                {knowledgeData?.snippets?.length > 0 && knowledgeData?.snippets.map((e, i) => <div key={e.id} className="bg-white p-4 rounded-xl border border-[#d6d6d6] shadow-sm flex justify-between items-start gap-3">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className="bg-[#E4E3F2] rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0">
                      <img src={letter} alt="letter" className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="relative">
                        <p className={`text-[14px] font-[400] font-inter text-[#5A687C] break-words whitespace-normal leading-relaxed ${!expandedSnippets[i] ? 'line-clamp-2' : ''}`}>
                          {e.data}
                        </p>
                        {e.data && e.data.trim().length > 400 && (
                          <button
                            onClick={() => setExpandedSnippets(prev => ({ ...prev, [i]: !prev[i] }))}
                            className="text-[#675FFF] text-[14px] font-[500] mt-1 hover:underline cursor-pointer"
                          >
                            {expandedSnippets[i] ? 'See less' : 'See more'}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                  <div ref={moreActionsRef} className='relative flex-shrink-0'>
                    <button
                      onClick={() => handleDropdownClick(i)}
                      className="text-[#1e1e1e] p-2 cursor-pointer border border-[#d6d6d6] rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <Ellipsis fill="#1e1e1e" />
                    </button>
                    {activeDropdown === i && (
                      <div className="absolute right-2 top-7 w-26 rounded-md shadow-lg bg-white ring-1 ring-gray-300 ring-opacity-5 z-[99999]" data-dropdown-menu onClick={(event) => event.stopPropagation()}>
                        <div className="py-1">
                          {/* <button
                            className="block cursor-pointer w-full group text-left px-4 py-2 text-sm text-[#5A687C] hover:bg-[#F4F5F6] hover:rounded-lg hover:text-[#675FFF]"
                            onClick={() => {
                              setActiveDropdown(null);
                            }}
                          >
                            <div className="flex items-center gap-2"><div className='group-hover:hidden'><Edit /></div> <div className='hidden group-hover:block'><Edit status={true} /></div> <span>{t("edit")}</span> </div>
                          </button>
                          <hr style={{ color: "#E6EAEE", marginTop: "5px" }} /> */}
                          <div className="py-1">
                            <button
                              className="block cursor-pointer w-full text-left px-4 py-1 text-[14px] font-[500] text-red-600 hover:rounded-lg"
                              onClick={(event) => {
                                event.stopPropagation();
                                handleDelete(i, e.id)
                              }}
                            >
                              <div className="flex items-center gap-2">{<Delete />} <span>{t("delete")}</span> </div>
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>)}
              </div>
            </div> :
              renderEmptyState("snippets", () => {
                setOpen(true);
                setActiveDropdown(null);
                setActiveTab("snippets");
              })}
          </>
        )
      default:
        return (
          <>
            {loadingData ? <div className="flex justify-center items-center h-[50vh]"><span className="loader" /></div> : knowledgeData?.files?.length > 0 ? <div className="mt-3">
              <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
                {knowledgeData?.files?.length > 0 && knowledgeData?.files.map((e, i) => <div key={e.id} className="bg-white p-4 rounded-xl border border-[#d6d6d6] shadow-sm flex justify-between items-center gap-3">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="bg-[#E4E3F2] rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0">
                      <File className="w-5 h-5 text-[#675FFF]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <a href={e.path} target="_blank" className="block text-[14px] font-[400] text-[#5A687C] truncate hover:underline hover:text-[#675FFF]">
                        {renderFileName(e.path)}
                      </a>
                      {e?.size && (
                        <p className="text-[12px] text-[#5A687C] mt-0.5">{e.size}</p>
                      )}
                    </div>
                  </div>
                  <div ref={moreActionsRef} className='relative flex-shrink-0'>
                    <button
                      onClick={() => handleDropdownClick(i)}
                      className="text-[#1e1e1e] p-2 cursor-pointer border border-[#d6d6d6] rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <Ellipsis fill="#1e1e1e" />
                    </button>
                    {activeDropdown === i && (
                      <div className="absolute right-2 top-7 w-26 rounded-md shadow-lg bg-white ring-1 ring-gray-300 ring-opacity-5 z-10">
                        <div className="py-1">
                          <div className="py-1">
                            <button
                              className="block cursor-pointer w-full text-left px-4 py-1 text-[14px] font-[500] text-red-600 hover:rounded-lg"
                              onClick={() => {
                                handleDelete(i, e.id)
                              }}
                            >
                              <div className="flex items-center gap-2">{<Delete />} <span>{t("delete")}</span> </div>
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>)}
              </div>
            </div> :
              renderEmptyState("files", () => {
                setOpen(true);
                setActiveDropdown(null);
                setActiveTab("files");
              })}
          </>
        )
    }
  }



  return (
    <div className="flex p-12 flex-col w-full items-start gap-4 ">
      <h1 className="font-[500] text-[#1e1e1e] text-[22px] leading-8 mt-1">
        {t("brain_ai.knowledge.sub_heading")}
      </h1>
      <div className="flex w-full items-center justify-between gap-4 mt-4">
        <div className="flex items-center gap-1 bg-[#F7F7F8] border border-[#E5E7EB] rounded-xl p-0.5">
          {tabs.map((e) => (
            <button
              key={e.key}
              onClick={() => {
                setActiveTab(e.key);
                setActiveDropdown(null);
              }}
              className={`inline-flex cursor-pointer items-center justify-center px-2.5 py-1.5 rounded-lg text-[14px] font-[500] transition-all duration-200 ${
                activeTab === e.key
                  ? "bg-white text-[#1E1E1E] shadow-sm border border-[#E5E7EB]"
                  : "bg-transparent text-[#9CA3AF] border border-transparent hover:text-[#1E1E1E]"
              }`}
            >
              <span className="leading-5">
                {e.label}
              </span>
            </button>
          ))}
        </div>
        <button
          onClick={() => {
            setOpen(true);
            setActiveDropdown(null);
          }}
          className="flex items-center cursor-pointer gap-2 px-3 py-2 bg-[#675FFF] border border-[#5f58e8] rounded-lg text-white text-[14px] font-[500]"
        >
          + {t("brain_ai.knowledge.add")} {renderHeader()}
        </button>
      </div>

      <div className="w-full">
        {renderMainContent()}
      </div>
      {open && <div className="fixed inset-0 bg-[rgb(0,0,0,0.7)] flex items-center justify-center z-50">
        <div className="bg-white max-h-[600px] w-full max-w-lg rounded-2xl shadow-xl relative flex flex-col">
          <button
            onClick={() => {
              setOpen(false)
              setFormData({ snippet: '', files: [], website: '' })
              setErrors({})
              setSelectedFile(null)
            }}
            className="absolute cursor-pointer top-4 right-4 text-gray-500 hover:text-gray-800"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="px-6 pt-6 pb-4 border-b border-[#E5E7EB]">
            <h2 className="text-[#1E1E1E] font-[400] text-[20px] mb-1">
              {t("brain_ai.knowledge.add")} {renderHeader()}
            </h2>
          </div>

          {/* Body */}
          <div className="px-6 py-4 overflow-auto">
            {activeTab === "files" && (
              <div>
                <p className="text-[14px] mb-2">
                  {modelData[activeTab].label}
                </p>
                
                <label className="block text-[14px] font-medium text-[#868C98] mb-2">{t("brain_ai.knowledge.reupload_your_file")}</label>
                <div
                  onClick={handleClick}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`flex flex-col items-center justify-center py-8 border-2 border-dashed rounded-lg text-center cursor-pointer transition ${dragActive ? 'border-[#675FFF] bg-[#F5F7FF]' : 'border-[#E1E4EA] bg-white'
                    }`}
                >
                  <Upload className="w-8 h-8 text-[#675FFF] mb-3" />
                  <p className="text-[14px] font-[400] text-[#1E1E1E] mb-3">
                    {t("brain_ai.knowledge.choose_a_file_or_drag_and_drop_it_here")}
                  </p>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleClick();
                    }}
                    className="px-4 py-2 cursor-pointer bg-white border border-[#E1E4EA] rounded-lg text-[14px] font-medium text-[#1E1E1E] hover:bg-[#F9FAFB] transition-colors"
                  >
                    {t("brain_ai.knowledge.browse_file")}
                  </button>
                  <input
                    type="file"
                    accept="application/pdf"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>

                {selectedFile && (
                  <div className="mt-3 text-sm text-gray-700 ">
                    <strong>{t("brain_ai.selected_file")}</strong> <span className="text-[#5A687C] hover:underline">{selectedFile.name}</span>
                  </div>
                )}
                {errors.files && <p className="text-red-500 mt-2">{errors.files}</p>}
              </div>
            )}
            {activeTab === "snippets" && (
              <div>
                <p className="text-[14px] mb-2">
              {modelData[activeTab].label}
            </p>
                <label className="block text-[14px] font-medium text-[#868C98] mb-1 mt-2">{t("brain_ai.details")}</label>
                <div className={`flex items-center border text-[#868C98] focus-within:border-[#675FFF] ${errors.snippet ? 'border-[#FF3B30]' : 'border-[#E1E4EA]'} rounded-[8px] px-4 py-3`}>
                  <textarea
                    type="text"
                    name="snippet"
                    value={formData?.snippet}
                    onChange={handleChange}
                    placeholder={t("brain_ai.detail_placeholder")}
                    rows={3}
                    className="w-full focus:outline-none resize-none "
                    maxLength={400}
                  />
                </div>
                {/* Character counter */}
                <div className="w-full text-right text-xs text-gray-500 mt-1">
                  {formData?.snippet?.length || 0} / 400
                </div>
                {errors.snippet && <p className="text-red-500 mt-2">{errors.snippet}</p>}
              </div>
            )}
            {activeTab === "website" && (
              <div>
                <p className="text-[14px] mb-2">
                  {modelData[activeTab].label}
                </p>
                <label className="block text-[14px] font-medium text-[#868C98] mb-1 mt-2">{t("brain_ai.knowledge.webpage_link")}</label>
                <div className={`flex items-center border focus-within:border-[#675FFF] ${errors.website ? 'border-[#FF3B30]' : 'border-[#E1E4EA]'} rounded-[8px] px-4 py-3`}>
                  <div className="flex items-center h-full mr-2 pr-2 border-r border-[#E1E4EA] self-stretch">
                    <span className="text-[#9CA3AF] text-[14px]">http://</span>
                  </div>
                  <input
                    type="text"
                    name="website"
                    value={formData?.website}
                    onChange={handleChange}
                    placeholder="Objectiveexample.com"
                    className="flex-1 focus:outline-none text-[#1E1E1E]"
                  />
                </div>
                {errors.website && <p className="text-red-500 mt-2">{errors.website}</p>}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-2 px-6 py-4 border-t border-[#E5E7EB]">
            <button
              onClick={() => {
                setOpen(false)
                setFormData({ snippet: '', files: [], website: '' })
                setErrors({})
                setSelectedFile(null)
              }}
              className="cursor-pointer text-[14px] font-[500] text-[#111827] bg-white border border-[#E5E7EB] rounded-lg px-3 py-2 shadow-sm hover:bg-[#F9FAFB]"
            >
              {t("brain_ai.cancel")}
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="cursor-pointer text-[14px] font-[500] text-white rounded-lg px-4 py-1.5 bg-[#675FFF] hover:bg-[#5E54FF] disabled:cursor-not-allowed"
            >
              {loading ? <div className="flex items-center justify-center gap-2"><p>{t("brain_ai.processing")}</p><span className="loader" /></div> : `${t("brain_ai.knowledge.add")} ${renderHeader()}`}
            </button>
          </div>
        </div>
      </div>}
    </div>
  );
};

export default Knowledge;