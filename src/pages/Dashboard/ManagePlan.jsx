import { ChevronDown, X, Search, Download } from "lucide-react";
import { useEffect, useState } from "react";
import { updateSubscriptionPaymentStatus, getTransactionsHistory } from "../../api/payment";
import { useSelector } from "react-redux";
import { loadStripe } from "@stripe/stripe-js";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { BusinessPlanIcon, CheckedCircle, CustomPlanIcon, ProPlanIcon, TeamPlanIcon } from "../../icons/icons";
import { DateFormat } from "../../utils/TimeFormat";
import { CancelSubscriptionPopup } from "../../components/Plan";

// Import your SVG icons
import AgentsIcon from "../../assets/svg/AgentsIcon.svg";
import CreditsIcon from "../../assets/svg/CreditsIcon.svg";
import UsersIcon from "../../assets/svg/UsersIcon.svg";
import StorageIcon from "../../assets/svg/StorageIcon.svg";
import IntegrationsIcon from "../../assets/svg/IntegrationsIcon.svg";
import ScheduleIcon from "../../assets/svg/ScheduleIcon.svg";
import SupportIcon from "../../assets/svg/SupportIcon.svg";
import PriorityIcon from "../../assets/svg/Priority.svg";
import AdvancedIcon from "../../assets/svg/Advanced.svg";
import MultiSupportIcon from "../../assets/svg/MultiSupport.svg";
import CalendarIcon from "../../assets/svg/calenderIcon.svg";

const featureIcons = {
  // AI Agents
  "ai agents": <img src={AgentsIcon} alt="agents" className="w-5 h-5" />,
  "agents": <img src={AgentsIcon} alt="agents" className="w-5 h-5" />,
  
  // Credits
  "credits": <img src={CreditsIcon} alt="credits" className="w-5 h-5" />,
  "credits_per_month": <img src={CreditsIcon} alt="credits" className="w-5 h-5" />,
  "credit": <img src={CreditsIcon} alt="credits" className="w-5 h-5" />,
  
  // Users
  "user": <img src={UsersIcon} alt="users" className="w-5 h-5" />,
  "users": <img src={UsersIcon} alt="users" className="w-5 h-5" />,
  
  // Storage/Knowledge
  "knowledge": <img src={StorageIcon} alt="storage" className="w-5 h-5" />,
  "of_knowledge": <img src={StorageIcon} alt="storage" className="w-5 h-5" />,
  "gb": <img src={StorageIcon} alt="storage" className="w-5 h-5" />,
  "storage": <img src={StorageIcon} alt="storage" className="w-5 h-5" />,
  
  // Integrations
  "single account per platform": <img src={ScheduleIcon} alt="calendar" className="w-5 h-5" />,
  "single_account_per_platform": <img src={ScheduleIcon} alt="calendar" className="w-5 h-5" />,
  "integrations": <img src={IntegrationsIcon} alt="integrations" className="w-5 h-5" />,
  "full_integrations": <img src={IntegrationsIcon} alt="integrations" className="w-5 h-5" />,
  "full integrations": <img src={IntegrationsIcon} alt="integrations" className="w-5 h-5" />,
  "single_account": <img src={IntegrationsIcon} alt="integrations" className="w-5 h-5" />,
  "platform": <img src={IntegrationsIcon} alt="integrations" className="w-5 h-5" />,
  "account": <img src={IntegrationsIcon} alt="integrations" className="w-5 h-5" />,
  
  // Schedule/Automation
  "schedule": <img src={ScheduleIcon} alt="schedule" className="w-5 h-5" />,
  "schedule_tool": <img src={ScheduleIcon} alt="schedule" className="w-5 h-5" />,
  "schedule_tool_runs": <img src={ScheduleIcon} alt="schedule" className="w-5 h-5" />,
  "runs": <img src={ScheduleIcon} alt="schedule" className="w-5 h-5" />,
  "automation": <img src={ScheduleIcon} alt="schedule" className="w-5 h-5" />,
  "tool": <img src={ScheduleIcon} alt="schedule" className="w-5 h-5" />,
  
  // Support
  "live_chat": <img src={SupportIcon} alt="support" className="w-5 h-5" />,
  "support": <img src={SupportIcon} alt="support" className="w-5 h-5" />,
  "live-chat": <img src={SupportIcon} alt="support" className="w-5 h-5" />,
  "chat": <img src={SupportIcon} alt="support" className="w-5 h-5" />,
  
  // Security & Advanced Features
  "priority support slas": <img src={PriorityIcon} alt="priority" className="w-5 h-5" />,
  "priority_support_slas": <img src={PriorityIcon} alt="priority" className="w-5 h-5" />,
  "priority support": <img src={PriorityIcon} alt="priority" className="w-5 h-5" />,
  "priority_support": <img src={PriorityIcon} alt="priority" className="w-5 h-5" />,
  "priority": <img src={PriorityIcon} alt="priority" className="w-5 h-5" />,
  "slas": <img src={PriorityIcon} alt="priority" className="w-5 h-5" />,
  "advanced_auth": <img src={AdvancedIcon} alt="advanced" className="w-5 h-5" />,
  "advanced authentication": <img src={AdvancedIcon} alt="advanced" className="w-5 h-5" />,
  "sso": <img src={AdvancedIcon} alt="advanced" className="w-5 h-5" />,
  "rbac": <img src={AdvancedIcon} alt="advanced" className="w-5 h-5" />,
  "multi_region": <img src={MultiSupportIcon} alt="multi-region" className="w-5 h-5" />,
  "support_for_multi_region": <img src={MultiSupportIcon} alt="multi-region" className="w-5 h-5" />,
  "multi-region": <img src={MultiSupportIcon} alt="multi-region" className="w-5 h-5" />,
  "premier support slgs": <img src={SupportIcon} alt="support" className="w-5 h-5" />,
  "premier_support_slgs": <img src={SupportIcon} alt="support" className="w-5 h-5" />,
  "premium_support": <img src={SupportIcon} alt="support" className="w-5 h-5" />,
  "premier support": <img src={SupportIcon} alt="support" className="w-5 h-5" />,
  "premier": <img src={SupportIcon} alt="support" className="w-5 h-5" />,
  "slgs": <img src={SupportIcon} alt="support" className="w-5 h-5" />,
  "auth": <img src={AdvancedIcon} alt="advanced" className="w-5 h-5" />,
  "authentication": <img src={AdvancedIcon} alt="advanced" className="w-5 h-5" />,
  "region": <img src={MultiSupportIcon} alt="multi-region" className="w-5 h-5" />,
  
  // Default fallback
  "default": <CheckedCircle status={true} />
};

// Helper function to find the appropriate icon
const getFeatureIcon = (feature) => {
  if (!feature) return featureIcons.default;
  
  const lowerFeature = feature.toLowerCase();
  
  // Priority matching - check for more specific matches first
  const priorityMatches = [
    "single account per platform",
    "single_account_per_platform",
    "priority support slas",
    "priority_support_slas",
    "premier support slgs",
    "premier_support_slgs",
    "support_for_multi_region",
    "advanced authentication",
    "premier support",
    "priority support",
    "schedule_tool_runs",
    "priority_support",
    "premium_support",
    "advanced_auth",
    "multi_region",
    "multi-region",
    "full_integrations",
    "full integrations",
    "single_account",
    "schedule_tool",
    "credits_per_month",
    "of_knowledge",
    "live_chat",
    "live-chat",
    "ai agents",
    "sso",
    "rbac",
    "slas",
    "slgs",
  ];
  
  // Check priority matches first
  for (const key of priorityMatches) {
    if (lowerFeature.includes(key.toLowerCase())) {
      return featureIcons[key];
    }
  }
  
  // Check all other keys
  for (const [key, icon] of Object.entries(featureIcons)) {
    if (key !== "default" && lowerFeature.includes(key.toLowerCase())) {
      return icon;
    }
  }
  
  return featureIcons.default;
};

const ManagePlan = ({ onClose }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("yearly");
  const [activePlan, setActivePlan] = useState("");
  const [planIndex, setPlanIndex] = useState();
  const [showCancelPopup, setShowCancelPopup] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [loadingTransactions, setLoadingTransactions] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const userDetails = useSelector((state) => state.profile.user);
  const token = useSelector((state) => state.auth.token);

  const plans = {
    yearly: [
      {
        id: import.meta.env.VITE_YEARLY_PRO_PLAN,
        name: `${t("Standard")}`,
        key: "pro",
        svg: <ProPlanIcon />,
        price: "€931",
        originalPrice: "€1,000",
        period: `/ ${t("settings.tab_2_list.year")}`,
        description: `${t("settings.tab_2_list.pro_content")}`,
        features: [
          `1 000 ${t("settings.tab_2_list.credits_per_month")}`,
          `1 ${t("settings.tab_2_list.user")}`,
          `1GB ${t("settings.tab_2_list.of_knowledge")}`,
          `5 ${t("settings.tab_2_list.integrations")}`,
          `${t("settings.tab_2_list.schedule_tool_runs")}`,
          `${t("settings.tab_2_list.live_chat")}`,
        ],
        selected: true,
        discount: `20% ${t("settings.tab_2_list.off")}`,
      },
      {
        id: import.meta.env.VITE_YEARLY_TEAM_PLAN,
        name: `${t("Pro")}`,
        key: "team",
        svg: <TeamPlanIcon />,
        price: "€1,603",
        originalPrice: "€2,000",
        period: `/ ${t("settings.tab_2_list.year")}`,
        description: `${t("settings.tab_2_list.team_content")}`,
        features: [
          `2 500 ${t("settings.tab_2_list.credits_per_month")}`,
          `5 ${t("settings.tab_2_list.users")}`,
          `5GB ${t("settings.tab_2_list.of_knowledge")}`,
          `${t("settings.tab_2_list.full_integrations")} ${t("settings.tab_2_list.single_account_per_platform")}`,
          `${t("settings.tab_2_list.live_chat")}`,
        ],
        discount: `20% ${t("settings.tab_2_list.off")}`,
      },
      {
        name: `${t("settings.tab_2_list.enterprise")}`,
        svg: <CustomPlanIcon />,
        key: "enterprise",
        price: `${t("settings.tab_2_list.custom")}`,
        description: "Best performance, support and security.",
        features: [
          `${t("settings.tab_2_list.priority_support")}`,
          `${t("settings.tab_2_list.advanced_auth")}`,
          `${t("settings.tab_2_list.support_for_multi_region")}`,
          `${t("settings.tab_2_list.premium_support")}`,
        ],
      },
    ],
    monthly: [
      {
        id: import.meta.env.VITE_MONTHLY_PRO_PLAN,
        name: "Standard",
        svg: <ProPlanIcon />,
        price: "€97",
        key: "pro",
        period: `/ month`,
        description: "For independent professionals",
        features: [
          `8 AI agents`,
          `1000 credits per month`,
          `1 user`,
          `1GB of Knowledge`,
          `5 Integrations`,
          `Schedule tool runs`,
          `Live-chat support`,
        ],
        selected: true,
      },
      {
        id: import.meta.env.VITE_MONTHLY_TEAM_PLAN,
        name: "Pro",
        svg: <TeamPlanIcon />,
        key: "team",
        price: "€167",
        period: `/ month`,
        description: "For teams working collaboratively.",
        features: [
          `9 AI agents`,
          `2 500 credits per month`,
          `5 users`,
          `5GB of Knowledge`,
          `Full integrations`,
          `Single account per platform`,
          `Live-chat support`,
        ],
      },
      {
        name: `${t("settings.tab_2_list.enterprise")}`,
        svg: <CustomPlanIcon />,
        key: "enterprise",
        price: `${t("settings.tab_2_list.custom")}`,
        description: "Best performance, support and security.",
        features: [
          `${t("settings.tab_2_list.priority_support")}`,
          `${t("settings.tab_2_list.advanced_auth")}`,
          `${t("settings.tab_2_list.support_for_multi_region")}`,
          `${t("settings.tab_2_list.premium_support")}`,
        ],
      },
    ],
  };

  useEffect(() => {
    if (token && !userDetails.loading) {
      if (userDetails?.subscriptionType === "trail") {
        setActivePlan("");
        setPlanIndex(0);
        setActiveTab("yearly");
      } else {
        const filterData = plans?.[userDetails?.subscriptionDurationType]?.filter(
          (each) => each.key === userDetails?.subscriptionType
        );
        const index = plans?.[userDetails?.subscriptionDurationType]?.findIndex(
          (each) => each.key === userDetails?.subscriptionType
        );
        setPlanIndex(index);
        setActiveTab(userDetails?.subscriptionDurationType);
        setActivePlan(filterData?.[0]?.key);
      }
    }
  }, [token, !userDetails.loading]);

  // Fetch transactions history
  useEffect(() => {
    const fetchTransactions = async () => {
      setLoadingTransactions(true);
      try {
        const response = await getTransactionsHistory();
        if (response?.status === 200) {
          setTransactions(response?.data?.data || []);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoadingTransactions(false);
      }
    };
    if (token) {
      fetchTransactions();
    }
  }, [token]);

  const handleDisablePlan = (index, key) => {
    // If subscription has ended, allow all plans
    if (new Date() > new Date(userDetails?.subscriptionEndDate)) {
      return false;
    }
    
    // If on trial, disable all (keep as is)
    if (userDetails?.subscriptionType === "trial") {
      return true;
    }
    
    // If viewing the same billing cycle as current subscription
    if (userDetails?.subscriptionDurationType === activeTab) {
      // Disable if it's the current plan
      if (index === planIndex) {
        return true;
      }
      // Disable plans lower than current plan (can't downgrade)
      if (index < planIndex) {
        return true;
      }
      // Enable plans higher than current plan (can upgrade)
      return false;
    } else {
      // If viewing different billing cycle, allow all plans
      return false;
    }
  };

  const handleSelectPlan = (plan) => {
    setActivePlan(plan);
  };

  const handlePayment = async (id) => {
    try {
      const payload = {
        email: userDetails.email,
        priceId: id,
      };
      const response = await updateSubscriptionPaymentStatus(payload);
      const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
      const stripe = await stripePromise;
      console.log(response);
      if (response.status === 200 && stripe) {
        await stripe.redirectToCheckout({ sessionId: response?.data?.sessionId });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const renderPlanExpire = () => {
    if (userDetails?.subscriptionType == "trial") {
      if (new Date() > new Date(userDetails?.subscriptionEndDate)) {
        return (
          <p className="text-red-500 pb-3">
            Your Trail Plan ended on {DateFormat(userDetails?.subscriptionEndDate)}
          </p>
        );
      } else {
        return (
          <p className="text-green-500 pb-3">
            Your Trail Plan ends on {DateFormat(userDetails?.subscriptionEndDate)}
          </p>
        );
      }
    } else if (new Date() > new Date(userDetails?.subscriptionEndDate)) {
      return (
        <p className="text-red-500 pb-3">
          Your current plan ended on {DateFormat(userDetails?.subscriptionEndDate)}
        </p>
      );
    }
  };

  // Format date to "MMM YYYY" (e.g., "Oct 2025")
  const formatBillingPeriod = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return `${months[date.getMonth()]} ${date.getFullYear()}`;
  };

  // Generate invoice ID (e.g., "NV-2025-004")
  const generateInvoiceId = (index, dateString) => {
    if (!dateString) return `NV-${new Date().getFullYear()}-${String(index + 1).padStart(3, "0")}`;
    const year = new Date(dateString).getFullYear();
    return `NV-${year}-${String(index + 1).padStart(3, "0")}`;
  };

  // Filter transactions based on search query
  const filteredTransactions = transactions.filter((transaction) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      generateInvoiceId(transactions.indexOf(transaction), transaction.transactionDate).toLowerCase().includes(query) ||
      transaction.subscriptionType?.toLowerCase().includes(query) ||
      formatBillingPeriod(transaction.transactionDate).toLowerCase().includes(query) ||
      transaction.amountPaid?.toString().includes(query)
    );
  });

  // Pagination calculations
  const totalPages = Math.ceil(filteredTransactions.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedTransactions = filteredTransactions.slice(startIndex, endIndex);

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push("...");
      for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
        pages.push(i);
      }
      if (currentPage < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  };

  if (userDetails?.loading)
    return (
      <p className="flex justify-center items-center h-full">
        <span className="loader" />
      </p>
    );

  return (
    <div className="w-full h-full overflow-y-auto">
      <div className="w-full max-w-full p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 relative">
          <div className="flex flex-col gap-1">
            <h1 className="text-[24px] sm:text-[28px] font-[600] text-[#1E1E1E]">
              Manage Plan
            </h1>
            <p className="text-[14px] sm:text-[16px] text-[#5A687C] font-[400]">
              Adjust your subscription or billing cycle at any time.
            </p>
          </div>

          {/* Close Button */}
          {/* {onClose && (
            <button
              onClick={onClose}
              className="absolute top-0 right-0 text-gray-500 cursor-pointer hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>
          )} */}

          {/* Billing Cycle Toggle */}
          <div className="flex gap-2 bg-[#F2F2F7] rounded-lg border border-[#E6E6E7]">
            <button
              className={`px-4 py-2 rounded-lg cursor-pointer text-sm font-medium transition-colors ${activeTab === "monthly"
                ? "bg-white text-[#1E1E1E] shadow-sm"
                : "bg-transparent text-[#5A687C]"
                }`}
              onClick={() => setActiveTab("monthly")}
            >
              Monthly
            </button>
            <button
              className={`px-4 py-2 cursor-pointer rounded-lg text-sm font-medium transition-colors ${activeTab === "yearly"
                ? "bg-white text-[#1E1E1E] shadow-sm"
                : "bg-transparent text-[#5A687C]"
                }`}
              onClick={() => setActiveTab("yearly")}
            >
              Annual (Save 20%)
            </button>
          </div>
        </div>

        {renderPlanExpire()}

        {/* Plan Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
          {plans[activeTab].map((plan, index) => {
            const isCurrentPlan = (userDetails?.subscriptionDurationType === activeTab) && index == planIndex;
            const isProPlan = plan.key === "team" && activeTab === "monthly";
            const isDisabled = handleDisablePlan(index, plan.key);

            return (
              <div
                key={index}
                className={`bg-white border rounded-xl p-6 relative transition-all duration-300 flex flex-col ${
                  isProPlan
                    ? "border-[#675FFF] border-4 shadow-lg"
                    : isCurrentPlan
                      ? "border-[#675FFF] border-2 shadow-md"
                      : "border-[#D6D6D6]"
                } ${
                  !isDisabled && !isCurrentPlan
                    ? "hover:border-[#675FFF] hover:shadow-xl hover:-translate-y-1 cursor-pointer"
                    : ""
                }`}
              >
                {/* Current Plan Badge */}
                {isCurrentPlan && (
                  <div className="absolute top-4 right-4 bg-[#675FFF] text-white text-xs font-[600] px-2 py-1 rounded-2xl">
                    Current Plan
                  </div>
                )}

                {/* Popular Tag for Pro Plan */}
                {isProPlan && !isCurrentPlan && (
                  <div className="absolute top-4 right-4 bg-[#E8E7FF] text-[#675FFF] text-xs font-[600] px-2 py-1 rounded-2xl">
                    Popular
                  </div>
                )}

                {/* Upper section with fixed height */}
                <div className="flex flex-col min-h-[200px]">
                  <div className="mb-4">
                    <h3 className="font-[600] text-[#1E1E1E] text-[20px] mb-1">{plan.name}</h3>
                    <p className="text-[#5A687C] text-[14px] font-[400]">{plan.description}</p>
                  </div>

                  <div className="mb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-3xl font-[600] text-[#1E1E1E] leading-none">
                        {plan.price}
                      </span>
                      {plan.originalPrice && activeTab === "yearly" && (
                        <span className="text-md text-[#868C98] text-center justify-center font-semibold line-through whitespace-nowrap">
                          {plan.originalPrice}
                        </span>
                      )}
                      {plan.period && (
                        <span className="text-[14px] text-[#5A687C] font-[400] whitespace-nowrap">
                          {plan.period}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {/* Spacer to push button to bottom */}
                  <div className="flex-grow"></div>
                  
                  <button
                    disabled={isDisabled}
                    onClick={() => plan.id && handlePayment(plan.id)}
                    className={`w-full py-2.5 px-4 font-[500] rounded-lg mb-4 text-[14px] transition-colors ${
                      isDisabled
                        ? "bg-[#F7F7F8] text-[#5A687C] cursor-not-allowed opacity-60"
                        : plan.key === "enterprise"
                          ? "bg-[#675FFF] text-white hover:bg-[#5E54FF] cursor-pointer"
                          : "bg-[#675FFF] text-white hover:bg-[#5E54FF] cursor-pointer"
                    }`}
                  >
                    {isCurrentPlan
                      ? "Current Plan"
                      : plan.key === "enterprise"
                        ? "Get a Quote"
                        : plan.key === "team" && activeTab === "monthly"
                          ? "Upgrade Pro"
                          : `${t("settings.tab_2_list.upgrade")}`}
                  </button>
                </div>


                <div className="relative flex items-center mt-2 mb-4">
                  <hr className="w-full border-t border-[#E4E6EF]" />
                  <span className="absolute left-1/2 -translate-x-1/2 px-3 bg-white text-[#5A687C] text-sm font-[400]">
                    INCLUDE
                  </span>
                </div>

                <div className="space-y-3">
                  {plan.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <div className="mt-0.5 flex-shrink-0">
                        {getFeatureIcon(feature)}
                      </div>
                      <p className="text-sm font-[400] text-[#5A687C] leading-relaxed">{feature}</p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Thinking about leaving section */}
        <div className="bg-white rounded-xl border border-[#E1E4EA] p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex-1">
            <h3 className="text-[16px] font-[600] text-[#1E1E1E] mb-2">Thinking about leaving?</h3>
            <p className="text-[14px] font-[400] text-[#5A687C]">
              You can cancel your subscription at any time. Your access will remain active until the end of the current billing period.
            </p>
          </div>
          <button
            onClick={() => setShowCancelPopup(true)}
            className="px-4 py-2 bg-[#F7F7F8] border border-[#E1E4EA] text-[#1E1E1E] text-[14px] font-[500] rounded-lg hover:bg-[#EFF0F2] transition-colors whitespace-nowrap"
          >
            Cancel My Plan
          </button>
        </div>

        {/* Cancel Subscription Popup */}
        {showCancelPopup && (
          <CancelSubscriptionPopup t={t} onClose={() => setShowCancelPopup(false)} />
        )}

        <div className="mt-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
            <h2 className="text-[20px] sm:text-[24px] font-[600] text-[#1E1E1E]">Billing History</h2>
            <div className="relative w-full sm:w-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#5A687C] w-4 h-4" />
              <input
                type="text"
                placeholder="Search Invoices"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full sm:w-[300px] pl-10 pr-4 py-2 bg-white border border-[#E1E4EA] rounded-lg text-[14px] focus:outline-none focus:border-[#675FFF]"
              />
            </div>
          </div>

          <div className="bg-white rounded-xl border border-[#D6D6D6] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full border-separate border-spacing-0">
                <thead className="bg-[#F7F7F8]">
                  <tr>
                    <th className="px-6 text-start py-3 text-[16px] font-[400] text-[#5A687C]">Invoice ID</th>
                    <th className="px-6 text-start py-3 text-[16px] font-[400] text-[#5A687C]">Plan</th>
                    <th className="px-6 text-start py-3 text-[16px] font-[400] text-[#5A687C]">Billing Period</th>
                    <th className="px-6 text-start py-3 text-[16px] font-[400] text-[#5A687C]">Amount</th>
                    <th className="px-6 text-start py-3 text-[16px] font-[400] text-[#5A687C]">Status</th>
                    <th className="px-12 text-start py-3 text-[16px] font-[400] text-[#5A687C]">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white [&>tr:first-child>td:first-child]:rounded-tl-xl [&>tr:first-child>td:last-child]:rounded-tr-xl [&>tr:last-child>td:first-child]:rounded-bl-xl [&>tr:last-child>td:last-child]:rounded-br-xl">
                  {loadingTransactions ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-8 text-center">
                        <span className="loader" />
                      </td>
                    </tr>
                  ) : paginatedTransactions.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-8 text-center text-[#5A687C]">
                        No invoices found
                      </td>
                    </tr>
                  ) : (
                    paginatedTransactions.map((transaction, index) => {
                      const originalIndex = transactions.indexOf(transaction);
                      const isLastRow = index === paginatedTransactions.length - 1;
                      return (
                        <tr key={index} className={`border-b border-[#D6D6D6] ${isLastRow ? 'last:border-b-0' : ''}`}>
                          <td className={`px-6 py-4 text-[14px] text-[#1E1E1E] font-[400] ${index === 0 ? 'border-t-0' : ''} ${isLastRow ? 'border-b-0' : ''}`}>
                            {generateInvoiceId(originalIndex, transaction.transactionDate)}
                          </td>
                          <td className={`px-6 py-4 text-[14px] text-[#1E1E1E] font-[400] capitalize ${index === 0 ? 'border-t-0' : ''} ${isLastRow ? 'border-b-0' : ''}`}>
                            {transaction.subscriptionType || "N/A"}
                          </td>
                          <td className={`px-6 py-4 text-[14px] text-[#1E1E1E] font-[400] ${index === 0 ? 'border-t-0' : ''} ${isLastRow ? 'border-b-0' : ''}`}>
                            {formatBillingPeriod(transaction.transactionDate)}
                          </td>
                          <td className={`px-6 py-4 text-[14px] text-[#1E1E1E] font-[400] ${index === 0 ? 'border-t-0' : ''} ${isLastRow ? 'border-b-0' : ''}`}>
                            €{transaction.amountPaid?.toFixed(2) || "0.00"}
                          </td>
                          <td className={`px-6 py-4 ${index === 0 ? 'border-t-0' : ''} ${isLastRow ? 'border-b-0' : ''}`}>
                            <span
                              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[14px] font-[500] ${transaction.status?.toLowerCase() === "paid"
                                  ? "text-[#34C759] bg-[#EBF9EE]"
                                  : "text-[#5A687C] bg-[#EFF0F2]"
                                }`}
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                              {transaction.status ? transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1) : "N/A"}
                            </span>
                          </td>
                          <td
                            className={`px-6 py-4 ${index === 0 ? "border-t-0" : ""} ${isLastRow ? "border-b-0" : ""
                              }`}
                          >
                            {transaction.receiptUrl ? (
                              <a
                                href={transaction.receiptUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className=" inline-flex items-center gap-2  bg-white  border border-[#E5E7EB] px-2 py-2  rounded-lg   text-[#1E1E1E]  text-[14px] font-[500] shadow-[0px_2px_6px_rgba(0,0,0,0.06)] hover:shadow-[0px_3px_8px_rgba(0,0,0,0.10)] transition "
                              >
                                <Download className="w-4 h-4" />
                                Download
                              </a>
                            ) : (
                              <span className="text-[#5A687C] flex items-center mr-12 justify-center text-[14px]">N/A</span>
                            )}
                          </td>

                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {filteredTransactions.length > 0 && (
              <div className="flex items-center justify-between bg-[#F7F7F8] px-4 py-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="border border-[#D6D6D6] text-[#000000] rounded-lg px-3 py-1 text-sm bg-white cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    ‹ Prev
                  </button>
                  {getPageNumbers().map((page, idx) => (
                    <button
                      key={idx}
                      onClick={() => typeof page === "number" && setCurrentPage(page)}
                      disabled={page === "..."}
                      className={`rounded-lg px-3 py-1 text-sm cursor-pointer ${page === currentPage
                          ? "bg-[#675FFF] text-white"
                          : page === "..."
                            ? "text-[#000000] cursor-default"
                            : "border border-[#D6D6D6] text-[#000000] bg-white hover:bg-gray-50"
                        }`}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="border border-[#D6D6D6] text-[#000000] rounded-lg px-3 py-1 text-sm bg-white cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next ›
                  </button>
                </div>

                <div className="flex items-center gap-2 text-sm text-[#5A687C]">
                  <button
                    onClick={() => setRowsPerPage(5)}
                    className={`border border-[#D6D6D6] rounded-lg px-2 py-1 text-[#000000] cursor-pointer ${rowsPerPage === 5 ? "bg-white" : "bg-transparent hover:bg-white"
                      }`}
                  >
                    5 rows
                  </button>
                  <button
                    onClick={() => setRowsPerPage(10)}
                    className={`border border-[#D6D6D6] rounded-lg px-2 py-1 text-[#000000] cursor-pointer ${rowsPerPage === 10 ? "bg-white" : "bg-transparent hover:bg-white"
                      }`}
                  >
                    10
                  </button>
                  <button
                    onClick={() => setRowsPerPage(20)}
                    className={`border border-[#D6D6D6] rounded-lg px-2 py-1 text-[#000000] cursor-pointer ${rowsPerPage === 20 ? "bg-white" : "bg-transparent hover:bg-white"
                      }`}
                  >
                    20
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagePlan;

