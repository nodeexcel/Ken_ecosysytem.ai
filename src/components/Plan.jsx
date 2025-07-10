import { ChevronDown, X } from "lucide-react";
import { useEffect, useState } from "react";
import { addCredits, updateSubscriptionPaymentStatus } from "../api/payment";
import { useSelector } from "react-redux";
import { loadStripe } from "@stripe/stripe-js";
import { AddIcon, CheckedCircle, CreditsIcon, EditPlanIcon, EmptyCircle, MembersIcon, OfferIcon, PaymentsIcon, PaymentsViewIcon, RefreshIcon } from "../icons/icons";
import { SelectDropdown } from "./Dropdown";

const CreditPopup = ({ t, onClose, onOpen, userDetails }) => {
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
      <div className="bg-white rounded-xl p-4 sm:p-6 w-[75%] h-[60vh] lg:h-[511px] lg:w-[516px] overflow-y-auto relative">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-[#335BFB1A] rounded-lg">
              <img src="/src/assets/svg/coins.svg" alt="" />
            </div>
            <span className="text-[20px]  font-[600] "> {t("settings.tab_2_list.yours_credits")}</span>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 absolute right-2 top-2 hover:text-gray-700"
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

        <div className="mb-6">
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
            <div key={each.value} className="my-3" onClick={() => setSelectedCredit(each)}>
              <div className={`flex justify-between items-center px-4 py-3 rounded-lg ${selectedCredit.value === each.value ? 'bg-[#675FFF]' : 'bg-[#F2F2F7]'}`}>
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
              onOpen()
            }}
            className="flex-1 py-2 my-4 px-4 border-[1.5px] font-[500] border-[#675FFF] rounded-lg text-[#675FFF]"
          >
            {t("settings.tab_2_list.upgrade_plan")}
          </button>
        </div>

        <div className="flex gap-4">
          <button
            onClick={onClose}
            className="flex-1 py-2 px-4 border border-[#5A687C] rounded-lg text-[#5A687C]"
          >
            {t("cancel")}
          </button>
          <button disabled={loading} onClick={handleAddCredits} className="flex-1 py-2 px-4 bg-[#675FFF] text-white rounded-lg">
            {loading ? <div className="flex items-center justify-center gap-2"><p> {t("processing")}</p><span className="loader" /></div> : `${t("settings.tab_2_list.add") + " " + selectedCredit.label + " " + t("settings.tab_2_list.credits")}`}
          </button>
        </div>
      </div>
    </div>
  );
};

const PlanManagementPopup = ({ t, onClose, onOpen }) => {
  const [activeTab, setActiveTab] = useState("annual");
  const [activePlan, setActivePlan] = useState("");
  const [planIndex, setPlanIndex] = useState();

  const userDetails = useSelector((state) => state.profile.user)
  const token = useSelector((state) => state.auth.token)

  const plans = {
    annual: [
      {
        id: import.meta.env.VITE_PRO_PLAN,
        name: `${t("settings.tab_2_list.pro")}`,
        key: "pro",
        svg: '/src/assets/svg/table.svg',
        price: "€97",
        period: `/ ${t("settings.tab_2_list.month")}`,
        description:
          `${t("settings.tab_2_list.pro_content")}`,
        features: [
          `10000 ${t("settings.tab_2_list.credits_per_month")}`,
          `1 ${t("settings.tab_2_list.user")}`,
          `100MB ${t("settings.tab_2_list.of_knowledge")}`,
          `5 ${t("settings.tab_2_list.integrations")}`,
          `${t("settings.tab_2_list.schedule_tool_runs")}`,
          `${t("settings.tab_2_list.live_chat")}`,
        ],
        selected: true,
        discount: `10% ${t("settings.tab_2_list.off")}`,
      },
      {
        id: import.meta.env.VITE_TEAM_PLAN,
        name: `${t("settings.tab_2_list.team")}`,
        key: "team",
        svg: '/src/assets/svg/house.svg',
        price: "€179",
        period: `/ ${t("settings.tab_2_list.month")}`,
        description: `${t("settings.tab_2_list.team_content")}`,
        features: [
          `100 000 ${t("settings.tab_2_list.credits_per_month")}`,
          `5 ${t("settings.tab_2_list.users")}`,
          `1GB ${t("settings.tab_2_list.of_knowledge")}`,
          `${t("settings.tab_2_list.full_integrations")}`,
          `${t("settings.tab_2_list.single_account_per_platform")}`,
          `${t("settings.tab_2_list.live_chat")}`,
        ],
        discount: `10% ${t("settings.tab_2_list.off")}`,
      },
      {
        id: import.meta.env.VITE_BUSINESS_PLAN,
        name: `${t("settings.tab_2_list.business")}`,
        key: "business",
        svg: '/src/assets/svg/building.svg',
        price: "€279",
        period: `/ ${t("settings.tab_2_list.month")}`,
        description: `${t("settings.tab_2_list.business_content")}`,
        features: [
          `300 000 ${t("settings.tab_2_list.credits_per_month")}`,
          `10 ${t("settings.tab_2_list.users")}`,
          `${t("settings.tab_2_list.full_integrations_access")}`,
          `${t("settings.tab_2_list.multi_account_mode")}`,
          `${t("settings.tab_2_list.activity_center")}`,
          `5GB ${t("settings.tab_2_list.of_knowledge")}`,
          `${t("settings.tab_2_list.dedicated_slack_channel")}`,
        ],
      },
      {
        name: `${t("settings.tab_2_list.enterprise")}`,
        svg: '/src/assets/svg/buildings.svg',
        key: "enterprise",
        price: `${t("settings.tab_2_list.custom")}`,
        description: "Best performance, support and security.",
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
        name: `${t("settings.tab_2_list.pro")}`,
        svg: '/src/assets/svg/table.svg',
        price: "€107",
        key: "pro",
        period: `/ ${t("settings.tab_2_list.month")}`,
        description:
          `${t("settings.tab_2_list.pro_content")}`,
        features: [
          `10000 ${t("settings.tab_2_list.credits_per_month")}`,
          `1 ${t("settings.tab_2_list.user")}`,
          `100MB ${t("settings.tab_2_list.of_knowledge")}`,
          `5 ${t("settings.tab_2_list.integrations")}`,
          `${t("settings.tab_2_list.schedule_tool_runs")}`,
          `${t("settings.tab_2_list.live_chat")}`,
        ],
        selected: true,
      },
      {
        name: `${t("settings.tab_2_list.team")}`,
        svg: '/src/assets/svg/house.svg',
        key: "team",
        price: "€199",
        period: `/ ${t("settings.tab_2_list.month")}`,
        description: `${t("settings.tab_2_list.team_content")}`,
        features: [
          `100 000 ${t("settings.tab_2_list.credits_per_month")}`,
          `5 ${t("settings.tab_2_list.users")}`,
          `1GB ${t("settings.tab_2_list.of_knowledge")}`,
          `${t("settings.tab_2_list.full_integrations")}`,
          `${t("settings.tab_2_list.single_account_per_platform")}`,
          `${t("settings.tab_2_list.live_chat")}`,
        ],
      },
      {
        name: `${t("settings.tab_2_list.business")}`,
        svg: '/src/assets/svg/building.svg',
        key: "business",
        price: "€309",
        period: `/ ${t("settings.tab_2_list.month")}`,
        description: `${t("settings.tab_2_list.business_content")}`,
        features: [
          `300 000 ${t("settings.tab_2_list.credits_per_month")}`,
          `10 ${t("settings.tab_2_list.users")}`,
          `${t("settings.tab_2_list.full_integrations_access")}`,
          `${t("settings.tab_2_list.multi_account_mode")}`,
          `${t("settings.tab_2_list.activity_center")}`,
          `5GB ${t("settings.tab_2_list.of_knowledge")}`,
          `${t("settings.tab_2_list.dedicated_slack_channel")}`,
        ],
      },
      {
        name: `${t("settings.tab_2_list.enterprise")}`,
        svg: '/src/assets/svg/buildings.svg',
        key: "enterprise",
        price: `${t("settings.tab_2_list.custom")}`,
        description: "Best performance, support and security.",
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
      const filterData = plans.annual.filter((each) => each.key === userDetails?.subscriptionType)
      const index = plans.annual.findIndex((each) => each.key === userDetails?.subscriptionType)
      setPlanIndex(index)
      setActivePlan(filterData?.[0].name)
    }

  }, [token, !userDetails.loading])

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
                className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium ${activeTab === "annual"
                  ? "bg-white text-black"
                  : "bg-transparent text-[#5A687C]"
                  }`}
                onClick={() => setActiveTab("annual")}
              >
                {t("settings.tab_2_list.annual")}
              </button>
              <button
                className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium ${activeTab === "monthly"
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
              className="text-gray-500 hover:text-gray-700 absolute top-1 right-1"
            >
              <X />
            </button>
          </div>
          <div className="w-full sm:w-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <button className="text-[#1E1E1E] text-[14px] font-[400]">
              {t("settings.tab_2_list.manage_payment_method")}
            </button>
            <button onClick={() => {
              onClose()
              onOpen()
            }} className="text-[#FF3B30] text-[14px] font-[400]">
              {t("settings.tab_2_list.cancel_subscription")}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {plans[activeTab].map((plan, index) => (
            <div
              key={index}
              onClick={index >= planIndex ? () => handleSelectPlan(plan.name) : undefined}
              className={`border ${activePlan === plan.name && index >= planIndex ? "border-[#675FFF]" : "border-[#E1E4EA]"} rounded-xl p-4`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex flex-col gap-2">
                  <div className="p-2 rounded-lg">
                    <img src={plan.svg} alt="" className="w-8 h-8 object-contain" />
                  </div>
                  <span className="font-[600] text-[15px] sm:text-[16px] ">{plan.name}</span>
                </div>
                {plan.discount && (
                  <span className="text-[#34C759] text-[13px] sm:text-[14px]  bg-[#34C7591A] px-2 py-1 rounded whitespace-nowrap">
                    {plan.discount}
                  </span>
                )}
              </div>
              <div className="flex items-baseline gap-1 mb-2 flex-wrap">
                <span className="text-[18px] sm:text-[22px] font-[600] ">{plan.price}</span>
                {plan.period && (
                  <span className="text-[#5A687C] font-[600] text-[13px] sm:text-[14px]">
                    {plan.period}
                  </span>
                )}
              </div>
              <p className="text-gray-600 text-[13px] sm:text-sm mb-4 line-clamp-2">{plan.description}</p>
              <button
                disabled={index < planIndex || plan.key === userDetails?.subscriptionType}
                onClick={() => handlePayment(plan.id)}
                className={`w-full py-2 px-3 rounded-lg mb-4 text-[13px] sm:text-sm ${(plan.key === userDetails?.subscriptionType || index < planIndex)
                  ? "bg-gray-100 text-gray-700"
                  : plan.key === "enterprise"
                    ? "border border-[#5E54FF] text-[#5E54FF]"
                    : "bg-[#5E54FF] text-white"
                  }`}
              >
                {plan.key === userDetails?.subscriptionType
                  ? `${t("settings.tab_2_list.selected")}`
                  : plan.key === "enterprise"
                    ? `${t("settings.tab_2_list.get_a_quote")}`
                    : `${t("settings.tab_2_list.upgrade")}`}
              </button>
              <div className="space-y-2.5">
                {plan.features.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <img src="/src/assets/svg/check.svg" alt="" className="w-4 h-4 mt-0.5" />
                    <span className="text-[13px] sm:text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const CancelSubscriptionPopup = ({ t, onClose }) => {
  const [initialTab, setInitailTab] = useState(true)
  const [selectedData, setSelectedData] = useState()
  const options = [{ label: `${t("settings.tab_2_list.too_expensive")}`, key: "too_expensive" }, { label: `${t("settings.tab_2_list.not_enough_value")}`, key: "not_enough_value" }, { label: `${t("settings.tab_2_list.other")}`, key: "other" }]
  const [otherIssue, setOtherIssue] = useState("")
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      {initialTab ? <div className="bg-white rounded-xl p-4 sm:p-8 max-w-[590px] max-h-[90%] overflow-auto relative">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <span className="text-[20px] text-[#1E1E1E] font-[600] ">{t("settings.tab_2_list.cancel_subscription")}</span>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 absolute right-2 top-2 hover:text-gray-700"
          >
            <X />
          </button>
        </div>

        <div className="mb-6 flex flex-col items-center gap-3">
          <div className="relative w-[170px] h-[87px]">
            <OfferIcon />
            <div className="absolute top-0 right-15 h-[83px] border-l border-dashed border-[#857FFF] ">
            </div>
            <div className="absolute top-0 left-0 w-full h-full flex items-center justify-between px-4 text-white font-sans">
              <p className="text-[#FBF665] text-[44.44px] font-[700]">50%</p>
              <p className="text-white  font-[700] text-[40.26px] rotate-180 [writing-mode:vertical-rl]">off</p>
            </div>
          </div>
          <h3 className="text-[17px] font-[600] ">{t("settings.tab_2_list.were_sorry")} </h3>
          <h2 className="text-[14px] text-center text-[#5A687C] font-[400]">{t("settings.tab_2_list.final_chance")}  <span className="text-[#675FFF]">{t("settings.tab_2_list.life_time")}  50% {t("settings.tab_2_list.discount")} </span>{t("settings.tab_2_list.one_time_deal")} </h2>
        </div>

        <div className="flex flex-col gap-3">
          <h2 className="text-[18px] text-[#1E1E1E] font-[600] ">{t("settings.tab_2_list.price_impact")} </h2>
          <div className="border border-[#E1E4EA] rounded-lg p-2 flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <div>
                <img src='/src/assets/svg/house.svg' alt="" className="w-8 h-8 object-contain" />
              </div>
              <p className="rounded-lg text-[#34C759] bg-[#EBF9EE] p-2">50% {t("settings.tab_2_list.off")} </p>
            </div>
            <div className="flex flex-col gap-2">
              <h2 className="text-[#675FFF] font-[600] text-[18px]">{t("settings.tab_2_list.starter")} </h2>
              <p className="text-[#1E1E1E] font-[600] text-[16px]">€97 → €48.50/{t("settings.tab_2_list.month")} </p>
              <p className="text-[#5A687C] font-[400] text-[14px]">{t("settings.tab_2_list.saving")}  €48.50/{t("settings.tab_2_list.month")}  indefinitely</p>
            </div>

          </div>
        </div>

        <div className="flex gap-4 mt-5">
          <button className="flex-1 py-2 px-4 bg-[#675FFF] text-white rounded-lg">
            {t("settings.tab_2_list.accept_discount")}
          </button>
          <button
            onClick={() => setInitailTab(false)}
            className="flex-1 py-2 px-4 border border-[#FF3B30] rounded-lg text-[#FF3B30]"
          >
            {t("settings.tab_2_list.no_i_cancel")}
          </button>
        </div>
      </div> : <div className="bg-white rounded-xl p-4 sm:p-8 max-w-[590px] max-h-[90%] overflow-auto relative">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <span className="text-[20px] text-[#1E1E1E] font-[600] ">{t("settings.tab_2_list.cancel_subscription")}</span>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 absolute right-2 top-2 hover:text-gray-700"
          >
            <X />
          </button>
        </div>

        <div className="mb-6 flex flex-col items-center gap-3">
          <div className="relative w-[170px] h-[87px]">
            <OfferIcon />
            <div className="absolute top-0 right-15 h-[83px] border-l border-dashed border-[#857FFF] ">
            </div>
            <div className="absolute top-0 left-0 w-full h-full flex items-center justify-between px-4 text-white font-sans">
              <p className="text-[#FBF665] text-[44.44px] font-[700]">50%</p>
              <p className="text-white  font-[700] text-[40.26px] rotate-180 [writing-mode:vertical-rl]">off</p>
            </div>
          </div>

          <h3 className="text-[17px] font-[600] ">{t("settings.tab_2_list.were_sorry")} </h3>
          <h2 className="text-[14px] text-center text-[#5A687C] font-[400]">{t("settings.tab_2_list.yours_credits_will")}</h2>
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-2">
            <label className="text-[14px] font-[500] mb-1">{t("settings.tab_2_list.why_are_you_cancelling")}</label>
            <SelectDropdown
              name="cancel_plan"
              options={options}
              value={selectedData}
              onChange={(updated) => {
                setSelectedData(updated)
              }}
              placeholder={t("select")}
              className=""
            />
          </div>
          {selectedData === "other" && <div>
            <label className="text-[14px] font-[500]">{t("settings.tab_2_list.reason")}</label>
            <textarea className="mt-1 w-full rounded-lg resize-none border border-[#E1E4EA] p-2 text-[16px] text-[#1E1E1E] focus:border-[#675FFF] focus:outline-none" placeholder={t("settings.tab_2_list.reason_placeholder")} rows={3} value={otherIssue} onChange={(e) => setOtherIssue(e.target.value)} />
          </div>}
        </div>

        <div className="flex gap-4 mt-5">
          <button
            onClick={onClose}
            className="flex-1 p-2 text-center bg-[#FF3B30] rounded-lg text-[#fff]"
          >
            {t("settings.tab_2_list.confirm_cancel")}
          </button>
          <button onClick={onClose} className="flex-1 w-full text-center p-2 bg-trasparent border border-[#5A687C] text-[#5A687C] rounded-lg">
            {t("settings.tab_2_list.i_changed_my_mind")}
          </button>
        </div>
      </div>}
    </div>
  )
}

const Plan = ({ t, teamMembersData, setActiveSidebarItem, showPlanPopup, setShowPlanPopup, handleInviteTeam }) => {
  const [showCreditPopup, setShowCreditPopup] = useState(false);
  const [cancelPopup, setCancelPopup] = useState(false);
  const [roleSelect, setRoleSelect] = useState("All");
  const [pastMonths, setPastMonths] = useState(6);
  const userDetails = useSelector((state) => state.profile.user);
  const [creditUsageData, setCreditUsageData] = useState([])

  // const creditUsageData = [
  //   {
  //     item: "AI Agents - LLM and Tool Cost",
  //     credit: "500.000",
  //     usedBy: "Sami",
  //     dateTime: "27/03/2025 03:30 PM",
  //   },
  //   {
  //     item: "AI Agents - LLM and Tool Cost",
  //     credit: "500.000",
  //     usedBy: "Jeson",
  //     dateTime: "27/03/2025 03:30 PM",
  //   },
  //   {
  //     item: "AI Agents - LLM and Tool Cost",
  //     credit: "500.000",
  //     usedBy: "Marcus",
  //     dateTime: "27/03/2025 03:30 PM",
  //   },
  //   {
  //     item: "AI Agents - LLM and Tool Cost",
  //     credit: "500.000",
  //     usedBy: "Robert",
  //     dateTime: "27/03/2025 03:30 PM",
  //   },
  //   {
  //     item: "AI Agents - LLM and Tool Cost",
  //     credit: "500.000",
  //     usedBy: "Robert",
  //     dateTime: "27/03/2025 03:30 PM",
  //   },
  // ];
  const role = useSelector((state) => state.profile.user.role)

  const roleOptions = [{ label: `${t("settings.tab_3_list.all")}`, key: "All" }, { label: `${t("settings.tab_3_list.admin")}`, key: "Admin" }, { label: `${t("settings.tab_3_list.member")}`, key: "Member" }, { label: `${t("settings.tab_3_list.guest")}`, key: "Guest" }]
  const pastMonthOptions = [{ label: `${t("settings.tab_2_list.past_6_months")}`, key: 6 }, { label: `${t("settings.tab_2_list.past_3_months")}`, key: 3 }, { label: `${t("settings.tab_2_list.past_2_months")}`, key: 2 }]

  return (
    <div className="py-2 pr-4 w-full h-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-[20px] sm:text-[24px] font-semibold">
          {t("settings.tab_2")}
        </h1>
        <button
          onClick={() => setShowPlanPopup(true)}
          className="w-full sm:w-auto px-4 py-2 text-[#5E54FF] text-[16px]  border border-[#5E54FF] hover:bg-indigo-50 rounded-lg"
        >
          {t("settings.tab_2_list.manage_plan")}
        </button>
      </div>

      {showPlanPopup && (
        <PlanManagementPopup t={t} onClose={() => setShowPlanPopup(false)} onOpen={() => setCancelPopup(true)} />
      )}
      {showCreditPopup && (
        <CreditPopup t={t} onClose={() => setShowCreditPopup(false)} onOpen={() => setShowPlanPopup(true)} userDetails={userDetails} />
      )}
      {cancelPopup && (
        <CancelSubscriptionPopup t={t} onClose={() => setCancelPopup(false)} />
      )}


      {/* Cards Container */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
        {/* Plan Card */}
        <div
          className="bg-white p-4 sm:p-6 rounded-xl  border border-[#E1E4EA]"
        >
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <div className="">
                <CreditsIcon />
              </div>
              <span className="text-[16px] font-[600]   "> {t("settings.tab_2_list.plan")}</span>
            </div>
            <button className="cursor-pointer"
              onClick={() => setShowCreditPopup(true)}
            >
              <EditPlanIcon />
            </button>
          </div>
          <h1 className=" mb-2 text-sm font-[400]  text-[#5A687C] " > {t("settings.tab_2_list.available_credits")}</h1>
          <div className="flex items-center gap-2">
            <span className="text-[24px] font-[600]  ">{teamMembersData?.credits}</span>
            <button onClick={() => setShowCreditPopup(true)} className="px-2 rounded-[5px] py-2 text-[14px] flex items-center gap-1 bg-[#335BFB1A] text-[#675FFF] font-[600] ">
              <AddIcon />
              <span> {t("settings.tab_2_list.add_credits")}</span>
            </button>
          </div>
        </div>

        {/* Payment Card */}
        <div className="bg-white p-4 sm:p-6 flex flex-col justify-between rounded-xl  border border-[#E1E4EA]">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <div className="">
                <PaymentsIcon />
              </div>
              <span className="font-medium"> {t("settings.tab_2_list.payment")}</span>
            </div>
            <button onClick={() => setActiveSidebarItem("transaction-history")} className="text-[#5E54FF] font-[600] text-sm cursor-pointer hover:underline flex items-center gap-2 ">
              <span>{t("settings.tab_2_list.view_details")}{" "}</span>
              <span className="pb-0.5"><PaymentsViewIcon /></span>
            </button>
          </div>
          <div className="inline-block w-fit px-4 py-2 bg-green-50 text-[#34C759] font-[600] rounded-lg text-sm">
            {t("settings.tab_2_list.pay_by_invoice")}
          </div>
        </div>

        {/* Member Seats Card */}
        <div className="bg-white p-4 sm:p-6 rounded-xl  border border-[#E1E4EA]">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <div className="">
                <MembersIcon/>
              </div>
              <span className="font-medium"> {t("settings.tab_2_list.members_seats")}</span>
            </div>
            <button onClick={handleInviteTeam} className="text-[#5E54FF] font-[600] cursor-pointer text-sm hover:underline flex items-center gap-1 ">
              <AddIcon/>
              {t("settings.tab_2_list.add_seats")}{" "}
            </button>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-gray-500 text-sm">{role}</span>
            <span className="text-[24px] font-[600]  ">{teamMembersData.teamMembers}/{teamMembersData.teamSize}</span>
          </div>
        </div>
      </div>

      {/* Credit Usage Section */}
      <div className="bg-white rounded-xl  border border-[#E1E4EA] p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h2 className="text-[20px] sm:text-[24px] font-[600] ">
            {t("settings.tab_2_list.credits_used")}
          </h2>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full sm:w-auto">
            <SelectDropdown
              name="role_select"
              options={roleOptions}
              value={roleSelect}
              onChange={(updated) => {
                setRoleSelect(updated)
              }}
              placeholder={t("brain_ai.select")}
              className="w-[155px]"
            />
            <SelectDropdown
              name="past_month"
              options={pastMonthOptions}
              value={pastMonths}
              onChange={(updated) => {
                setPastMonths(updated)
              }}
              placeholder={t("brain_ai.select")}
              className="w-[160px]"
            />
            <div className="flex items-center px-3 gap-2 cursor-pointer bg-white border border-[#E1E4EA] rounded-[8px] py-[8px]">
              <RefreshIcon/>
              <button className="text-[16px] cursor-pointer text-[#5A687C]">
                {t("refresh")}
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="text-left text-gray-600">
                <th className="pb-6 pr-8 text-[16px]  font-[400] text-[#5A687C]">
                  {t("settings.tab_2_list.item")}
                </th>
                <th className="pb-6 px-8 text-[16px] text-nowrap  font-[400] text-[#5A687C] flex items-center gap-2">
                  {t("settings.tab_2_list.credit")}{" "}
                  <span>
                    <img src="/src/assets/svg/credit.svg" alt="" />
                  </span>
                </th>
                <th className="pb-6 px-8 text-[16px] text-nowrap  font-[400] text-[#5A687C]">
                  {t("settings.tab_2_list.used_by")}
                </th>
                <th className="pb-6 pl-8 text-[16px]  font-[400] text-[#5A687C]">
                  {t("settings.tab_2_list.date_time")}
                </th>
              </tr>
            </thead>
            <tbody>
              {creditUsageData.map((row, index) => (
                <tr key={index} className="border-b border-gray-100">
                  <td className="py-3 pr-8">
                    <div className="flex items-center gap-4">
                      <div className="px-3 py-3 bg-[#335BFB1A] rounded-2xl">
                        <img src="/src/assets/svg/coins.svg" alt="" />
                      </div>
                      {row.item}
                    </div>
                  </td>
                  <td className="py-3 px-8">{row.credit}</td>
                  <td className="py-3 px-8">{row.usedBy}</td>
                  <td className="py-3 pl-8 text-indigo-600">{row.dateTime}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {creditUsageData?.length == 0 && <p className="text-center h-20 pt-5">{t("no_data")}</p>}
        </div>
      </div>
    </div>
  );
};
export default Plan;
