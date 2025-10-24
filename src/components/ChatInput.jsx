import { useState, useRef, useEffect } from "react";
import EmojiPicker from "emoji-picker-react";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import { EmojiIcon, ImageChatIcon, MicChatIcon, PaperClipChatIcon } from "../icons/icons";

const ChatInput = ({ value, onChange, onSend, sendLabel = "Send", placeholder = "Type a message..." }) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const pickerRef = useRef(null);
  const inputRef = useRef(null);
  const [isListening, setIsListening] = useState(false);
  const [originalValue, setOriginalValue] = useState(""); // Store original value before voice input

  // Speech recognition hook
  const { 
    transcript, 
    listening, 
    resetTranscript, 
    browserSupportsSpeechRecognition 
  } = useSpeechRecognition();

  // Check if browser supports speech recognition and if we're in a secure context
  const isSecureContext = window.isSecureContext || window.location.protocol === 'https:';
  const speechSupported = browserSupportsSpeechRecognition && isSecureContext;
  
  if (!browserSupportsSpeechRecognition) {
    console.warn('Browser does not support speech recognition');
  }
  
  if (!isSecureContext) {
    console.warn('Speech recognition requires HTTPS in production');
  }

  const handleEmojiSelect = (emojiData) => {
    onChange(value + emojiData.emoji);
  };

  // Update input when transcript changes - show original value + transcript while listening
  useEffect(() => {
    if (transcript && isListening) {
      // Combine original value with current transcript
      const combinedValue = originalValue ? `${originalValue} ${transcript}` : transcript;
      onChange(combinedValue);
      // Scroll input to end
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

  // Cleanup speech recognition on unmount
  useEffect(() => {
    return () => {
      if (listening) {
        SpeechRecognition.stopListening();
      }
    };
  }, [listening]);


  // Reset original value when not listening
  useEffect(() => {
    if (!listening) {
      setOriginalValue("");
    }
  }, [listening]);

  // Toggle speech recognition
  const toggleListening = () => {
    console.log("calling==========")
    if (!speechSupported) {
      if (!isSecureContext) {
        alert('Speech recognition requires HTTPS. Please ensure your site is served over HTTPS.');
      } else {
        alert('Your browser does not support speech recognition. Please use Chrome, Edge, or Safari.');
      }
      return;
    }

    if (listening) {
      SpeechRecognition.stopListening();
      setIsListening(false);
      // Finalize the value: original value + final transcript
      if (transcript) {
        const finalValue = originalValue ? `${originalValue} ${transcript}` : transcript;
        onChange(finalValue);
      }
    } else {
      // Store the current value before starting voice input
      setOriginalValue(value);
      resetTranscript();
      setIsListening(true);
      
      SpeechRecognition.startListening({ 
        continuous: true, 
        language: "en-US",
        interimResults: true
      });
    }
  };

  return (
    <div className="w-full mx-auto p-2 relative">
      <form
        onSubmit={onSend}
        className="flex w-full flex-col items-center gap-2 p-2 rounded-2xl border border-gray-300 shadow-sm bg-white relative"
      >
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
        {listening && (
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-800 text-white px-4 py-2 rounded-full text-sm shadow-lg flex items-center gap-2">
            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
            <span>Listening... Speak now</span>
            {/* Stop button next to the text */}
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
            disabled={listening} // disable typing while listening
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
            <div className="p-[10px] cursor-pointer hover:bg-[#F2F2F7] hover:rounded-[11px]">
              <PaperClipChatIcon />
            </div>

            {/* Mic icon */}
            <div
              className={`relative p-[10px] cursor-pointer hover:bg-[#F2F2F7] hover:rounded-[11px] ${
                listening ? "text-red-500" : ""
              } ${!speechSupported ? "opacity-50 cursor-not-allowed" : ""}`}
              onClick={toggleListening}
              title={
                !speechSupported 
                  ? (isSecureContext ? "Speech recognition not supported" : "Speech recognition requires HTTPS")
                  : listening 
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
            className={`${
              value ? "bg-indigo-500 cursor-pointer" : "bg-gray-400 cursor-not-allowed"
            } text-white px-4 py-2 rounded-md transition`}
          >
            {sendLabel}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatInput;
