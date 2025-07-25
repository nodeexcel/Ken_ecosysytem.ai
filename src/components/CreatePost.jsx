import { X, ChevronDown, Hash, Settings, Edit3, Camera, Link, Trash2, UploadIcon } from "lucide-react"
import inkartinkLogo from '../assets/svg/inkartink.svg';
import { useTranslation } from "react-i18next";
import DateTimePicker from "./DateTimePicker";
import { useState, useRef, useEffect } from "react";
import { publishContent, saveDraftContent, scheduleContent } from '../api/contentCreationAgent';
import { getInstaAccounts } from '../api/brainai';
import { SelectDropdown } from "./Dropdown";

export default function CreatePost({ onClose }) {
  const { t } = useTranslation();
  const [showDateTimePicker, setShowDateTimePicker] = useState(false);
  // State for required fields
  const [text, setText] = useState("");
  const [document, setDocument] = useState(null); // base64 string
  const [platform, setPlatform] = useState("");
  const [selectedAccount, setSelectedAccount] = useState(""); // New state for selected account
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef();
  const [fileName, setFileName] = useState("");
  // State for Instagram accounts
  const [instaAccounts, setInstaAccounts] = useState([]);
  const [instaLoading, setInstaLoading] = useState(false);
  const [instaError, setInstaError] = useState(null);
  const textInputRef = useRef(); // Add ref for text input
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Fetch Instagram accounts when platform is 'instagram'
  useEffect(() => {
    if (platform === "instagram") {
      setInstaLoading(true);
      setInstaError(null);
      const fetchAccounts = async () => {
        try {
          const accounts = await getInstaAccounts();
          console.log("Fetched insta accounts:", accounts);
          const arr = Array.isArray(accounts?.data?.insta_account_info) ? accounts.data?.insta_account_info : [];
          
          setInstaAccounts(arr);
        } catch (err) {
          setInstaError("Failed to fetch Instagram accounts");
        } finally {
          setInstaLoading(false);
        }
      };
      fetchAccounts();
    } else {
      setInstaAccounts([]);
    }
  }, [platform]);

  // Handle file upload and convert to base64
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    // Only allow webp/jpeg/png/pdf
    if (!['image/webp', 'image/jpeg', 'image/png', 'application/pdf'].includes(file.type)) {
      setErrors({ document: 'Only webp, jpeg, png images or pdf files are allowed.' });
      return;
    }
    setFileName(file.name);
    const reader = new FileReader();
    reader.onloadend = () => {
      setDocument(file); // base64 string only
      if (errors.document) setErrors(prev => ({ ...prev, document: undefined }));
    };
    reader.readAsDataURL(file);
  };

  // Drag and drop handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };
  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange({ target: { files: e.dataTransfer.files[0] } });
    }
  };
  const handleUploadAreaClick = () => {
    fileInputRef.current.click();
  };

  // Helper to determine media_type from file
  const getMediaType = (file) => {
    if (!file) return '';
    if (file.type.startsWith('image/')) return 'image';
    if (file.type.startsWith('video/')) return 'video';
    if (file.type === 'application/pdf') return 'pdf';
    return '';
  };

  // Handle Draft button click
  const handleSaveDraft = async () => {
    setIsSaving(true);
    let newErrors = {};
    if (!text) newErrors.text = 'Post text is required.';
    if (!platform) newErrors.platform = 'Platform is required.';
    if (platform === "instagram" && !selectedAccount) newErrors.selectedAccount = 'Account is required.';
    if (!document) newErrors.document = 'File/Image is required.';
    setErrors(newErrors);
    setIsSaving(false);
    if (Object.keys(newErrors).length > 0) return;
    try {
      const payload = {
        text,
        document,
        platform,
        ...(platform === "instagram" ? { platform_unique_id: selectedAccount } : {}),
        media_type: getMediaType(document),
      };
      await saveDraftContent(payload);
      // Optionally show a success message or close modal
    } catch (err) {
      setErrors({ general: 'Failed to save draft' });
    } finally {
      setIsSaving(false);
    }
  };
  const handlePublish = async () => {
    setIsSaving(true);
    setSuccessMessage("");
    setErrorMessage("");
    let newErrors = {};
    if (!text) newErrors.text = 'Post text is required.';
    if (!platform) newErrors.platform = 'Platform is required.';
    if (platform === "instagram" && !selectedAccount) newErrors.selectedAccount = 'Account is required.';
    if (!document) newErrors.document = 'File/Image is required.';
    setErrors(newErrors);
    setIsSaving(false);
    if (Object.keys(newErrors).length > 0) return;
    try {
      const payload = {
        text,
        document,
        platform,
        ...(platform === "instagram" ? { platform_unique_id: selectedAccount } : {}),
        media_type: getMediaType(document),
      };
      const response = await publishContent(payload);
      console.log("responseddddddd", response);
      if (response?.status === 201) {
        setSuccessMessage(response?.data?.success);
        setErrorMessage("");
      } else if (response?.status === 400) {
        setErrorMessage(response?.response?.data?.error);
        setSuccessMessage("");
      }
    } catch (err) {
      setErrors({ general: 'Failed to publish' });
    } finally {
      setIsSaving(false);
    }
  };
  const handleSchedule = async (scheduledDate, scheduledTime) => {
    setIsSaving(true);
    let newErrors = {};
    if (!text) newErrors.text = 'Post text is required.';
    if (!platform) newErrors.platform = 'Platform is required.';
    if (platform === "instagram" && !selectedAccount) newErrors.selectedAccount = 'Account is required.';
    if (!document) newErrors.document = 'File/Image is required.';
    setErrors(newErrors);
    setIsSaving(false);
    if (Object.keys(newErrors).length > 0) return;
    try {
      let [hours, minutes] = scheduledTime.replace(/\s/g, '').split(':');
      if (!minutes && hours) {
        [hours, minutes] = scheduledTime.split(' : ');
      }
      hours = parseInt(hours, 10);
      minutes = parseInt(minutes, 10);
      const scheduledDateObj = new Date(scheduledDate);
      scheduledDateObj.setHours(hours);
      scheduledDateObj.setMinutes(minutes);
      scheduledDateObj.setSeconds(0);
      scheduledDateObj.setMilliseconds(0);
      const scheduledTimeUTC = scheduledDateObj.toISOString();
      const payload = {
        text,
        document,
        platform,
        ...(platform === "instagram" ? { platform_unique_id: selectedAccount } : {}),
        scheduled_date: scheduledDate,
        scheduled_time: scheduledTime,
        media_type: getMediaType(document),
      };
      await scheduleContent(payload);
    } catch (err) {
      setErrors({ general: 'Failed to schedule' });
    } finally {
      setIsSaving(false);
    }
  };
  // Toolbar button handlers
  const handleEditClick = () => {
    if (textInputRef.current) textInputRef.current.focus();
  };
  const handleCameraClick = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };
  const handleLinkClick = () => {
    const url = window.prompt('Enter URL to insert:');
    if (url) {
      // Insert at cursor or append
      setText(prev => prev + ' ' + url);
    }
  };
  const handleTrashClick = () => {
    setText("");
    setDocument(null);
    setFileName("");
  };
  const handleSettingsClick = () => {
    window.alert('Settings clicked! (Implement settings modal here)');
  };
  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-row items-center justify-between h-[38px]">
        <h1 className="text-2xl font-semibold text-gray-900">{t("scheduler")}</h1>
        <button className="p-2 hover:bg-gray-100 rounded-full" onClick={onClose}>
          <X className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      {/* Main Content with Horizontal Scroll for Small Screens */}
      <div className="w-full overflow-x-auto">
        <div className="flex w-full min-w-[1000px] h-[726px]  mx-auto rounded-[16px] border border-[#E1E4EA] bg-white">
          {/* Left Sidebar */}
          <div className="w-[218px] h-[726px] bg-white border-r border-r-[#E1E4EA] border-t border-t-[#ffffff] border-b border-b-[#ffffff] border-l border-l-[#ffffff] rounded-l-[16px] flex flex-col relative p-4 min-h-[600px]">
            <div>
              <div className="flex flex-col w-[184px] max-h-[70px] gap-[6px] absolute top-[0px] left-[16px]">
                {/* Select Platform */}
                <div className="mb-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Select Platform</label>
                  <div className="relative mb-4">
                    <SelectDropdown
                      name="platform"
                      options={[
                        { key: "linkedin", label: "Linkedin" },
                        { key: "X", label: "Twitter" },
                        { key: "instagram", label: "Instagram" },
                        // Add more platforms as needed
                      ]}
                      value={platform}
                      onChange={val => {
                        setPlatform(val);
                        if (errors.platform) setErrors(prev => ({ ...prev, platform: undefined }));
                      }}
                      placeholder="Select Platform"
                      className={`w-full rounded-md ${errors.platform ? 'border border-red-500' : ''}`}
                    />
                    {errors.platform && <div className="text-red-500 text-xs mt-1">{errors.platform}</div>}
                  </div>
                </div>
                {/* Select Account */}
                <div className="mb-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Select Account</label>
                  <div className="relative mb-4">
                    {/*
                      The following static options are used for demo purposes only.
                      The dynamic code for fetching/displaying real Instagram accounts is commented below and can be restored later.
                    */}
                    
                    {/* // Uncomment this block to use dynamic Instagram accounts: */}
                    <SelectDropdown
                      name="account"
                      options={
                        platform === "instagram"
                          ? instaLoading
                            ? [{ key: '', label: 'Loading...' }]
                            : instaAccounts.length > 0
                              ? [
                                  { key: '', label: 'Select' },
                                  ...instaAccounts.map(acc => ({
                                    key: acc.instagram_user_id,
                                    label: acc.username
                                  }))
                                ]
                              : [{ key: '', label: 'No accounts found' }]
                          : [{ key: '', label: 'Select' }]
                      }
                      value={selectedAccount}
                      onChange={val => {
                        setSelectedAccount(val);
                        if (errors.selectedAccount) setErrors(prev => ({ ...prev, selectedAccount: undefined }));
                      }}
                      disabled={platform !== "instagram" || instaLoading}
                      className={`w-full ${errors.selectedAccount ? 'border border-red-500' : ''}`}
                    />
                    {instaError && <div className="text-red-500 text-xs mt-1">{instaError}</div>}
                    {errors.selectedAccount && <div className="text-red-500 text-xs mt-1">{errors.selectedAccount}</div>}
                  </div>
                </div>
                {/* Platform Unique ID */}
                {/* Removed this entire block for Platform Unique ID input */}
                {/* Existing account display and remove button */}
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
                value={text}
                onChange={e => {
                  setText(e.target.value);
                  if (errors.text) setErrors(prev => ({ ...prev, text: undefined }));
                }}
                className={`w-full h-[48px] font-normal text-[16px] leading-[18.4px] tracking-[0] text-[#5A687C] rounded-md px-4 mb-4 ${errors.text ? 'border border-red-500' : ''}`}
                placeholder="Enter post text *"
                style={{ fontWeight: 400, fontStyle: "normal", letterSpacing: 0 }}
                ref={textInputRef} // Add ref here
              />
              {errors.text && <div className="text-red-500 text-xs mb-2">{errors.text}</div>}

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
                <label className="block text-sm font-medium text-gray-700 mb-2">Upload File / Images (webp, jpeg, png, pdf) *</label>
                <input
                  type="file"
                  accept="image/webp,image/jpeg,image/png,application/pdf"
                  onChange={handleFileChange}
                  className="mb-2 hidden"
                  ref={fileInputRef}
                />
                <div
                  className={`border-2 border-dashed ${dragActive ? 'border-blue-400 bg-blue-100' : errors.document ? 'border-red-500 bg-red-50' : 'border-blue-200 bg-blue-50'} rounded-lg p-6 text-center hover:border-blue-300 cursor-pointer w-full`}
                  onClick={handleUploadAreaClick}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  role="button"
                  tabIndex={0}
                >
                  <UploadIcon className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 font-medium">Upload from your computer</p>
                  <p className="text-xs text-gray-500 mt-1">or drag and drop</p>
                </div>
                {fileName && (
                  <div className="text-xs text-gray-700 mt-2">Selected file: <span className="font-medium">{fileName}</span></div>
                )}
                {errors.document && <div className="text-red-500 text-xs mt-1">{errors.document}</div>}
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
              <button className="p-2 cursor-pointer rounded" onClick={handleEditClick}>
                <Edit3 className="w-4 h-4" />
              </button>
              <button className="p-2 cursor-pointer rounded" onClick={handleCameraClick}>
                <Camera className="w-4 h-4" />
              </button>
              <button className="p-2 cursor-pointer rounded" onClick={handleLinkClick}>
                <Link className="w-4 h-4" />
              </button>
              <button className="p-2 cursor-pointer rounded" onClick={handleTrashClick}>
                <Trash2 className="w-4 h-4" />
              </button>
              <button className="p-2 cursor-pointer rounded" onClick={handleSettingsClick}>
                <Settings className="w-4 h-4" />
              </button>
            </div>

            {/* Action Buttons at the bottom */}
            <div className="flex flex-row justify-center items-center gap-[9px] border-t border-[#E1E4EA] w-full min-h-[88px] absolute bottom-0 left-0 right-0 p-[25px] box-border bg-white">
              <button className="flex flex-row items-center justify-center gap-[10px] w-[79px] h-[38px] rounded-[7px] border-[1.5px] px-[20px] py-[7px] text-[#5A687C] bg-[#FFFFFF] font-medium" onClick={handleSaveDraft} disabled={isSaving}>
                {isSaving ? 'Saving...' : 'Draft'}
              </button>
              <button onClick={handlePublish} disabled={isSaving}  className="flex flex-row items-center justify-center gap-[10px] min-w-[96px] min-h-[38px] rounded-[7px] border-[1.5px] border-[#5F58E8] px-[20px] py-[7px] text-[#675FFF] bg-transparent font-medium">
                Publish
              </button>
              <button  className="flex flex-row items-center justify-center gap-[10px] min-w-[112px] min-h-[38px] rounded-[7px] border-[1.5px] border-[#5F58E8] px-[20px] py-[7px] text-[#FFFFFF] bg-[#675FFF] font-medium" onClick={() => setShowDateTimePicker(true)}>
                Schedule
              </button>
            </div>
            {successMessage && <div className="text-green-600 text-sm mt-2 text-center">{successMessage}</div>}
            {errorMessage && <div className="text-red-600 text-sm mt-2 text-center">{errorMessage}</div>}
            {errors.general && <div className="text-red-500 text-sm mt-2">{errors.general}</div>}
          </div>

          {/* Right Post Preview */}
          <div className="w-[287px] h-[726px] bg-white border-l border-[#E1E4EA] rounded-tr-[16px] rounded-br-[16px] p-4 flex flex-col">
            <div className="flex flex-col gap-[14px] w-full mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Post Preview</label>
                <div className="relative w-full h-[44px]">
                  <SelectDropdown
                    name="platform-preview"
                    options={[
                      { key: "", label: "Select Platform" },
                      { key: "linkedin", label: "Linkedin" },
                      // Add more platforms as needed
                    ]}
                    value={platform}
                    onChange={setPlatform}
                    placeholder="Select Platform"
                    className="w-full"
                  />
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
              {/* Removed Platform Unique ID input from here */}
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
      {showDateTimePicker && (
        <DateTimePicker 
          onClose={() => setShowDateTimePicker(false)}
          onSchedule={(date, time) => {
            setShowDateTimePicker(false);
            handleSchedule(date, time);
          }}
        />
      )}
    </div>
  )
}
