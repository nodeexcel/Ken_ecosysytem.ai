import { useState, useRef, useEffect } from "react";
import EmojiPicker from "emoji-picker-react";
import { EmojiIcon, ImageChatIcon, MicChatIcon, PaperClipChatIcon } from "../icons/icons";
import useWebSpeechAPI from "../hooks/useWebSpeechAPI";
import PdfIcon from "../assets/svg/pdf.svg";
import { uploadAttachment } from "../api/contentCreationAgent";

const ChatInput = ({
  value,
  onChange,
  onSend,
  sendLabel = "Send",
  placeholder = "Type a message...",
  userToken,
  agentName,
}) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const pickerRef = useRef(null);
  const inputRef = useRef(null);
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [originalValue, setOriginalValue] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  // Use Web Speech API hook
  const { isListening, transcript, isSupported, error, timeLeft, startListening, stopListening } = useWebSpeechAPI();

  const handleEmojiSelect = (emojiData) => {
    onChange(value + emojiData.emoji);
  };

  // Update input when transcript changes - show original value + transcript while listening
  useEffect(() => {
    if (transcript && isListening) {
      // Merge voice transcript with whatever was already typed
      const combinedValue = originalValue
        ? `${originalValue.trim()} ${transcript.trim()}`
        : transcript.trim();

      onChange(combinedValue);
      if (inputRef.current) {
        inputRef.current.scrollLeft = inputRef.current.scrollWidth;
      }
    }
  }, [transcript, isListening, originalValue, onChange]);


  // Close picker on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        setShowEmojiPicker(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Reset original value when not listening
  useEffect(() => {
    if (!isListening) {
      setOriginalValue("");
    }
  }, [isListening]);

  // Toggle speech recognition
  const toggleListening = () => {
    if (!isSupported) {
      alert('Speech recognition is not supported in your browser.');
      return;
    }

    if (isListening) {
      stopListening();
    } else {
      setOriginalValue(value); // store whatever user already typed
      startListening();
    }
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Allow only PDF files
    const isPdf = file.type === "application/pdf" || file.name?.toLowerCase().endsWith(".pdf");
    if (!isPdf) {
      alert("Only PDF files are allowed.");
      event.target.value = "";
      return;
    }
    
    console.log("File selected, starting upload...", { fileName: file.name, agentName });
    setUploading(true);
    setSelectedFile({ name: file.name, type: file.type });
    const formData = new FormData();
    formData.append("attachment", file);
    // include agent name in payload when provided
    if (agentName) formData.append("agent_name", agentName);
    const effectiveToken = userToken || localStorage.getItem('token') || undefined;
    if (effectiveToken) {
      formData.append("user_token", effectiveToken);
    }
    
    try {
      console.log("Calling uploadAttachment API...", { agentName, hasToken: !!effectiveToken });
      const response = await uploadAttachment(formData, agentName);
      console.log("Upload response:", response);
      
      // Check if response is actually an error object
      if (response && response.isAxiosError) {
        throw response;
      }
      
      const data = response?.data;
      const returnedFileId = data?.message?.file_id || data?.file_id || null;
      const returnedFileName = data?.message?.filename || data?.filename || file.name;
      setSelectedFile({ name: returnedFileName, type: file.type, id: returnedFileId });
      console.log("File uploaded successfully:", { fileId: returnedFileId, fileName: returnedFileName });
    } catch (err) {
      const status = err?.response?.status;
      const msg = err?.response?.data?.message || err?.message || "Unknown error";
      console.error("File upload error:", { status, msg, err });
      alert(`File upload failed${status ? ` (HTTP ${status})` : ""}. ${msg}`);
      setSelectedFile(null); // Clear selected file on error
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  };

  const handleFileClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="w-full mx-auto p-2 relative">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          try {
            onSend(selectedFile);
          } finally {
            setSelectedFile(null);
          }
        }}
        className="flex w-full flex-col items-center gap-2 p-2 rounded-2xl border border-gray-300 shadow-sm bg-white relative"
      >
        {/* Hidden file input */}
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="application/pdf"
          onChange={handleFileChange}
        />

        {/* Selected file preview */}
        {selectedFile && (
          <div className="w-full mb-2">
            <div className="relative inline-flex items-center gap-3 px-3 py-2 rounded-lg border border-gray-200 bg-white shadow-sm max-w-full">
              {/* Icon */}
              <div className="flex items-center justify-center w-8 h-8 rounded-md bg-red-50">
                <img src={PdfIcon} alt="PDF" className="w-6 h-6 text-red-600" />
              </div>

              {/* File name */}
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-900 truncate" title={selectedFile.name}>
                  {selectedFile.name}
                </div>
                
              </div>

              {/* Remove button */}
              <button
                type="button"
                aria-label="Remove file"
                className="ml-2 flex-shrink-0 w-7 h-7 rounded-full bg-white border border-gray-200 text-gray-600 hover:bg-red-50 flex items-center justify-center shadow cursor-pointer"
                onClick={() => {
                  setSelectedFile(null);
                  if (fileInputRef.current) fileInputRef.current.value = "";
                }}
              >
                <span className="text-sm">✕</span>
              </button>
            </div>
          </div>
        )}

        {/* Emoji Picker */}
        {showEmojiPicker && (
          <div
            ref={pickerRef}
            className="absolute bottom-full mb-2 right-4 z-[9999]"
          >
            <div className="relative">
              {/* Close button */}
              <button
                type="button"
                onClick={() => setShowEmojiPicker(false)}
                className="absolute -top-2 -right-2 z-[10000] text-gray-500 hover:text-gray-700 font-bold bg-white rounded-full w-9 h-9 flex items-center justify-center shadow cursor-pointer"
              >
                ✕
              </button>

              <EmojiPicker
                onEmojiClick={handleEmojiSelect}
                height={350}
                width={300}
              />
            </div>
          </div>
        )}

        {/* Mic modal above input */}
        {isListening && (
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-800 text-white px-4 py-2 rounded-full text-sm shadow-lg flex items-center gap-2">
            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
            <span>Listening... Speak now</span>
            <button
              type="button"
              onClick={toggleListening}
              className="ml-2 p-1 hover:bg-gray-700 rounded-full"
            >
              ✖️
            </button>
          </div>
        )}


        {/* Input */}
        <div className="flex items-center w-full border-b border-gray-200 pb-2">
          <input
            ref={inputRef}
            type="text"
            className="flex-1 w-full px-6 py-3 outline-none   border-none text-sm disabled:bg-gray-100 disabled:cursor-not-allowed overflow-x-auto whitespace-nowrap"
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            disabled={isListening} // disable typing while listening
          />
        </div>

        {/* Bottom row icons */}
        <div className="flex w-full justify-between px-2 pt-2">
          <div className="flex items-center space-x-2">
            <div
              className="p-[10px] cursor-pointer hover:bg-[#F2F2F7] hover:rounded-[11px]"
              onClick={() => setShowEmojiPicker((prev) => !prev)}
            >
              <EmojiIcon />
            </div>
            <div className="p-[10px] cursor-pointer hover:bg-[#F2F2F7] hover:rounded-[11px]">
              <ImageChatIcon />
            </div>

            {/* File Upload */}
            <div
              className="p-[10px] cursor-pointer hover:bg-[#F2F2F7] hover:rounded-[11px]"
              onClick={handleFileClick}
              title="Attach file"
            >
              {uploading ? (
                <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <PaperClipChatIcon />
              )}
            </div>

            {/* Mic */}
            <div
              className={`relative p-[10px] cursor-pointer hover:bg-[#F2F2F7] hover:rounded-[11px] ${
                isListening ? "text-red-500" : ""
              } ${!isSupported ? "opacity-50 cursor-not-allowed" : ""}`}
              onClick={isSupported ? toggleListening : undefined}
              title={
                !isSupported
                  ? "Speech recognition not supported"
                  : isListening
                    ? "Stop Recording"
                    : "Start Recording"
              }
            >
              <MicChatIcon />
            </div>
          </div>

          {/* Send button */}
          <button
            disabled={!value}
            type="submit"
            className={`${value ? "bg-indigo-500 cursor-pointer" : "bg-gray-400 cursor-not-allowed"
              } text-white px-4 py-2 rounded-md transition`}
          >
            {uploading ? "Uploading..." : sendLabel}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatInput;
