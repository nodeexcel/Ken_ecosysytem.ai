import React, { useState } from "react";
import nodata from '../assets/svg/brainai_nodata.svg'
import letter from '../assets/svg/letter_t.svg'
import { Upload, X } from "lucide-react";

const tabs = [
  { label: "Snippets", key: "snippets" },
  { label: "Websites", key: "websites" },
  { label: "Files", key: "files" },
]

const modelData = {
  snippets: { label: "Provide any facts, information you want to include in your Brain AI for agents to be aware of." },
  websites: { label: "Provide any facts webpages you want to include in your Brain AI for agents to be aware of." },
  files: { label: "Upload only clear, relevant, and concise documents to ensure accurate answers from AI agents. Exemples: Company bylaws, Presentation Brochure, Various Presentations." }
}

const staticData = [
  { header: "My company", description: "Lev" },
  { header: "Tool integrations", description: "No integrations connected for scheduling and tasks yet." },
  { header: "Skill improvement area", description: "Looking to improve in an unspecified area to help Lev grow." }
]

const Knowledge = () => {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("snippets")


  const renderMainContent = () => {
    switch (activeTab) {
      case "snippets":
        return (
          <div className="mt-3 max-w-[648px]">
            <div className="w-full gap-3 min-h-[360px] flex flex-col justify-center items-center border border-solid border-[#e1e4ea] bg-white rounded-2xl">
              <div>
                <img src={nodata} alt="nodata" />
              </div>
              <h1 className="text-[20px] font-[600] font-inter">Brain AI is empty</h1>
              <p className="text-[14px] font-[500] font-inter">Add information to use it</p>
            </div>
          </div>
        )

      case "websites":
        return (
          <div className="mt-3 max-w-[648px]">
            <div className="w-full flex flex-col gap-4 border border-solid border-[#e1e4ea] bg-white rounded-2xl p-4">
              {staticData.map((e) => <div key={e.header} className="bg-[#f7f8fc] p-4 rounded-xl flex gap-2">
                <div className="pt-1">
                  <img src={letter} alt="letter" />
                </div>
                <div>
                  <h2 className="text-[16px] font-[600] font-inter text-[#373F51]">{e.header}</h2>
                  <p className="text-[14px] font-[500] font-inter text-[#6B7280]">{e.description}</p>
                </div>
              </div>)}

            </div>
          </div>
        )
      default:
        return (
          <div className="mt-3 max-w-[648px]">
            <div className="w-full gap-3 min-h-[360px] flex flex-col justify-center items-center border border-solid border-[#e1e4ea] bg-white rounded-2xl">
              <div>
                <img src={nodata} alt="nodata" />
              </div>
              <h1 className="text-[20px] font-[600] font-inter">Brain AI is empty</h1>
              <p className="text-[14px] font-[500] font-inter">Add information to use it</p>
            </div>
          </div>
        )
    }
  }



  return (
    <div className="flex flex-col w-full items-start gap-6 onest">
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
          <span className={`[font-family:'Onest',Helvetica] font-medium text-sm tracking-[0] leading-6 whitespace-nowrap ${activeTab === e.key ? "text-[#5E54FF]"
            : "text-[#5A687C] "}`}>
            {e.label}
          </span>
        </button>)}
      </div>

      <div className="w-full">
        {renderMainContent()}
      </div>
      {open && <div className="onest fixed inset-0 bg-[rgb(0,0,0,0.7)] flex items-center justify-center z-50">
        <div className="bg-white max-h-[600px] flex flex-col gap-4 w-full max-w-lg rounded-2xl shadow-xl p-6 relative">
          <button
            onClick={() => setOpen(false)}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
          >
            <X className="w-5 h-5" />
          </button>

          <h2 className="text-[#1E1E1E] font-semibold text-[20px] mb-1">
            Add Knowledge
          </h2>
          <p className="text-[14px] text-[#5A687C]">
            {modelData[activeTab].label}
          </p>

          {/* Tabs */}
          <div className="flex border border-[#E1E4EA] rounded-lg overflow-hidden mt-2">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                className={`w-full py-2 text-sm font-medium transition ${activeTab === tab.key
                  ? "bg-[#F3F4F6] text-[#1E1E1E]"
                  : "bg-white text-[#5A687C]"
                  }`}
                onClick={() => setActiveTab(tab.key)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="mt-3">
            {activeTab === "files" && (
              <div>
                <label className="block text-[14px] font-medium text-[#292D32] mb-1">Upload File / Images</label>
                <div className="border border-dashed border-[#CBD5E0] rounded-lg px-4 py-8 text-center">
                  <Upload className="mx-auto mb-2 text-[#5E54FF]" />
                  <p className="text-[#1E1E1E] font-medium">Upload from your computer</p>
                  <p className="text-sm text-[#5A687C]">or drag and drop</p>
                </div>
              </div>
            )}
            {activeTab === "snippets" && (
              <div>
                <label className="block text-[14px] font-medium text-[#292D32] mb-1">Details</label>
                <div className="flex items-center border border-gray-300 rounded-[8px] px-4 py-3">
                  <textarea
                    type="text"
                    name="details"
                    placeholder="The more details, the better!"
                    rows={3}
                    className="w-full focus:outline-none"
                  />
                </div>
              </div>
            )}
            {activeTab === "websites" && (
              <div>
                <label className="block text-[14px] font-medium text-[#292D32] mb-1">Website</label>
                <div className="flex items-center border border-gray-300 rounded-[8px] px-4 py-3">
                  <input
                    type="text"
                    name="website"
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
              className="w-full text-[16px] text-white rounded-[8px] bg-[#5E54FF] h-[38px]"
            >
              Save
            </button>
          </div>
        </div>
      </div>}
    </div>
  );
};

export default Knowledge;