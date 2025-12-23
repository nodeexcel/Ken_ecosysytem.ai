import { useState, useRef, useEffect } from 'react'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import linkedinIcon from '../assets/svg/linkedin.svg'
import KenImage  from '../assets/svg/KenNewLogo.svg'
import { Eye, EyeOff, ChevronDown } from 'lucide-react'
import TotalCampaigns from '../assets/svg/TotalCampaigns.svg'
import ActiveCampaign from '../assets/svg/ActiveCampaign.svg'
import InvitationsAccepted from '../assets/svg/InvitationsAccepted.svg'
import AcceptanceRate from '../assets/svg/AcceptanceRate.svg'
import AnsweredMessage from '../assets/svg/AnsweredMessage.svg'
import ResponseRate from '../assets/svg/ResponseRate.svg'
import { getLinkedInAccounts } from '../api/brainai'
import { SelectDropdown } from './Dropdown'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from "chart.js"
import { Line } from "react-chartjs-2"

// Register Chart.js components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
)

function KenOverview() {
    const navigate = useNavigate()
    const [step, setStep] = useState("login") // "login", "otp", or "dashboard"
    const [activityView, setActivityView] = useState("invitations") // "invitations" or "messages"
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [otp, setOtp] = useState(["", "", "", ""])
    const otpRefs = [useRef(null), useRef(null), useRef(null), useRef(null)]
    const [linkedInAccounts, setLinkedInAccounts] = useState([])
    const [selectedAccount, setSelectedAccount] = useState("")
    const [loadingAccounts, setLoadingAccounts] = useState(true)

    const handleGetLinkedInAccounts = async () => {
        setLoadingAccounts(true)
        try {
            const response = await getLinkedInAccounts();
            if (response?.status === 200) {
                const accounts = response?.data?.linkedin_account_info || response?.data?.linkedin_accounts || response?.data?.data || []
                setLinkedInAccounts(Array.isArray(accounts) ? accounts : [])
                
                // If only one account, select it by default
                if (accounts.length === 1) {
                    setSelectedAccount(accounts[0].linkedin_id?.toString() || accounts[0].id?.toString() || "")
                }
            } else {
                setLinkedInAccounts([])
            }
        } catch (error) {
            console.error("Error fetching LinkedIn accounts:", error)
            setLinkedInAccounts([])
        } finally {
            setLoadingAccounts(false)
        }
    }

    useEffect(() => {
        handleGetLinkedInAccounts()
    }, [])

    const handleLoginSubmit = (e) => {
        e.preventDefault()
        // For now, just show OTP screen with static data
        setStep("otp")
    }

    const handleOtpChange = (index, value) => {
        if (value.length > 1) return
        const newOtp = [...otp]
        newOtp[index] = value
        setOtp(newOtp)

        if (value && index < otp.length - 1) {
            otpRefs[index + 1].current.focus()
        }
    }

    const handleOtpKeyDown = (index, e) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            otpRefs[index - 1].current.focus()
        }
    }

    const handleOtpPaste = (e) => {
        e.preventDefault()
        const paste = e.clipboardData.getData('text').trim()
        if (!/^\d+$/.test(paste)) return

        const pasteArray = paste.slice(0, 4).split('')
        const newOtp = [...otp]
        pasteArray.forEach((char, idx) => {
            newOtp[idx] = char
        })
        setOtp(newOtp)

        const firstEmpty = pasteArray.length < 4 ? pasteArray.length : 3
        if (otpRefs[firstEmpty]?.current) {
            otpRefs[firstEmpty].current.focus()
        }
    }

    const handleOtpSubmit = (e) => {
        e.preventDefault()
        // For now, show dashboard with static data
        setStep("dashboard")
    }

    const handleCancel = () => {
        setStep("login")
        setOtp(["", "", "", ""])
    }

    const handleResendCode = () => {
        // For now, just log - API will be implemented later
        console.log("Resend code requested")
    }

    // Chart data for Activity Chart
    const activityChartData = {
        labels: ['1/3', '2/3', '3/3', '4/3', '5/3', '6/3', '7/3', '8/3', '9/3'],
        datasets: [
            {
                label: activityView === 'invitations' ? 'Invitations' : 'Messages',
                data: [20, 35, 28, 45, 38, 52, 48, 60, 55],
                borderColor: '#675FFF',
                backgroundColor: 'rgba(103, 95, 255, 0.1)',
                fill: true,
                tension: 0.4,
            },
        ],
    }

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                backgroundColor: '#fff',
                titleColor: '#1E1E1E',
                bodyColor: '#5A687C',
                borderColor: '#E1E4EA',
                borderWidth: 1,
                padding: 12,
            },
        },
        scales: {
            x: {
                grid: {
                    display: false,
                },
                ticks: {
                    color: '#5A687C',
                    font: {
                        size: 12,
                    },
                },
            },
            y: {
                grid: {
                    color: '#F0F0F0',
                },
                ticks: {
                    color: '#5A687C',
                    font: {
                        size: 12,
                    },
                },
                beginAtZero: true,
            },
        },
    }

    // Dashboard view
    if (step === "dashboard") {
        return (
            <div className="w-full h-full flex flex-col p-10">
                {/* Header */}
                <div className="flex justify-between items-start mb-8">
                    <div>
                        <h1 className="text-2xl font-[500] text-[#1E1E1E] mb-2">Linkedin Prospection</h1>
                        <p className="text-[#5A687C] text-base">
                            Track your outreach performance, manage campaigns, and measure engagement across LinkedIn.
                        </p>
                    </div>
                    <button className="bg-[#675FFF] text-white font-semibold px-4 py-2 rounded-xl hover:bg-[#5a4fe6] transition-colors">
                        + Search for Prospects
                    </button>
                </div>

                {/* Dashboard Content */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Left Column */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Your LinkedIn Account Card */}
                        <div className="bg-white rounded-2xl border border-[#E1E4EA] relative overflow-hidden">
                            {/* Header with border-b - full width */}
                            <div className="flex justify-between items-center px-6 pt-6 pb-4 mb-6 border-b border-[#E1E4EA]">
                                <h2 className="text-lg font-semibold text-[#1E1E1E]">Your LinkedIn Account</h2>
                                <button className="bg-[#FFF5F5] cursor-pointer border border-red-500 text-red-500 text-sm font-medium px-3 py-1.5 rounded-lg hover:bg-[#FFE5E5] transition-colors">
                                    Disconnect
                                </button>
                            </div>
                            
                            <div className="px-6 pb-6">
                                {/* Profile Section - Centered */}
                                <div className="flex flex-col items-center mb-6">
                                    <div className="w-16 h-16 rounded-full flex items-center justify-center mb-3">
                                        <img src={KenImage} alt="Ken" className="w-16 h-16 rounded-full" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-[#1E1E1E] mb-1">Sami Sammari</h3>
                                    <p className="text-sm text-[#5A687C]">CEO of LinkedIn</p>
                                </div>
                                
                                {/* Metrics */}
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="text-center">
                                        <p className="text-sm text-[#5A687C] mb-1">Connections</p>
                                        <p className="text-xl font-semibold text-[#1E1E1E]">14,382</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-sm text-[#5A687C] mb-1">In Pending</p>
                                        <p className="text-xl font-semibold text-[#1E1E1E]">126</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-sm text-[#5A687C] mb-1">Profile Views</p>
                                        <p className="text-xl font-semibold text-[#1E1E1E]">214</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Activity Chart Card */}
                        <div className="bg-white rounded-2xl border border-[#E1E4EA] relative overflow-hidden">
                            {/* Header with border-b - full width */}
                            <div className="flex justify-between items-center px-6 pt-6 pb-4 mb-4 border-b border-[#E1E4EA]">
                                <h2 className="text-lg font-semibold text-[#1E1E1E]">Activity Chart</h2>
                                <div className="flex bg-[#F7F7F8] border border-[#E1E4EA] rounded-lg p-0.5 gap-1">
                                    <button
                                        onClick={() => setActivityView("invitations")}
                                        className={`px-4 py-1.5 rounded-md text-sm font-semibold cursor-pointer transition-colors ${
                                            activityView === "invitations"
                                                ? "bg-white border border-[#E1E4EA] text-[#1E1E1E]"
                                                : "text-[#5A687C]"
                                        }`}
                                    >
                                        Invitations
                                    </button>
                                    <button
                                        onClick={() => setActivityView("messages")}
                                        className={`px-4 py-1.5 rounded-md text-sm font-semibold cursor-pointer transition-colors ${
                                            activityView === "messages"
                                                ? "bg-white border border-[#E1E4EA] text-[#1E1E1E]"
                                                : "text-[#5A687C]"
                                        }`}
                                    >
                                        Messages
                                    </button>
                                </div>
                            </div>
                            
                            <div className="px-6 pb-6">
                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <p className="text-sm text-[#5A687C] mb-1">Avg invites/day</p>
                                        <p className="text-xl font-semibold text-[#1E1E1E]">45</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-[#5A687C] mb-1">Avg acceptances/day</p>
                                        <p className="text-xl font-semibold text-[#1E1E1E]">16</p>
                                    </div>
                                </div>
                                <div className="h-[200px]">
                                    <Line data={activityChartData} options={chartOptions} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Metrics Grid */}
                    <div className="lg:col-span-2">
                        <div className="grid grid-cols-2 gap-4 ">
                            <div className="bg-white rounded-2xl border border-[#E1E4EA] p-6 min-h-[200px]">
                                <img src={TotalCampaigns} alt="Campaign Totals" className="w-[62px] h-[62px] mb-4" />
                                <p className="text-md font-medium text-[#5A687C] mb-1 px-4">Campaign Totals</p>
                                <p className="text-3xl font-[600] text-[#1E1E1E] px-4">18</p>
                            </div>
                            <div className="bg-white rounded-2xl border border-[#E1E4EA] p-6 min-h-[200px]">
                                <img src={ActiveCampaign} alt="Active Campaigns" className="w-[62px] h-[62px] mb-4" />
                                <p className="text-md font-medium text-[#5A687C] mb-1 px-4">Active Campaigns</p>
                                <p className="text-3xl font-[600] text-[#1E1E1E] px-4">12</p>
                            </div>
                            <div className="bg-white rounded-2xl border border-[#E1E4EA] p-6 min-h-[200px]">
                                <img src={InvitationsAccepted} alt="Invitations Accepted" className="w-[62px] h-[62px] mb-4" />
                                <p className="text-md font-medium text-[#5A687C] mb-1 px-4">Invitations Accepted</p>
                                <p className="text-3xl font-[600] text-[#1E1E1E] px-4">482</p>
                            </div>
                            <div className="bg-white rounded-2xl border border-[#E1E4EA] p-6 min-h-[200px]">
                                <img src={AcceptanceRate} alt="Acceptance Rate" className="w-[62px] h-[62px] mb-4" />
                                <p className="text-md font-medium text-[#5A687C] mb-1 px-4">Acceptance Rate</p>
                                <p className="text-3xl font-[600] text-[#1E1E1E] px-4">36.8%</p>
                            </div>
                            <div className="bg-white rounded-2xl border border-[#E1E4EA] p-6 min-h-[200px]">
                                <img src={AnsweredMessage} alt="Answered Messages" className="w-[62px] h-[62px] mb-4" />
                                <p className="text-md font-medium text-[#5A687C] mb-1 px-4">Answered Messages</p>
                                <p className="text-3xl font-[600] text-[#1E1E1E] px-4">219</p>
                            </div>
                            <div className="bg-white rounded-2xl border border-[#E1E4EA] p-6 min-h-[200px]">
                                <img src={ResponseRate} alt="Response Rate" className="w-[62px] h-[62px] mb-4" />
                                <p className="text-md font-medium text-[#5A687C] mb-1 px-4">Response Rate</p>
                                <p className="text-3xl font-[600] text-[#1E1E1E] px-4">42.1%</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="w-full h-full flex flex-col p-10">
            {/* Header */}
            <div className="w-full max-w-full mx-auto mb-8">
                <h1 className="text-2xl font-[500] text-[#1E1E1E] mb-2">Linkedin Prospection</h1>
                <p className="text-[#5A687C] text-base">
                    Track your outreach performance, manage campaigns, and measure engagement across LinkedIn.
                </p>
            </div>

            {/* Login Card - Centered */}
            <div className="flex-1 flex items-center justify-center ">
                <div className="w-full max-w-full bg-white min-h-[640px] rounded-2xl shadow-sm border border-[#E1E4EA] p-8">
                    <div className="max-w-md mx-auto mt-10">
                        {/* LinkedIn Logo */}
                        <div className="flex justify-center mb-3">
                            <div className="w-16 h-16 rounded-lg flex items-center justify-center">
                                <img src={linkedinIcon} alt="LinkedIn" className="w-12 h-12" />
                            </div>
                        </div>

                        {step === "login" ? (
                            <>
                                {loadingAccounts ? (
                                    <div className="text-center py-8">
                                        <div className="loader mx-auto mb-4"></div>
                                        <p className="text-[#5A687C]">Loading accounts...</p>
                                    </div>
                                ) : linkedInAccounts.length === 0 ? (
                                    <>
                                        {/* No Account Connected */}
                                        <h2 className="text-[24px] font-[500] text-[#1E1E1E] text-center mb-2">
                                            No LinkedIn account connected
                                        </h2>
                                        <p className="text-md text-[#5A687C] text-center mb-6">
                                            Go to Brain AI to connect your LinkedIn account.
                                        </p>
                                        <button
                                            onClick={() => navigate('/dashboard/brain?tab=integration')}
                                            className="w-full bg-[#675FFF] cursor-pointer text-white font-semibold py-2.5 px-3 rounded-xl hover:bg-[#5a4fe6] transition-colors"
                                        >
                                            Go to Brain AI
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        {/* Heading */}
                                        <h2 className="text-[24px] font-[500] text-[#1E1E1E] text-center mb-2">
                                            {linkedInAccounts.length === 1 ? 'LinkedIn Account' : 'Select your LinkedIn account'}
                                        </h2>
                                        <p className="text-md text-[#5A687C] text-center mb-6">
                                            {linkedInAccounts.length === 1 
                                                ? 'Your connected LinkedIn account' 
                                                : 'Please select an account to continue'}
                                        </p>

                                        {/* Account Selection */}
                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <label className="text-sm font-normal text-[#868C98]">
                                                    LinkedIn Account
                                                </label>
                                                <SelectDropdown
                                                    name="linkedin_account"
                                                    options={linkedInAccounts.map(account => ({
                                                        key: (account.linkedin_id || account.id || account.account_id)?.toString() || '',
                                                        label: account.name || account.email || account.username || `Account ${account.linkedin_id || account.id || ''}`
                                                    }))}
                                                    placeholder={linkedInAccounts.length === 1 ? "Select your account" : "Select your account"}
                                                    value={selectedAccount}
                                                    onChange={(value) => setSelectedAccount(value)}
                                                />
                                            </div>

                                            {/* Continue Button */}
                                            <button
                                                onClick={() => {
                                                    if (selectedAccount || linkedInAccounts.length === 1) {
                                                        setStep("otp")
                                                    }
                                                }}
                                                disabled={!selectedAccount && linkedInAccounts.length > 1}
                                                className="w-full bg-[#675FFF] cursor-pointer text-white font-semibold py-2.5 px-3 rounded-xl hover:bg-[#5a4fe6] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                Continue
                                            </button>
                                        </div>
                                    </>
                                )}
                            </>
                        ) : (
                            <>
                                {/* OTP Verification Screen */}
                                <h2 className="text-xl font-bold text-[#1E1E1E] text-center mb-2">
                                    Confirm Your Login
                                </h2>
                                <p className="text-sm text-[#5A687C] text-center mb-6">
                                    Enter the 4-digit verification code we sent to <br /> {" "}
                                    <span className="font-semibold text-[#1E1E1E]">{email || "robert45@gmail.com"}</span>
                                </p>

                                <form onSubmit={handleOtpSubmit} className="space-y-6">
                                    {/* OTP Input Fields */}
                                    <div className="flex justify-center items-center gap-2">
                                        {otp.map((digit, index) => (
                                            <React.Fragment key={index}>
                                                <input
                                                    ref={otpRefs[index]}
                                                    type="text"
                                                    inputMode="numeric"
                                                    maxLength={1}
                                                    value={digit}
                                                    onChange={(e) => handleOtpChange(index, e.target.value)}
                                                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                                                    onPaste={handleOtpPaste}
                                                    className="w-14 h-14 text-center text-lg font-semibold border border-[#D6D6D6] rounded-xl focus:outline-none focus:border-[#675FFF] text-[#1E1E1E]"
                                                />
                                                {index < otp.length - 1 && (
                                                    <span className="text-[#D6D6D6] text-xl font-normal">-</span>
                                                )}
                                            </React.Fragment>
                                        ))}
                                    </div>

                                    {/* Buttons */}
                                    <div className="space-y-3">
                                        <button
                                            type="submit"
                                            className="w-full bg-[#675FFF] cursor-pointer text-white font-semibold py-2.5 px-3 rounded-xl hover:bg-[#5a4fe6] transition-colors"
                                        >
                                            Verify & Continue
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleCancel}
                                            className="w-full bg-white border border-[#D6D6D6] cursor-pointer text-[#1E1E1E] font-semibold py-2.5 px-3 rounded-xl hover:bg-[#F7F7F8] transition-colors"
                                        >
                                            Cancel
                                        </button>
                                    </div>

                                    {/* Resend Code */}
                                    <p className="text-center text-sm text-[#5A687C]">
                                        Didn't get the code?{" "}
                                        <button
                                            type="button"
                                            onClick={handleResendCode}
                                            className="text-[#675FFF] font-semibold cursor-pointer hover:underline"
                                        >
                                            Resend Code
                                        </button>
                                    </p>
                                </form>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default KenOverview
