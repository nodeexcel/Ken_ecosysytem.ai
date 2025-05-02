import React, { useEffect, useState } from 'react';
import creditCardIcon from '../assets/svg/credit.svg'; // Replace with actual paths
import { getTransactionsHistory } from '../api/payment';
import { PiCoinsThin } from 'react-icons/pi';

const TransactionHistory = () => {
    const [transactions, setTransactions] = useState("")
    const [loading, setLoading] = useState(true)
    const [message, setMessage] = useState("")

    const renderTransactionData = async () => {
        setMessage("")
        try {
            const response = await getTransactionsHistory()
            if (response?.status === 200) {
                setTransactions(response?.data?.data)
                if (response?.data?.data?.length == 0) {
                    setLoading(false)
                    setMessage("No Data Found")
                }
            }

        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        if (transactions?.length > 0) {
            setLoading(false)
        }

    }, [transactions])

    useEffect(() => {
        renderTransactionData()
    }, [])
    return (
        <div className="overflow-x-auto p-5 onest">
            <table className="w-full min-w-[800px]">
                <thead>
                    <tr className="text-left text-gray-600">
                        <th className="pb-6 pr-8 text-[16px] onest font-[400] text-[#5A687C]">Transaction</th>
                        <th className="pb-6 px-8 text-[16px] onest font-[400] text-[#5A687C] flex items-center gap-2">
                            Amount <img src={creditCardIcon} alt="Credit Icon" />
                        </th>
                        <th className="pb-6 px-8 text-[16px] onest font-[400] text-[#5A687C]">Status</th>
                        <th className="pb-6 px-8 text-[16px] onest font-[400] text-[#5A687C]">Email</th>
                        <th className="pb-6 pl-8 text-[16px] onest font-[400] text-[#5A687C]">Date and Time</th>
                        <th className="pb-6 pl-8 text-[16px] onest font-[400] text-[#5A687C]">Receipt</th>
                    </tr>
                </thead>
                <tbody>
                    {loading ? <div><span className='loader' /></div> : message ? <p>{message}</p> : <> {transactions?.length > 0 && transactions.map((row, index) => (
                        <tr key={index} className="border-b border-gray-100">
                            <td className="py-3 pr-8">
                                <div className="flex items-center gap-4">
                                    <div className="px-3 py-3 bg-[#33fb721a] rounded-2xl">
                                        <PiCoinsThin color='green' size={20} />
                                    </div>
                                    <div>
                                        <div className="font-medium text-[15px] capitalize">{row.subscriptionType}</div>
                                        <div className="text-[13px] text-gray-500">{row.paymentMethod}</div>
                                    </div>
                                </div>
                            </td>
                            <td className="py-3 px-8 text-[15px]">€{row.amountPaid}</td>
                            <td className="py-3 px-8 text-green-600 text-[15px] capitalize">{row.status}</td>
                            <td className="py-3 px-8 text-[14px]">{row.email}</td>
                            <td className="py-3 pl-8 text-indigo-600 text-[14px]">
                                {new Date(row.transactionDate).toLocaleString()}
                            </td>
                            <td className="py-3 pl-8 text-[14px]">
                                {row.receiptUrl ? (
                                    <a
                                        href={row.receiptUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 underline"
                                    >
                                        View
                                    </a>
                                ) : (
                                    <span className="text-gray-400">N/A</span>
                                )}
                            </td>
                        </tr>
                    ))}</>}
                </tbody>
            </table>
        </div>
    );
};

export default TransactionHistory;
