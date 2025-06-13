import { ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export const SelectDropdown = ({ name, options, placeholder = 'Select', value, onChange, className = '', errors, disabled, extraName }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [openUpward, setOpenUpward] = useState(false);
    const dropdownRef = useRef(null);
    const buttonRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        if (isOpen && buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            const dropdownHeight = 240;
            const spaceBelow = window.innerHeight - rect.bottom;
            const spaceAbove = rect.top;
            if (spaceBelow < dropdownHeight && spaceAbove > dropdownHeight) {
                setOpenUpward(true);
            } else {
                setOpenUpward(false);
            }
        }
    }, [isOpen]);

    const handleSelect = (option) => {
        onChange(option);
        setIsOpen(false);
    };

    const optionLabel = value && options.find((e) => e.key === value);

    return (
        <div ref={dropdownRef} className={`relative ${className}`}>
            <button
                ref={buttonRef}
                type="button"
                disabled={disabled}
                onClick={() => setIsOpen(!isOpen)}
                className={`flex justify-between items-center w-full border ${(errors?.[name] || errors?.calendar_choosed) ? 'border-red-500' : 'border-[#E1E4EA]'} rounded-lg px-3 py-2 bg-white text-left hover:cursor-pointer focus:outline-none focus:border-[#675FFF]`}
            >
                <span className={`block truncate ${!optionLabel ? 'text-gray-500' : `${name == "lead_status" ? 'text-[#675FFF]' : 'text-[#5A687C]'}`}`}>
                    {extraName ? `${extraName}: ${optionLabel?.label}` : (optionLabel?.label || placeholder)}
                </span>
                <ChevronDown className={`ml-2 h-4 w-4 text-gray-400 transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`} />
            </button>
            {isOpen && (
                <div
                    className={`absolute z-10 w-full rounded-md bg-white shadow-lg border border-gray-200 max-h-60 overflow-auto ${openUpward ? 'bottom-full mb-1' : 'mt-1'}`}
                >
                    <ul className="py-1 px-2 flex flex-col gap-1">
                        {options.map((option) => (
                            <li
                                key={option.key}
                                className={`cursor-pointer font-[500] select-none relative px-4 py-2 hover:bg-[#F4F5F6] hover:rounded-lg hover:text-[#675FFF] ${value === option.key ? 'text-[#675FFF] bg-[#F4F5F6] rounded-lg' : 'text-[#5A687C]'}`}
                                onClick={() => handleSelect(option.key)}
                            >
                                {option.label}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};
