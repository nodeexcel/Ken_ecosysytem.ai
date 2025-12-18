import { X, Trash2, Italic, Bold, Smile, MessageCircle, Underline, Strikethrough, ThumbsUp, Share, Check } from "lucide-react"
import inkartinkLogo from '../assets/svg/inkartink.svg';
import { useTranslation } from "react-i18next";
import DateTimePicker from "./DateTimePicker";
import { useState, useRef, useEffect } from "react";
import { publishContent, saveDraftContent, scheduleContent, editScheduledContent } from '../api/contentCreationAgent';
import { getInstaAccounts, getLinkedInAccounts, getTikTokAccounts } from '../api/brainai';
import { SelectDropdown } from "./Dropdown";
import { Duplicate } from "../icons/icons";
import instagram from '../assets/svg/instagram.svg'
import linkedin from '../assets/svg/linkedin.svg'
import twitter from '../assets/svg/tiktok.png'
import ImageFile from '../assets/svg/ImageFile.svg'
import VideoFile from '../assets/svg/VideoFile.svg'
import VideoPlayIcon from '../assets/svg/VideoPlay.svg'
import constanceImg from "../assets/svg/constance_logo.svg"
import ShareIcon from '../assets/svg/Share.svg'
import StatusModal from './StatusModal'
import { useNavigate } from 'react-router-dom'

export default function CreatePost({ onClose, editData }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [showDateTimePicker, setShowDateTimePicker] = useState(false);
  // State for required fields
  const [text, setText] = useState("");
  const [document, setDocument] = useState(null); // base64 string
  const [documents, setDocuments] = useState([]); // Array of files for multiple uploads
  const [platform, setPlatform] = useState("");
  const [selectedAccount, setSelectedAccount] = useState(""); // New state for selected account
  const [isSaving, setIsSaving] = useState({ draft: false, publish: false, schedule: false });
  const [errors, setErrors] = useState({});
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef();
  const [fileName, setFileName] = useState("");
  const [preview, setPreview] = useState(null);
  const [previewMediaType, setPreviewMediaType] = useState(null); // 'image' | 'document' | 'video' | null
  const [showPreview, setShowPreview] = useState(false);
  const [uploadMode, setUploadMode] = useState(null); // 'image' | 'video'
  // State for all accounts (Instagram, LinkedIn, TikTok)
  const [allAccounts, setAllAccounts] = useState([]);
  const [accountsLoading, setAccountsLoading] = useState(false);
  const [accountsError, setAccountsError] = useState(null);
  const textInputRef = useRef(); // Add ref for text input
  const [statusModal, setStatusModal] = useState({ open: false, type: 'success', title: '', description: '', primaryButtonText: 'OK', onPrimaryClick: null });
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [isPlaying, setIsPlaying] = useState([]); // track which videos are playing
  const [showOverlay, setShowOverlay] = useState([]); // track overlay visibility
  const videoRefs = useRef([]); // store video refs

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

  // Fetch all accounts on component mount
  useEffect(() => {
    const fetchAllAccounts = async () => {
      setAccountsLoading(true);
      setAccountsError(null);
      try {
        const [instaResponse, linkedinResponse, tiktokResponse] = await Promise.all([
          getInstaAccounts(),
          getLinkedInAccounts(),
          getTikTokAccounts()
        ]);

        const allAccountsList = [];

        // Add Instagram accounts
        if (instaResponse?.status === 200 && instaResponse?.data?.insta_account_info) {
          instaResponse.data.insta_account_info.forEach(acc => {
            allAccountsList.push({
              id: acc.instagram_user_id,
              username: acc.username || `@${acc.username}`,
              platform: "instagram",
              platformLabel: "Instagram",
              accountData: acc
            });
          });
        }

        // Add LinkedIn accounts
        if (linkedinResponse?.status === 200 && linkedinResponse?.data?.linkedin_account_info) {
          linkedinResponse.data.linkedin_account_info.forEach(acc => {
            allAccountsList.push({
              id: acc.linkedin_id,
              username: acc.name || `@${acc.name}`,
              platform: "linkedin",
              platformLabel: "LinkedIn",
              accountData: acc
            });
          });
        }

        // Add TikTok accounts
        if (tiktokResponse?.status === 200 && tiktokResponse?.data?.tiktok_account_info) {
          tiktokResponse.data.tiktok_account_info.forEach(acc => {
            allAccountsList.push({
              id: acc.tiktok_id,
              username: acc.name || `@${acc.name}`,
              platform: "X",
              platformLabel: "TikTok",
              accountData: acc
            });
          });
        }

        setAllAccounts(allAccountsList);
      } catch (err) {
        console.error("Error fetching accounts:", err);
        setAccountsError("Failed to fetch accounts");
      } finally {
        setAccountsLoading(false);
      }
    };

    fetchAllAccounts();
  }, []);

  useEffect(() => {
    if (successMessage) {
      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    }
  }, [successMessage])


  // Handle account selection
  const handleAccountSelect = (account) => {
    setSelectedAccount(account.id);
    setPlatform(account.platform);
    if (errors.selectedAccount) {
      setErrors(prev => ({ ...prev, selectedAccount: undefined }));
    }
  }

  // Get platform icon
  const getPlatformIcon = (platformType) => {
    if (platformType === "instagram") {
      return instagram;
    } else if (platformType === "X") {
      return twitter;
    } else {
      return linkedin;
    }
  }

  const handleVideoClick = (index) => {
    const video = videoRefs.current[index];
    if (!video) return;

    if (video.paused) {
      video.play();
      setIsPlaying((prev) => {
        const copy = [...prev];
        copy[index] = true;
        return copy;
      });
      setShowOverlay((prev) => {
        const copy = [...prev];
        copy[index] = true;
        return copy;
      });

      setTimeout(() => {
        setShowOverlay((prev) => {
          const copy = [...prev];
          copy[index] = false; // hide overlay after 1 sec
          return copy;
        });
      }, 1000);
    } else {
      video.pause();
      setIsPlaying((prev) => {
        const copy = [...prev];
        copy[index] = false;
        return copy;
      });
      setShowOverlay((prev) => {
        const copy = [...prev];
        copy[index] = true; // show overlay when paused
        return copy;
      });
    }
  };

  const getSelectedAccountLabel = () => {
    const account = allAccounts.find(acc => acc.id === selectedAccount);
    return account ? account.username : "";
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
  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const validFiles = files.filter(file => {
      // Restrict by upload mode (image or video)
      if (uploadMode === "image" && !file.type.startsWith("image/")) return false;
      if (uploadMode === "video" && !file.type.startsWith("video/")) return false;

      // Fallback: allow only supported types
      if (!["image/webp", "image/jpeg", "image/png", "application/pdf", "video/mp4"].includes(file.type)) {
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) {
      setErrors({ document: 'Only webp, jpeg, png images, pdf files, or mp4 videos are allowed.' });
      return;
    }

    // Process each file
    const filePromises = validFiles.map(file => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve({
            file: file,
            preview: reader.result,
            mediaType: getMediaType(file),
            name: file.name
          });
        };
        reader.readAsDataURL(file);
      });
    });

    try {
      const newDocuments = await Promise.all(filePromises);
      setDocuments(prev => [...prev, ...newDocuments]);
      // Set first file as main document for API
      if (!document) {
        setDocument(validFiles[0]);
        setPreview(newDocuments[0].preview);
        setPreviewMediaType(newDocuments[0].mediaType);
        setFileName(newDocuments[0].name);
      }
      if (errors.document) setErrors(prev => ({ ...prev, document: undefined }));
    } catch (error) {
      console.error('Error processing files:', error);
      setErrors({ document: 'Error processing files' });
    }
  };

  // Remove a document from the list
  const handleRemoveDocument = (index) => {
    const newDocuments = documents.filter((_, i) => i !== index);
    setDocuments(newDocuments);
    if (newDocuments.length > 0) {
      setDocument(newDocuments[0].file);
      setPreview(newDocuments[0].preview);
      setPreviewMediaType(newDocuments[0].mediaType);
      setFileName(newDocuments[0].name);
    } else {
      setDocument(null);
      setPreview(null);
      setPreviewMediaType(null);
      setFileName("");
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
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileChange({ target: { files: Array.from(e.dataTransfer.files) } });
    }
  };
  const handleUploadAreaClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleMediaButtonClick = (mode) => {
    setUploadMode(mode);
    // Trigger hidden input; accept logic is enforced in handleFileChange
    if (fileInputRef.current) {
      // Clear previous selection so same file can be re-selected
      fileInputRef.current.value = "";
      fileInputRef.current.click();
    }
  };

  // Helper to determine media_type from file
  const getMediaType = (file) => {
    if (!file) return 'text';
    if (file.type.startsWith('image/')) return 'image';
    if (file.type.startsWith('video/')) return 'video';
    if (file.type === 'application/pdf') return 'document';
    return '';
  };

  const normalizePlatform = (platform) => {
    if (!platform) return platform;
    const platformMap = {
      "X": "tiktok",
      "instagram": "Instagram",
      "linkedin": "LinkedIn"
    };
    return platformMap[platform] || platform;
  };

  // Handle Draft button click
  const handleSaveDraft = async () => {
    let newErrors = {};
    if (!text) newErrors.text = `${t("constance.post_text") + " " + t("is_required")}`;
    if (!platform) newErrors.platform = `${t("constance.platform") + " " + t("is_required")}`;
    if (!selectedAccount) newErrors.selectedAccount = `${t("constance.account") + " " + t("is_required")}`;
    if ((platform === "instagram" || platform === "X") && !document && !(editData && editData.document)) {
      newErrors.document = `${t("brain_ai.upload_file_images_placeholder") + " " + t("is_required")}`;
    }
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
          platform: normalizePlatform(platform),
          platform_unique_id: selectedAccount,
          media_type: getMediaType(document),
        };
        const response = await editScheduledContent(contentId, payload);
        if (response?.status === 200) {
          setText("");
          setDocument(null);
          setFileName("");
          setPreview(null);
          setPreviewMediaType(null);
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
        platform: normalizePlatform(platform), // Normalize platform name for API
        platform_unique_id: selectedAccount,
        media_type: getMediaType(document),
      };
      const response = await saveDraftContent(payload);
      if (response?.status === 201) {
        setText("");
        setDocument(null);
        setFileName("");
        setPreview(null);
        setPreviewMediaType(null);
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
    if ((platform === "instagram" || platform === "X") && !document && !(editData && editData.document)) {
      newErrors.document = `${t("brain_ai.upload_file_images_placeholder") + " " + t("is_required")}`;
    }
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;
    try {
      setErrorMessage("");
      setIsSaving((prev) => ({ ...prev, publish: true }));
      const payload = {
        text,
        document,
        platform: normalizePlatform(platform), // Normalize platform name for API
        platform_unique_id: selectedAccount,
        media_type: getMediaType(document),
      };
      const response = await publishContent(payload);
      if (response?.status === 201) {
        setSuccessMessage(response?.data?.success);
        setText("");
        setDocument(null);
        setFileName("");
        setPreview(null);
        setPreviewMediaType(null);
        setSelectedAccount("");
        setPlatform("");
        fileInputRef.current.value = '';
        setIsSaving((prev) => ({ ...prev, publish: false }));
        // Show success modal
        setStatusModal({
          open: true,
          type: 'success',
          title: 'Published Successfully',
          description: response?.data?.success || 'Your content has been published successfully.',
          primaryButtonText: 'OK',
          onPrimaryClick: () => setStatusModal({ ...statusModal, open: false })
        });
      }
      else {
        const errorMessage = response?.response?.data?.error || response?.data?.error || 'Failed to publish content. Please try again.';
        setErrorMessage(errorMessage);
        setSuccessMessage("");
        setIsSaving((prev) => ({ ...prev, publish: false }));
        // Show error modal
        setStatusModal({
          open: true,
          type: 'error',
          title: 'Publish Failed',
          description: errorMessage,
          primaryButtonText: 'OK',
          onPrimaryClick: () => setStatusModal({ ...statusModal, open: false })
        });
      }
    } catch (err) {
      setIsSaving((prev) => ({ ...prev, publish: false }));
      setErrors({ general: 'Failed to publish' });
      // Show error modal
      const errorMessage = err?.response?.data?.error || err?.data?.error || 'Failed to publish content. Please try again.';
      setStatusModal({
        open: true,
        type: 'error',
        title: 'Publish Failed',
        description: errorMessage,
        primaryButtonText: 'OK',
        onPrimaryClick: () => setStatusModal({ ...statusModal, open: false })
      });
    }
  };
  const handleSchedule = async (scheduledDate, scheduledTime) => {
    let newErrors = {};
    if (!text) newErrors.text = `${t("constance.post_text") + " " + t("is_required")}`;
    if (!platform) newErrors.platform = `${t("constance.platform") + " " + t("is_required")}`;
    if (!selectedAccount) newErrors.selectedAccount = `${t("constance.account") + " " + t("is_required")}`;
    if ((platform === "instagram" || platform === "X") && !document && !(editData && editData.document)) {
      newErrors.document = `${t("brain_ai.upload_file_images_placeholder") + " " + t("is_required")}`;
    }
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
          platform: normalizePlatform(platform), // Normalize platform name for API
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
          setPreview(null);
          setPreviewMediaType(null);
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
        platform: normalizePlatform(platform), // Normalize platform name for API
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
        setPreview(null);
        setPreviewMediaType(null);
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
    setDocuments([]);
    setFileName("");
    setPreview(null);
    setPreviewMediaType(null);
  };

  return (
    <div className="flex flex-col gap-4 sm:gap-6 lg:gap-8 h-screen">
      {/* Header */}
      <div className="flex flex-row items-center justify-between min-h-[38px] sm:h-[38px]">
        <h1 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900 pr-2">{t("constance.create_scheduler") || "Create Scheduler"}</h1>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="px-4 py-2 text-sm font-medium text-[#5A687C] cursor-pointer bg-white border border-[#E1E4EA] rounded-lg hover:bg-[#F4F5F6] transition-colors"
          >
            {t("constance.preview") || "Preview"}
          </button>
          <button
            onClick={handleSaveDraft}
            disabled={isSaving?.draft}
            className={`px-4 py-2 text-sm font-medium text-[#5A687C] cursor-pointer bg-white border border-[#E1E4EA] rounded-lg hover:bg-[#F4F5F6] transition-colors ${isSaving?.draft ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
          >
            {isSaving?.draft ? (
              <div className="flex items-center justify-center gap-2">
                <p>{t("processing")}</p>
                <span className="loader" />
              </div>
            ) : (
              t("constance.save_as_draft") || "Save as Draft"
            )}
          </button>
          <button
            onClick={() => setShowDateTimePicker(true)}
            className="px-4 py-2 text-sm font-medium text-white cursor-pointer bg-[#675FFF] border border-[#675FFF] rounded-lg hover:bg-[#5a4fe6] transition-colors"
          >
            {t("constance.schedule") || "Schedule"}
          </button>
        </div>
      </div>

      {/* Main Content with Horizontal Scroll for Small Screens */}
      <div className="w-full overflow-x-auto">
        <div className="flex w-full min-w-[1000px] mx-auto rounded-[16px] border border-[#E1E4EA] bg-white">
          {/* Left Sidebar */}
          <div className="w-[230px] h-[726px] bg-white border-r border-r-[#E1E4EA] border-t border-t-[#ffffff] border-b border-b-[#ffffff] border-l border-l-[#ffffff] rounded-l-[16px] flex flex-col relative min-h-[600px]">
            {/* Header */}
            <div className="px-4 pt-6 pb-4">
              <h2 className="text-base font-semibold text-[#1E1E1E] text-center">
                {t("select") + " " + t("constance.account") || "Select Account"}
              </h2>
            </div>

            {/* Accounts List */}
            <div className="flex-1 overflow-y-auto px-2 pb-4">
              {accountsLoading ? (
                <div className="flex justify-center items-center h-full">
                  <span className="loader" />
                </div>
              ) : accountsError ? (
                <div className="text-red-500 text-sm text-center py-4">{accountsError}</div>
              ) : allAccounts.length === 0 ? (
                <div className="text-[#5A687C] text-sm text-center py-4">
                  {t("no_accounts_found") || "No accounts found"}
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  {allAccounts.map((account) => {
                    const isSelected = selectedAccount === account.id;
                    return (
                      <div
                        key={account.id}
                        onClick={() => handleAccountSelect(account)}
                        className={`flex items-center gap-3 px-1.5 py-3 rounded-lg cursor-pointer transition-colors ${
                          isSelected
                            ? "bg-[#E9E8F9]"
                            : "bg-white hover:bg-gray-50"
                        }`}
                      >
                        {/* Platform Icon */}
                        <div className="flex-shrink-0">
                          <img
                            src={getPlatformIcon(account.platform)}
                            alt={account.platformLabel}
                            className="w-6 h-6"
                          />
                        </div>
                        {/* Username */}
                        <div className="flex-1 min-w-0">
                          <span className={`text-sm font-medium ${
                            isSelected ? "text-[#675FFF]" : "text-[#1E1E1E]"
                          }`}>
                            {account.username.startsWith("@") ? account.username : `@${account.username}`}
                          </span>
                        </div>
                        {/* Checkmark for selected */}
                        {isSelected && (
                          <div className="flex-shrink-0 w-5 h-5 bg-[#675FFF] rounded flex items-center justify-center">
                            <Check className="w-3 h-3 text-white" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                  
                  {/* Add Account button - positioned right after the last account */}
                  <button 
                    onClick={() => navigate('/dashboard/brain?tab=integration')}
                    className="w-full flex items-center justify-center gap-2 text-sm text-[#1E1E1E] font-medium border border-[#E1E4EA] rounded-[12px] py-2.5 bg-white hover:bg-[#F8F9FB] transition-colors shadow-[0_2px_6px_rgba(15,23,42,0.06)] mt-2 cursor-pointer"
                  >
                    <span className="text-lg leading-none">+</span>
                    <span>{t("constance.add") + " " + t("constance.account") || "Add Account"}</span>
                  </button>
                </div>
              )}
              {errors.selectedAccount && (
                <div className="text-red-500 text-xs mt-2">{errors.selectedAccount}</div>
              )}
            </div>
          </div>

          {/* Center Post Creation - Post Details */}
          <div className="flex flex-col gap-4 bg-white border-[#E1E4EA] rounded-lg p-6 flex-1 h-full relative overflow-y-auto">
            {/* Post Details Title */}
            <h2 className="text-lg font-semibold text-gray-900 mb-4">{t("constance.post_details") || "Post Details"}</h2>

            <div className="border border-[#D6D6D6] rounded-xl p-2 " >


              {/* Rich Text Editor Toolbar */}
              <div className="flex items-center gap-2 px-2 pt-2 mb-4 bg-white">
                <button className="p-2 hover:bg-gray-100 rounded transition-colors" title="Bold">
                  <Bold className="w-5 h-5 text-black" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded transition-colors" title="Italic">
                  <Italic className="w-5 h-5 text-black" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded transition-colors" title="Underline">
                  <Underline className="w-5 h-5 text-black" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded transition-colors" title="Strikethrough">
                  <Strikethrough className="w-5 h-5 text-black" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded transition-colors" title="Emoji">
                  <Smile className="w-5 h-5 text-black" />
                </button>
              </div>

              {/* Text Content Area */}
              <textarea
                value={text}
                onChange={e => {
                  setText(e.target.value);
                  if (errors.text) setErrors(prev => ({ ...prev, text: undefined }));
                }}
                className={`w-full h-[calc(100vh-550px)] px-4 font-normal text-[16px] text-[#5A687C] resize-none 
     rounded-xl 
    focus:border-[#AEB3BB] focus:ring-0 focus:outline-none
    ${errors.text ? 'border-red-500' : ''}`}
                placeholder={t("constance.post_text") || "Write your post content here..."}
                style={{ fontWeight: 400, fontStyle: "normal", letterSpacing: 0 }}
                ref={textInputRef}
              />



              {errors.text && <div className="text-red-500 text-xs mt-1">{errors.text}</div>}
              {errors.document && <div className="text-red-500 text-xs mt-1">{errors.document}</div>}

              {/* Media Section - Thumbnails */}
              {/* Media Section - Thumbnails */}
              {documents.length > 0 && (
                <div className="mb-4">
                  <div className="grid grid-cols-2 gap-3">
                    {documents.map((doc, index) => (
                      <div key={index} className="relative group">
                        <div className="relative w-full h-[200px] rounded-lg overflow-hidden border border-[#E1E4EA] bg-gray-50">

                          {/* Image Preview */}
                          {doc.mediaType === 'image' && (
                            <img
                              src={doc.preview}
                              alt={doc.name}
                              className="w-full h-full object-cover"
                            />
                          )}

                          {/* Video Preview */}
                          {doc.mediaType === 'video' && (
                            <div
                              className="relative w-full h-full flex items-center justify-center bg-black cursor-pointer"
                              onClick={() => handleVideoClick(index)}
                            >
                              <video
                                ref={el => videoRefs.current[index] = el}
                                src={doc.preview}
                                muted
                                playsInline
                                className="w-full h-full object-contain"
                              />
                              {/* Overlay Play Icon */}
                              {showOverlay[index] && (
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                  <div className="flex items-center justify-center">
                                    <img
                                      src={VideoPlayIcon}
                                      alt="play"
                                      className="w-8 h-8"
                                    />
                                  </div>
                                </div>
                              )}
                            </div>
                          )}

                          {/* Document Preview */}
                          {doc.mediaType === 'document' && (
                            <div className="w-full h-full flex items-center justify-center bg-gray-100">
                              <div className="text-center">
                                <svg
                                  className="w-12 h-12 text-gray-400 mx-auto mb-2"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                </svg>
                                <p className="text-xs text-gray-500 truncate px-2">{doc.name}</p>
                              </div>
                            </div>
                          )}

                          {/* Remove Button */}
                          <button
                            onClick={() => handleRemoveDocument(index)}
                            className="absolute bottom-2 right-2 p-1.5 bg-red-500 hover:bg-red-600 rounded-full transition-colors opacity-0 group-hover:opacity-100"
                          >
                            <Trash2 className="w-4 h-4 text-white" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}


              {/* Hidden input used by the media buttons (image / video) */}
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/webp,image/jpeg,image/png,video/mp4"
                onChange={handleFileChange}
                multiple
              />

              {/* Bottom Options */}
              <div className="mt-6 pt-4 border-t border-[#E1E4EA] flex flex-col lg:flex-row items-end lg:items-center gap-4">
                <div className="flex items-center gap-2 flex-shrink-0">
                  <input
                    type="checkbox"
                    id="pdf-checkbox"
                    className="rounded border-gray-300 w-[21px] h-[21px] cursor-pointer"
                  />
                  <label htmlFor="pdf-checkbox" className="text-sm text-[#5A687C] cursor-pointer">
                    {t("constance.post_photos_pdf") || "Post photos as a PDF document"}
                  </label>
                </div>

                {/* RIGHT — Image Icon + Publish button */}
                <div className="flex items-center gap-3 lg:ml-auto w-full lg:w-auto justify-end">

                  {/* Video File Button */}
                  <button
                    className="p-2 hover:bg-gray-100 rounded transition-colors"
                    title="Video File"
                    onClick={() => handleMediaButtonClick("video")}
                  >
                    <img src={VideoFile} alt="video file" className="w-5 h-5" />
                  </button>
                  {/* Image Icon */}
                  <button
                    className="p-2 hover:bg-gray-100 rounded transition-colors"
                    title="Image File"
                    onClick={() => handleMediaButtonClick("image")}
                  >
                    <img src={ImageFile} alt="image file" className="w-5 h-5" />
                  </button>



                  {/* Publish Button */}
                  <button
                    onClick={handlePublish}
                    disabled={isSaving?.publish}
                    className={`px-4 py-2 text-sm font-medium text-white bg-[#675FFF] 
        rounded-lg hover:bg-[#5a4fe6] transition-colors 
        ${isSaving?.publish ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
                  >
                    {isSaving?.publish ? (
                      <div className="flex items-center justify-center gap-2">
                        <p>{t("processing")}</p>
                        <span className="loader" />
                      </div>
                    ) : (
                      t("publish_now") || "Publish Now"
                    )}
                  </button>
                </div>
              </div>
              {successMessage && <div className="text-green-600 text-sm mt-2">{successMessage}</div>}
              {errorMessage && <div className="text-red-600 text-sm mt-2">{errorMessage}</div>}
              {errors.general && <div className="text-red-500 text-sm mt-2">{errors.general}</div>}
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
          isSaving={isSaving?.schedule}
        />
      )}

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-[770px] max-h-[90vh] flex flex-col shadow-xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-2 border-b border-[#E1E4EA]">
              <h2 className="text-lg font-semibold text-gray-900">{t("constance.post_preview") || "Preview Post "}</h2>
              <button
                onClick={() => setShowPreview(false)}
                className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="bg-[#ffffff] w-full min-w-[232px] flex items-center justify-between p-[12px] rounded-[9px]">

              {/* Left Section */}
              <div className="flex gap-3 items-center">
                <div className="w-10 h-10 rounded-full bg-[#FFE4C5] flex items-center justify-center">
                  <img
                    src={constanceImg}
                    alt="constance"
                    className="w-8 h-8 object-contain scale-115"
                  />
                </div>

                <div className="flex flex-col">
                  <h1 className="text-[#1E1E1E] text-[16px] font-[600]">
                    {t("constance.constance")}
                  </h1>
                  <p className="text-[#5A687C] text-[14px] font-[400]">
                    {t("constance.content_creation")}
                  </p>
                </div>
              </div>

              {/* Right Section */}
              <div className="text-[#5A687C] text-[12px]">
                1 min ago
              </div>

            </div>


            {/* Preview Content */}
            <div className="flex-1 overflow-y-auto px-6  flex flex-col gap-3">
              {/* Header (Instagram-like) */}


              {(text || getSelectedAccountLabel()) && (
                <div className="text-sm text-gray-800 whitespace-pre-wrap break-words">
                  {renderCaptionWithHashtags(text)}
                </div>
              )}

              {/* Image/Media Preview */}
              {documents.length <= 1 ? (
                // ===== SINGLE FILE PREVIEW =====
                <div className="relative w-full h-[250px] rounded-md overflow-hidden flex items-center justify-center bg-gray-50 border border-gray-200 flex-shrink-0">
                  {preview ? (
                    previewMediaType === 'image' ? (
                      <img src={preview} alt="Content preview" className="absolute inset-0 w-full h-full object-contain" />
                    ) : previewMediaType === 'document' ? (
                      <embed src={preview} type="application/pdf" className="absolute inset-0 w-full h-full object-contain" />
                    ) : previewMediaType === 'video' ? (
                      <video src={preview} controls className="absolute inset-0 w-full h-full object-contain" />
                    ) : null
                  ) : (
                    <img src={inkartinkLogo} alt="Default Preview" className="absolute inset-0 w-full h-full object-contain" />
                  )}
                </div>
              ) : (
                // ===== MULTI-FILE CARD VIEW =====
                <div className="grid grid-cols-2 gap-3 mt-4 ">
                  {documents.map((doc, i) => (
                    <div
                      key={i}
                      className="relative w-full h-[180px] border border-gray-200 rounded-lg overflow-hidden bg-gray-50 flex items-center justify-center"
                    >
                      {doc.mediaType === "image" ? (
                        <img
                          src={doc.preview}
                          alt={doc.name}
                          className="w-full h-full object-cover"
                        />
                      ) : doc.mediaType === "video" ? (
                        <div className="relative w-full h-full bg-black">

                          {/* ===== VIDEO ELEMENT ===== */}
                          <video
                            src={doc.preview}
                            muted
                            playsInline
                            ref={(el) => (videoRefs.current[i] = el)}
                            className="w-full h-full object-contain"
                          />

                          {/* ===== PLAY / PAUSE OVERLAY BUTTON ===== */}
                          {showOverlay[i] && (
                            <button
                              onClick={() => handleVideoClick(i)}
                              className="absolute inset-0 flex items-center justify-center bg-black/0"
                            >
                              <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
                                {isPlaying[i] ? (
                                  // Pause Icon
                                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M6 4h4v16H6zm8 0h4v16h-4z" />
                                  </svg>
                                ) : (
                                  // Play Icon
                                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M8 5v14l11-7z" />
                                  </svg>
                                )}
                              </div>
                            </button>
                          )}
                        </div>
                      ) : doc.mediaType === "document" ? (
                        <embed
                          src={doc.preview}
                          type="application/pdf"
                          className="w-full h-full object-contain"
                        />
                      ) : null}
                    </div>
                  ))}
                </div>
              )}


              {/* Action row (Instagram-like) */}
              {(text || getSelectedAccountLabel()) && (


                <div className="flex items-center justify-between border-t border-gray-300 pb-4 py-2 mt-1 px-2">

                  {/* Left: Likes + Comments */}
                  <div className="flex items-center gap-6 text-gray-600 text-sm mt-1">

                    {/* Likes */}
                    <div className="flex items-center gap-1 cursor-pointer text-black">
                      <ThumbsUp className="w-4 h-4" />
                      <span>100 Likes</span>
                    </div>

                    {/* Comments */}
                    <div className="flex items-center gap-1 cursor-pointer hover:text-black">
                      <MessageCircle className="w-4 h-4" />
                      <span>28 Comments</span>
                    </div>

                  </div>

                  {/* Right: Share */}
                  <div className="flex items-center gap-1 text-gray-600 text-sm cursor-pointer hover:text-black">
                    <img src={ShareIcon} className="w-4 h-4" />
                    <span>Share</span>
                  </div>

                </div>


              )}

              
              {/* Caption Preview */}

            </div>

            {/* Action Buttons at Bottom */}
            <div className="border-t border-[#E1E4EA] px-6 py-4 flex items-center justify-end gap-3">
              <button
                onClick={() => {
                  setShowPreview(false);
                  setShowDateTimePicker(true);
                }}
                className="px-4 py-2 text-sm font-medium text-[#5A687C] bg-white border border-[#E1E4EA] rounded-lg hover:bg-[#F4F5F6] transition-colors"
              >
                {t("schedule") || "Schedule"}
              </button>
              <button
                onClick={() => {
                  setShowPreview(false);
                  handlePublish();
                }}
                disabled={isSaving?.publish}
                className={`px-4 py-2 text-sm font-medium text-white bg-[#675FFF] border border-[#675FFF] rounded-lg hover:bg-[#5a4fe6] transition-colors ${
                  isSaving?.publish ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
                }`}
              >
                {isSaving?.publish ? (
                  <div className="flex items-center justify-center gap-2">
                    <p>{t("processing")}</p>
                    <span className="loader" />
                  </div>
                ) : (
                  t("publish_now") || "Publish Now"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Status Modal for Publish Success/Error */}
      <StatusModal
        isOpen={statusModal.open}
        onClose={() => setStatusModal({ ...statusModal, open: false })}
        type={statusModal.type}
        title={statusModal.title}
        description={statusModal.description}
        primaryButtonText={statusModal.primaryButtonText}
        onPrimaryClick={statusModal.onPrimaryClick || (() => setStatusModal({ ...statusModal, open: false }))}
      />
    </div>
  )
}
