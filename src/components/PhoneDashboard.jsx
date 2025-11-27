import { Plus, X, ChevronDown, RefreshCw } from 'lucide-react'
import React, { useState, useEffect } from 'react'
import { useTranslation } from "react-i18next";
import { getAgents, getCallAgent, getPhoneCampaign, outboundCall, inboundCall } from '../api/callAgent';
import { addCredit } from "../api/payment";
import { getCurrentCredits } from '../api/profile';
import { SelectDropdown } from './Dropdown';
import PhoneIcon from '../assets/svg/Phone.svg'

const PhoneDashboard = ({ onNavigateSection = () => { } }) => {

  const [autoRefill, setAutoRefill] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [amount, setAmount] = useState('');
  const [selectedCard, setSelectedCard] = useState(null);
  const [balance, setBalance] = useState(0);
  const [timePeriod, setTimePeriod] = useState('This Month');
  const [automaticRechargeEnabled, setAutomaticRechargeEnabled] = useState(false);
  const [rechargeThreshold, setRechargeThreshold] = useState('');
  const [topUpAmount, setTopUpAmount] = useState('');
  const [isRechargeExpanded, setIsRechargeExpanded] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    agents: 0,
    campaigns: 0,
    outbound_calls: 0,
    inbound_calls: 0,
    average_call_duration: '00:00:00',
    call_duration_trend: null,
    agents_online: 0,
    agents_pending: 0,
    campaigns_outbound: 0,
    campaigns_inbound: 0,
    connection_rate: 0,
    response_rate: 0,
    loading: true,
    error: null
  });
  const { t } = useTranslation();
  const handleNavigateSection = (sectionKey) => {
    if (typeof onNavigateSection === "function") {
      onNavigateSection(sectionKey);
    }
  };

  const timePeriodOptions = [
    { label: 'This Month', key: 'This Month' },
    { label: 'Last Month', key: 'Last Month' },
    { label: 'Last 3 Months', key: 'Last 3 Months' },
    { label: 'Last 6 Months', key: 'Last 6 Months' },
    { label: 'This Year', key: 'This Year' }
  ];

  // Helper function to format duration from seconds to HH:MM:SS
  const formatDuration = (seconds) => {
    if (!seconds || isNaN(seconds)) return '00:00:00';
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // Helper function to calculate average call duration
  const calculateAverageDuration = (calls) => {
    if (!calls || !Array.isArray(calls) || calls.length === 0) return 0;
    const totalDuration = calls.reduce((sum, call) => {
      const duration = call.duration || 0;
      return sum + duration;
    }, 0);
    return Math.floor(totalDuration / calls.length);
  };

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setDashboardData(prev => ({ ...prev, loading: true }));

        // Fetch main dashboard data
        const response = await getAgents();
        const mainData = response.data?.success || {};

        // Fetch agent details for online/pending status
        let agentsOnline = 0;
        let agentsPending = 0;
        try {
          const agentsResponse = await getCallAgent();
          if (agentsResponse?.data?.agents_info) {
            const agents = Array.isArray(agentsResponse.data.agents_info)
              ? agentsResponse.data.agents_info
              : [];
            agentsOnline = agents.filter(agent => agent.status === 'active' || agent.status === 'online').length;
            agentsPending = agents.filter(agent => agent.status === 'pending' || agent.status === 'inactive').length;
          }
        } catch (err) {
          console.error('Error fetching agent details:', err);
        }

        // Fetch campaign details for outbound/inbound breakdown
        let campaignsOutbound = 0;
        let campaignsInbound = 0;
        try {
          const campaignsResponse = await getPhoneCampaign();
          if (campaignsResponse?.data?.campaigns) {
            const campaigns = Array.isArray(campaignsResponse.data.campaigns)
              ? campaignsResponse.data.campaigns
              : [];
            campaignsOutbound = campaigns.filter(campaign => campaign.type === 'outbound' || campaign.campaign_type === 'outbound').length;
            campaignsInbound = campaigns.filter(campaign => campaign.type === 'inbound' || campaign.campaign_type === 'inbound').length;
          }
        } catch (err) {
          console.error('Error fetching campaign details:', err);
        }

        // Fetch outbound calls for connection rate and average duration
        let averageDuration = 0;
        let connectionRate = 0;
        try {
          const outboundResponse = await outboundCall();
          const outboundCalls = outboundResponse?.data?.success || [];
          if (Array.isArray(outboundCalls) && outboundCalls.length > 0) {
            averageDuration = calculateAverageDuration(outboundCalls);
            const connectedCalls = outboundCalls.filter(call => call.status === 'connected' || call.status === 'completed').length;
            connectionRate = outboundCalls.length > 0 ? Math.round((connectedCalls / outboundCalls.length) * 100) : 0;
          }
        } catch (err) {
          console.error('Error fetching outbound calls:', err);
        }

        // Fetch inbound calls for response rate
        let responseRate = 0;
        try {
          const inboundResponse = await inboundCall();
          const inboundCalls = inboundResponse?.data?.success || [];
          if (Array.isArray(inboundCalls) && inboundCalls.length > 0) {
            const respondedCalls = inboundCalls.filter(call => call.status === 'answered' || call.status === 'completed').length;
            responseRate = inboundCalls.length > 0 ? Math.round((respondedCalls / inboundCalls.length) * 100) : 0;
          }
        } catch (err) {
          console.error('Error fetching inbound calls:', err);
        }

        setDashboardData({
          agents: mainData.agents || 0,
          campaigns: mainData.campaigns || 0,
          outbound_calls: mainData.outbound_calls || 0,
          inbound_calls: mainData.inbound_calls || 0,
          average_call_duration: formatDuration(averageDuration),
          call_duration_trend: null, // This would need historical data to calculate
          agents_online: agentsOnline,
          agents_pending: agentsPending,
          campaigns_outbound: campaignsOutbound,
          campaigns_inbound: campaignsInbound,
          connection_rate: connectionRate,
          response_rate: responseRate,
          loading: false,
          error: null
        });
      } catch (err) {
        setDashboardData(prev => ({ ...prev, loading: false, error: err.message }));
        console.error('Error fetching dashboard data:', err);
      }
    };

    fetchAllData();
  }, []);

  useEffect(() => {
    const fetchCredits = async () => {
      const res = await getCurrentCredits();
      if (res?.data?.phoneCredits?.balance !== undefined) {
        setBalance(res.data.phoneCredits.balance);
      }
    };
    fetchCredits();
  }, []);

  const handleTopUp = async () => {
    const value = selectedCard || Number(amount || 0);
    if (!value || Number.isNaN(value) || Number(value) <= 0) {
      return;
    }

    try {
      const resp = await addCredit(Number(value));
      console.log('Top up response', resp);
      if (resp?.status === 200 || resp?.status === 201) {
        // If API returned a checkout session URL, open in new tab
        const sessionUrl = resp?.data?.sessionUrl || resp?.data?.sessionurl || resp?.data?.url;
        if (sessionUrl) {
          window.open(sessionUrl, '_blank', 'noopener,noreferrer');
        }
        setShowModal(false);
        setAmount('');
        setSelectedCard(null);
        // refresh dashboard data
        const r = await getAgents();
        if (r?.data?.success) {
          setDashboardData((prev) => ({ ...prev, agents: r.data.success.agents, campaigns: r.data.success.campaigns, outbound_calls: r.data.success.outbound_calls, inbound_calls: r.data.success.inbound_calls }));
        }
        // Refresh credits
        const creditsRes = await getCurrentCredits();
        if (creditsRes?.data?.phoneCredits?.balance !== undefined) {
          setBalance(creditsRes.data.phoneCredits.balance);
        }
      } else {
      }
    } catch (err) {
      console.error(err);
    }
  }

  const handleRefresh = async () => {
    try {
      setDashboardData(prev => ({ ...prev, loading: true }));

      // Fetch main dashboard data
      const response = await getAgents();
      const mainData = response.data?.success || {};

      // Fetch agent details
      let agentsOnline = 0;
      let agentsPending = 0;
      try {
        const agentsResponse = await getCallAgent();
        if (agentsResponse?.data?.agents_info) {
          const agents = Array.isArray(agentsResponse.data.agents_info)
            ? agentsResponse.data.agents_info
            : [];
          agentsOnline = agents.filter(agent => agent.status === 'active' || agent.status === 'online').length;
          agentsPending = agents.filter(agent => agent.status === 'pending' || agent.status === 'inactive').length;
        }
      } catch (err) {
        console.error('Error fetching agent details:', err);
      }

      // Fetch campaign details
      let campaignsOutbound = 0;
      let campaignsInbound = 0;
      try {
        const campaignsResponse = await getPhoneCampaign();
        if (campaignsResponse?.data?.campaigns) {
          const campaigns = Array.isArray(campaignsResponse.data.campaigns)
            ? campaignsResponse.data.campaigns
            : [];
          campaignsOutbound = campaigns.filter(campaign => campaign.type === 'outbound' || campaign.campaign_type === 'outbound').length;
          campaignsInbound = campaigns.filter(campaign => campaign.type === 'inbound' || campaign.campaign_type === 'inbound').length;
        }
      } catch (err) {
        console.error('Error fetching campaign details:', err);
      }

      // Fetch outbound calls
      let averageDuration = 0;
      let connectionRate = 0;
      try {
        const outboundResponse = await outboundCall();
        const outboundCalls = outboundResponse?.data?.success || [];
        if (Array.isArray(outboundCalls) && outboundCalls.length > 0) {
          averageDuration = calculateAverageDuration(outboundCalls);
          const connectedCalls = outboundCalls.filter(call => call.status === 'connected' || call.status === 'completed').length;
          connectionRate = outboundCalls.length > 0 ? Math.round((connectedCalls / outboundCalls.length) * 100) : 0;
        }
      } catch (err) {
        console.error('Error fetching outbound calls:', err);
      }

      // Fetch inbound calls
      let responseRate = 0;
      try {
        const inboundResponse = await inboundCall();
        const inboundCalls = inboundResponse?.data?.success || [];
        if (Array.isArray(inboundCalls) && inboundCalls.length > 0) {
          const respondedCalls = inboundCalls.filter(call => call.status === 'answered' || call.status === 'completed').length;
          responseRate = inboundCalls.length > 0 ? Math.round((respondedCalls / inboundCalls.length) * 100) : 0;
        }
      } catch (err) {
        console.error('Error fetching inbound calls:', err);
      }

      setDashboardData({
        agents: mainData.agents || 0,
        campaigns: mainData.campaigns || 0,
        outbound_calls: mainData.outbound_calls || 0,
        inbound_calls: mainData.inbound_calls || 0,
        average_call_duration: formatDuration(averageDuration),
        call_duration_trend: null,
        agents_online: agentsOnline,
        agents_pending: agentsPending,
        campaigns_outbound: campaignsOutbound,
        campaigns_inbound: campaignsInbound,
        connection_rate: connectionRate,
        response_rate: responseRate,
        loading: false,
        error: null
      });

      const creditsRes = await getCurrentCredits();
      if (creditsRes?.data?.phoneCredits?.balance !== undefined) {
        setBalance(creditsRes.data.phoneCredits.balance);
      }
    } catch (err) {
      console.error('Error refreshing data:', err);
      setDashboardData(prev => ({ ...prev, loading: false }));
    }
  }


  return (
    <div className="py-6 px-6 flex flex-col gap-6 w-full h-screen overflow-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Overview</h1>
          <p className="text-md text-[#5A687C] mt-2">Monitor your call activity, credits, and agent performance.</p>
        </div>
        <div className="flex items-center gap-3">
          <SelectDropdown
            name="time_period"
            options={timePeriodOptions}
            value={timePeriod}
            onChange={(updated) => setTimePeriod(updated)}
            placeholder="This Month"
            className="w-[140px] text-[14px] font-500"
          />
          <button
            onClick={handleRefresh}
            className="flex items-center gap-2 px-4 py-2 text-[14px] bg-white border border-[#E1E4EA] rounded-lg text-[#1E1E1E] text-sm font-medium hover:bg-gray-50 cursor-pointer"
          >
            <RefreshCw size={16} />
            Refresh
          </button>
        </div>
      </div>

      {dashboardData.error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {dashboardData.error}
        </div>
      )}

      {/* Top Row - Credit Summary and Average Call Duration */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Credit Summary Card */}
        <div className="rounded-xl border border-[#E1E4EA] bg-white p-6 flex flex-col justify-between relative">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-[500] text-[#5A687C]">Credit Summary</h2>
            <div className="flex items-center gap-2">
              <span className="text-[14px] font-[500] text-[#5A687C]">Auto Refill</span>
              <button
                onClick={() => setAutoRefill(!autoRefill)}
                className={`w-12 h-6 cursor-pointer rounded-full flex items-center px-1 transition-colors duration-300 ${autoRefill ? "bg-[#675FFF]" : "bg-gray-300"
                  }`}
              >
                <div
                  className={`w-4 h-4 bg-white rounded-full shadow transform transition-transform duration-300 ${autoRefill ? "translate-x-6" : "translate-x-0"
                    }`}
                ></div>
              </button>
            </div>
          </div>
          <div className="flex items-center justify-between mt-4">
            <div>
              <h3 className="text-4xl font-bold text-[#1E1E1E] mb-2">€{balance.toFixed(2)}</h3>
              <p className="text-sm text-[#5A687C]">Credit rate <span className="font-semibold text-black">0.20 € / min </span></p>
            </div>
            <button
              className="bg-[#675FFF] text-white px-5 py-2.5 rounded-lg text-sm font-medium flex items-center justify-center gap-2 cursor-pointer hover:bg-[#5E54FF] transition"
              onClick={() => setShowModal(true)}
            >
              <Plus size={16} />
              Add Credit
            </button>
          </div>
        </div>

        {/* Average Call Duration Card */}
        <div className="rounded-xl border border-[#E1E4EA] bg-white p-6 flex flex-col justify-between">
          <div>
            <h2 className="text-[14px] font-[500] text-[#5A687C] mb-4">Average Call Duration</h2>
            <h3 className="text-4xl font-bold mb-2 text-[#1E1E1E]">
              {dashboardData.loading ? '...' : dashboardData.average_call_duration}
            </h3>
            <p className="text-sm text-[#5A687C]">
              {dashboardData.call_duration_trend
                ? `${dashboardData.call_duration_trend > 0 ? '+' : ''}${dashboardData.call_duration_trend}% ${dashboardData.call_duration_trend > 0 ? 'longer' : 'shorter'} calls this week`
                : dashboardData.loading ? 'Loading...' : 'No trend data available'}
            </p>
          </div>

        </div>
      </div>

      {/* Bottom Row - Other Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

        {/* Agent Overview Card */}
        <div className="rounded-xl border border-[#E1E4EA] bg-white p-6 flex flex-col justify-between">
          <div>
            <h2 className="text-[14px] font-[500] text-[#5A687C] mb-4">Agent Overview</h2>
            <h3 className="text-4xl font-bold mb-2 text-[#1E1E1E]">
              {dashboardData.loading ? '...' : dashboardData.agents}
            </h3>
            <p className="text-sm text-[#5A687C]">
              {dashboardData.loading ? 'Loading...' : `${dashboardData.agents_online} online${dashboardData.agents_pending > 0 ? ` · ${dashboardData.agents_pending} pending invitation` : ''}`}
            </p>
          </div>
          <button
            className="bg-white border border-[#E1E4EA] w-full mt-3 text-[#1E1E1E] text-sm font-medium px-4 py-2 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => handleNavigateSection("call-agents")}
          >
            See more
          </button>
        </div>

        {/* Campaigns Card */}
        <div className="rounded-xl border border-[#E1E4EA] bg-white p-6 flex flex-col justify-between">
          <div>
            <h2 className="text-[14px] font-[500] text-[#5A687C] mb-4">Campaigns</h2>
            <h3 className="text-4xl font-bold mb-2 text-[#1E1E1E]">
              {dashboardData.loading ? '...' : dashboardData.campaigns}
            </h3>
            <p className="text-sm text-[#5A687C]">
              {dashboardData.loading ? 'Loading...' : `${dashboardData.campaigns_outbound} outbound${dashboardData.campaigns_inbound > 0 ? ` · ${dashboardData.campaigns_inbound} inbound` : ''}`}
            </p>
          </div>
          <button
            className="bg-white border border-[#E1E4EA] w-full mt-3 text-[#1E1E1E] text-sm font-medium px-4 py-2 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => handleNavigateSection("call-campaigns")}
          >
            See more
          </button>
        </div>

        {/* Called Clients Card */}
        <div className="rounded-xl border border-[#E1E4EA] bg-white p-6 flex flex-col justify-between">
          <div>
            <h2 className="text-[14px] font-[500] text-[#5A687C] mb-4">Called Clients</h2>
            <h3 className="text-4xl font-bold mb-2 text-[#1E1E1E]">
              {dashboardData.loading ? '...' : dashboardData.outbound_calls}
            </h3>
            <p className="text-sm text-[#5A687C]">
              {dashboardData.loading ? 'Loading...' : `Average connection rate: ${dashboardData.connection_rate}%`}
            </p>
          </div>
          <button
            className="bg-white border border-[#E1E4EA] text-[#1E1E1E] w-full mt-3 text-sm font-medium px-4 py-2 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => handleNavigateSection("outbound-calls")}
          >
            See more
          </button>
        </div>

        {/* Calls Received Card */}
        <div className="rounded-xl border border-[#E1E4EA] bg-white p-6 flex flex-col justify-between">
          <div>
            <h2 className="text-[14px] font-[500] text-[#5A687C] mb-4">Calls Received</h2>
            <h3 className="text-4xl font-bold mb-2 text-[#1E1E1E]">
              {dashboardData.loading ? '...' : dashboardData.inbound_calls}
            </h3>
            <p className="text-sm text-[#5A687C]">
              {dashboardData.loading ? 'Loading...' : `Response rate: ${dashboardData.response_rate}%`}
            </p>
          </div>
          <button
            className="bg-white border border-[#E1E4EA] text-[#1E1E1E] w-full mt-3 text-sm font-medium px-4 py-2 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => handleNavigateSection("inbound-calls")}
          >
            See more
          </button>
        </div>
      </div>
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4 ">
          <div className="bg-white rounded-2xl max-h-[92vh] overflow-auto w-full max-w-[806px] p-6 relative shadow-lg">
            {/* Header with Close button */}
            <div className="mb-6 flex items-start justify-between">
              <div>
                <h2 className="text-[20px] font-[600] text-[#1E1E1E]">My Call Credits</h2>
                <p className="text-sm text-[#5A687C] mt-2">Top up your account to keep calls and campaigns running smoothly.</p>
              </div>
              <button
                className="text-gray-500 hover:text-gray-800 cursor-pointer"
                onClick={() => setShowModal(false)}
              >
                <X size={20} />
              </button>
            </div>

            <hr className="text-gray-200 border-border-gray-100 my-2"></hr>

            {/* Choose an amount section */}
            <div className="p-1 mb-2">
              <div className="flex items-start justify-between mb-2">
                <h2 className="text-md font-[600] text-[#1E1E1E]">Choose an amount</h2>
                <p className="text-sm text-[#5A687C]">Price <span className="font-[500] text-black">€0.20/minute</span></p>
              </div>

              {/* Predefined options */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                {[
                  { label: '25 Minute Call', price: 5 },
                  { label: '50 Minute Call', price: 10 },
                  { label: '120 Minute Call', price: 24 },
                  { label: '250 Minute Call', price: 50 },
                ].map((opt, idx) => {
                  const isSelected = selectedCard === opt.price;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setSelectedCard(opt.price);
                        setAmount(String(opt.price));
                      }}
                      className={`flex items-center gap-3 p-2 border cursor-pointer rounded-lg hover:shadow-sm transition ${isSelected ? 'border-[#675FFF] bg-[#F3F0FF]' : 'border-[#E1E4EA]'}`}
                    >
                      <div className={`flex items-center justify-center w-10 h-10 rounded-lg border ${isSelected ? 'border-[#EAEAEA] bg-white' : 'border-[#d4d9e3] bg-white'}`}>
                        <img src={PhoneIcon} alt="Phone" className="w-5 h-5" />
                      </div>
                      <div className="flex items-center justify-between flex-1 px-4">
                        <div className="text-md text-[#5A687C]">{opt.label}</div>
                        <div className="text-lg font-semibold text-[#1E1E1E]">€{opt.price}</div>
                      </div>
                    </button>
                  )
                })}
              </div>

              {/* OR separator */}
              <div className='w-full my-5'>
                <hr className="text-gray-200" />
                <div className='w-full flex justify-center items-center -mt-3'>
                  <span className='text-sm bg-white px-4 text-gray-400 font-light'>OR</span>
                </div>
              </div>

              {/* Custom amount input */}
              <div className="grid grid-cols-2 gap-6 items-start max-h-[88px]">
                <div className="max-h-[88px] overflow-hidden">
                  <div className="relative">
                    <input
                      type="number"
                      placeholder="Enter Amount"
                      value={amount}
                      max={10000}
                      onChange={(e) => {
                        const value = Number(e.target.value);
                        if (value <= 10000) {
                          setAmount(e.target.value);
                        } else {
                          setAmount("10000");
                        }
                        setSelectedCard(null);
                      }}
                      className="w-full px-4 py-2.5 pr-8 border border-[#E1E4EA] rounded-lg focus:outline-none focus:border-[#675FFF] 
        appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 text-sm">€</span>
                  </div>

                  <button
                    className="w-full mt-1 bg-[#675FFF] text-white px-6 py-1.5 rounded-lg cursor-pointer hover:bg-[#5E54FF] transition font-medium"
                    onClick={handleTopUp}
                  >
                    Top Up Credit
                  </button>
                </div>

                <div className="bg-[#F7F7F8] border border-[#E1E4EA] rounded-lg px-4 py-3 max-h-[88px] overflow-hidden">
                  <p className="text-sm text-[#5A687C] mb-1">Calculated call minutes</p>
                  <p className="text-3xl font-bold text-[#1E1E1E]">
                    {amount ? Math.round(Number(amount) / 0.2) : "0"}{" "}
                    <span className="text-lg font-normal">min</span>
                  </p>
                </div>
              </div>
              <hr className="border border-[#E1E4EA] mt-2"></hr>
            </div>

            {/* Automatic Recharge Section */}
            <div className="py-6 px-4 border border-[#E1E4EA] rounded-xl">
              <div className=''>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h2 className="text-md font-[600] text-[#1E1E1E] mb-2">Automatic Recharge</h2>
                    <p className="text-sm text-[#5A687C]">
                      Automatically refill your balance when it drops below your chosen threshold.
                    </p>
                  </div>
                  <div className="flex items-center gap-3 ml-4 flex-shrink-0">
                    <span className={`text-sm font-medium ${automaticRechargeEnabled ? 'text-[#675FFF]' : 'text-[#5A687C]'}`}>
                      {automaticRechargeEnabled ? 'On' : 'Off'}
                    </span>
                    <button
                      onClick={() => {
                        setAutomaticRechargeEnabled(!automaticRechargeEnabled);
                        if (!automaticRechargeEnabled) {
                          setIsRechargeExpanded(true);
                        }
                      }}
                      className={`w-12 h-6 cursor-pointer rounded-full flex items-center px-1 transition-colors duration-300 ${automaticRechargeEnabled ? "bg-[#675FFF]" : "bg-gray-300"
                        }`}
                    >
                      <div
                        className={`w-4 h-4 bg-white rounded-full shadow transform transition-transform duration-300 ${automaticRechargeEnabled ? "translate-x-6" : "translate-x-0"
                          }`}
                      ></div>
                    </button>
                    <button
                      onClick={() => setIsRechargeExpanded(!isRechargeExpanded)}
                      className="text-[#5A687C] hover:text-[#1E1E1E] transition-colors"
                    >
                      <ChevronDown
                        size={20}
                        className={`transition-transform duration-200 cursor-pointer ${isRechargeExpanded ? 'rotate-180' : ''}`}
                      />
                    </button>
                  </div>
                </div>
              </div>

              {/* Expandable Content */}
              {isRechargeExpanded && (
                <div className="space-y-4 mt-4">
                  <hr className="border border-[#E1E4EA]"></hr>
                  {/* Recharge Threshold */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="w-1/2">
                      <label className="block text-sm font-semibold text-[#1E1E1E] mb-1">
                        Recharge Threshold
                      </label>
                      <p className="text-xs text-[#5A687C]">When balance falls below</p>
                    </div>

                    {/* Right — 50% width */}
                    <div className="relative w-1/2">
                      <input
                        type="number"
                        placeholder="Enter threshold"
                        value={rechargeThreshold}
                        max={10000}
                        onChange={(e) => {
                          const value = Number(e.target.value);
                          if (value <= 10000) {
                            setRechargeThreshold(e.target.value);
                          } else {
                            setRechargeThreshold("10000");
                          }
                        }}
                        className="w-full px-4 py-2.5 pr-8 border border-[#D6D6D6] rounded-lg focus:outline-none focus:border-[#675FFF] appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 text-sm">€</span>
                    </div>
                  </div>

                  {/* Top-up Amount */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="w-1/2">
                      <label className="block text-sm font-semibold text-[#1E1E1E] mb-1">
                        Top-up Amount
                      </label>
                      <p className="text-xs text-[#5A687C]">
                        Add balance up to
                      </p>
                    </div>
                    <div className="relative w-1/2">
                      <input
                        type="number"
                        placeholder="Enter amount"
                        value={topUpAmount}
                        max={10000}
                        onChange={(e) => {
                          const value = Number(e.target.value);
                          if (value <= 10000) {
                            setTopUpAmount(e.target.value);
                          } else {
                            setTopUpAmount("10000");
                          }
                        }}
                        className="w-full text-bold font-md px-4 py-2.5 pr-8 border border-[#D6D6D6] rounded-lg focus:outline-none focus:border-[#675FFF] 
                          appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 text-sm md:text-md font-[500]">€</span>
                </div>
              </div>

                  {/* Save Button */}
                  <button
                    className="w-full mt-4 bg-[#675FFF] text-white px-6 py-2.5 rounded-lg cursor-pointer hover:bg-[#5E54FF] transition font-medium"
                    onClick={() => {
                      // Handle save logic here
                      console.log('Saving automatic recharge settings:', {
                        enabled: automaticRechargeEnabled,
                        threshold: rechargeThreshold,
                        topUpAmount: topUpAmount
                      });
                      // You can add API call here to save the settings
                    }}
                  >
                    Save
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default PhoneDashboard
