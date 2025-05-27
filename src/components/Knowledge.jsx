import { useEffect, useRef, useState } from "react";
import nodata from '../assets/svg/brainai_nodata.svg'
import letter from '../assets/svg/letter_t.svg'
import { Upload, X } from "lucide-react";
import { Delete, Edit, ThreeDots, UploadIcon } from "../icons/icons";
import { deleteKnowledgeSnippets, getKnowledgeSnippets, knowledgeBase } from "../api/brainai";

const tabs = [
  { label: "Snippets", key: "snippets" },
  { label: "Websites", key: "website" },
  { label: "Files", key: "files" },
]

const modelData = {
  snippets: { label: "Provide any facts, information you want to include in your Brain AI for agents to be aware of." },
  website: { label: "Provide any facts webpages you want to include in your Brain AI for agents to be aware of." },
  files: { label: "Upload only clear, relevant, and concise documents to ensure accurate answers from AI agents. Exemples: Company bylaws, Presentation Brochure, Various Presentations." }
}

const staticData = [
  { header: "My company", description: "Lev" },
  { header: "Tool integrations", description: "No integrations connected for scheduling and tasks yet." },
  { header: "Skill improvement area", description: "Looking to improve in an unspecified area to help Lev grow." }
]

const NoData = ({ setOpen }) => {
  return (
    <div className="mt-3 max-w-[648px]">
      <div className="w-full gap-3 min-h-[360px] flex flex-col justify-center items-center border border-solid border-[#e1e4ea] bg-white rounded-2xl">
        <div onClick={setOpen}>
          <img src={nodata} alt="nodata" />
        </div>
        <h1 className="text-[20px] font-[600] font-inter">Brain AI is empty</h1>
        <p className="text-[14px] font-[500] font-inter">Add information to use it</p>
      </div>
    </div>
  )
}

const Knowledge = () => {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("snippets")
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [snippetDetails, setSnippetDetail] = useState("")
  const [websiteUrl, setWebsiteUrl] = useState("")
  const [formData, setFormData] = useState({})
  const [loading, setLoading] = useState(false)
  const [knowledgeData, setKnowledgeData] = useState({})
  const [loadingData, setLoadingData] = useState(false);
  const [errors, setErrors] = useState({});
  const [activeDropdown, setActiveDropdown] = useState(null);

  useEffect(() => {
    setTimeout(() => {
      setErrors({})
    }, 5000)
  }, [errors])


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev, [name]: value
    }))
  }

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file && file.type !== "application/pdf") {
      setErrors((prev) => ({ ...prev, files: "Only PDF files are allowed." }));
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
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type !== "application/pdf") {
      setErrors((prev) => ({ ...prev, files: "Only PDF files are allowed." }));
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
        const payload = {
          data: formData.website,
          data_type: activeTab
        }
        handleKnowledge(payload)
        break;
      case "files":
        const filePayload = {
          data: formData.files.name,
          file: formData.files,
          data_type: activeTab
        }
        handleKnowledge(filePayload)
        break;
      default:
        const data = {
          data: formData.snippet,
          data_type: activeTab
        }
        handleKnowledge(data)
        break;
    }
  }


  const renderHeader = () => {
    const tab = tabs.find((e) => e.key === activeTab)
    return tab.label
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


  const renderMainContent = () => {
    switch (activeTab) {
      case "website":
        return (
          <>
            {loadingData ? <div className="flex justify-center items-center h-[50vh]"><span className="loader" /></div> : knowledgeData?.website?.length > 0 ? <div className="mt-3 max-w-[648px]">
              <div className="w-full flex flex-col gap-4 border border-solid border-[#e1e4ea] bg-white rounded-2xl p-4">
                {knowledgeData?.website?.length > 0 && knowledgeData?.website.map((e, i) => <div key={e.id} className="bg-[#f7f8fc] p-4 rounded-xl flex justify-between items-center gap-2">
                  <div className="flex  items-center gap-2">
                    <div className="text-[#675FFF]">
                      W
                    </div>
                    <div>
                      <a href={e.url} target="_blank" className="text-[14px] hover:underline hover:text-[#675FFF] font-[400] font-inter text-[#5A687C]">{e.url}</a>
                    </div>
                  </div>
                  <div className='bg-[#fff] rounded-lg'>
                    <button
                      onClick={() => handleDropdownClick(i)}
                      className="text-gray-500 p-2"
                    >
                      <ThreeDots />
                    </button>
                    {activeDropdown === i && (
                      <div className="absolute w-48 rounded-md shadow-lg bg-white ring-1 ring-gray-300 ring-opacity-5 z-10">
                        <div className="py-1">
                          <button
                            className="block w-full group text-left px-4 py-2 text-sm text-gray-700 hover:text-[#675FFF] hover:bg-gray-100"
                            onClick={() => {
                              setActiveDropdown(null);
                            }}
                          >
                            <div className="flex items-center gap-2"><div className='group-hover:hidden'><Edit /></div> <div className='hidden group-hover:block'><Edit status={true} /></div> <span>Edit</span> </div>
                          </button>
                          <hr style={{ color: "#E6EAEE" }} />
                          <button
                            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                            onClick={() => {
                              handleDelete(i, e.id)
                            }}
                          >
                            <div className="flex items-center gap-2">{<Delete />} <span>Delete</span> </div>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>)}
              </div>
            </div> :
              <NoData setOpen={() => setOpen(true)} />}
          </>
        )

      case "snippets":
        return (
          <>
            {loadingData ? <div className="flex justify-center items-center h-[50vh]"><span className="loader" /></div> : knowledgeData?.snippets?.length > 0 ? <div className="mt-3 max-w-[648px]">
              <div className="w-full flex flex-col gap-4 border border-solid border-[#e1e4ea] bg-white rounded-2xl p-4">
                {knowledgeData?.snippets?.length > 0 && knowledgeData?.snippets.map((e, i) => <div key={e.id} className="bg-[#f7f8fc] p-4 rounded-xl flex justify-between items-center gap-2">
                  <div className="flex  items-center gap-2">
                    <div className="pt-1">
                      <img src={letter} alt="letter" />
                    </div>
                    <div>
                      <p className="text-[14px] font-[400] font-inter text-[#5A687C]">{e.data}</p>
                    </div>
                  </div>
                  <div className='bg-[#fff] rounded-lg'>
                    <button
                      onClick={() => handleDropdownClick(i)}
                      className="text-gray-500 p-2"
                    >
                      <ThreeDots />
                    </button>
                    {activeDropdown === i && (
                      <div className="absolute w-48 rounded-md shadow-lg bg-white ring-1 ring-gray-300 ring-opacity-5 z-10">
                        <div className="py-1">
                          <button
                            className="block w-full group text-left px-4 py-2 text-sm text-gray-700 hover:text-[#675FFF] hover:bg-gray-100"
                            onClick={() => {
                              setActiveDropdown(null);
                            }}
                          >
                            <div className="flex items-center gap-2"><div className='group-hover:hidden'><Edit /></div> <div className='hidden group-hover:block'><Edit status={true} /></div> <span>Edit</span> </div>
                          </button>
                          <hr style={{ color: "#E6EAEE" }} />
                          <button
                            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                            onClick={() => {
                              handleDelete(i, e.id)
                            }}
                          >
                            <div className="flex items-center gap-2">{<Delete />} <span>Delete</span> </div>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>)}
              </div>
            </div> : <NoData setOpen={() => setOpen(true)} />}
          </>
        )
      default:
        return (
          <>
            {loadingData ? <div className="flex justify-center items-center h-[50vh]"><span className="loader" /></div> : knowledgeData?.files?.length > 0 ? <div className="mt-3 max-w-[648px]">
              <div className="w-full flex flex-col gap-4 border border-solid border-[#e1e4ea] bg-white rounded-2xl p-4">
                {knowledgeData?.files?.length > 0 && knowledgeData?.files.map((e, i) => <div key={e.id} className="bg-[#f7f8fc] p-4 rounded-xl flex justify-between items-center gap-2">
                  <div className="flex  items-center gap-2">
                    <div className="text-[#675FFF]">
                      F
                    </div>
                    <div>
                      <a href={e.path} target="_blank" className="text-[14px] hover:underline hover:text-[#675FFF] font-[400] font-inter text-[#5A687C]">{e.path}</a>
                    </div>
                  </div>
                  <div className='bg-[#fff] rounded-lg'>
                    <button
                      onClick={() => handleDropdownClick(i)}
                      className="text-gray-500 p-2"
                    >
                      <ThreeDots />
                    </button>
                    {activeDropdown === i && (
                      <div className="absolute w-48 rounded-md shadow-lg bg-white ring-1 ring-gray-300 ring-opacity-5 z-10">
                        <div className="py-1">
                          <button
                            className="block w-full group text-left px-4 py-2 text-sm text-gray-700 hover:text-[#675FFF] hover:bg-gray-100"
                            onClick={() => {
                              setActiveDropdown(null);
                            }}
                          >
                            <div className="flex items-center gap-2"><div className='group-hover:hidden'><Edit /></div> <div className='hidden group-hover:block'><Edit status={true} /></div> <span>Edit</span> </div>
                          </button>
                          <hr style={{ color: "#E6EAEE" }} />
                          <button
                            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                            onClick={() => {
                              handleDelete(i, e.id)
                            }}
                          >
                            <div className="flex items-center gap-2">{<Delete />} <span>Delete</span> </div>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>)}
              </div>
            </div> :
              <NoData setOpen={() => setOpen(true)} />}
          </>
        )
    }
  }



  return (
    <div className="flex pr-2 flex-col w-full items-start gap-6 ">
      <div className="flex items-center justify-between w-full">
        <h1 className="font-semibold text-[#1e1e1e] text-2xl leading-8">
          Knowledge Base
        </h1>
        <button onClick={() => setOpen(true)} className="flex items-center gap-2.5 px-5 py-[7px] bg-[#675FFF] border-[1.5px] border-[#5f58e8] rounded text-white">
          <span className="font-medium text-base leading-6">
            Add Info Manually
          </span>
        </button>
      </div>

      <div className="flex items-start relative self-stretch w-full flex-[0_0_auto] border-b border-[#e1e4ea]">
        {tabs.map((e) => <button
          key={e.key}
          onClick={() => setActiveTab(e.key)}
          className={`inline-flex items-center justify-center gap-1 p-2.5 relative flex-[0_0_auto] border-b-2 ${activeTab === e.key
            ? "border-[#5E54FF] text-primary-color"
            : "border-[#e1e4ea] text-text-grey"
            } rounded-none`}
        >
          <span className={`font-medium text-sm tracking-[0] leading-6 whitespace-nowrap ${activeTab === e.key ? "text-[#5E54FF]"
            : "text-[#5A687C] "}`}>
            {e.label}
          </span>
        </button>)}
      </div>

      <div className="w-full">
        {renderMainContent()}
      </div>
      {open && <div className=" fixed inset-0 bg-[rgb(0,0,0,0.7)] flex items-center justify-center z-50">
        <div className="bg-white max-h-[600px] flex flex-col gap-4 w-full max-w-lg rounded-2xl shadow-xl p-6 relative">
          <button
            onClick={() => setOpen(false)}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
          >
            <X className="w-5 h-5" />
          </button>

          <h2 className="text-[#1E1E1E] font-semibold text-[20px] mb-1">
            Add {renderHeader()}
          </h2>
          <p className="text-[14px] text-[#5A687C]">
            {modelData[activeTab].label}
          </p>

          {/* Tabs */}
          {/* <div className="flex bg-[#F3F4F6] rounded-lg overflow-hidden mt-2">
            {tabs.map((tab) => (
              <div key={tab.key} className="w-full p-1" onClick={() => setActiveTab(tab.key)}>
                <button

                  className={`w-full py-2 text-sm font-medium transition ${activeTab === tab.key
                    ? "bg-white text-[#1E1E1E] rounded-lg"
                    : "text-[#5A687C]"
                    }`}

                >
                  {tab.label}
                </button>
              </div>
            ))}
          </div> */}


          {/* Tab Content */}
          <div className="mt-3">
            {activeTab === "files" && (
              <div>
                <label className="block text-sm font-medium mb-1">Upload File / Images</label>
                <div className="mt-2">
                  <div
                    onClick={handleClick}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`flex flex-col items-center justify-center py-4 border-2 border-dashed rounded-md text-center cursor-pointer transition ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-[#335CFF80] bg-[#F5F7FF]'
                      }`}
                  >
                    <UploadIcon />
                    <p className="text-[18px] font-[600] text-[#1E1E1E] mt-2">
                      Upload from your computer
                    </p>
                    <p className="text-[14px] font-[500] text-[#5A687C] mt-1">
                      or drag and drop
                    </p>
                    <input
                      type="file"
                      accept="application/pdf"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </div>

                  {selectedFile && (
                    <div className="mt-3 text-sm text-gray-700">
                      <strong>Selected File:</strong> {selectedFile.name}
                    </div>
                  )}
                  {errors.files && <p className="text-red-500 mt-5">{errors.files}</p>}
                </div>
              </div>
            )}
            {activeTab === "snippets" && (
              <div>
                <label className="block text-[14px] font-medium text-[#292D32] mb-1">Details</label>
                <div className="flex items-center border border-gray-300 rounded-[8px] px-4 py-3">
                  <textarea
                    type="text"
                    name="snippet"
                    value={formData?.snippet}
                    onChange={handleChange}
                    placeholder="The more details, the better!"
                    rows={3}
                    className="w-full focus:outline-none resize-none"
                  />
                </div>
              </div>
            )}
            {activeTab === "website" && (
              <div>
                <label className="block text-[14px] font-medium text-[#292D32] mb-1">Website</label>
                <div className="flex items-center border border-gray-300 rounded-[8px] px-4 py-3">
                  <input
                    type="text"
                    name="website"
                    value={formData?.website}
                    onChange={handleChange}
                    placeholder="https://ecosystem.ai.com"
                    className="w-full focus:outline-none"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-2 mt-4">
            <button
              onClick={() => setOpen(false)}
              className="w-full text-[16px] text-[#5A687C] bg-white border border-[#E1E4EA] rounded-[8px] h-[38px]"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full text-[16px] text-white rounded-[8px] bg-[#5E54FF] h-[38px]"
            >
              {loading ? <div className="flex items-center justify-center gap-2"><p>Processing...</p><span className="loader" /></div> : "Save"}
            </button>
          </div>
        </div>
      </div>}
    </div>
  );
};

export default Knowledge;