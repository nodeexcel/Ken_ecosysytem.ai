import { useState, useRef, useEffect } from "react";
import EmojiPicker from "emoji-picker-react";
import { EmojiIcon, ImageChatIcon, MicChatIcon, PaperClipChatIcon } from "../icons/icons";

const ChatInput = ({ value, onChange, onSend, sendLabel = "Send", placeholder = "Type a message..." }) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const pickerRef = useRef(null);

  const handleEmojiSelect = (emojiData) => {
    onChange(value + emojiData.emoji); // append selected emoji
     // close picker after selection
  };

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

  return (
    <div className="w-full mx-auto p-2 relative">
      <form
        onSubmit={onSend}
        className="flex w-full flex-col items-center gap-2 p-2 rounded-2xl border border-gray-300 shadow-sm bg-white"
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

        {/* Input */}
        <div className="flex items-center w-full border-b border-gray-200 pb-2">
          <input
            type="text"
            className="flex-1 w-full px-6 py-3 outline-none border-none text-sm"
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
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
            <div className="p-[10px] cursor-pointer hover:bg-[#F2F2F7] hover:rounded-[11px]">
              <MicChatIcon />
            </div>
          </div>

          {/* Send button */}
          <button
            disabled={!value}
            type="submit"
            className={`${value ? "bg-indigo-500 cursor-pointer" : "bg-gray-400 cursor-not-allowed"} text-white px-4 py-2 rounded-md transition`}
          >
            {sendLabel}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatInput;
