import { ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

export const SelectDropdown = ({ name, options, placeholder = 'Select', value, onChange, className = '', errors, disabled, extraName, hideArrow = false, forceUpward = false, forceDownward = false }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [openUpward, setOpenUpward] = useState(false);
    const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
    const dropdownRef = useRef(null);
    const buttonRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (buttonRef.current && !buttonRef.current.contains(event.target) && 
                !event.target.closest('.select-dropdown-portal')) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        if (isOpen && buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            setDropdownPosition({
                top: rect.bottom,
                left: rect.left,
                width: rect.width
            });
            
            if (forceDownward) {
                setOpenUpward(false);
            } else if (forceUpward) {
                setOpenUpward(true);
            } else {
                const dropdownHeight = 240;
                const spaceBelow = window.innerHeight - rect.bottom;
                const spaceAbove = rect.top;
                if (spaceBelow < dropdownHeight && spaceAbove > dropdownHeight) {
                    setOpenUpward(true);
                } else {
                    setOpenUpward(false);
                }
            }
        }
    }, [isOpen, forceUpward, forceDownward]);

    const handleSelect = (optionKey) => {
        onChange(optionKey);
        setIsOpen(false);
    };

    // Fix: allow 0 as a valid value
    const optionLabel = (value !== undefined && value !== null&& value!=="") ? options.find((e) => e.key === value) : null;

    return (
        <div ref={dropdownRef} className={`relative ${className}`}>
            <button
                ref={buttonRef}
                type="button"
                disabled={disabled}
                onClick={() => setIsOpen(!isOpen)}
                className={`flex justify-between items-center w-full border ${(errors?.[name] || errors?.calendar_choosed) ? 'border-red-500' : 'border-[#E1E4EA]'} rounded-lg px-3 py-2 bg-white text-left hover:cursor-pointer focus:outline-none focus:border-[#675FFF]`}
            >
                <span className={`flex items-center gap-2 truncate ${!optionLabel ? 'text-[#5A687C]' : `${name == "lead_status" ? 'text-[#675FFF]' : 'text-[#1E1E1E]'}`}`}>
                    {optionLabel?.icon && (
                        <img src={optionLabel.icon} alt={optionLabel.label} className="w-5 h-5 flex-shrink-0" />
                    )}
                    {extraName ? `${extraName}: ${optionLabel?.label}` : (optionLabel?.label || placeholder)}
                </span>
                {!hideArrow && (
                  <ChevronDown className={`ml-2 h-4 w-4 text-gray-400 transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`} />
                )}
            </button>
            {isOpen && createPortal(
                <div
                    className={`fixed z-[9999] rounded-md bg-white shadow-lg border border-gray-200 max-h-40 sm:max-h-60 overflow-auto select-dropdown-portal`}
                    style={{
                        top: openUpward ? `${dropdownPosition.top - 4}px` : `${dropdownPosition.top + 4}px`,
                        left: `${dropdownPosition.left}px`,
                        width: `${dropdownPosition.width}px`,
                        transform: openUpward ? 'translateY(-100%)' : 'none'
                    }}
                >
                    <ul className="py-1 px-2 flex flex-col gap-1 my-1">
                        {options?.length > 0 && options.map((option) => (
                            <li
                                key={option.key}
                                className={`cursor-pointer font-[400] select-none relative px-4 py-2 hover:bg-[#F4F5F6] hover:rounded-lg hover:text-[#675FFF] flex items-center gap-2 ${value === option.key ? 'text-[#675FFF] bg-[#F4F5F6] rounded-lg' : 'text-[#5A687C]'}`}
                                onClick={() => handleSelect(option.key)}
                            >
                                {option.icon && (
                                    <img src={option.icon} alt={option.label} className="w-5 h-5 flex-shrink-0" />
                                )}
                                {option.label}
                            </li>
                        ))}
                    </ul>
                </div>,
                document.body
            )}
        </div>
    );
};
