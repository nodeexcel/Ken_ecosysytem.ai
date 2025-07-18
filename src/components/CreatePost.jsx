import { X, ChevronDown, Hash, Settings, Edit3, Camera, Link, Trash2, UploadIcon } from "lucide-react"
import inkartinkLogo from '../assets/svg/inkartink.svg';
import { useTranslation } from "react-i18next";

export default function CreatePost({ onClose }) {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-row items-center justify-between h-[38px]">
        <h1 className="text-2xl font-semibold text-gray-900">{t("scheduler")}</h1>
        <button className="p-2 hover:bg-gray-100 rounded-full" onClick={onClose}>
          <X className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      <div className="flex w-full h-[726px]  mx-auto rounded-[16px] border border-[#E1E4EA] bg-white">
        {/* Left Sidebar */}
        <div className="w-[218px] h-[726px] bg-white border-r border-r-[#E1E4EA] border-t border-t-[#ffffff] border-b border-b-[#ffffff] border-l border-l-[#ffffff] rounded-l-[16px] flex flex-col relative p-4 min-h-[600px]">
          <div>
            <div className="flex flex-col w-[184px] max-h-[70px] gap-[6px] absolute top-[18px] left-[16px]">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Account</label>
                <div className="relative mb-4">
                  <select className="w-full border border-gray-300 px-3 py-2 rounded-md appearance-none bg-white text-gray-700">
                    <option>Select</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
              <div className="flex flex-row items-center gap-[6px]  rounded-lg p-2 w-full mt-2">
                <div className="w-[30px] h-[30px] bg-blue-600 rounded flex items-center justify-center">
                  <span className="text-white text-xs font-bold">in</span>
                </div>
                <div className="flex-1">
                  <span className="font-semibold text-[14px] leading-[17px] tracking-[0] text-black flex-1">
                    Ecomsystme.ai
                  </span>
                </div>
                <button className="text-gray-400 hover:text-red-500">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Add Account button with border styling - positioned to match Draft buttons exactly */}
          <div className="absolute bottom-0 left-0 right-0 border-t border-[#E1E4EA] min-h-[88px] p-[25px] bg-white flex items-center">
            <button className="w-full  text-sm text-[#5A687C] text-center font-medium border border-gray-200 rounded-md py-2 bg-white">
              Add Account
            </button>
          </div>
        </div>

        {/* Center Post Creation */}
        <div className="flex flex-col gap-2 bg-white  border-[#E1E4EA] rounded-lg p-6 w-[calc(100%-494px)] h-[726px] relative">
          {/* Post Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                <span className="text-white text-xs font-bold">in</span>
              </div>
              <span className="text-sm font-medium text-gray-900">Test Post</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex flex-row items-center gap-[6px] w-[178px] h-[27px]">
                <button className="flex flex-row items-center gap-[4px] w-[103px] h-[27px] rounded-[4px] border border-[#E1E4EA] px-[10px] py-[6px] text-xs text-gray-600 hover:text-gray-800 bg-white">
                  <Hash className="w-3 h-3" />
                  Add Labels
                </button>
                <button className="flex flex-row items-center gap-[4px] w-[69px] h-[27px] rounded-[4px] border border-[#E1E4EA] px-[10px] py-[6px] text-xs text-gray-600 hover:text-gray-800 bg-white">
                  Clear
                </button>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col w-full rounded-[10px] p-[10px] border border-[#E1E4EA] gap-[17px]">
            {/* Post Title Input */}
            <input
              type="text"
              className="w-full h-[48px] font-normal text-[16px] leading-[18.4px] tracking-[0] text-[#5A687C] rounded-md px-4 mb-4"
              placeholder="Test Post"
              style={{ fontWeight: 400, fontStyle: "normal", letterSpacing: 0 }}
            />

            <div className="flex flex-row items-center justify-between w-full h-[27px] mb-4">
              <div className="flex flex-row items-center w-[218px] h-[27px] gap-[6px]">
                <button
                  className="flex items-center gap-[4px] rounded-[4px] border border-[#E1E4EA] px-[10px] py-[6px] text-xs text-gray-600 hover:text-gray-800 bg-white"
                  style={{ width: "94px", height: "27px" }}
                >
                  <Hash className="w-3 h-3" />
                  Hashtags
                </button>
                <button
                  className="flex items-center gap-[4px] rounded-[4px] border border-[#E1E4EA] px-[10px] py-[6px] text-xs text-gray-600 hover:text-gray-800 bg-white"
                  style={{ width: "118px", height: "27px" }}
                >
                  <Settings className="w-3 h-3" />
                  Ai Assistance
                </button>
              </div>
              <div className="flex flex-row items-center gap-[6px]" style={{ width: "126px", height: "27px" }}>
                <button className="flex items-center justify-center w-[27px] h-[27px] rounded-[4px] border border-[#E1E4EA] bg-white">
                  <span className="text-[#5A687C] font-inter font-semibold text-[12px]">9</span>
                </button>
                <button className="flex items-center justify-center w-[27px] h-[27px] rounded-[4px] border border-[#E1E4EA] bg-white">
                  <span className="text-[#5A687C] font-inter font-semibold text-[12px]">B</span>
                </button>
                <button className="flex items-center justify-center w-[27px] h-[27px] rounded-[4px] border border-[#E1E4EA] bg-white">
                  <span className="text-[#5A687C] font-inter font-semibold text-[12px]">I</span>
                </button>
                <button className="flex items-center justify-center w-[27px] h-[27px] rounded-[4px] border border-[#E1E4EA] bg-white">
                  <span className="text-[#5A687C] font-inter font-semibold text-[12px]">☺︎</span>
                </button>
              </div>
            </div>

            {/* Upload Section */}
            <div className="mb-4 w-full">
              <label className="block text-sm font-medium text-gray-700 mb-2">Upload File / Images</label>
              <div className="border-2 border-dashed border-blue-200 bg-blue-50 rounded-lg p-6 text-center hover:border-blue-300 cursor-pointer w-full">
                <UploadIcon className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600 font-medium">Upload from your computer</p>
                <p className="text-xs text-gray-500 mt-1">or drag and drop</p>
              </div>

              <div className="flex items-start justify-start mt-3">
                <label className="flex items-center gap-2 text-sm text-gray-700">
                  <input type="checkbox" className="rounded border-gray-300 w-[21px] h-[21px]" />
                  <span className="text-[#5A687C] text-[14px] leading-[23.8px]">Post photos as a PDF document</span>
                </label>
              </div>
            </div>
          </div>

          {/* Bottom Toolbar */}
          <div className="flex flex-row items-center" style={{ width: "140px", height: "20px", gap: "4px" }}>
            <button className="p-2 rounded">
              <Edit3 className="w-4 h-4" />
            </button>
            <button className="p-2 rounded">
              <Camera className="w-4 h-4" />
            </button>
            <button className="p-2 rounded">
              <Link className="w-4 h-4" />
            </button>
            <button className="p-2 rounded">
              <Trash2 className="w-4 h-4" />
            </button>
            <button className="p-2 rounded">
              <Settings className="w-4 h-4" />
            </button>
          </div>

          {/* Action Buttons at the bottom */}
          <div className="flex flex-row justify-center items-center gap-[9px] border-t border-[#E1E4EA] w-full min-h-[88px] absolute bottom-0 left-0 right-0 p-[25px] box-border bg-white">
            <button className="flex flex-row items-center justify-center gap-[10px] w-[79px] h-[38px] rounded-[7px] border-[1.5px] px-[20px] py-[7px] text-[#5A687C] bg-[#FFFFFF] font-medium">
              Draft
            </button>
            <button className="flex flex-row items-center justify-center gap-[10px] min-w-[96px] min-h-[38px] rounded-[7px] border-[1.5px] border-[#5F58E8] px-[20px] py-[7px] text-[#675FFF] bg-transparent font-medium">
              Publish
            </button>
            <button className="flex flex-row items-center justify-center gap-[10px] min-w-[112px] min-h-[38px] rounded-[7px] border-[1.5px] border-[#5F58E8] px-[20px] py-[7px] text-[#FFFFFF] bg-[#675FFF] font-medium">
              Schedule
            </button>
          </div>
        </div>

        {/* Right Post Preview */}
        <div className="w-[287px] h-[726px] bg-white border-l border-[#E1E4EA] rounded-tr-[16px] rounded-br-[16px] p-4 flex flex-col">
          <div className="flex flex-col gap-[14px] w-full mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Post Preview</label>
              <div className="relative w-full h-[44px]">
                <select className="w-full h-full border border-gray-300 px-3 py-2 rounded-md appearance-none bg-white text-gray-700">
                  <option>Linkedin</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Preview Content */}
          <div className="flex-1 flex  ">
            <img
              src={inkartinkLogo}
              alt="INKARTINK Logo"
              className="w-[260px] h-[234px] rounded-md object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
