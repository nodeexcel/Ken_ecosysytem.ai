import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import SuccessIcon from '../assets/svg/SuccessIcon.svg';
import ErrorIcon from '../assets/svg/ErrorIcon.svg';

/**
 * Small toast-style notification for lightweight events (delete, update, etc.)
 *
 * Props:
 * - open: boolean
 * - type: 'success' | 'error'
 * - title: string
 * - description?: string
 * - highlightText?: string  // optional bold segment inside description
 * - onClose: () => void
 * - position?: 'top-center' | 'top-right' | 'bottom-right' (default: 'top-center')
 * - autoClose?: number (milliseconds, default: 3000)
 */
const ToastModal = ({
  open,
  type = 'success',
  title,
  description,
  highlightText,
  onClose,
  position = 'top-center',
  autoClose = 3000,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    if (open) {
      // Trigger fade-in animation
      setIsVisible(true);
      setIsExiting(false);

      // Auto-close after specified duration
      const timer = setTimeout(() => {
        setIsExiting(true);
        // Wait for exit animation to complete before calling onClose
        setTimeout(() => {
          setIsVisible(false);
          onClose();
        }, 300); // Match animation duration
      }, autoClose);

      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
      setIsExiting(false);
    }
  }, [open, autoClose, onClose]);

  if (!open && !isVisible) return null;

  const icon = type === 'success' ? SuccessIcon : ErrorIcon;
  const iconBgColor = type === 'success' ? 'bg-[#ECFDF3]' : 'bg-[#FEF2F2]';

  const positionClasses = 'top-2 right-16'; // top-center default

  return (
    <div className="fixed inset-0 z-[9999] pointer-events-none">
      <div
        className={`absolute ${positionClasses} pointer-events-auto transition-all duration-300 ease-in-out ${
          isExiting
            ? 'opacity-0 translate-y-[-10px] scale-95'
            : isVisible
            ? 'opacity-100 translate-y-0 scale-100'
            : 'opacity-0 translate-y-[-10px] scale-95'
        }`}
      >
        <div className="flex items-start gap-3 bg-white rounded-xl shadow-lg px-2 py-2 min-w-[320px] max-w-[345px] border border-[#E5E7EB]">
          {/* Icon */}
          <div className="mt-1 flex-shrink-0">
            <div className={`w-10 h-10 rounded-full ${iconBgColor} flex items-center justify-center`}>
              <img
                src={icon}
                alt={type === 'success' ? 'Success' : 'Error'}
                className="w-10 h-10"
              />
            </div>
          </div>

          {/* Text */}
          <div className="flex-1">
            <h3 className="text-sm font-[600] text-[#111827] mb-0.5">
              {title}
            </h3>
            {description && (
              <p className="text-xs text-[#6B7280] leading-snug">
                {highlightText && description.includes(highlightText) ? (
                  <>
                    {description.split(highlightText)[0]}
                    <span className="font-[600] text-[#111827]">
                      {highlightText}
                    </span>
                    {description.split(highlightText)[1]}
                  </>
                ) : (
                  description
                )}
              </p>
            )}
          </div>

          {/* Close */}
          <button
            type="button"
            onClick={() => {
              setIsExiting(true);
              setTimeout(() => {
                setIsVisible(false);
                onClose();
              }, 300);
            }}
            className="mt-0.5 text-[#9CA3AF] hover:text-[#4B5563] transition-colors cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ToastModal;


