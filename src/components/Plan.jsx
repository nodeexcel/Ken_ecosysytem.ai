import { ChevronDown, X, Info, Search, Download } from "lucide-react";
import { useEffect, useState } from "react";
import { addCredits, updateSubscriptionPaymentStatus, getTransactionsHistory } from "../api/payment";
import { useSelector } from "react-redux";
import { loadStripe } from "@stripe/stripe-js";
import { useNavigate } from "react-router-dom";
import { AddIcon, BusinessPlanIcon, CheckedCircle, CreditsIcon, CustomPlanIcon, EditPlanIcon, EmptyCircle, MembersIcon, OfferIcon, PaymentsIcon, PaymentsViewIcon, ProPlanIcon, TeamPlanIcon } from "../icons/icons";
import { SelectDropdown } from "./Dropdown";
import { DateFormat } from "../utils/TimeFormat";

const CreditPopup = ({ t, onClose, onOpen, userDetails, navigate }) => {
  const staticCredits = [{ label: 500, value: "35€", priceId: import.meta.env.VITE_CREDITS_500_ID }, { label: 1000, value: "65€", priceId: import.meta.env.VITE_CREDITS_1000_ID }, { label: 2000, value: "110€", priceId: import.meta.env.VITE_CREDITS_2000_ID }]
  const [selectedCredit, setSelectedCredit] = useState(staticCredits[2]);
  const [loading, setLoading] = useState(false)

  const handleAddCredits = async () => {
    setLoading(true)
    try {
      const payload = {
        priceId: selectedCredit.priceId,
        credits: selectedCredit.label,
        userId: userDetails.id
      }
      const response = await addCredits(payload);
      const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
      const stripe = await stripePromise;
      console.log(response)
      if (response.status === 200 && stripe) {
        await stripe.redirectToCheckout({ sessionId: response?.data?.sessionId });
      }
    } catch (error) {
      console.log("Stripe error:", error);
    } finally {
      setLoading(false)
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl p-4 max-w-[515px] max-h-[514px] w-full h-full overflow-auto relative">
        <div className="flex flex-col gap-3 pt-6 pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-[#335BFB1A] rounded-lg">
                <img src="/src/assets/svg/coins.svg" alt="" />
              </div>
              <span className="text-[20px]  font-[600] "> {t("settings.tab_2_list.yours_credits")}</span>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 cursor-pointer absolute right-2 top-2 hover:text-gray-700"
            >
              <X />
            </button>
          </div>

          {/* <div className="bg-[#5E54FF] text-white p-4 rounded-lg mb-6 flex justify-between items-center ">
          <div className=" text-[16px]  font-[500] text-[#E1E4EA] ">
            Available Credit
          </div>
          <div className="text-[36px] font-700   font-semibold">100</div>
        </div> */}

          <div className="">
            <h3 className="text-[17px] font-[600]  my-4"> {t("settings.tab_2_list.add_credits")}</h3>
            {/* <div className="relative mb-4">
            <input
              type="range"
              min="100"
              max="30000"
              value={selectedCredit}
              onChange={(e) => setSelectedCredit(Number(e.target.value))}
              className="w-full h-3.5 bg-gray-200 rounded-lg appearance-none cursor-pointer custom-thumb"
              style={{
                background: `linear-gradient(to right, #675FFF ${((selectedCredit - 100) / (30000 - 100)) * 100
                  }%, #e5e7eb ${((selectedCredit - 100) / (30000 - 100)) * 100
                  }%)`,
              }}
            />
            <div className="flex justify-between mt-2">
              <span className="text-[17px] font-[600]  ">100</span>
              <span className="text-[17px] font-[600]  ">30000</span>
            </div>
          </div> */}
            {/* <div className="flex flex-wrap gap-2 mb-4">
            {creditOptions.map((credit, index) => (
              <button
                key={index}
                onClick={() => setSelectedCredit(credit)}
                className="flex-1 py-2 px-4 border border-gray-300 bg-[#F2F2F7] rounded-lg text-[17px] font-[600]  text-center hover:bg-gray-50"
              >
                {credit}
              </button>
            ))}
            <input
              type="number"
              value={selectedCredit}
              onChange={(e) => {
                if (e.target.value > 30000) {
                  setSelectedCredit(30000)
                } else if (e.target.value < 100) {
                  setSelectedCredit(100)
                } else {
                  setSelectedCredit(Number(e.target.value))
                }
              }}
              className="flex-1 py-2 px-4 border border-gray-300 rounded-lg text-center"
              min="100"
              max="30000"
            />
          </div> */}
            {staticCredits.map((each) => (
              <div key={each.value} className="my-3 cursor-pointer" onClick={() => setSelectedCredit(each)}>
                <div className={`flex justify-between items-center px-4 py-3 rounded-2xl ${selectedCredit.value === each.value ? 'bg-[#675FFF]' : 'bg-[#F2F2F7]'}`}>
                  <div className={`${selectedCredit.value === each.value ? 'text-[#fff]' : 'text-[#1E1E1E]'} flex items-center gap-2 text-[17px] font-[600]`}>
                    <h2>{each.label}  {t("settings.tab_2_list.credits")} = </h2>
                    <h2>{each.value}</h2>
                  </div>
                  {selectedCredit.value === each.value ? <CheckedCircle /> : <EmptyCircle />}
                </div>
              </div>
            ))}
            <button
              onClick={() => {
                onClose()
                if (navigate) {
                  navigate("/dashboard/manage-plan")
                } else {
                  onOpen()
                }
              }}
              className="flex-1 cursor-pointer py-2 my-4 px-4 border-[1.5px] font-[500] border-[#675FFF] rounded-lg text-[#675FFF]"
            >
              {t("settings.tab_2_list.upgrade_plan")}
            </button>
          </div>
          
          <div className="flex gap-4">
            <button
              onClick={onClose}
              className="flex-1 cursor-pointer py-2 px-4 border border-[#5A687C] rounded-lg text-[#5A687C]"
            >
              {t("cancel")}
            </button>
            <button disabled={loading} onClick={handleAddCredits} className="flex-1 cursor-pointer py-2 px-4 bg-[#675FFF] text-white rounded-lg">
              {loading ? <div className="flex items-center justify-center gap-2"><p> {t("processing")}</p><span className="loader" /></div> : `${t("settings.tab_2_list.add") + " " + selectedCredit.label + " " + t("settings.tab_2_list.credits")}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const PlanManagementPopup = ({ t, onClose, onOpen }) => {
  const [activeTab, setActiveTab] = useState("yearly");
  const [activePlan, setActivePlan] = useState("");
  const [planIndex, setPlanIndex] = useState();

  const userDetails = useSelector((state) => state.profile.user)
  const token = useSelector((state) => state.auth.token)

  const plans = {
    yearly: [
      {
        id: import.meta.env.VITE_YEARLY_PRO_PLAN,
        name: `${t("settings.tab_2_list.standard_plan")}`,
        key: "pro",
        svg: <ProPlanIcon />,
        price: "€931",
        period: `/ ${t("settings.tab_2_list.year")}`,
        description:
          `${t("settings.tab_2_list.pro_content")}`,
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
        name: `${t("settings.tab_2_list.pro")}`,
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
      // {
      //   id: import.meta.env.VITE_BUSINESS_PLAN,
      //   name: `${t("settings.tab_2_list.business")}`,
      //   key: "business",
      //   svg: <BusinessPlanIcon />,
      //   price: "€279",
      //   period: `/ ${t("settings.tab_2_list.month")}`,
      //   description: `${t("settings.tab_2_list.business_content")}`,
      //   features: [
      //     `300 000 ${t("settings.tab_2_list.credits_per_month")}`,
      //     `10 ${t("settings.tab_2_list.users")}`,
      //     `${t("settings.tab_2_list.full_integrations_access")}`,
      //     `${t("settings.tab_2_list.multi_account_mode")}`,
      //     `${t("settings.tab_2_list.activity_center")}`,
      //     `5GB ${t("settings.tab_2_list.of_knowledge")}`,
      //     `${t("settings.tab_2_list.dedicated_slack_channel")}`,
      //   ],
      // },
      {
        name: `${t("settings.tab_2_list.enterprise")}`,
        svg: <CustomPlanIcon />,
        key: "enterprise",
        price: `${t("settings.tab_2_list.custom")}`,
        description: `${t("settings.tab_2_list.enterprise_content")}`,
        features: [
          `${t("settings.tab_2_list.priority_support")}`,
          `${t("settings.tab_2_list.advanced_auth")}`,
          `${t("settings.tab_2_list.support_for_multi_region")}`,
          `${t("settings.tab_2_list.premium_support")}`
        ],
      },
    ],
    monthly: [
      {
        id: import.meta.env.VITE_MONTHLY_PRO_PLAN,
        name: `${t("settings.tab_2_list.pro")}`,
        svg: <ProPlanIcon />,
        price: "€97",
        key: "pro",
        period: `/ ${t("settings.tab_2_list.month")}`,
        description:
          `${t("settings.tab_2_list.pro_content")}`,
        features: [
          `1 000 ${t("settings.tab_2_list.credits_per_month")}`,
          `1 ${t("settings.tab_2_list.user")}`,
          `1GB ${t("settings.tab_2_list.of_knowledge")}`,
          `5 ${t("settings.tab_2_list.integrations")}`,
          `${t("settings.tab_2_list.schedule_tool_runs")}`,
          `${t("settings.tab_2_list.live_chat")}`,
        ],
        selected: true,
      },
      {
        id: import.meta.env.VITE_MONTHLY_TEAM_PLAN,
        name: `${t("settings.tab_2_list.team")}`,
        svg: <TeamPlanIcon />,
        key: "team",
        price: "€167",
        period: `/ ${t("settings.tab_2_list.month")}`,
        description: `${t("settings.tab_2_list.team_content")}`,
        features: [
          `2 500 ${t("settings.tab_2_list.credits_per_month")}`,
          `5 ${t("settings.tab_2_list.users")}`,
          `5GB ${t("settings.tab_2_list.of_knowledge")}`,
          `${t("settings.tab_2_list.full_integrations")} ${t("settings.tab_2_list.single_account_per_platform")}`,

          `${t("settings.tab_2_list.live_chat")}`,
        ],
      },
      // {
      //   name: `${t("settings.tab_2_list.business")}`,
      //   svg: <BusinessPlanIcon />,
      //   key: "business",
      //   price: "€309",
      //   period: `/ ${t("settings.tab_2_list.month")}`,
      //   description: `${t("settings.tab_2_list.business_content")}`,
      //   features: [
      //     `300 000 ${t("settings.tab_2_list.credits_per_month")}`,
      //     `10 ${t("settings.tab_2_list.users")}`,
      //     `${t("settings.tab_2_list.full_integrations_access")}`,
      //     `${t("settings.tab_2_list.multi_account_mode")}`,
      //     `${t("settings.tab_2_list.activity_center")}`,
      //     `5GB ${t("settings.tab_2_list.of_knowledge")}`,
      //     `${t("settings.tab_2_list.dedicated_slack_channel")}`,
      //   ],
      // },
      {
        name: `${t("settings.tab_2_list.enterprise")}`,
        svg: <CustomPlanIcon />,
        key: "enterprise",
        price: `${t("settings.tab_2_list.custom")}`,
        description: `${t("settings.tab_2_list.enterprise_content")}`,
        features: [
          `${t("settings.tab_2_list.priority_support")}`,
          `${t("settings.tab_2_list.advanced_auth")}`,
          `${t("settings.tab_2_list.support_for_multi_region")}`,
          `${t("settings.tab_2_list.premium_support")}`
        ],
      },
    ],
  };


  useEffect(() => {
    if (token && !userDetails.loading) {
      if (userDetails?.subscriptionType === "trail") {
        setActivePlan("")
        setPlanIndex(0)
        setActiveTab("yearly")
      }
      else {
        const filterData = plans?.[userDetails?.subscriptionDurationType]?.filter((each) => each.key === userDetails?.subscriptionType)
        const index = plans?.[userDetails?.subscriptionDurationType]?.findIndex((each) => each.key === userDetails?.subscriptionType)
        setPlanIndex(index)
        setActiveTab(userDetails?.subscriptionDurationType)
        setActivePlan(filterData?.[0]?.key)
      }
    }

  }, [token, !userDetails.loading])

  const handleDisablePlan = (index, key) => {
    if (new Date() > new Date(userDetails?.subscriptionEndDate)) {
      return false
    } else if (userDetails?.subscriptionType === "trial") {
      return true
    } else if (userDetails?.subscriptionDurationType === activeTab) {
      if ((index < planIndex) || (key === userDetails?.subscriptionType)) {
        return true
      } else {
        return false
      }
    } else {
      if (userDetails?.subscriptionDurationType === "monthly") {
        return false
      }
      return true
    }
  }


  const handleSelectPlan = (plan) => {
    setActivePlan(plan)
  }

  const handlePayment = async (id) => {
    try {
      const payload = {
        email: userDetails.email,
        priceId: id
      }
      const response = await updateSubscriptionPaymentStatus(payload)
      const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
      const stripe = await stripePromise;
      console.log(response)
      if (response.status === 200 && stripe) {
        await stripe.redirectToCheckout({ sessionId: response?.data?.sessionId });
      }

    } catch (error) {
      console.log(error)
    }
  }

  const renderPlanExpire = () => {
    if (userDetails?.subscriptionType == 'trial') {
      if (new Date() > new Date(userDetails?.subscriptionEndDate)) {
        return <p className="text-red-500 pb-3">{t("settings.tab_2_list.your_trail_plan_ended")} {DateFormat(userDetails?.subscriptionEndDate)}</p>
      } else {
        return <p className="text-green-500 pb-3">{t("settings.tab_2_list.your_trail_plan_ends")} {DateFormat(userDetails?.subscriptionEndDate)}</p>
      }
    } else if (new Date() > new Date(userDetails?.subscriptionEndDate)) {
      return <p className="text-red-500 pb-3">{t("settings.tab_2_list.your_current_plan_ended")} {DateFormat(userDetails?.subscriptionEndDate)}</p>
    }
  }

  if (userDetails?.loading) return <p className='flex justify-center items-center h-full'><span className='loader' /></p>


  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-3 sm:p-6 mx-2 w-full max-w-[95%] lg:max-w-[90%] h-[80vh] overflow-y-auto relative">
        <div className="flex flex-wrap items-start justify-between gap-3 mb-6">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-[#335BFB1A] rounded-lg">
              <img src="/src/assets/svg/MangePlan.svg" alt="" />
            </div>
            <span className="text-[16px] sm:text-[20px] font-[600] ">{t("settings.tab_2_list.manage_plan")}</span>
            <div className="flex gap-2 bg-[#F2F2F7] p-1 rounded-lg">
              <button
                className={`flex-1 px-3 py-2 rounded-lg cursor-pointer text-sm font-medium ${activeTab === "yearly"
                  ? "bg-white text-black"
                  : "bg-transparent text-[#5A687C]"
                  }`}
                onClick={() => setActiveTab("yearly")}
              >
                {t("settings.tab_2_list.annual")}
              </button>
              <button
                className={`flex-1 px-3 py-2 cursor-pointer rounded-lg text-sm font-medium ${activeTab === "monthly"
                  ? "bg-white text-black"
                  : "bg-transparent text-[#5A687C]"
                  }`}
                onClick={() => setActiveTab("monthly")}
              >
                {t("settings.tab_2_list.monthly")}
              </button>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={onClose}
              className="text-gray-500 cursor-pointer hover:text-gray-700 absolute top-1 right-1"
            >
              <X />
            </button>
          </div>
          <div className="w-full sm:w-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <button className="text-[#1E1E1E] cursor-pointer text-[14px] font-[400]">
              {t("settings.tab_2_list.manage_payment_method")}
            </button>
            <button onClick={() => {
              onClose()
              onOpen()
            }} className="text-[#FF3B30] cursor-pointer text-[14px] font-[400]">
              {t("settings.tab_2_list.cancel_subscription")}
            </button>
          </div>
        </div>
        {renderPlanExpire()}

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
          {plans[activeTab].map((plan, index) => (
            <div
              key={index}
              onClick={index >= planIndex ? () => handleSelectPlan(plan.key) : undefined}
              className={`border ${((userDetails?.subscriptionDurationType === activeTab) && (index == planIndex)) ? "border-[#675FFF]" : "border-[#E1E4EA]"} rounded-xl px-4 py-2`}
            >
              <div className="flex justify-between mb-4">
                <div className="flex flex-col gap-2">
                  <div>
                    {plan.svg}
                  </div>
                  <span className="font-[600] text-[#1E1E1E] text-[18px] ">{plan.name}</span>
                </div>
                {plan.discount && (
                  <div className="text-[#34C759] h-fit text-[18px] font-[600] bg-[#34C7591A] p-[10px] rounded-[11px] whitespace-nowrap">
                    {plan.discount}
                  </div>
                )}
              </div>
              <div className="flex items-baseline gap-1 mb-2 flex-wrap">
                <p className="text-[22px] text-[#1E1E1E] font-[600] ">{plan.price}</p>
                {plan.period && (
                  <span className="text-[#5A687C] font-[600] text-[16px]">
                    {plan.period}
                  </span>
                )}
              </div>
              <p className="text-[#5A687C] text-[14px] font-[400] mb-4">{plan.description}</p>
              <button
                disabled={handleDisablePlan(index, plan.key)}
                onClick={() => handlePayment(plan.id)}
                className={`w-full py-2 px-3 font-[500] rounded-lg mb-4 text-[13px] sm:text-sm ${handleDisablePlan(index, plan.key)
                  ? "bg-gray-100 cursor-not-allowed text-[#5A687C]"
                  : plan.key === "enterprise"
                    ? "border-[1.5px] border-[#5F58E8] text-[#675FFF]"
                    : "bg-[#675FFF] text-white cursor-pointer"
                  }`}
              >
                {handleDisablePlan(index, plan.key) && ((userDetails?.subscriptionDurationType === activeTab) && (index == planIndex))
                  ? `${t("settings.tab_2_list.selected")}`
                  : plan.key === "enterprise"
                    ? `${t("settings.tab_2_list.get_a_quote")}`
                    : `${t("settings.tab_2_list.upgrade")}`}
              </button>
              <p className="text-[#5A687C] font-[500] text-[14px] pb-4">{t("settings.tab_2_list.include")}</p>
              <div className="space-y-2.5">
                {plan.features.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <div><CheckedCircle status={true} /></div>
                    <p className="text-sm font-[500] text-[#5A687C]">{feature}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div >
  );
};

export const CancelSubscriptionPopup = ({ t, onClose }) => {
  const [initialTab, setInitailTab] = useState(true)
  const [selectedData, setSelectedData] = useState()
  const options = [{ label: `${t("settings.tab_2_list.too_expensive")}`, key: "too_expensive" }, { label: `${t("settings.tab_2_list.not_enough_value")}`, key: "not_enough_value" }, { label: `${t("settings.tab_2_list.other")}`, key: "other" }]
  const [otherIssue, setOtherIssue] = useState("")
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">

      {initialTab ? (
        <div className="bg-white rounded-2xl shadow-xl w-[420px] p-6 max-h-[90%] overflow-y-auto relative">
          <div className="border-b border-gray-200">
            <div className="flex items-center justify-between mb-4 border-b border-[#E2E4E9] pb-4">
              <h2 className="text-[16px] font-semibold text-[#1E1E1E]">
                {t("settings.tab_2_list.cancel_subscription")}
              </h2>

              <button
                onClick={onClose}
                className="text-[#6C7489] hover:text-[#1E1E1E] mr-2 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex flex-col items-center text-center gap-3 mb-6">
              <div className="relative inline-flex">
                {/* Outer soft-radius glow */}
                <div className="absolute inset-0 rounded-full bg-[#675FFF]/15 blur-3xl"></div>

                {/* Inner pill */}
                <div className="relative px-7 py-3 rounded-full bg-white text-[#675FFF] text-[22px] font-semibold
    shadow-[0_8px_35px_rgba(103,95,255,0.18)] border border-[#E8E5FF]">
                  30% OFF
                </div>
              </div>



              <h3 className="text-[18px] font-semibold text-[#1E1E1E]">
                {t("settings.tab_2_list.were_sorry")}
              </h3>

              <p className="text-[14px] text-[#5A687C] leading-relaxed">
                {t("settings.tab_2_list.before_cancel_offer")}<br></br>
                <span className="font-semibold text-black"> {t("settings.tab_2_list.lifetime_discount_text")} </span>
                {t("settings.tab_2_list.to_stay_with")}
              </p>
            </div>

            {/* Plan Card */}
            <div className="border border-[#E1E4EA] rounded-xl p-4 shadow-sm mb-4">

              <div className="flex items-center gap-2 mb-1 justify-between">
                <h2 className="text-[#1E1E1E] font-[600] text-[18px]">
                  {t("settings.tab_2_list.standard_plan")}
                </h2>
                <span className="bg-[#E8E7FF] text-[#675FFF] text-[11px] font-semibold px-2 py-1 rounded-full">
                  {t("settings.tab_2_list.discount_30_off")}
                </span>
              </div>

              {/* Price Row */}
              <div className="flex items-center gap-2">
                <span className="text-[#1E1E1E] font-[700] text-[26px] leading-none">
                  €48.50
                </span>

                <span className="text-[#8891A5] text-[15px] line-through relative">
                  €97
                </span>

                <span className="text-[#5A687C] text-[14px]">{t("settings.tab_2_list.per_month")}</span>
              </div>

              <p className="text-[#5A687C] text-[13px] mt-1">
                {t("settings.tab_2_list.saving_indefinitely")}
              </p>
            </div>
            <p className="text-[#8891A5] text-[12px] text-center">
              {t("settings.tab_2_list.offer_expires")}
            </p>
          </div>


          <div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setInitailTab(false)}
                className="flex-1 py-2.5 text-sm font-semibold border cursor-pointer border-[#E1E4EA] text-[#1E1E1E] rounded-lg hover:bg-gray-50"
              >
                {t("settings.tab_2_list.no_still_cancel")}
              </button>

              <button className="flex-1 py-2.5 text-sm font-semibold cursor-pointer bg-[#675FFF] text-white rounded-lg hover:bg-[#5E54FF]">
                {t("settings.tab_2_list.accept_discount_stay")}
              </button>
            </div>
          </div>


        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-xl w-[368px] p-6 max-h-[90%] relative">
  <div className="flex items-center justify-between mb-6 border-b border-[#E2E4E9]">
    <h2 className="text-[20px] font-[600] text-[#1E1E1E]">
      {t("settings.tab_2_list.cancel_subscription")}
    </h2>

    <button
      onClick={onClose}
      className="text-[#6C7489] hover:text-[#1E1E1E] cursor-pointer mr-2"
    >
      <X className="w-5 h-5" />
    </button>
  </div>

  {/* Information Icon and Heading */}
  <div className="flex flex-col items-center gap-4 mb-6">
    <div className="w-12 h-12 rounded-full bg-[#F7F7F8] flex items-center justify-center">
      <Info className="w-6 h-6 text-[#5A687C]" />
    </div>

    <h3 className="text-[20px] font-[600] text-[#1E1E1E]">
      {t("settings.tab_2_list.final_confirmation")}
    </h3>

    <p className="text-[14px] text-center text-[#5A687C] font-[400]">
      {t("settings.tab_2_list.cancel_feedback_message")}
    </p>
  </div>

  {/* Reason Form */}
  <div className="flex flex-col gap-4 mb-4">
    
    {/* Reason Dropdown */}
    <div className="flex flex-col gap-2">
      <label className="text-[14px] font-[500] text-[#5A687C]">
        {t("settings.tab_2_list.why_are_you_cancelling")}
      </label>

      <SelectDropdown
        name="cancel_plan"
        options={options}
        value={selectedData}
        onChange={(updated) => setSelectedData(updated)}
        placeholder={t("select")}
      />
    </div>

    {/* Reason Textarea (Always Visible as Requested) */}
    <div className="flex flex-col gap-2">
      <label className="text-[14px] font-[500] text-[#5A687C]">
        {t("settings.tab_2_list.reason")}
      </label>

      <textarea
        className="w-full rounded-lg resize-none border border-[#E1E4EA] p-3 text-[14px] text-[#1E1E1E] focus:border-[#675FFF] focus:outline-none"
        placeholder={t("settings.tab_2_list.enter_your_reasons")}
        rows={3}
        value={otherIssue}
        onChange={(e) => setOtherIssue(e.target.value)}
      />
    </div>
  </div>

  {/* Warning Text */}
  <p className="text-xs text-[#5A687C] font-[400] mb-6 items-center">
    {t("settings.tab_2_list.credits_revoked_warning")}
  </p>

  {/* Buttons */}
  <div className="flex gap-4">
  {/* Left Button */}
  <button
    onClick={onClose}
    className="flex-1 h-[38px] flex cursor-pointer items-center justify-center border border-[#E1E1E1] 
               bg-white text-[#1E1E1E] rounded-lg hover:bg-gray-50 
               text-[13px] font-medium whitespace-nowrap"
  >
    {t("settings.tab_2_list.i_changed_my_mind")}
  </button>

  {/* Right Button */}
  <button
    onClick={onClose}
    className="flex-1 h-[38px] flex cursor-pointer items-center justify-center 
               bg-[#675FFF] text-white rounded-lg hover:bg-[#5E54FF] 
               text-[13px] font-medium whitespace-nowrap"
  >
    {t("settings.tab_2_list.confirm_cancel")}
  </button>
</div>

</div>

      )}

    </div>

  )
}

// Helper function to format renewal date as "DD MMM YYYY"
const formatRenewalDate = (dateString) => {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    const day = date.getDate();
    const month = date.toLocaleString('en-US', { month: 'short' });
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  } catch (error) {
    return '';
  }
};

// Helper function to get plan display name
const getPlanDisplayName = (subscriptionType, t) => {
  const planMap = {
    'pro': t("settings.tab_2_list.standard_plan"),
    'team': t("settings.tab_2_list.pro"),
    'business': t("settings.tab_2_list.business"),
    'enterprise': t("settings.tab_2_list.enterprise"),
    'trial': t("settings.tab_2_list.trial")
  };
  return planMap[subscriptionType] || subscriptionType?.charAt(0).toUpperCase() + subscriptionType?.slice(1) || t("settings.tab_2_list.standard_plan");
};

const Plan = ({ t, teamMembersData, setActiveSidebarItem, showPlanPopup, setShowPlanPopup, handleAddSeatsTeam, setShowManagePlan, setSearchParams }) => {
  const navigate = useNavigate();
  const [showCreditPopup, setShowCreditPopup] = useState(false);
  const [cancelPopup, setCancelPopup] = useState(false);
  const userDetails = useSelector((state) => state.profile.user);
  const token = useSelector((state) => state.auth.token);
  const [transactions, setTransactions] = useState([]);
  const [loadingTransactions, setLoadingTransactions] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);

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

    // Case 1: total pages <= 5 → show all
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
      return pages;
    }

    // Case 2: current page is at the start (pages 1-3) → show 1, 2, 3, ..., totalPages
    if (currentPage <= 3) {
      pages.push(1, 2, 3, "...", totalPages);
      return pages;
    }

    // Case 3: current page is near the end (last 3 pages)
    if (currentPage >= totalPages - 2) {
      pages.push(1, "...", totalPages - 2, totalPages - 1, totalPages);
      return pages;
    }

    // Case 4: current page is in the middle
    pages.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages);

    return pages;
  };


  return (
    <div className="w-full h-full">
      {/* Header */}
      <div className="flex flex-col gap-2 mb-6">
        <h1 className="text-md md:text-2xl font-[600] text-[#1E1E1E]">
          {t("settings.tab_2_list.plan_billing")}
        </h1>
        <p className="text-[14px] sm:text-[16px] text-[#5A687C] font-[400]">
          {t("settings.tab_2_list.plan_billing_description")}
        </p>
      </div>

      {showPlanPopup && (
        <PlanManagementPopup t={t} onClose={() => setShowPlanPopup(false)} onOpen={() => setCancelPopup(true)} />
      )}
      {showCreditPopup && (
        <CreditPopup t={t} onClose={() => setShowCreditPopup(false)} onOpen={() => setShowPlanPopup(true)} userDetails={userDetails} navigate={navigate} />
      )}
      {cancelPopup && (
        <CancelSubscriptionPopup t={t} onClose={() => setCancelPopup(false)} />
      )}

      {/* Cards Container - 3 Cards Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6 mb-6 sm:mb-8 [&>div]:min-w-0">
        {/* Current Plan Card */}
        <div className="bg-white p-4 sm:p-5 lg:p-6 rounded-xl border border-[#E1E4EA] min-w-0 overflow-hidden flex flex-col">
          <div className="min-w-0 flex-1">
            <h3 className="text-xs sm:text-sm font-[500] text-[#5A687C] mb-2 sm:mb-3">{t("settings.tab_2_list.current_plan")}</h3>
            <h2 className="text-lg sm:text-xl md:text-2xl lg:text-2xl font-[600] text-[#1E1E1E] mb-2 break-words">
              {getPlanDisplayName(userDetails?.subscriptionType, t)}
            </h2>
            {userDetails?.subscriptionEndDate && (
              <p className="text-xs sm:text-sm font-[400] text-[#5A687C] break-words">
                {t("settings.tab_2_list.auto_renew_on")} <span className="text-black font-semibold">{formatRenewalDate(userDetails.subscriptionEndDate)}</span> 
              </p>
            )}
          </div>
          <button
            onClick={() => {
              if (setShowManagePlan && setSearchParams) {
                setShowManagePlan(true);
                setSearchParams({ view: 'manage-plan' });
              } else {
                navigate("/dashboard/manage-plan");
              }
            }}
            className="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-white border border-[#E1E4EA] rounded-lg text-[#1E1E1E] cursor-pointer text-sm sm:text-base font-semibold shadow-sm hover:bg-[#F9F8FF] transition-colors overflow-hidden text-ellipsis mt-4 sm:mt-5"
          >
            {t("settings.tab_2_list.manage_plan")}
          </button>
        </div>

        {/* Payment Method Card */}
        <div className="bg-white p-4 sm:p-5 lg:p-6 rounded-xl border border-[#E1E4EA] min-w-0 overflow-hidden flex flex-col">
          <div className="min-w-0 flex-1">
            <h3 className="text-xs sm:text-sm font-[500] text-[#5A687C] mb-2 sm:mb-3">{t("settings.tab_2_list.payment_method")}</h3>
            <h2 className="text-lg sm:text-xl md:text-2xl lg:text-2xl font-[600] text-[#1E1E1E] mb-2 break-words">
              Visa
            </h2>
            <p className="text-xs sm:text-sm font-[400] text-[#5A687C] break-words">
              **** 2131 • 12/25
            </p>
          </div>
          <button
            className="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-white border border-[#E1E4EA] rounded-lg text-[#1E1E1E] cursor-pointer text-sm sm:text-base font-semibold shadow-sm hover:bg-[#F9F8FF] transition-colors overflow-hidden text-ellipsis mt-4 sm:mt-5"
          >
            {t("settings.tab_2_list.change_method")}
          </button>
        </div>

        {/* Member Seats Card */}
        <div className="bg-white p-4 sm:p-5 lg:p-6 rounded-xl border border-[#E1E4EA] font-semibold shadow-sm min-w-0 overflow-hidden flex flex-col">
          <div className="min-w-0 flex-1">
            <h3 className="text-xs sm:text-sm font-[500] text-[#5A687C] mb-2 sm:mb-3">{t("settings.tab_2_list.members_seats")}</h3>
            <h2 className="text-lg sm:text-xl md:text-2xl lg:text-2xl font-[600] text-[#1E1E1E] mb-1 break-words">
              {teamMembersData?.teamMembers || 0} / {teamMembersData?.teamSize || 0}
            </h2>
            <p className="text-xs sm:text-sm font-[400] text-[#5A687C] break-words">{t("settings.tab_2_list.total_users")}</p>
          </div>
          <button
            onClick={handleAddSeatsTeam}
            className="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-white border border-[#E1E4EA] font-semibold shadow-sm cursor-pointer rounded-lg text-[#1E1E1E] text-sm sm:text-base hover:bg-[#F9F8FF] transition-colors overflow-hidden text-ellipsis mt-4 sm:mt-5"
          >
            {t("settings.tab_2_list.add_new_seats")}
          </button>
        </div>

        {/* Credit Usage Card */}
        {/* <div className="bg-white p-4 sm:p-6 rounded-2xl border border-[#E1E4EA] font-semibold shadow-sm">
          <div className="mb-4">
            <h3 className="text-[14px] font-[500] text-[#5A687C] mb-4">Credit Usage</h3>
            <div className="flex items-baseline justify-between mb-3">
              <h2 className="text-[20px] sm:text-[24px] font-[600] text-[#1E1E1E]">
                {usedCredits.toLocaleString()}
              </h2>
              <p className="text-[14px] font-[400] text-[#5A687C]">
                Limit {creditLimit.toLocaleString()}
              </p>
            </div>
            <div className="w-full h-2 bg-[#E1E4EA] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#675FFF] transition-all duration-300"
                style={{ width: `${creditUsage}%` }}
              />
            </div>
          </div>
          <button
            onClick={() => setShowCreditPopup(true)}
            className="w-full px-4 py-2 bg-white border font-semibold shadow-sm border-[#E1E4EA] cursor-pointer rounded-lg text-[#1E1E1E] text-md hover:bg-[#F9F8FF] transition-colors"
          >
            + Add Credits
          </button>
        </div> */}
      </div>

      <hr className="border-b border-gray-200 w-full"></hr>

      {/* Billing History Section */}
      <div className="mt-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
          <h2 className="text-[20px] sm:text-[24px] font-[600] text-[#1E1E1E]">{t("settings.tab_2_list.billing_history")}</h2>
          <div className="relative w-full sm:w-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#5A687C] w-4 h-4" />
            <input
              type="text"
              placeholder={t("settings.tab_2_list.search_invoices")}
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
                  <th className="px-6 text-start py-3 text-[16px] font-[400] text-[#5A687C]">{t("settings.tab_2_list.invoice_id")}</th>
                  <th className="px-6 text-start py-3 text-[16px] font-[400] text-[#5A687C]">{t("settings.tab_2_list.plan")}</th>
                  <th className="px-6 text-start py-3 text-[16px] font-[400] text-[#5A687C]">{t("settings.tab_2_list.billing_period")}</th>
                  <th className="px-6 text-start py-3 text-[16px] font-[400] text-[#5A687C]">{t("settings.tab_2_list.amount")}</th>
                  <th className="px-6 text-start py-3 text-[16px] font-[400] text-[#5A687C]">{t("settings.tab_2_list.status")}</th>
                  <th className="px-12 text-start py-3 text-[16px] font-[400] text-[#5A687C]">{t("settings.tab_2_list.action")}</th>
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
                      {t("settings.tab_2_list.no_invoices_found")}
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
                          {transaction.subscriptionType || t("settings.tab_2_list.not_available")}
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
                            {transaction.status ? transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1) : t("settings.tab_2_list.not_available")}
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
                              {t("settings.tab_2_list.download")}
                            </a>
                          ) : (
                            <span className="text-[#5A687C] flex items-center mr-12 justify-center text-[14px]">{t("settings.tab_2_list.not_available")}</span>
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
          {/* Pagination */}
{filteredTransactions.length > 0 && (
  <div className="flex flex-col sm:flex-row items-center justify-between bg-[#F7F7F8] px-6 py-3 gap-4">
    {/* Page Navigation Buttons */}
    <div className="flex items-center gap-2">
      <button
        onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
        disabled={currentPage === 1}
        className="border border-[#D6D6D6] text-[#000000] rounded-lg px-3 py-1 text-sm bg-white cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
      >
        ‹ {t("settings.tab_2_list.prev")}
      </button>
      
      {getPageNumbers().map((page, idx) => (
        <button
          key={idx}
          onClick={() => typeof page === "number" && setCurrentPage(page)}
          disabled={page === "..."}
          className={`rounded-lg px-3 py-1 text-sm min-w-[36px] ${
            page === currentPage
              ? "bg-[#675FFF] text-white"
              : page === "..."
                ? "text-[#000000] cursor-default"
                : "border border-[#D6D6D6] text-[#000000] bg-white hover:bg-gray-50 cursor-pointer"
          }`}
        >
          {page}
        </button>
      ))}
      
      <button
        onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
        disabled={currentPage === totalPages}
        className="border border-[#D6D6D6] text-[#000000] rounded-lg px-3 py-1 text-sm bg-white cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
      >
        {t("settings.tab_2_list.next")} ›
      </button>
    </div>

    {/* Rows per page selector */}
    <div className="flex items-center gap-2 text-sm text-[#5A687C]">
      <span>{t("settings.tab_2_list.rows_per_page")}</span>
      <div className="flex gap-1">
        <button
          onClick={() => setRowsPerPage(5)}
          className={`border rounded-lg px-3 py-1 text-sm cursor-pointer ${
            rowsPerPage === 5 
              ? "bg-white border-[#D6D6D6] text-[#000000]" 
              : "bg-transparent border-[#D6D6D6] text-[#5A687C] hover:bg-white"
          }`}
        >
          {t("settings.tab_2_list.rows_5")}
        </button>
        <button
          onClick={() => setRowsPerPage(10)}
          className={`border rounded-lg px-3 py-1 text-sm cursor-pointer ${
            rowsPerPage === 10 
              ? "bg-white border-[#D6D6D6] text-[#000000]" 
              : "bg-transparent border-[#D6D6D6] text-[#5A687C] hover:bg-white"
          }`}
        >
          10
        </button>
        <button
          onClick={() => setRowsPerPage(20)}
          className={`border rounded-lg px-3 py-1 text-sm cursor-pointer ${
            rowsPerPage === 20 
              ? "bg-white border-[#D6D6D6] text-[#000000]" 
              : "bg-transparent border-[#D6D6D6] text-[#5A687C] hover:bg-white"
          }`}
        >
          20
        </button>
      </div>
    </div>
  </div>
)}
        </div>
      </div>
    </div>
  );
};
export default Plan;
