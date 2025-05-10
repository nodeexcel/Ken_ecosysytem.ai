import React, { useState, useEffect, useRef } from 'react';
import { Delete, Notes, ThreeDots } from '../icons/icons';
import { ChevronDown, Info, X } from 'lucide-react';



const TimeSelector = ({ onSave, onCancel }) => {
  const [selectedHour, setSelectedHour] = useState('10');
  const [selectedMinute, setSelectedMinute] = useState('00');
  const [selectedPeriod, setSelectedPeriod] = useState('AM');

  const hours = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'));
  const minutes = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'));

  const handleSave = () => onSave(`${selectedHour}:${selectedMinute} ${selectedPeriod}`);

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 w-72">
      <div className="flex justify-between gap-3 mb-4">
        <select
          value={selectedHour}
          onChange={(e) => setSelectedHour(e.target.value)}
          className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-[#675FFF]"
        >
          {hours.map((hour) => (
            <option key={hour} value={hour}>
              {hour}
            </option>
          ))}
        </select>
        <span className="self-center text-lg">:</span>
        <select
          value={selectedMinute}
          onChange={(e) => setSelectedMinute(e.target.value)}
          className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-[#675FFF]"
        >
          {minutes.map((minute) => (
            <option key={minute} value={minute}>
              {minute}
            </option>
          ))}
        </select>
        <select
          value={selectedPeriod}
          onChange={(e) => setSelectedPeriod(e.target.value)}
          className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-[#675FFF]"
        >
          <option value="AM">AM</option>
          <option value="PM">PM</option>
        </select>
      </div>
      <div className="flex justify-between gap-2">
        <button
          onClick={handleSave}
          className="flex-1 bg-[#675FFF] text-white py-2 px-4 rounded hover:bg-[#5648ff]"
        >
          Save
        </button>
        <button
          onClick={onCancel}
          className="flex-1 border border-gray-300 py-2 px-4 rounded hover:bg-gray-50"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};




  // WeekSelector Component
  const WeekSelector = ({ onSave, onCancel }) => {
    const [selectedDays, setSelectedDays] = useState([]);
    const days = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
    const toggleDay = (day) => setSelectedDays(prev => prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]);
    const handleSave = () => onSave(selectedDays);
    return (
      <div className="bg-white rounded-lg shadow-lg p-4 ">
        <div className="space-y-2 mb-4">
          {days.map((day) => (
            <div key={day} onClick={() => toggleDay(day)} className={`p-2 rounded-lg cursor-pointer flex items-center gap-2 ${selectedDays.includes(day) ? 'bg-[#F0EFFF] text-[#675FFF]' : 'hover:bg-gray-50'}`}>
              <div className={`w-4 h-4 rounded border flex items-center justify-center ${selectedDays.includes(day) ? 'border-[#675FFF] bg-[#675FFF]' : 'border-gray-300'}`}>{selectedDays.includes(day) && <span className="text-white text-xs">✓</span>}</div>
              <span>{day}</span>
            </div>
          ))}
        </div>
        <div className="flex justify-between gap-2">
          <button onClick={handleSave} className="flex-1 bg-[#675FFF] text-white py-2 px-4 rounded hover:bg-[#5648ff]">Save</button>
          <button onClick={onCancel} className="flex-1 border border-gray-300 py-2 px-4 rounded hover:bg-gray-50">Cancel</button>
        </div>
      </div>
    );
  };

  // Dropdown Component
  const Dropdown = ({ options, placeholder = 'Select', value, onChange, className = '' }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    useEffect(() => {
      const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
          setIsOpen(false);
        }
      };
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);
    const handleSelect = (option) => {
      onChange(option);
      setIsOpen(false);
    };
    return (
      <div ref={dropdownRef} className={`relative w-full ${className}`}>
        <button type="button" onClick={() => setIsOpen(!isOpen)} className="flex justify-between items-center w-full border border-gray-300 rounded px-3 py-2 bg-white text-left focus:outline-none focus:ring-1 focus:ring-[#675FFF]">
          <span className={`block truncate ${!value ? 'text-gray-500' : 'text-gray-900'}`}>{value || placeholder}</span>
          <ChevronDown className={`ml-2 h-4 w-4 text-gray-400 transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`} />
        </button>
        {isOpen && (
          <div className="absolute z-10 mt-1 w-full rounded-md bg-white shadow-lg border border-gray-200 max-h-60 overflow-auto">
            <ul className="py-1">
              {options.map((option) => (
                <li key={option} className={`cursor-pointer select-none relative px-4 py-2 hover:bg-[#F4F5F6] ${value === option ? 'text-[#675FFF]' : 'text-gray-900'}`} onClick={() => handleSelect(option)}>{option}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  };






function CampaignsTable() {
    const [campaignData, setCampaignData] = useState([
        { name: 'Campaign', opened: '-', clicked: '-', bounced: '', status: "Issue Detected" },
        { name: 'Campaign', opened: '-', clicked: '-', bounced: '', status: "Planned" }
    ]);

    const [activeDropdown, setActiveDropdown] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [startDate, setStartDate] = useState("");
    const [toggle, setToggle] = useState(false);
    const [toggleBranding, setToggleBranding] = useState(false);
    const [showTimeSelector, setShowTimeSelector] = useState(false);
    const [showWeekSelector, setShowWeekSelector] = useState(false);
    const [selectedTime, setSelectedTime] = useState("");
    const [selectedDays, setSelectedDays] = useState([]);

    // Dropdown values
    const [campaignObjective, setCampaignObjective] = useState("");
    const [ctaType, setCtaType] = useState("");
    const [targetList, setTargetList] = useState("");
    const [desiredTone, setDesiredTone] = useState("");
    const [messageLanguage, setMessageLanguage] = useState("");
    const [sendTimeWindow, setSendTimeWindow] = useState("");
    const [frequency, setFrequency] = useState("");
    const [textLength, setTextLength] = useState("");

   const ctaTypeOptions = ["Book a Meeting", "Purchase",
    "Visit a Page",
    "Replay",
    "Download"
   ];
   const toneOptions = ["Friendly", "Professional",
"StoryTelling",
"Provocation",
"Education",
"Inspiring"
   ];

   const languageOptions = ["EN", "FR"];

   const wordOptions = ["50 - 100 words", "100 - 200 words", "200 - 400 words", "400 - 800 words"];
    const deleteRow = (index) => {
        const updated = [...campaignData];
        updated.splice(index, 1);
        setCampaignData(updated);
    };

    const handleDropdownClick = (index) => {
        setActiveDropdown(activeDropdown === index ? null : index);
    };

    const handleTimeSelect = (time) => {
        setSelectedTime(time);
        setSendTimeWindow(time);
        setShowTimeSelector(false);
    };

    const handleDaysSelect = (days) => {
        setSelectedDays(days);
        setFrequency(days.join(', '));
        setShowWeekSelector(false);
    };

    const renderColor = (text) => {
        switch (text) {
            case "Issue Detected":
                return `text-[#B32318] bg-[#FEF3F2] border-[#FECDC9]`;
            case "Running":
                return `text-[#067647] bg-[#ECFDF3] border-[#AAEFC6]`;
            case "Planned":
                return `text-[#675FFF] bg-[#F0EFFF] border-[#675FFF]`;
            default:
                return `text-[#344054] bg-[#fff] border-[#EAECF0]`;
        }
    };

    return (
        <>
            <div className="w-full p-4 flex flex-col gap-4 onest">
                <div className="flex justify-between items-center">
                    <h1 className="text-gray-900 font-semibold text-xl md:text-2xl">Campaigns</h1>
                    <button
                        onClick={() => setShowModal(true)}
                        className="bg-[#675FFF] text-white rounded-md text-sm md:text-base px-4 py-2"
                    >
                        Campaigns
                    </button>
                </div>

                <div className="overflow-auto w-full rounded-lg">
                <table className="w-full rounded-2xl">
                    <thead>
                        <tr className="text-left text-[#5A687C]">
                            <th className="px-6 py-3 text-[16px] font-medium">Name</th>
                            <th className="px-6 py-3 text-[16px] font-medium">Opened</th>
                            <th className="px-6 py-3 text-[16px] font-medium">Clicked</th>
                            <th className="px-6 py-3 text-[16px] font-medium">Bounced</th>
                            <th className="px-6 py-3 text-[16px] font-medium">Status</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody className='bg-white border border-[#E1E4EA]'>
                        {campaignData.map((item, index) => (
                            <tr key={index} className={`${index !== campaignData.length - 1 ? 'border-b border-gray-200' : ''}`}>
                                <td className="px-6 py-4 text-sm text-[#1E1E1E] font-[600]">{item.name}</td>
                                <td className="px-6 py-4 text-sm text-[#1E1E1E]">{item.opened}</td>
                                <td className="px-6 py-4 text-sm text-[#1E1E1E]">{item.clicked}</td>
                                <td className="px-6 py-4 text-sm text-[#1E1E1E]">{item.bounced}</td>
                                <td className="px-6 py-4 text-sm text-[#1E1E1E]"><div className={`px-2 py-1 w-fit border rounded-2xl ${renderColor(item.status)}`}>{item.status}</div></td>
                                <td className="px-6 py-4 text-sm text-[#1E1E1E]">
                                    <button onClick={() => handleDropdownClick(index)} className="p-2 rounded-lg">
                                        <div className='bg-[#F4F5F6] p-2 rounded-lg'><ThreeDots /></div>
                                    </button>
                                    {activeDropdown === index && (
                                        <div className="absolute right-6  w-48 rounded-md shadow-lg bg-white ring-1 ring-gray-300 ring-opacity-5 z-10">
                                            <div className="py-1">
                                                <button
                                                    className="block w-full text-left px-4 py-2 text-sm text-[#5A687C] hover:bg-[#F4F5F6]"
                                                    onClick={() => {
                                                        // Handle delete action
                                                        setActiveDropdown(null);
                                                    }}
                                                >
                                                    <div className="flex items-center gap-2">{<Notes />} <span className="hover:text-[#675FFF]">View Report</span> </div>
                                                </button>
                                                <hr style={{ color: "#E6EAEE" }} />
                                                <button
                                                    className="block w-full text-left px-4 py-2 text-sm text-[#FF3B30] hover:bg-[#F4F5F6]"
                                                    onClick={() => {
                                                        // Handle delete action
                                                        deleteRow(index);
                                                        setActiveDropdown(null);
                                                    }}
                                                >
                                                    <div className="flex items-center gap-2">{<Delete />} <span>Delete</span> </div>
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            </div>

            {/* Modal Overlay */}
            {showModal && (
                <div className="z-50 flex items-center justify-center  fixed inset-0 bg-[rgb(0,0,0,0.7)]">
                    <div className="bg-white max-w-2xl w-full mx-4 md:mx-auto rounded-xl shadow-lg p-6 relative overflow-auto max-h-[90vh]">
                        <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800">
                            <X />
                        </button>
                        <h2 className="text-xl font-semibold mb-4">Add New Campaign</h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Campaign Title</label>
                                <input type="text" placeholder="Enter campaign title" className="w-full border border-gray-300 rounded px-3 py-2" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Campaign Objective</label>
                                <Dropdown
                                    options={["Promote an offer", "Inform / Educate", "Re-engage leads", "Announce a new feature", "Other"]}
                                    value={campaignObjective}
                                    onChange={setCampaignObjective}
                                    placeholder="Select"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Main Subject</label>
                                <input type="text" placeholder="Enter main subject" className="w-full border border-gray-300 rounded px-3 py-2" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">CTA Type</label>
                                <Dropdown
                                    options={ctaTypeOptions}
                                    value={ctaType}
                                    onChange={setCtaType}
                                    placeholder="Select"
                                />
                                <button className="text-[#675FFF] text-md mt-4 ">+ Call to action link</button>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">List Of Target</label>
                                <Dropdown
                                    options={["Segment A", "Segment B"]}
                                    value={targetList}
                                    onChange={setTargetList}
                                    placeholder="Select"
                                />
                                <p className="text-sm mt-4 ">Estimated Segment Size: 12</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Desired Tone</label>
                                <Dropdown
                                    options={toneOptions}
                                    value={desiredTone}
                                    onChange={setDesiredTone}
                                    placeholder="Select"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Language</label>
                                <Dropdown
                                    options={languageOptions}
                                    value={messageLanguage}
                                    onChange={setMessageLanguage}
                                    placeholder="Select"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="relative">
                                    <label className="block text-sm font-medium mb-1">Send Time Window</label>
                                    <div
                                        onClick={() => setShowTimeSelector(true)}
                                        className="w-full border border-gray-300 rounded px-3 py-2 cursor-pointer"
                                    >
                                        {selectedTime || "Select Time"}
                                    </div>
                                    {showTimeSelector && (
                                        <div className="absolute z-50 mt-1">
                                            <TimeSelector
                                                onSave={handleTimeSelect}
                                                onCancel={() => setShowTimeSelector(false)}
                                            />
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Start Date</label>
                                    <input
                                        type="date"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                        className="w-full border border-gray-300 rounded px-3 py-2"
                                    />
                                </div>
                                <div className="relative">
                                    <label className="block text-sm font-medium mb-1">Frequency</label>
                                    <div
                                        onClick={() => setShowWeekSelector(true)}
                                        className="w-full border border-gray-300 rounded px-3 py-2 cursor-pointer"
                                    >
                                        {selectedDays.length > 0 ? selectedDays.join(', ') : "Select Days"}
                                    </div>
                                    {showWeekSelector && (
                                        <div className="absolute z-50 mt-1">
                                            <WeekSelector
                                                onSave={handleDaysSelect}
                                                onCancel={() => setShowWeekSelector(false)}
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div>
                                <div className="flex items-center justify-between">
                                    <label className="text-sm font-medium">Include branding (Brain A1)?</label>
                                    <div className='flex items-center gap-6'>
                                        <div className='relative group'>
                                            <Info className="text-gray-500 cursor-pointer" size={16} />
                                            <div className="absolute bottom-full mb-1 w-60 -right-50 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 hidden group-hover:flex transition-opacity duration-200 z-10">
                                                Continue in the same spirit, format, tone, style, and overall vibe as your previous emails. To enable this, integrate your email platform or upload your past emails as a PDF in the "AI Brain
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => setToggleBranding(!toggleBranding)}
                                            className={`w-11 h-6 rounded-full relative transition-colors duration-300 ${toggleBranding ? "bg-[#7065F0]" : "bg-gray-300"}`}
                                        >
                                            <span
                                                className={`block w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform duration-300 ${toggleBranding ? "translate-x-5" : "translate-x-0.5"}`}
                                            ></span>
                                        </button>
                                    </div>
                                </div>
                                <p className='text-sm text-gray-500'>Use AI Brain as the reference for your emails</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Custom prompt for A1</label>
                                <textarea placeholder="e.g. Write a re-engagement email for cold leads about my A1 training offer" className="w-full border border-gray-300 rounded px-3 py-2"></textarea>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1 flex items-center gap-2">
                                    <p>Text Length</p>
                                    <div className="relative group">
                                        <Info className="text-gray-500 cursor-pointer" size={16} />
                                        <div className="absolute bottom-full mb-1 w-60 left-3 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 hidden group-hover:flex transition-opacity duration-200 z-10">
                                            Choose the optimal length for your emails — see industry benchmarks in our Help Center.
                                        </div>
                                    </div>
                                </label>
                                <Dropdown
                                    options={wordOptions}
                                    value={textLength}
                                    onChange={setTextLength}
                                    placeholder="Select"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Products/Service to feature</label>
                                <input type="text" placeholder="Enter Products/Service to feature" className="w-full border border-gray-300 rounded px-3 py-2" />
                            </div>

                            <div className="flex items-center justify-between">
                                <label className="text-sm font-medium">Review before sending</label>
                                <button
                                    onClick={() => setToggle(!toggle)}
                                    className={`w-11 h-6 rounded-full relative transition-colors duration-300 ${toggle ? "bg-[#7065F0]" : "bg-gray-300"}`}
                                >
                                    <span
                                        className={`block w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform duration-300 ${toggle ? "translate-x-5" : "translate-x-0.5"}`}
                                    ></span>
                                </button>
                            </div>
                            <p className='text-sm text-gray-500 -mt-4'>You receive a notification 24h before sending to review and approve the email.</p>

                            <div className="bg-orange-100 text-sm text-black rounded-md px-4 py-2">
                                You'll be able to review and edit each email 24 hours before it's sent, directly from your calendar.
                            </div>

                            <div className="flex justify-between gap-4 pt-4">
                                <button className="px-4 py-2 bg-[#675FFF] text-white rounded w-1/2">Launch Campaign</button>
                                <button className="px-4 py-2 border border-gray-300 rounded w-1/2">Save As Draft</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default CampaignsTable;