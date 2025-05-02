import React, { useState } from 'react';
import { FaTrash } from 'react-icons/fa';

function CampaignDashboard() {
    const [campaignData, setCampaignData] = useState([
        {
            name: 'XYZ',
            sentDate: '27/03/2025 03:30 PM',
            sentTo: 0,
            status: true,
            leadStatus: true,
        },
        {
            name: 'XYZ',
            sentDate: '27/03/2025 03:30 PM',
            sentTo: 0,
            status: true,
            leadStatus: true,
        },
    ]);

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

    return (
        <div className="w-full p-4 flex flex-col gap-4 onest ">
            <div className="flex justify-between items-center">
                <h1 className="text-gray-900 font-semibold text-xl md:text-2xl">Campaigns</h1>
                <button className="bg-[#675FFF] text-white rounded-md text-sm md:text-base px-4 py-2">
                    Add Campaign
                </button>
            </div>

            <div className="overflow-auto">
                <table className="min-w-full rounded-2xl">
                    <thead>
                        <tr className="text-left text-[#5A687C]">
                            <th className="px-6 py-3 text-[16px] font-medium">Name</th>
                            <th className="px-6 py-3 text-[16px] font-medium">Sent (date)</th>
                            <th className="px-6 py-3 text-[16px] font-medium">Sent to (numbers)</th>
                            <th className="px-6 py-3 text-[16px] font-medium">Status</th>
                            <th className="px-6 py-3 text-[16px] font-medium">Lead Status</th>
                            <th className="px-6 py-3 text-[16px] font-medium">Actions</th>
                        </tr>
                    </thead>
                    <tbody className='bg-white shadow-sm'>
                        {campaignData.map((item, index) => (
                            <tr key={index} className="text-center">
                                <td className="px-6 py-4 text-sm text-gray-800 font-semibold">{item.name}</td>
                                <td className="px-6 py-4 text-sm text-gray-700">{item.sentDate}</td>
                                <td className="px-6 py-4 text-sm text-gray-700">{item.sentTo}</td>

                                <td className="px-6 py-4 text-sm items-center gap-2">
                                    <div className='flex justify-center items-center gap-2'>
                                    <p className="bg-green-100 text-green-700 px-2 py-1 text-xs rounded-full">
                                        {item.status ? 'Active' : 'Paused'}
                                    </p>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            className="sr-only peer"
                                            checked={item.status}
                                            onChange={() => toggleStatus(index, 'status')}
                                        />
                                        <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-400 rounded-full peer dark:bg-gray-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
                                    </label>
                                    </div>
                                </td>

                                <td className="px-6 py-4 text-sm items-center gap-2">
                                   <div className='flex justify-center items-center gap-2'>
                                   <p className="bg-green-100 text-green-700 px-2 py-1 text-xs rounded-full">
                                        {item.leadStatus ? 'Active' : 'Inactive'}
                                    </p>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            className="sr-only peer"
                                            checked={item.leadStatus}
                                            onChange={() => toggleStatus(index, 'leadStatus')}
                                        />
                                        <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-400 rounded-full peer dark:bg-gray-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
                                    </label>
                                   </div>
                                </td>

                                <td className="px-6 py-4 text-sm text-gray-700">
                                    <button onClick={() => deleteRow(index)} className="text-red-500 hover:text-red-700">
                                        <FaTrash />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="w-full border border-dashed border-[#C0C0C0] mt-4 p-3 flex justify-center">
                <button
                    className="text-[#5E54FF] bg-transparent px-6 py-2 rounded-md text-[16px] font-[500]"
                >
                    + Add New
                </button>
            </div>
        </div>
    );
}

export default CampaignDashboard;
