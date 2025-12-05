import React from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import SuccessIcon from '../assets/svg/SuccessIcon.svg';
import ErrorIcon from '../assets/svg/ErrorIcon.svg';

const StatusModal = ({
  isOpen,
  onClose,
  type = 'success', // 'success' or 'error'
  title,
  description,
  highlightText, // Text to highlight in description (e.g., campaign name)
  primaryButtonText,
  onPrimaryClick,
}) => {
  if (!isOpen) return null;

  const icon = type === 'success' ? SuccessIcon : ErrorIcon;

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/20"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-2xl shadow-xl max-w-md w-full mx-4 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#5A687C] hover:text-[#1E1E1E] transition-colors cursor-pointer z-10"
        >
          <X size={20} />
        </button>

        {/* Content Section */}
        <div className="p-6">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <img src={icon} alt={type === 'success' ? 'Success' : 'Error'} className="w-20 h-20" />
          </div>

          {/* Title */}
          <h2 className="text-2xl font-[500] text-[#1E1E1E] text-center mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>
            {title}
          </h2>

          {/* Description */}
          <p className="text-base text-[#5A687C] text-center mb-8 leading-relaxed px-2" style={{ fontFamily: 'Inter, sans-serif' }}>
            {highlightText ? (
              <>
                {description.split(highlightText)[0]}
                <span className="font-[400] text-[#1E1E1E]">"{highlightText}"</span>
                {description.split(highlightText)[1]}
              </>
            ) : (
              description
            )}
          </p>
        </div>

        {/* Footer Section with Border */}
        <div className="border-t border-[#E1E4EA] px-8 py-4">
          <button
            onClick={onPrimaryClick || onClose}
            className="w-full px-6 py-3 bg-[#675FFF] hover:bg-[#5A4FE6] text-white font-[600] text-base rounded-xl transition-colors cursor-pointer"
          >
            {primaryButtonText}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default StatusModal;

