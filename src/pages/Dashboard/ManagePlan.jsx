import { ChevronDown, X } from "lucide-react";
import { useEffect, useState } from "react";
import { updateSubscriptionPaymentStatus } from "../../api/payment";
import { useSelector } from "react-redux";
import { loadStripe } from "@stripe/stripe-js";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { BusinessPlanIcon, CheckedCircle, CustomPlanIcon, ProPlanIcon, TeamPlanIcon } from "../../icons/icons";
import { DateFormat } from "../../utils/TimeFormat";

const ManagePlan = ({ onClose }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("yearly");
  const [activePlan, setActivePlan] = useState("");
  const [planIndex, setPlanIndex] = useState();

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
        price: "€1603",
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

  const handleDisablePlan = (index, key) => {
    if (new Date() > new Date(userDetails?.subscriptionEndDate)) {
      return false;
    } else if (userDetails?.subscriptionType === "trial") {
      return true;
    } else if (userDetails?.subscriptionDurationType === activeTab) {
      if (index < planIndex || key === userDetails?.subscriptionType) {
        return true;
      } else {
        return false;
      }
    } else {
      if (userDetails?.subscriptionDurationType === "monthly") {
        return false;
      }
      return true;
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

  if (userDetails?.loading)
    return (
      <p className="flex justify-center items-center h-full">
        <span className="loader" />
      </p>
    );

  return (
    <div className="w-full h-full overflow-y-auto bg-[#F7F7F8]">
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
          {onClose && (
            <button
              onClick={onClose}
              className="absolute top-0 right-0 text-gray-500 cursor-pointer hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>
          )}

          {/* Billing Cycle Toggle */}
          <div className="flex gap-2 bg-[#F2F2F7] p-1 rounded-lg">
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

            return (
              <div
                key={index}
                className={`bg-white border ${isProPlan
                  ? "border-[#675FFF] relative"
                  : isCurrentPlan
                    ? "border-[#E1E4EA]"
                    : "border-[#E1E4EA]"
                  } rounded-xl p-6 relative`}
              >
                {/* Popular Tag for Pro Plan */}
                {isProPlan && (
                  <div className="absolute top-4 right-4 bg-[#E8E7FF] text-[#675FFF] text-xs font-[600] px-2 py-1 rounded-2xl">
                    Popular
                  </div>
                )}

                <div className="mb-4">
                  <h3 className="font-[600] text-[#1E1E1E] text-[20px] mb-1">{plan.name}</h3>
                  <p className="text-[#5A687C] text-[14px] font-[400]">{plan.description}</p>
                </div>

                <div className="flex items-baseline gap-1 mb-4">
                  <p className="text-[24px] text-[#1E1E1E] font-[600]">{plan.price}</p>
                  {plan.period && (
                    <span className="text-[#5A687C] font-[400] text-[14px]">{plan.period}</span>
                  )}
                </div>

                <button
                  disabled={handleDisablePlan(index, plan.key)}
                  onClick={() => plan.id && handlePayment(plan.id)}
                  className={`w-full py-2.5 px-4 font-[500] rounded-lg mb-4 text-[14px] transition-colors
    ${isCurrentPlan
                      ? "bg-[#F7F7F8] text-[#5A687C] cursor-not-allowed"
                      : plan.key === "enterprise"
                        ? "bg-[#675FFF] text-white hover:bg-[#5E54FF] cursor-pointer"
                        : "bg-[#675FFF] text-white hover:bg-[#5E54FF] cursor-pointer"
                    }
  `}
                >
                  {isCurrentPlan
                    ? "Current Plan"
                    : plan.key === "enterprise"
                      ? "Get a Quote"
                      : plan.key === "team" && activeTab === "monthly"
                        ? "Upgrade Pro"
                        : `${t("settings.tab_2_list.upgrade")}`}
                </button>


                <div className="relative flex items-center my-2">
                  <hr className="w-full border-t border-[#E4E6EF]" />
                  <span className="absolute left-1/2 -translate-x-1/2 px-3 bg-white text-[#5A687C] text-[14px] font-[400]">
                    INCLUDE
                  </span>
                </div>

                <div className="space-y-3">
                  {plan.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <div className="mt-0.5">
                        <CheckedCircle status={true} />
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
            onClick={() => {
              // Handle cancel subscription
            }}
            className="px-4 py-2 bg-[#F7F7F8] border border-[#E1E4EA] text-[#1E1E1E] text-[14px] font-[500] rounded-lg hover:bg-[#EFF0F2] transition-colors whitespace-nowrap"
          >
            Cancel My Plan
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManagePlan;

