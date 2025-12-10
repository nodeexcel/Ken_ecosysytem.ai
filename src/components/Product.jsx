import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Download, RefreshCw, Ellipsis, ArrowRight, ArrowUpRight, ArrowDownRight, Info, ChevronDown, X, Globe, FileText, Filter, Users, Building2, Sparkles, Upload, Cloud, Trash2, Pencil, ArrowRight as ArrowRightIcon } from 'lucide-react';
import SuccessIcon from '../assets/svg/SuccessIcon.svg';
import ChatgptLogoWhite from '../assets/svg/ChatgptLogoWhite.svg';
import GeneratedBackgroundImage from '../assets/images/ProductBg.png'
import Preview from '../assets/svg/Preview.svg'
import LoadingSpinner from '../assets/svg/LoadingSpinner.svg'
import GlobeIcon from "../assets/svg/GlobeIcon.svg";
import AnalysisIcon from "../assets/svg/AnalysisIcon.svg";
import DifferentiatorIcon from "../assets/svg/DifferentiatorIcon.svg";
import CompetitorIcon from "../assets/svg/CompetitorIcon.svg";
import CompanyIcon from "../assets/svg/CompanyIcon.svg";
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
} from 'chart.js';
import { Line } from 'react-chartjs-2';

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
);

const Product = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('Last 30 days');
  const [selectedView, setSelectedView] = useState('Overall');
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [newProductName, setNewProductName] = useState('');
  const [newProductWebsite, setNewProductWebsite] = useState('');
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [detectedLanguage, setDetectedLanguage] = useState('');
  const [showProductForm, setShowProductForm] = useState(false);
  const [companyName, setCompanyName] = useState('NovaDesk');
  const [overview, setOverview] = useState('NovaDesk is an AI-powered customer support automation platform that streamlines ticket handling, accelerates response times, and enhances customer satisfaction. It integrates with leading SaaS tools including Intercom, Zendesk, HubSpot, and Slack, allowing support teams to centralize conversations and automate repetitive tasks. NovaDesk automatically triages tickets, suggests context-aware responses, and learns from past interactions to continuously improve support quality.');
  const [keywords1, setKeywords1] = useState([
    'AI-powered ticket triage',
    'Instant multilingual replies',
    '24/7 automated support',
    'Integrates with 60+ tools',
    'Automated SLA workflows',
    'Adaptive smart macros',
    'Continuous AI learning',
    'Enterprise security compliance'
  ]);
  const [keywords2, setKeywords2] = useState([
    'zendesk.com',
    'intercom.com',
    'freshdesk.com',
    'livechat.com',
    'kayako.com',
    'groovehq.com',
    'crisp.chat',
    'replypilot.ai',
    'supportgenie.com',
    'helpflow.ai'
  ]);
  const [showPromptSuggestions, setShowPromptSuggestions] = useState(false);
  const [prompts, setPrompts] = useState([
    'Which platform offers AI-powered ticket triage and automated customer support workflows?',
    'Is there a solution that provides multilingual AI-assisted replies for global customer support?',
    'Which tool integrates with Intercom, Zendesk, Slack, and HubSpot while automating ticket handling?',
    'What platform offers 24/7 AI customer support agents with real-time sentiment analysis?',
    'Which system helps support teams reduce response times with adaptive smart macros?'
  ]);

  // Dummy product data
  const products = [
    {
      id: 1,
      productName: 'Ecosysteme.ai',
      slug: 'ecosysteme-1763626630024',
      lastMonthSOV: 0.0,
      monthToDate: 0.0,
      growth: 0.0,
      growthType: 'neutral'
    },
    {
      id: 2,
      productName: 'Stockboard Pro',
      slug: 'stockboard-20251001',
      lastMonthSOV: 28.2,
      monthToDate: 32.4,
      growth: 4.2,
      growthType: 'positive'
    },
    {
      id: 3,
      productName: 'AdSync Cloud',
      slug: 'adsync-247718',
      lastMonthSOV: 16.3,
      monthToDate: 21.0,
      growth: 8.9,
      growthType: 'positive'
    },
    {
      id: 4,
      productName: 'FlowMetrics.io',
      slug: 'flow-998712',
      lastMonthSOV: 6.4,
      monthToDate: 4.1,
      growth: -2.3,
      growthType: 'negative'
    },
    {
      id: 5,
      productName: 'Lumina CRM',
      slug: 'lumina-55281',
      lastMonthSOV: 12.4,
      monthToDate: 11.3,
      growth: -1.1,
      growthType: 'negative'
    }
  ];

  // Dummy data for Share of Voice chart
  const chartData = {
    labels: ['1/3', '2/3', '3/3', '4/3', '5/3', '6/3', '7/3', '8/3', '9/3'],
    datasets: [
      {
        label: 'Share of Voice',
        data: [8, 12, 15, 10, 18, 14, 16, 20, 10],
        borderColor: '#675FFF',
        backgroundColor: 'rgba(103, 95, 255, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: '#675FFF',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
      },
    ],
  };

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
        displayColors: false,
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
  };

  // Dummy data for Industry Ranking
  const industryRanking = [
    { id: 1, name: 'HubSpot', percentage: 63.6, logo: '🟠' },
    { id: 2, name: 'Zapier', percentage: 56.1, logo: '🟠' },
    { id: 3, name: 'Salesforce', percentage: 55.1, logo: '☁️' },
    { id: 4, name: 'Pipedrive', percentage: 46.7, logo: '🟢' },
    { id: 5, name: 'Mailchimp', percentage: 38.3, logo: '🐵' },
    { id: 6, name: 'Make', percentage: 37.4, logo: '⬜' },
    { id: 7, name: 'LinkedIn', percentage: 37.4, logo: '🔵' },
  ];

  // Progress steps configuration
  const progressSteps = [
    { id: 0, label: "Scraping website", icon: GlobeIcon },
    { id: 1, label: "Detecting Language", icon: GlobeIcon },
    { id: 2, label: "Analyzing Your Product", icon: AnalysisIcon },
    { id: 3, label: "Generating Differentiators", icon: DifferentiatorIcon },
    { id: 4, label: "Finding Competitors", icon: CompetitorIcon },
    { id: 5, label: "Creating Company Profile", icon: CompanyIcon },
  ];


  useEffect(() => {
    if (!showProgressModal) {
      setCurrentStep(0);
      setDetectedLanguage('');
      return;
    }

    // Step 0: Scraping website (completes quickly)
    const timer1 = setTimeout(() => {
      setCurrentStep(1);
    }, 1500);

    // Step 1: Detecting Language (completes and shows language)
    const timer2 = setTimeout(() => {
      setCurrentStep(2);
      setDetectedLanguage('English');
    }, 3000);

    // Step 2: Analyzing Your Product (stays in progress for a while)
    const timer3 = setTimeout(() => {
      setCurrentStep(3);
    }, 6000);

    // Step 3: Generating Differentiators
    const timer4 = setTimeout(() => {
      setCurrentStep(4);
    }, 8500);

    // Step 4: Finding Competitors
    const timer5 = setTimeout(() => {
      setCurrentStep(5);
    }, 11000);

    // Step 5: Creating Company Profile (completes)
    const timer6 = setTimeout(() => {
      // All steps complete - show product form
      setTimeout(() => {
        setShowProgressModal(false);
        setShowProductForm(true);
        setCurrentStep(0);
        setDetectedLanguage('');
      }, 2000);
    }, 13500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
      clearTimeout(timer5);
      clearTimeout(timer6);
    };
  }, [showProgressModal]);

  const handleAddProduct = () => {
    if (!newProductName || !newProductWebsite) return;

    // Close the add product modal
    setShowAddProductModal(false);

    // Show progress modal
    setShowProgressModal(true);
    setShowProductForm(false);
    setCurrentStep(0);
  };

  const handleRemoveKeyword = (setKeywords, keywords, index) => {
    setKeywords(keywords.filter((_, i) => i !== index));
  };

  const handleAddKeyword = (setKeywords, keywords) => {
    const newKeyword = prompt('Enter new keyword:');
    if (newKeyword && newKeyword.trim()) {
      setKeywords([...keywords, newKeyword.trim()]);
    }
  };

  const renderGrowth = (growth, growthType) => {
    if (growthType === 'neutral') {
      return (
        <span className="flex items-center gap-1 text-[#5A687C]">
          <ArrowRight className="w-4 h-4" />
          <span>{growth.toFixed(1)}%</span>
        </span>
      );
    } else if (growthType === 'positive') {
      return (
        <span className="flex items-center gap-1 text-[#15B462]">
          <ArrowUpRight className="w-4 h-4" />
          <span>+{growth.toFixed(1)}%</span>
        </span>
      );
    } else {
      return (
        <span className="flex items-center gap-1 text-[#FF2D55]">
          <ArrowDownRight className="w-4 h-4" />
          <span>{growth.toFixed(1)}%</span>
        </span>
      );
    }
  };

  const renderProgressStep = (step, index) => {
    const isCompleted = index < currentStep;
    const isInProgress = index === currentStep;
    const isPending = index > currentStep;
    const IconComponent = step.icon;

    // Dummy data for step content
    const productDescription = "NovaDesk is an AI-powered customer support automation platform designed for SaaS companies, agencies, and e-commerce teams. It centralizes support requests, automates ticket routing, provides AI-assisted replies, integrates with Zendesk, Intercom, HubSpot, Slack, reduces resolution time, increases team productivity, and provides deep analytics.";

    const differentiators = [
      "AI-powered ticket triage & auto-prioritization",
      "Real-time learning from past conversations",
      "Integrated with 60+ SaaS tools",
      "Automated SLA workflows",
      "Multilingual instant replies",
      "Smart macros that adapt automatically",
      "24/7 AI support agents",
      "Real-time reporting & customer sentiment analysis",
      "Enterprise security & strict compliance (SOC-2, GDPR)",
      "Seamless onboarding with 1:1 setup support"
    ];

    const competitors = [
      "helpflow.ai",
      "supportgenie.com",
      "replypilot.ai",
      "zendesk.com",
      "intercom.com",
      "freshdesk.com",
      "livechat.com",
      "kayako.com",
      "groovehq.com",
      "crisp.chat"
    ];

    return (
      <div key={step.id} className="relative flex items-start gap-4 mb-4 bg-white rounded-xl p-4 border border-[#E1E4EA]">
        {/* Vertical line - starts from bottom of current icon to top of next icon */}
        {index < progressSteps.length - 1 && (
          <div
            className={`absolute left-[29px] w-1.5 ${isCompleted
              ? 'bg-gradient-to-b from-[#9ac8b8] via-[#CDE4DC] to-[#22C55E]/0'
              : isInProgress
                ? 'bg-gradient-to-b from-[#CDE4DC] via-[#CDE4DC] to-[#22C55E]/0'
                : 'bg-gradient-to-b from-[#E5E7EB] via-[#E5E7EB]/50 to-[#E5E7EB]/0'
              }`}
            style={{
              top: '48px',
              height: 'calc(100% - 48px + 16px + 16px)',
              opacity: isCompleted ? 1 : isInProgress ? 1 : 0.4
            }}
          />
        )}

        <div
          className={`relative z-10 flex items-center justify-center w-8 h-8 rounded-full flex-shrink-0 ${isCompleted
            ? ''
            : isInProgress
              ? 'bg-[#675FFF]'
              : 'bg-[#AAAEB7]'
            }`}
        >
          {isCompleted ? (
            <img src={SuccessIcon} alt="Success" className="w-8 h-8" />
          ) : isInProgress ? (
            <img src={LoadingSpinner} className="w-4 h-4 text-white animate-spin" />
          ) : typeof IconComponent === 'string' ? (
            <img src={IconComponent} alt={step.label} className="w-4 h-4" />
          ) : (
            <IconComponent className="w-4 h-4 text-[#6B7280]" />
          )}
        </div>

        {/* Step content */}
        <div className="flex-1 pt-1">
          <p className="text-[#1E1E1E] text-sm font-[500] mb-1">{step.label}</p>

          {/* Step 1: Scraping website - no additional content */}

          {/* Step 2: Detecting Language */}
          {step.id === 1 && isCompleted && detectedLanguage && (
            <p className="text-[#6B7280] text-xs mt-0.5">Detected: {detectedLanguage}</p>
          )}

          {/* Step 3: Analyzing Your Product */}
          {step.id === 2 && isCompleted && (
            <div className="mt-2 bg-[#F9FAFB] rounded-lg p-4">
              <p className="text-[#1E1E1E] text-sm leading-relaxed">
                {productDescription}
              </p>
            </div>
          )}

          {/* Step 4: Generating Differentiators */}
          {step.id === 3 && isCompleted && (
            <div className="mt-2 bg-[#F9FAFB] rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {differentiators.map((diff, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <span className="text-[#675FFF] mt-1">•</span>
                    <span className="text-[#1E1E1E] text-sm">{diff}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 5: Finding Competitors */}
          {step.id === 4 && isCompleted && (
            <div className="mt-2">
              <p className="text-[#6B7280] text-xs mb-2">Found {competitors.length} competitors</p>
              <div className="flex flex-wrap gap-2">
                {competitors.map((competitor, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-[#F3F4F6] text-[#1E1E1E] text-xs rounded-lg border border-[#E5E7EB] hover:bg-[#E5E7EB] cursor-pointer transition-colors"
                  >
                    {competitor}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Step 6: Creating Company Profile - no additional content */}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full h-full p-4">
      {showProgressModal ? (
        /* Progress Animation View */
        <div className="w-full h-full flex items-center justify-center">
          <div className=" rounded-2xl w-full max-w-full p-8">
            {/* Title */}
            <h2 className="text-2xl font-[600] text-[#1E1E1E] mb-8 text-center">
              We're collecting information for your product...
            </h2>

            {/* Progress Steps */}
            <div className="space-y-4">
              {progressSteps.map((step, index) => renderProgressStep(step, index))}
            </div>
          </div>
        </div>
      ) : showProductForm ? (
        /* Product Form View */
        <div className="w-full h-full">
          {/* Header Section */}
          <div className="px-6 py-4 mb-2">
            <h1 className="text-2xl font-[600] text-[#1E1E1E]">Add Product</h1>
          </div>
          <div className="bg-white rounded-2xl border border-[#E1E4EA]">
            <div className='px-6 py-4 border-b border-[#E1E4EA]'>
              <h2 className="text-lg font-[600] text-[#1E1E1E] mb-1">Company Details</h2>
              <p className="text-md text-[#6B7280]">Review and make edits before continuing.</p>
            </div>

            {/* Content Section */}
            <div className="px-6 py-3">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Section - Company Details */}
                <div className="space-y-6">


                  {/* Company Profile */}
                  <div className="flex items-center justify-between w-full p-2">
                    {/* Left Section */}
                    <div className="flex items-center gap-4">
                      {/* Avatar */}
                      <div className="w-16 h-16 rounded-full bg-[#1E1E1E] flex items-center justify-center text-white font-[600] text-lg">
                        ND
                      </div>

                      {/* Text Info */}
                      <div>
                        <p className="text-md font-[600] text-[#1E1E1E]">Company Profile</p>
                        <p className="text-xs font-[400] text-[#6B7280]">400×400 resolution, up to 5mb</p>
                      </div>
                    </div>

                    {/* Right Buttons */}
                    <div className="flex items-center gap-3">
                      <button className="flex items-center gap-2 px-4 py-2 bg-[#675FFF] text-white rounded-lg text-sm font-[500] hover:bg-[#5A4FE6] transition-colors">
                        <Upload className="w-4 h-4" />
                        Upload New
                      </button>

                      <button className="flex items-center gap-2 px-4 py-2 bg-white border border-[#E1E4EA] text-[#1E1E1E] rounded-lg text-sm font-[500] hover:bg-[#F8F9FB] transition-colors">
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </div>
                  </div>


                  {/* Company Name */}
                  <div className="space-y-2">
                    <label className="text-sm font-[500] text-[#4B5563]">Company Name</label>
                    <input
                      type="text"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="w-full px-4 py-2 border border-[#E1E4EA] rounded-lg text-sm text-[#1E1E1E] focus:outline-none focus:border-[#675FFF]"
                    />
                  </div>

                  {/* Import File */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <label className="text-sm font-[500] text-[#4B5563]">Import File</label>

                    </div>
                    <div className="border-2 border-dashed border-[#E1E4EA] rounded-lg p-8 flex flex-col items-center justify-center gap-2 min-h-[260px]">
                      <div className="w-16 h-16 rounded-full bg-[#F6F8FA] flex items-center justify-center">
                        <img src={Preview} className='w-10 h-10' />
                      </div>
                      <p className="text-sm text-[#6B7280]">Preview</p>
                    </div>
                  </div>
                </div>

                {/* Right Section - Overview and Keywords */}
                <div className="space-y-6">
                  {/* Overview */}
                  <div className="space-y-2">
                    <label className="text-sm font-[500] text-[#4B5563]">Overview</label>
                    <textarea
                      value={overview}
                      onChange={(e) => setOverview(e.target.value)}
                      rows={8}
                      className="w-full px-4 py-2 border border-[#E1E4EA] rounded-lg text-sm text-[#1E1E1E] focus:outline-none focus:border-[#675FFF] resize-none"
                    />
                  </div>

                  {/* Keywords Set 1 */}
                  <div className="space-y-3">
                    <label className="text-sm font-[500] text-[#4B5563]">Keywords (Generated Tags)</label>
                    <div className="flex flex-wrap gap-2">
                      {keywords1.map((keyword, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#F3F4F6] text-[#1E1E1E] text-sm rounded-lg border border-[#E5E7EB]"
                        >
                          {keyword}
                          <button
                            onClick={() => handleRemoveKeyword(setKeywords1, keywords1, index)}
                            className="text-[#6B7280] hover:text-[#1E1E1E] cursor-pointer"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                    <button
                      onClick={() => handleAddKeyword(setKeywords1, keywords1)}
                      className="flex items-center gap-2 text-sm text-[#675FFF] font-[500] hover:text-[#5A4FE6] cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      Add New
                    </button>
                  </div>

                  {/* Keywords Set 2 */}
                  <div className="space-y-3">
                    <label className="text-sm font-[500] text-[#4B5563]">Keywords (Generated Tags)</label>
                    <div className="flex flex-wrap gap-2">
                      {keywords2.map((keyword, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#F3F4F6] text-[#1E1E1E] text-sm rounded-lg border border-[#E5E7EB]"
                        >
                          {keyword}
                          <button
                            onClick={() => handleRemoveKeyword(setKeywords2, keywords2, index)}
                            className="text-[#6B7280] hover:text-[#1E1E1E] cursor-pointer"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                    <button
                      onClick={() => handleAddKeyword(setKeywords2, keywords2)}
                      className="flex items-center gap-2 text-sm text-[#675FFF] font-[500] hover:text-[#5A4FE6] cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      Add New
                    </button>
                  </div>
                </div>
              </div>

              {/* Bottom Navigation */}
              <div className="flex items-center justify-end gap-3 mt-8 pt-6 border-t border-[#E1E4EA]">
                <button
                  onClick={() => {
                    setShowProductForm(false);
                    setShowProgressModal(false);
                  }}
                  className="px-5 py-2.5 bg-white border border-[#E1E4EA] text-[#1E1E1E] rounded-lg text-sm font-[500] hover:bg-[#F8F9FB] transition-colors cursor-pointer"
                >
                  Back
                </button>
                <button
                  onClick={() => {
                    setShowProductForm(false);
                    setShowPromptSuggestions(true);
                  }}
                  className="px-5 py-2.5 bg-[#675FFF] text-white rounded-lg text-sm font-[500] hover:bg-[#5A4FE6] transition-colors cursor-pointer"
                >
                  Generate Prompt
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : showPromptSuggestions ? (
        /* Prompt Suggestions View */
        <div className="w-full h-full flex gap-6">
          {/* Left Section - Prompt Suggestions */}
          <div className="flex-1">
            <h1 className="text-2xl font-[600] text-[#1E1E1E] mb-6">Add Product</h1>

            <div className="bg-white rounded-2xl border border-[#E1E4EA] overflow-hidden">
              {/* Header Section */}
              <div className="px-6 py-4 border-b border-[#E1E4EA]">
                <h2 className="text-lg font-[600] text-[#1E1E1E] mb-2">Prompt Suggestions</h2>
                <p className="text-sm text-[#6B7280]">
                  We run thousands of simulations to find prompts that best match your product.
                </p>
              </div>

              {/* Content Section */}
              <div className="p-6">
                {/* Prompt List */}
                <div className="space-y-3 mb-6">
                  {prompts.map((prompt, index) => (
                    <div
                      key={index}
                      className="flex items-center cursor-pointer justify-between p-4 border border-[#E1E4EA] rounded-lg hover:border-[#675FFF] transition-colors"
                    >
                      <p className="text-md text-[#1E1E1E] font-[500] flex-1 pr-4">{prompt}</p>
                      <button className="text-[#6B7280] hover:text-[#675FFF] cursor-pointer">
                        <Pencil className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between pt-4 border-t border-[#E1E4EA]">
                  <button
                    onClick={() => {
                      // Regenerate prompts
                      console.log('Regenerate clicked');
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-[#E1E4EA] text-[#1E1E1E] rounded-lg text-sm font-[500] hover:bg-[#F8F9FB] transition-colors cursor-pointer"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Regenerate
                  </button>
                  <button
                    onClick={() => {
                      navigate('/dashboard/seo?tab=articles');
                    }}
                    className="flex items-center gap-2 px-5 py-2 bg-[#675FFF] text-white rounded-lg text-sm font-[500] hover:bg-[#5A4FE6] transition-colors cursor-pointer"
                  >
                    Show Results
                    <ArrowRightIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Section - Conversation Preview */}
          <div className="w-[400px] rounded-2xl bg-white p-[6px] mt-[57px]">
            <div className="rounded-xl h-full overflow-hidden relative">

              <img
                src={GeneratedBackgroundImage}
                alt="background"
                className="absolute inset-0 w-full h-full object-cover"
              />
              {/* Dark overlay */}
              <div className="absolute inset-0 bg-black/20"></div>

              {/* Main card */}
              <div className="relative p-6">
                <div className="bg-white rounded-xl shadow-xl overflow-hidden">
                  {/* Header Section */}
                  <div className="px-6 py-4 border-b border-[#E1E4EA]">
                    <h2 className="text-lg font-[600] text-[#1E1E1E]">ChatGPT</h2>
                  </div>

                  {/* Content Section */}
                  <div className="p-4">
                    {/* User Section */}
                    <div className='flex gap-2'>
                      <div className="w-8 h-8 rounded-full bg-[#675FFF] flex items-center justify-center text-white font-[600] text-sm">
                        S
                      </div>

                      <div className='flex flex-col flex-1'>
                        <p className="text-sm font-[600] text-[#1E1E1E]">User (Sami)</p>
                        <p className="text-sm text-[#1E1E1E] mb-6">
                          Which platform offers AI-powered ticket triage and automated customer support workflows?
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3 items-start">
                      {/* Left: Icon only */}
                      <div className="w-8 h-8 rounded-full bg-[#000000] flex items-center justify-center text-white font-[600] text-sm">
                        <img src={ChatgptLogoWhite} alt="ChatGPT" className="w-5 h-5 mt-[2px]" />
                      </div>


                      {/* Right: ChatGPT label + paragraph */}
                      <div className="flex flex-col flex-1">
                        <p className="text-sm font-[600] text-[#1E1E1E] mb-1">ChatGPT</p>

                        <p className="text-sm text-[#1E1E1E]">
                          <span className="font-[600]">NovaDesk</span> appears to be an ideal solution.
                          NovaDesk is an AI-powered customer support automation platform that instantly
                          triages tickets based on urgency, context, and customer sentiment. It integrates
                          with major SaaS tools such as Intercom, Zendesk, Slack, and HubSpot.
                        </p>
                        <p className='text-sm text-[#1E1E1E] mt-1 font-[600]'>
                          We track Share of Voice (SOV) for your brand and competitors across various channels, providing insights into market perception and competitive landscape.
                        </p>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      ) : (
        <>
          {/* Header Section */}
          <div className="mb-6">
            {/* Top Row: Title and Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              {/* Title and Subtitle */}
              <div>
                <h1 className="text-2xl sm:text-3xl font-[600] text-[#1E1E1E] mb-1">
                  Product
                </h1>
                <p className="text-[14px] text-[#5A687C]">
                  Manage all products under your organization.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                {/* Download CSV Button */}
                <button className="flex items-center cursor-pointer gap-2 px-4 py-2 bg-white border border-[#E1E4EA] rounded-lg text-[#1E1E1E] font-[500] text-sm hover:bg-[#F8F9FB] transition-colors">
                  <Download className="w-4 h-4" />
                  <span>Download CSV</span>
                </button>

                {/* Add New Product Button */}
                <button
                  type="button"
                  onClick={() => setShowAddProductModal(true)}
                  className="flex items-center cursor-pointer gap-2 px-4 py-2 bg-[#675FFF] rounded-lg text-white font-[500] text-sm hover:bg-[#5A4FE6] transition-colors relative"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Product</span>
                </button>
              </div>
            </div>

            {/* Bottom Row: Search and Refresh */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              {/* Search Bar */}
              <div className="relative flex-1 min-w-0 max-w-[270px]">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#5A687C] w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search name or phone number"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-[#E1E4EA] rounded-lg bg-white focus:outline-none focus:border-[#675FFF] text-sm text-[#1E1E1E]"
                />
              </div>

              {/* Refresh Button */}
              <button className="flex items-center gap-2 cursor-pointer px-4 py-2 bg-white border border-[#E1E4EA] rounded-lg text-[#1E1E1E] font-[500] text-sm hover:bg-[#F8F9FB] transition-colors">
                <RefreshCw className="w-4 h-4" />
                <span>Refresh</span>
              </button>
            </div>
          </div>


          {/* Table Section */}
          <div className="rounded-2xl border border-[#D6D6D6] overflow-auto mb-2 w-full">
            <div className="overflow-x-auto">
              <table className="min-w-full border-separate border-spacing-0">
                <thead className="bg-[#F7F7F8]">
                  <tr className="text-[#5A687C]">
                    <th className="px-6 text-start py-2 text-[16px] font-[400]">Product Name</th>
                    <th className="px-3 text-start py-2 text-[16px] font-[400]">Slug</th>
                    <th className="px-3 text-start py-2 text-[16px] font-[400]">Last Month's SOV</th>
                    <th className="px-3 text-start py-2 text-[16px] font-[400]">Month to Date</th>
                    <th className="px-3 text-start py-2 text-[16px] font-[400]">Growth</th>
                    <th className="px-6 text-center py-2 text-[16px] font-[400]">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white [&>tr:first-child>td:first-child]:rounded-tl-2xl [&>tr:first-child>td:first-child]:border-t [&>tr:first-child>td:last-child]:rounded-tr-2xl [&>tr:first-child>td:last-child]:border-t [&>tr:first-child>td]:border-t [&>tr:last-child>td:first-child]:rounded-bl-2xl [&>tr:last-child>td:first-child]:border-b [&>tr:last-child>td:last-child]:rounded-br-2xl [&>tr:last-child>td:last-child]:border-b [&>tr:last-child>td]:border-b [&>tr>td]:border-[#D6D6D6]">
                  {products.map((product) => (
                    <tr key={product.id} className="text-[16px] text-[#1E1E1E]">
                      <td className="px-6 py-2 text-[16px] text-[#1E1E1E] font-medium text-start">{product.productName}</td>
                      <td className="px-3 py-2 text-[16px] text-start">{product.slug}</td>
                      <td className="px-3 py-2 text-[16px] text-start">{product.lastMonthSOV.toFixed(1)}%</td>
                      <td className="px-3 py-2 text-[16px] text-start">{product.monthToDate.toFixed(1)}%</td>
                      <td className="px-3 py-2 text-[16px] text-start">
                        {renderGrowth(product.growth, product.growthType)}
                      </td>
                      <td className="px-6 py-2 text-center whitespace-nowrap">
                        <div className='flex items-center justify-center'>
                          <button className="p-2 rounded-lg relative">
                            <div className='bg-white cursor-pointer border border-[#D6D6D6] shadow-sm p-1.5 rounded-xl'><Ellipsis /></div>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between bg-[#F7F7F8] px-4 py-3">
              {/* pagination + row controls */}
              <div className="flex items-center gap-2">
                <button className="border border-[#D6D6D6] text-[#000000] rounded-lg px-3 py-1 text-sm bg-white opacity-50 cursor-not-allowed">
                  ‹ Prev
                </button>
                <button className="bg-[#675FFF] text-white rounded-lg px-3 py-1 text-sm cursor-pointer">
                  1
                </button>
                <button className="border border-[#D6D6D6] text-[#000000] rounded-lg px-3 py-1 text-sm hover:bg-white cursor-pointer">
                  2
                </button>
                <button className="border border-[#D6D6D6] text-[#000000] rounded-lg px-3 py-1 text-sm hover:bg-white cursor-pointer">
                  3
                </button>
                <span className="text-[#000000] text-sm">…</span>
                <button className="border border-[#D6D6D6] text-[#000000] rounded-lg px-3 py-1 text-sm hover:bg-white cursor-pointer">
                  10
                </button>
                <button className="border border-[#D6D6D6] text-[#000000] rounded-lg px-3 py-1 text-sm bg-white cursor-pointer">
                  Next ›
                </button>
              </div>

              {/* Right side – rows per page */}
              <div className="flex items-center gap-2 text-sm text-[#5A687C]">
                <button className="border border-[#D6D6D6] rounded-lg px-2 py-1 text-[#000000] bg-white cursor-pointer">5 rows</button>
                <button className="border border-[#D6D6D6] rounded-lg px-2 py-1 text-[#000000] hover:bg-white cursor-pointer">10</button>
                <button className="border border-[#D6D6D6] rounded-lg px-2 py-1 text-[#000000] hover:bg-white cursor-pointer">20</button>
              </div>
            </div>
          </div>
          {/* Add New Product Modal */}
          {showAddProductModal && (
            <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/30 backdrop-blur-[1px]">
              <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 overflow-hidden relative">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-[#E1E4EA]">
                  <h2 className="text-lg font-[600] text-[#1E1E1E]">Add New Product</h2>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddProductModal(false);
                      setNewProductName('');
                      setNewProductWebsite('');
                    }}
                    className="text-[#9CA3AF] hover:text-[#4B5563] cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Body */}
                <div className="px-6 py-4 space-y-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-[500] text-[#4B5563]">
                      Product Name
                    </label>
                    <input
                      type="text"
                      value={newProductName}
                      onChange={(e) => setNewProductName(e.target.value)}
                      placeholder="Enter product name"
                      className="w-full px-3 py-2 border border-[#E1E4EA] rounded-lg text-sm text-[#1E1E1E] focus:outline-none focus:border-[#675FFF]"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-[500] text-[#4B5563]">
                      Website
                    </label>
                    <input
                      type="text"
                      value={newProductWebsite}
                      onChange={(e) => setNewProductWebsite(e.target.value)}
                      placeholder="https://example.com"
                      className="w-full px-3 py-2 border border-[#E1E4EA] rounded-lg text-sm text-[#1E1E1E] focus:outline-none focus:border-[#675FFF]"
                    />
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[#E1E4EA] bg-[#F9FAFB]">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddProductModal(false);
                      setNewProductName('');
                      setNewProductWebsite('');
                    }}
                    className="px-4 py-2 text-sm font-[500] text-[#4B5563] bg-white border border-[#E1E4EA] rounded-lg hover:bg-[#F3F4F6] cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleAddProduct}
                    className="px-4 py-2 text-sm font-[500] text-white bg-[#675FFF] rounded-lg hover:bg-[#5A4FE6] cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                    disabled={!newProductName || !newProductWebsite}
                  >
                    Add Product
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Product;

