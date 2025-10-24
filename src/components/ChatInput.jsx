import { useState, useRef, useEffect } from "react";
import EmojiPicker from "emoji-picker-react";
import { EmojiIcon, ImageChatIcon, MicChatIcon, PaperClipChatIcon } from "../icons/icons";
import useWebSpeechAPI from "../hooks/useWebSpeechAPI";

const ChatInput = ({ value, onChange, onSend, sendLabel = "Send", placeholder = "Type a message..." }) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const pickerRef = useRef(null);
  const inputRef = useRef(null);
  const [originalValue, setOriginalValue] = useState(""); // Store original value before voice input

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
            <div className="p-[10px] cursor-pointer hover:bg-[#F2F2F7] hover:rounded-[11px]">
              <PaperClipChatIcon />
            </div>

            {/* Mic icon */}
            <div
              className={`relative p-[10px] cursor-pointer hover:bg-[#F2F2F7] hover:rounded-[11px] ${isListening ? "text-red-500" : ""
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
            {sendLabel}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatInput;
