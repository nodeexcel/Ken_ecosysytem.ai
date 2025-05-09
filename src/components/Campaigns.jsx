import React, { useState } from 'react';
import { Delete, Notes, ThreeDots } from '../icons/icons';

function CampaignsTable() {
    const [campaignData, setCampaignData] = useState([
        {
            name: 'Campaign',
            opened: '-',
            clicked: '-',
            bounced: '',
            status: "Issue Detected"
        },
        {
            name: 'Campaign',
            opened: '-',
            clicked: '-',
            bounced: '',
            status: "Planned"
        }
    ]);

    const [activeDropdown, setActiveDropdown] = useState(null);

    const toggleStatus = (index, key) => {
        const updated = [...campaignData];
        updated[index][key] = !updated[index][key];
        setCampaignData(updated);
    };

    const deleteRow = (index) => {
        const updated = [...campaignData];
        updated.splice(index, 1);
        setCampaignData(updated);
    };

    const handleDropdownClick = (index) => {
        setActiveDropdown(activeDropdown === index ? null : index);
    };

    const renderColor = (text) => {
        switch (text) {
            case "Issue Detected":
                return `text-[#B32318] bg-[#FEF3F2] border-[#FECDC9]`
            case "Running":
                return `text-[#067647] bg-[#ECFDF3] border-[#AAEFC6]`
            case "Planned":
                return `text-[#675FFF] bg-[#F0EFFF] border-[#675FFF]`
            default:
                return `text-[#344054] bg[#fff] border[#EAECF0]`
        }
    }

    return (
        <div className="w-full p-4 flex flex-col gap-4 onest ">
            <div className="flex justify-between items-center">
                <h1 className="text-gray-900 font-semibold text-xl md:text-2xl">Campaigns</h1>
                <button className="bg-[#675FFF] text-white rounded-md text-sm md:text-base px-4 py-2">
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
            <div className="w-full border rounded-lg border-dashed border-[#C0C0C0] mt-4 p-3 flex justify-center">
                <button
                    className="text-[#5E54FF] bg-transparent px-6 py-2 rounded-md text-[16px] font-[500]"
                >
                    + Add New
                </button>
            </div>
        </div>
    );
}

export default CampaignsTable;
