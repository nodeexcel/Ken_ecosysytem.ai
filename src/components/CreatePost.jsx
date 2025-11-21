import { X, ChevronDown, Hash, Settings, Edit3, Camera, Link, Trash2, UploadIcon, Tag, CircleX, StarsIcon, SquarePen, Image, Share2, Heart, MessageCircle, Send, Bookmark, MoreHorizontal } from "lucide-react"
import inkartinkLogo from '../assets/svg/inkartink.svg';
import { useTranslation } from "react-i18next";
import DateTimePicker from "./DateTimePicker";
import { useState, useRef, useEffect } from "react";
import { publishContent, saveDraftContent, scheduleContent, editScheduledContent } from '../api/contentCreationAgent';
import { getInstaAccounts, getLinkedInAccounts } from '../api/brainai';
import { SelectDropdown } from "./Dropdown";
import { Duplicate } from "../icons/icons";
import instagram from '../assets/svg/instagram.svg'
import linkedin from '../assets/svg/linkedin.svg'
import twitter from '../assets/svg/twitter.svg'
import ImageUpload from '../assets/svg/images 2, photos, pictures, shot.svg'
import Bold from '../assets/svg/bold.svg'
import Italic from '../assets/svg/italic.svg'
import Underline from '../assets/svg/underline.svg'
import StrikeThrough from '../assets/svg/strike through.svg'
import Smile from '../assets/svg/smile, emoji.svg'
import Dustbin from '../assets/svg/Frame 427320989.svg'
import VideoClip from '../assets/svg/video clip, film, movie.svg'

export default function CreatePost({ onClose, editData }) {
  const { t } = useTranslation();
  const [showDateTimePicker, setShowDateTimePicker] = useState(false);
  // State for required fields
  const [text, setText] = useState("");
  const [document, setDocument] = useState(null); // base64 string
  const [platform, setPlatform] = useState("");
  const [selectedAccount, setSelectedAccount] = useState(""); // New state for selected account
  const [isSaving, setIsSaving] = useState({ draft: false, publish: false, schedule: false });
  const [errors, setErrors] = useState({});
  const [dragActive, setDragActive] = useState(false);
  const [mediaList, setMediaList] = useState([]);
  const videoRefs = useRef({});
  const [videoStates, setVideoStates] = useState({});
  const fileInputRef = useRef();
  const [fileName, setFileName] = useState("");
  const [preview, setPreview] = useState(null);
  const [previewMediaType, setPreviewMediaType] = useState(null); // 'image' | 'document' | 'video' | null
  // State for Instagram accounts
  const [accountsOptions, setAccountsOptions] = useState([]);
  const [accountsOptionsLoading, setAccountsOptionsLoading] = useState(false);
  const [accountsError, setAccountsError] = useState(null);
  const textInputRef = useRef(); // Add ref for text input
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isChecked, setIsChecked] = useState(false);
  // Prefill when editing existing content
  useEffect(() => {
    if (editData) {
      setText(editData.text || "");
      setPlatform(editData.platform || "");
      setSelectedAccount(editData.platform_unique_id || "");
      if (editData.document) {
        const correctedUrl = editData.document?.includes("amazonaws.comcontent-document")
          ? editData.document.replace("amazonaws.comcontent-document", "amazonaws.com/content-document")
          : editData.document;
        setPreview(correctedUrl);
        setPreviewMediaType(editData.media_type || null);
        const parts = editData.document.split('/');
        setFileName(parts[parts.length - 1] || "");
      }
    }
  }, [editData]);

  // Fetch Instagram accounts when platform is 'instagram'
  useEffect(() => {
    // Clear selected account when platform changes
    setSelectedAccount("");
    
    if (platform === "instagram" || platform === "linkedin") {
      setAccountsOptionsLoading(true);
      setAccountsError(null);
      const fetchAccounts = async () => {
        try {
          const accounts = platform === "instagram" ? await getInstaAccounts() : await getLinkedInAccounts()
          const accountsData = platform === "instagram" ? accounts?.data?.insta_account_info : accounts?.data?.linkedin_account_info;
          setAccountsOptions(accountsData);
        } catch (err) {
          setAccountsError("Failed to fetch Instagram accounts");
        } finally {
          setAccountsOptionsLoading(false);
        }
      };
      fetchAccounts();
    } else {
      setAccountsOptions([]);
    }
  }, [platform]);

  useEffect(() => {
    if (successMessage) {
      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    }
  }, [successMessage])


  const renderOptions = () => {
    if (accountsOptionsLoading) {
      return [{ key: '', label: 'Loading...' }];
    }
    if (accountsOptions?.length > 0) {
      return accountsOptions.map(acc => ({
        key: platform === "instagram" ? acc.instagram_user_id : acc.linkedin_id,
        label: platform === "instagram" ? acc.username : acc.name
      }));
    }
    return [];
  }
  
  const openImagePicker = () => {
  if (!fileInputRef.current) return;
  fileInputRef.current.accept = "image/webp,image/jpeg,image/png";
  fileInputRef.current.click();
};

const openVideoPicker = () => {
  if (!fileInputRef.current) return;
  fileInputRef.current.accept = "video/mp4";
  fileInputRef.current.click();
};

const toggleVideoPlay = (index) => {
  const video = videoRefs.current[index];
  if (!video) return;

  if (video.paused) {
    video.play();
    setVideoStates((prev) => ({ ...prev, [index]: true }));
  } else {
    video.pause();
    setVideoStates((prev) => ({ ...prev, [index]: false }));
  }
};



  const getSelectedAccountLabel = () => {
    const options = renderOptions();
    const match = options.find(opt => opt.key === selectedAccount);
    return match ? match.label : "";
  }

  const renderCaptionWithHashtags = (value) => {
    if (!value) return null;
    const parts = value.split(/(\#[\w\u00C0-\u024F\u1E00-\u1EFF]+)/g);
    return parts.map((part, idx) => {
      if (/^\#[\w\u00C0-\u024F\u1E00-\u1EFF]+$/.test(part)) {
        return <span key={idx} className="text-[#3B82F6]">{part}</span>;
      }
      return <span key={idx}>{part}</span>;
    });
  }

  // Handle file upload and convert to base64
  // const handleFileChange = async (e) => {
  //   const file = e.target.files[0];
  //   if (!file) return;
  //   // Only allow webp/jpeg/png/pdf
  //   if (!['image/webp', 'image/jpeg', 'image/png', 'application/pdf', 'video/mp4'].includes(file.type)) {
  //     setErrors({ document: 'Only webp, jpeg, png images or pdf files are allowed.' });
  //     return;
  //   }
  //   setFileName(file.name);
  //   setDocument(file);
  //   const reader = new FileReader();
  //   reader.onloadend = () => {
  //     setPreview(reader.result); // base64 string only
  //     setPreviewMediaType(getMediaType(file));
  //     if (errors.document) setErrors(prev => ({ ...prev, document: undefined }));
  //   };
  //   reader.readAsDataURL(file);
  // };
  
//   const handleFileChange = (e) => {
//   const file = e.target.files?.[0];
//   if (!file) return;

//   const allowedTypes = [
//     "image/webp",
//     "image/jpeg",
//     "image/png",
//     "application/pdf",
//     "video/mp4",
//   ];

//   if (!allowedTypes.includes(file.type)) {
//     setErrors({
//       document: "Only webp, jpeg, png, pdf, or mp4 files are allowed.",
//     });
//     return;
//   }

//   setFileName(file.name);
//   setDocument(file);

//   const reader = new FileReader();
//   reader.onloadend = () => {
//     setPreview(reader.result);
//     setPreviewMediaType(getMediaType(file));
//     if (errors.document) {
//       setErrors((prev) => ({ ...prev, document: undefined }));
//     }
//   };
//   reader.readAsDataURL(file);
// };

const handleFileChange = (e) => {
  const files = Array.from(e.target.files || []);
  if (!files.length) return;

  const allowedTypes = [
    "image/webp",
    "image/jpeg",
    "image/png",
    "application/pdf",
    "video/mp4",
  ];

  files.forEach((file) => {
    if (!allowedTypes.includes(file.type)) {
      setErrors({
        document: "Only webp, jpeg, png, pdf, or mp4 files are allowed.",
      });
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setMediaList((prev) => [
        ...prev,
        {
          file,
          preview: reader.result,
          type: getMediaType(file),
        }
      ]);
    };
    reader.readAsDataURL(file);
  });

  if (errors.document) {
    setErrors((prev) => ({ ...prev, document: undefined }));
  }
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
    if (!file) return 'text';
    if (file.type.startsWith('image/')) return 'image';
    if (file.type.startsWith('video/')) return 'video';
    if (file.type === 'application/pdf') return 'document';
    return '';
  };

  // Handle Draft button click
  const handleSaveDraft = async () => {
    let newErrors = {};
    if (!text) newErrors.text = `${t("constance.post_text") + " " + t("is_required")}`;
    if (!platform) newErrors.platform = `${t("constance.platform") + " " + t("is_required")}`;
    if (!selectedAccount) newErrors.selectedAccount = `${t("constance.account") + " " + t("is_required")}`;
    if (platform === "instagram" && !document && !(editData && editData.document)) newErrors.document = `${t("brain_ai.upload_file_images_placeholder") + " " + t("is_required")}`;
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;
    try {
      setIsSaving((prev) => ({ ...prev, draft: true }));
      // If editing an existing Draft/Scheduled item, call edit API only (no fall-through)
      if (editData) {
        const contentId = editData?.scheduled_content_id || editData?.content_id || editData?.id;
        if (!contentId) {
          setErrors({ general: 'Missing content ID for editing' });
          setIsSaving((prev) => ({ ...prev, draft: false }));
          return;
        }
        const payload = {
          text,
          document,
          platform,
          platform_unique_id: selectedAccount,
          media_type: getMediaType(document),
        };
        const response = await editScheduledContent(contentId, payload);
        if (response?.status === 200) {
          setText("");
          setDocument(null);
          setFileName("");
          setSelectedAccount("");
          setPlatform("");
          if (fileInputRef.current) fileInputRef.current.value = '';
          setIsSaving((prev) => ({ ...prev, draft: false }));
          if (typeof onClose === 'function') onClose('success');
        } else {
          setErrors({ general: response?.response?.data?.error || 'Failed to edit draft' });
          setIsSaving((prev) => ({ ...prev, draft: false }));
        }
        return;
      }
      const payload = {
        text,
        document,
        platform,
        platform_unique_id: selectedAccount,
        media_type: getMediaType(document),
      };
      const response = await saveDraftContent(payload);
      if (response?.status === 201) {
        setText("");
        setDocument(null);
        setFileName("");
        setSelectedAccount("");
        setPlatform("");
        fileInputRef.current.value = '';
        setIsSaving((prev) => ({ ...prev, draft: false }));
      } else {
        setIsSaving((prev) => ({ ...prev, draft: false }));
      }
    } catch (err) {
      setErrors({ general: 'Failed to save draft' });
      setIsSaving((prev) => ({ ...prev, draft: false }));
    }
  };
  const handlePublish = async () => {
    setSuccessMessage("");
    setErrorMessage("");
    let newErrors = {};
    if (!text) newErrors.text = `${t("constance.post_text") + " " + t("is_required")}`;
    if (!platform) newErrors.platform = `${t("constance.platform") + " " + t("is_required")}`;
    if (!selectedAccount) newErrors.selectedAccount = `${t("constance.account") + " " + t("is_required")}`;
    if (platform === "instagram" && !document && !(editData && editData.document)) newErrors.document = `${t("brain_ai.upload_file_images_placeholder") + " " + t("is_required")}`;
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;
    try {
      setErrorMessage("");
      setIsSaving((prev) => ({ ...prev, publish: true }));
      const payload = {
        text,
        document,
        platform,
        platform_unique_id: selectedAccount,
        media_type: getMediaType(document),
      };
      const response = await publishContent(payload);
      if (response?.status === 201) {
        setSuccessMessage(response?.data?.success);
        setText("");
        setDocument(null);
        setFileName("");
        setSelectedAccount("");
        setPlatform("");
        fileInputRef.current.value = '';
        setIsSaving((prev) => ({ ...prev, publish: false }));
      }
      else {
        setErrorMessage(response?.response?.data?.error);
        setSuccessMessage("");
        setIsSaving((prev) => ({ ...prev, publish: false }));
      }
    } catch (err) {
      setIsSaving((prev) => ({ ...prev, publish: false }));
      setErrors({ general: 'Failed to publish' });
    }
  };
  const handleSchedule = async (scheduledDate, scheduledTime) => {
    let newErrors = {};
    if (!text) newErrors.text = `${t("constance.post_text") + " " + t("is_required")}`;
    if (!platform) newErrors.platform = `${t("constance.platform") + " " + t("is_required")}`;
    if (!selectedAccount) newErrors.selectedAccount = `${t("constance.account") + " " + t("is_required")}`;
    if (platform === "instagram" && !document && !(editData && editData.document)) newErrors.document = `${t("brain_ai.upload_file_images_placeholder") + " " + t("is_required")}`;
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;
    try {
      setIsSaving((prev) => ({ ...prev, schedule: true }));
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
      // If editing an existing Draft/Scheduled item, call edit API only (no fall-through)
      if (editData) {
        const contentId = editData?.scheduled_content_id || editData?.content_id || editData?.id;
        if (!contentId) {
          setErrors({ general: 'Missing content ID for editing' });
          setIsSaving((prev) => ({ ...prev, schedule: false }));
          return;
        }
        const payload = {
          text,
          document,
          platform,
          scheduled_date: scheduledDate,
          scheduled_time: scheduledTime,
          platform_unique_id: selectedAccount,
          media_type: getMediaType(document),
        };
        const response = await editScheduledContent(contentId, payload);
        if (response?.status === 200) {
          setText("");
          setDocument(null);
          setFileName("");
          setSelectedAccount("");
          setPlatform("");
          if (fileInputRef.current) fileInputRef.current.value = '';
          setIsSaving((prev) => ({ ...prev, schedule: false }));
          if (typeof onClose === 'function') onClose('success');
        } else {
          setErrors({ general: response?.response?.data?.error || 'Failed to edit schedule' });
          setIsSaving((prev) => ({ ...prev, schedule: false }));
        }
        return;
      }
      const payload = {
        text,
        document,
        platform,
        scheduled_date: scheduledDate,
        scheduled_time: scheduledTime,
        platform_unique_id: selectedAccount,
        media_type: getMediaType(document),
      };
      const response = await scheduleContent(payload);
      if (response?.status === 201) {
        setText("");
        setDocument(null);
        setFileName("");
        setSelectedAccount("");
        setPlatform("");
        fileInputRef.current.value = '';
        setIsSaving((prev) => ({ ...prev, schedule: false }));
      } else {
        setIsSaving((prev) => ({ ...prev, schedule: false }));
      }
    } catch (err) {
      setErrors({ general: 'Failed to schedule' });
      setIsSaving((prev) => ({ ...prev, schedule: false }));
    }
  };
  // Toolbar button handlers
  const handleEditClick = () => {
    if (textInputRef.current) textInputRef.current.focus();
  };
  const handleCameraClick = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleTrashClick = () => {
    setText("");
    setDocument(null);
    setFileName("");
    setPreview(null);

  };

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      {/* <div className="flex flex-row items-center justify-between h-[38px]">
        <h1 className="text-2xl font-semibold text-gray-900">{t("constance.scheduler") + ' > ' + (editData ? t("edit") : t("brain_ai.create"))}</h1>
        <button className="p-2 hover:bg-gray-100 rounded-full cursor-pointer" onClick={onClose}>
          <X className="w-5 h-5 text-gray-500" />
        </button>
      </div> */}
      <div className="flex  flex-col md:flex-row justify-between max-h-[32px] items-center">
        <h1 className="font-medium text-[16px] md:text-[24px]">{t("constance.create_scheduler")}</h1>
        <div className="flex flex-row gap-2.5 h-full">
          <button
          onClick={onClose} 
          className="min-w-16 rounded-[8px] px-[10px] py-[6px] gap-[10px] items-center text-center text-[13px] font-font-medium bg-[#FFFFFF] border-[0.5px] border-[#00000029] cursor-pointer">{t("constance.cancel")}</button>
          <button
            className={`min-w-16 rounded-[8px] px-[10px] py-[6px] gap-[10px] items-center text-center text-[13px] font-font-medium bg-[#FFFFFF] border-[0.5px] border-[#00000029] ${isSaving?.draft ? 'cursor-not-allowed' : 'cursor-pointer'}`}
            onClick={handleSaveDraft} disabled={isSaving?.draft}
          >
            {isSaving?.draft ? (
              <div className="flex items-center justify-center gap-2">
                <p>{t("processing")}</p>
                <span className="loader" />
              </div>
            ) : (
              t("emailings.save_as_draft")
            )}
          </button>

          <button  className="min-w-16 rounded-[8px] px-[10px] py-[6px] gap-[10px] items-center text-center text-white text-[13px] text-wh font-font-medium bg-[#675FFF] border-[0.5px] border-[#00000029] cursor-pointer"
          onClick={() => setShowDateTimePicker(true)}
          >{t("schedule")}</button>
        </div>
      </div>

      {/* Main Content with Horizontal Scroll for Small Screens */}
      <div className="w-full overflow-x-auto">
        <div className="flex flex-col lg:flex-row w-full mx-auto border-[0.5px] rounded-[12px] border-[#D6D6D6] bg-[#F7F7F8] min-w-0 overflow-hidden"> {/* Added overflow-hidden */}
          {/* Left Sidebar */}
          <div className="w-full lg:w-[248px] bg-[#FFFFFF] border-b lg:border-b-0 lg:border border-[#00000029] flex flex-col relative px-4 pt-4 pb-6 gap-4 rounded-tl-[12px] rounded-tr-[12px] lg:rounded-tr-none lg:rounded-bl-[12px]">
            {/* <div> */}
            <div className="flex flex-col pt-3 w-full lg:w-[184px] max-h-auto lg:max-h-[70px] gap-[6px] relative lg:absolute top-[0px] left-0 lg:left-[16px]">
              {/* Select Platform */}
              <div className="mb-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">{t("select") + " " + t("constance.platform")}</label>
                <div className="relative mb-4">
                  <SelectDropdown
                    name="platform"
                    options={[
                      { key: "linkedin", label: "Linkedin" },
                      { key: "X", label: "Twitter" },
                      { key: "instagram", label: "Instagram" },
                    ]}
                    value={platform}
                    onChange={val => {
                      setPlatform(val);
                      if (errors.platform) setErrors(prev => ({ ...prev, platform: undefined }));
                    }}
                    placeholder={t("select") + " " + t("constance.platform")}
                    className={`w-full`}
                    errors={errors}
                  />
                  {errors.platform && <div className="text-red-500 text-xs mt-1">{errors.platform}</div>}
                </div>
              </div>
              {/* Select Account */}
              <div className="mb-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">{t("select") + " " + t("constance.account")}</label>
                <div className="relative mb-4">
                  {/*
                      The following static options are used for demo purposes only.
                      The dynamic code for fetching/displaying real Instagram accounts is commented below and can be restored later.
                    */}

                  {/* // Uncomment this block to use dynamic Instagram accounts: */}
                  <SelectDropdown
                    name="selectedAccount"
                    options={
                      renderOptions()
                    }
                    value={selectedAccount}
                    onChange={val => {
                      setSelectedAccount(val);
                      if (errors.selectedAccount) setErrors(prev => ({ ...prev, selectedAccount: undefined }));
                    }}
                    // disabled={platform !== "instagram" || accountsOptionsLoading}
                    className={`w-full`}
                    placeholder={t("select") + " " + t("constance.account")}
                    errors={errors}
                  />
                  {accountsError && <div className="text-red-500 text-xs mt-1">{accountsError}</div>}
                  {errors.selectedAccount && <div className="text-red-500 text-xs mt-1">{errors.selectedAccount}</div>}
                </div>
              </div>
              {/* Platform Unique ID */}
              {/* Removed this entire block for Platform Unique ID input */}
              {/* Existing account display and remove button */}
              <div className="flex flex-row items-center gap-[6px]  rounded-lg p-2 w-full mt-2">
               <div className="flex flex-row items-center gap-2 bg-[#F0EFFF] p-1 rounded-lg">
                  <div className="w-6 h-6 rounded flex items-center justify-center">
                    {platform === "instagram" ? (
                      <img src={instagram} alt="Instagram" className="w-6 h-6" />
                    ) : platform === "X" ? (
                      <img src={twitter} alt="X / Twitter" className="w-6 h-6" />
                    ) : (
                      <img src={linkedin} alt="LinkedIn" className="w-6 h-6" />
                    )}
                  </div>
                </div>
                <div className="flex-1">
                  <span className="font-semibold text-[14px] leading-[17px] tracking-[0] text-black flex-1">
                    Ecosysteme.ai
                  </span>
                </div>
                <button className="text-gray-400 hover:text-red-500">
                  <X className="w-4 h-4" />
                </button>
              </div>
              
               <button className=" flex flex-inline h-8 text-[13px] text-[#0A0D14] text-center font-medium border-[0.5px] border-[#00000029] rounded-[8px] py-[6px] px-[10px] gap-[6px] justify-center items-center bg-white">
                 <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M8.00008 4.6665V7.99984M8.00008 7.99984V11.3332M8.00008 7.99984H4.66675M8.00008 7.99984H11.3334" stroke="#0A0D14" strokeWidth="1.5" strokeLinecap="round"/>
</svg>
<span>{t("constance.add") + " " + t("constance.account")}</span>
              </button>
              {/* </div> */}
            </div>

            {/* Add Account button with border styling - positioned to match Draft buttons exactly */}
            {/* <div className="absolute bottom-0 left-0 right-0 border-t border-[#E1E4EA] min-h-[88px] p-[25px] bg-white flex items-center">
              <button className="w-full  text-sm text-[#5A687C] text-center font-medium border border-gray-200 rounded-md py-2 bg-white">
                {t("constance.add") + " " + t("constance.account")}
              </button>
            </div> */}
          </div>

          {/* Center Post Creation */}
          <div className="flex w-full flex-col gap-[16px] bg-[#FFFFFF] border-[#D6D6D6] px-4 lg:px-6 py-4 h-auto lg:h-[685px] border-b-[0.5px] relative rounded-bl-[12px] rounded-br-[12px] lg:rounded-bl-none lg:rounded-tr-[12px] lg:rounded-br-[12px]">
            {/* Post Header */}
            {/* <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="flex flex-row items-center gap-2 bg-[#F0EFFF] p-1 rounded-lg">
                  <div className="w-8 h-8 rounded flex items-center justify-center">
                    {platform === "instagram" ? (
                      <img src={instagram} alt="Instagram" className="w-8 h-8" />
                    ) : platform === "X" ? (
                      <img src={twitter} alt="X / Twitter" className="w-8 h-8" />
                    ) : (
                      <img src={linkedin} alt="LinkedIn" className="w-8 h-8" />
                    )}
                  </div>
                </div>

              </div>
              <div className="flex items-center gap-2">
                <div className="flex flex-row items-center gap-[6px] w-[178px] h-[27px]">
                  <button className="flex flex-row items-center gap-[4px] w-[103px] h-[27px] rounded-[4px] border border-[#E1E4EA] px-[10px] py-[6px] text-xs text-gray-600 hover:text-gray-800 bg-white">
                    <Tag className="w-3 h-3" />
                    {t("constance.add") + " " + t("constance.labels")}
                  </button>
                  <button className="flex flex-row items-center gap-[4px] w-[69px] h-[27px] rounded-[4px] border border-[#E1E4EA] px-[10px] py-[6px] text-xs text-gray-600 hover:text-gray-800 bg-white">
                    <CircleX className="w-3 h-3" />
                    {t("constance.clear")}
                  </button>
                </div>
              </div>
            </div> */}
            <h1 className="text-[16px] font-medium">{t("brain_ai.post_details")}</h1>
            {/* Action Buttons */}
            <div className="flex flex-col h-full p-4 lg:p-[24px] w-full rounded-[10px] border border-[#00000029] gap-[16px] justify-between">
              {/* <input
                type="text"
                value={text}
                onChange={e => {
                  setText(e.target.value);
                  if (errors.text) setErrors(prev => ({ ...prev, text: undefined }));
                }}
                className={`w-full pl-3 h-[48px] font-normal text-[16px] focus:outline-none focus:border focus:border-[#675FFF] text-[#5A687C] rounded-md  mb-4 ${errors.text ? 'border border-red-500' : ''}`}
                placeholder={t("constance.post_text")}
                style={{ fontWeight: 400, fontStyle: "normal", letterSpacing: 0 }}
                ref={textInputRef}
              />
              {errors.text && <div className="text-red-500 text-xs mb-2">{errors.text}</div>} */}

              {/* <div className="flex flex-row items-center justify-between w-full h-[27px] mb-4"> */}
              {/* <div className="flex flex-row items-center w-[218px] h-[27px] gap-[6px]">
                  <button
                    className="flex items-center gap-[4px] rounded-[4px] border border-[#E1E4EA] px-[10px] py-[6px] text-xs text-gray-600 hover:text-gray-800 bg-white"
                    style={{ width: "94px", height: "27px" }}
                  >
                    <Hash className="w-3 h-3" />
                    {t("constance.hastags")}
                  </button>
                  <button
                    className="flex items-center gap-[4px] rounded-[4px] border border-[#E1E4EA] px-[10px] py-[6px] text-xs text-gray-600 hover:text-gray-800 bg-white"
                    style={{ width: "118px", height: "27px" }}
                  >
                    <StarsIcon className="w-3 h-3" />
                    {t("constance.ai_assistance")}
                  </button>
                </div> */}
              <div className="space-y-[20px]">
                <div className="flex flex-row items-center gap-3 lg:gap-[16px] max-h-[16px]">
                  <button className="flex items-center justify-center w-[16px]">
                    <img src={Bold} />
                  </button>
                  <button className="flex items-center justify-center w-[16px]">
                    <img src={Italic} />
                  </button>
                  <button className="flex items-center justify-center w-[16px]">
                    <img src={Underline} />
                  </button>
                  <button className="flex items-center justify-center w-[16px]">
                    <img src={StrikeThrough} />
                  </button>
                  <button className="flex items-center justify-center w-[16px]">
                    <img src={Smile} />
                  </button>
                </div>
                {/* </div> */}

                <textarea
                  type="text"
                  value={text}
                  onChange={e => {
                    setText(e.target.value);
                    if (errors.text) setErrors(prev => ({ ...prev, text: undefined }));
                  }}
                  className={`w-full max-h-[176px] gap-[8px] px-1 mt-4 border-0 h-full scrollbar-none text-[14px] tracking-[-0.02em] ${errors.text ? 'border border-red-500' : 'border-0'}`}
                  placeholder={t("constance.post_text")}
                  ref={textInputRef}
                />
                {errors.text && <div className="text-red-500 text-xs mb-2">{errors.text}</div>}

                {/* Uploaded Media Thumbnails */}
                {mediaList.length > 0 && (
                  <div className="w-full flex flex-wrap gap-2 lg:gap-4 mt-2">
                    {mediaList.map((item, index) => (
                      <div
                        key={index}
                        className="relative"
                        style={{
                          width: "120px lg:160px",
                          height: "80px lg:100px",
                          borderRadius: "4px",
                          overflow: "hidden",
                          position: "relative",
                        }}
                      >
                        {/* IMAGE */}
                        {item.type === "image" && (
                          <img
                            src={item.preview}
                            alt="preview"
                            className="w-full h-full object-cover"
                          />
                        )}

                        {/* VIDEO */}
                        {item.type === "video" && (
                          <div className="w-full h-full relative">
                            <video
                              src={item.preview}
                              className="w-full h-full object-cover"
                              muted
                              loop
                              ref={(el) => (videoRefs.current[index] = el)}
                            />

                            {/* Play / Pause Button */}
                            <button
                              onClick={() => toggleVideoPlay(index)}
                              className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40 transition rounded"
                            >
                              {videoStates[index] ? (
                                <svg width="24 lg:32" height="24 lg:32" viewBox="0 0 24 24" fill="white">
                                  <rect x="6" y="5" width="4" height="14" />
                                  <rect x="14" y="5" width="4" height="14" />
                                </svg>
                              ) : (
                                <svg width="24 lg:32" height="24 lg:32" viewBox="0 0 24 24" fill="white">
                                  <path d="M8 5v14l11-7z" />
                                </svg>
                              )}
                            </button>
                          </div>

                        )}

                        {/* PDF */}
                        {item.type === "document" && (
                          <embed
                            src={item.preview}
                            type="application/pdf"
                            className="w-full h-full object-contain bg-white"
                          />
                        )}

                        {/* DELETE BUTTON */}
                        <img
                          src={Dustbin}
                          alt="delete"
                          className="absolute bottom-1 right-1 cursor-pointer p-1"
                          onClick={() => {
                            setMediaList((prev) => prev.filter((_, i) => i !== index));
                          }}
                        />
                      </div>
                    ))}
                  </div>
                )}


                {/* Upload Section */}
                <div className="mb-4 w-full">
                  {/* <label className="block text-sm font-medium text-gray-700 mb-2">{t("brain_ai.upload_file_images_placeholder")} (webp, jpeg, png, pdf, mp4) *</label> */}
                  {/* <input
                  type="file"
                  accept="image/webp,image/jpeg,image/png,application/pdf/,video/mp4"
                  onChange={handleFileChange}
                  className="mb-2 hidden"
                  ref={fileInputRef}
                /> */}
                  <input
                    type="file"
                    accept="image/webp,image/jpeg,image/png,application/pdf,video/mp4"
                    onChange={handleFileChange}
                    className="hidden"
                    ref={fileInputRef}
                  />




                  {/* <div
                  className={`border-2 border-dashed ${dragActive ? 'border-[#335CFF80] bg-[#F5F7FF]' : errors.document ? 'border-red-500 bg-red-50' : 'border-[#335CFF80] bg-[#F5F7FF]'} rounded-lg p-6 text-center hover:border-[#335CFF80] cursor-pointer w-full`}
                  onClick={handleUploadAreaClick}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  role="button"
                  tabIndex={0}
                >
                  <UploadIcon className="w-8 h-8 text-[#675FFF] mx-auto mb-2" />
                  <p className="text-sm text-gray-600 font-medium">{t("brain_ai.upload_from_your_computer")}</p>
                  <p className="text-xs text-gray-500 mt-1">{t("brain_ai.or_drag_and_drop")}</p>
                </div>
                {fileName && (
                  <div className="text-xs text-gray-700 mt-2">{t("brain_ai.selected_file")} <span className="font-medium">{fileName}</span></div>
                )}
                {errors.document && <div className="text-red-500 text-xs mt-1">{errors.document}</div>} */}
                </div></div>
              <div className="flex flex-col sm:flex-row items-start justify-between gap-3 mb-1">
                <label className="flex items-center gap-2 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    className={`rounded border-gray-300 w-[16px] h-[16px] ${isChecked ? 'bg-[#675FFF] text-[#FFFFFF]' : 'bg-white'}`}
                    onClick={() => setIsChecked(!isChecked)}
                  />
                  <span className="text-[#0A0D14] text-[14px] leading-[23.8px]">
                    {t("constance.post_photos_pdf")}
                  </span>
                </label>

                <div className="flex flex-row gap-4 lg:gap-[20px] max-h-[32px]">
                  <div className="flex flex-row gap-4 lg:gap-[20px] items-center justify-center">
                    <img
                      src={VideoClip}
                      alt="Upload Video"
                      className="w-6 h-6 cursor-pointer"
                      onClick={openVideoPicker}
                    />

                    <img
                      src={ImageUpload}
                      alt="Upload Image"
                      className="w-6 h-6 cursor-pointer"
                      onClick={openImagePicker}
                    />

                  </div>
                  {!editData && (<button
                    disabled={isSaving?.publish} onClick={handlePublish}
                    className={`bg-[#675FFF] items-center justify-center py-[6px] px-[10px] gap-[6px] rounded-[8px] text-white text-[13px] font-medium ${isSaving?.publish ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
                    {isSaving?.publish ? <div className="flex items-center justify-center gap-2"><p className="text-[12px] lg:text-[13px]">{t("processing")}{t("processing")}</p><span className="loader" /></div> : t("publish_now")}
                  </button>)}
                </div>
              </div>
            </div>

            {/* Bottom Toolbar */}
            {/* <div className="flex flex-row items-center" style={{ width: "140px", height: "20px", gap: "4px" }}>
              <button className="p-2 cursor-pointer rounded" onClick={handleEditClick}>
                <SquarePen className="w-4 h-4" />
              </button>
              <button className="p-2 cursor-pointer rounded" onClick={handleCameraClick}>
                <Image className="w-4 h-4" />
              </button>
              <button className="p-2 cursor-pointer rounded">
                <Share2 className="w-4 h-4" />
              </button>
              <button className="p-2 cursor-pointer rounded" onClick={handleTrashClick}>
                <Trash2 className="w-4 h-4" />
              </button>
              <button className="p-2 cursor-pointer rounded">
                <Duplicate className="w-4 h-4" />
              </button>
              <button className="p-2 cursor-pointer rounded">
                <StarsIcon className="w-4 h-4" />
              </button>
            </div> */}

            {/* Action Buttons at the bottom */}
            {/* <div className="flex flex-row justify-center items-center gap-[9px] border-t border-[#E1E4EA] w-full min-h-[88px] absolute bottom-0 left-0 right-0 p-[25px] box-border bg-white">
              <button className={`flex flex-row items-center justify-center gap-[10px] h-[38px] rounded-[7px] border-[1.5px] px-[20px] py-[7px] text-[#5A687C] bg-[#FFFFFF] font-medium ${isSaving?.draft ? 'cursor-not-allowed' : 'cursor-pointer'}`} onClick={handleSaveDraft} disabled={isSaving?.draft}>
                {isSaving?.draft ? <div className="flex items-center justify-center gap-2"><p>{t("processing")}</p><span className="loader" /></div> : t("draft")}
              </button>
              {!editData && (
                <button disabled={isSaving?.publish} onClick={handlePublish} className={`flex flex-row items-center justify-center gap-[10px] min-w-[96px] min-h-[38px] rounded-[7px] border-[1.5px] border-[#5F58E8] px-[20px] py-[7px] text-[#675FFF] bg-transparent font-medium ${isSaving?.publish ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
                  {isSaving?.publish ? <div className="flex items-center justify-center gap-2"><p>{t("processing")}</p><span className="loader" /></div> : t("publish")}
                </button>
              )}
              <button className="flex cursor-pointer flex-row items-center justify-center gap-[10px] min-w-[112px] min-h-[38px] rounded-[7px] border-[1.5px] border-[#5F58E8] px-[20px] py-[7px] text-[#FFFFFF] bg-[#675FFF] font-medium" onClick={() => setShowDateTimePicker(true)}>
                {t("schedule")}
              </button>
            </div> */}
            {successMessage && <div className="text-green-600 text-sm mt-2 text-center">{successMessage}</div>}
            {errorMessage && <div className="text-red-600 text-sm mt-2 text-center">{errorMessage}</div>}
            {errors.general && <div className="text-red-500 text-sm mt-2">{errors.general}</div>}
          </div>

          {/* Right Post Preview */}
          {/* <div className="w-[287px] h-[726px] bg-white border-l border-[#E1E4EA] rounded-tr-[16px] rounded-br-[16px] p-4 flex flex-col">
            <div className="flex flex-col gap-[14px] w-full mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t("constance.post_preview")}</label>
                <div className="relative w-full h-[44px]">
                  <SelectDropdown
                    name="platform-preview"
                    options={[
                      { key: "linkedin", label: "Linkedin" },
                      // Add more platforms as needed
                    ]}
                    value={platform}
                    onChange={setPlatform}
                    placeholder={t("select") + " " + t("constance.platform")}
                    className="w-full"
                  />
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div> 
              </div>
            </div>

            <div className="flex-1 flex flex-col gap-3 overflow-y-auto">
              {(text || getSelectedAccountLabel() || platform) && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#F0EFFF] flex items-center justify-center">
                    {platform === "instagram" ? (
                      <img src={instagram} alt="Instagram" className="w-5 h-5" />
                    ) : platform === "X" ? (
                      <img src={twitter} alt="X / Twitter" className="w-5 h-5" />
                    ) : platform === "linkedin" ? (
                      <img src={linkedin} alt="LinkedIn" className="w-5 h-5" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gray-200" />
                    )}
                  </div>
                  <div className="flex flex-col">
                    <div className="text-sm font-semibold text-gray-900 truncate max-w-[140px]">
                      {getSelectedAccountLabel() || "user_name"}
                    </div>
                    
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button className="px-1 py-0.5 text-[11px] uppercase tracking-wide rounded-[6px] border border-blue-600 text-blue-500">
                    {t("follow") || "FOLLOW"}
                  </button>
                  <MoreHorizontal className="w-5 h-5 text-gray-500" />
                </div>
              </div>
              )}
              <div className="relative w-full h-[234px] rounded-md overflow-hidden flex items-center justify-center bg-gray-50 border border-gray-200 flex-shrink-0">
                {preview ? (
                  previewMediaType === 'image' ? (
                    <img
                      src={preview}
                      alt="Content preview"
                      className="absolute inset-0 w-full h-full object-contain"
                    />
                  ) : previewMediaType === 'document' ? (
                    <embed
                      src={preview}
                      type="application/pdf"
                      className="absolute inset-0 w-full h-full object-contain"
                    />
                  ) : previewMediaType === 'video' ? (
                    <video
                      src={preview}
                      controls
                      className="absolute inset-0 w-full h-full object-contain"
                    />
                  ) : (
                    (preview.startsWith("data:image") ? (
                      <img
                        src={preview}
                        alt="Content preview"
                        className="absolute inset-0 w-full h-full object-contain"
                      />
                    ) : preview.startsWith("data:application/pdf") ? (
                      <embed
                        src={preview}
                        type="application/pdf"
                        className="absolute inset-0 w-full h-full object-contain"
                      />
                    ) : null)
                  )
                ) : (
                  <img
                    src={inkartinkLogo}
                    alt="Default Preview"
                    className="absolute inset-0 w-full h-full object-contain"
                  />
                )}
              </div>

              {(text || getSelectedAccountLabel()) && (
                <div className="flex items-center justify-between mt-1">
                  <div className="flex items-center gap-3">
                    <Heart className="w-5 h-5 text-gray-700" />
                    <MessageCircle className="w-5 h-5 text-gray-700" />
                    <Send className="w-5 h-5 text-gray-700" />
                  </div>
                  <Bookmark className="w-5 h-5 text-gray-700" />
                </div>
              )}

              {(text || getSelectedAccountLabel()) && (
                <div className="text-sm font-semibold text-gray-900">
                  396 {t("likes") || "likes"}
                </div>
              )}

              {(text || getSelectedAccountLabel()) && (
                <div className="text-sm text-gray-800 whitespace-pre-wrap break-words">
                  <span className="font-semibold mr-2">{getSelectedAccountLabel() || "user_name"}</span>
                  {renderCaptionWithHashtags(text)}
                </div>
              )}
            </div>

          </div> */}
        </div>
      </div>
      {showDateTimePicker && (
        <DateTimePicker
          onClose={() => setShowDateTimePicker(false)}
          onSchedule={(date, time) => {
            setShowDateTimePicker(false);
            handleSchedule(date, time);
          }}
          isSaving={isSaving?.schedule}
        />
      )}
    </div>
  )
}
