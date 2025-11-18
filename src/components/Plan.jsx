import { ChevronDown, X } from "lucide-react";
import { useEffect, useState } from "react";
import { addCredits, updateSubscriptionPaymentStatus } from "../api/payment";
import { useSelector } from "react-redux";
import { loadStripe } from "@stripe/stripe-js";
import { useNavigate } from "react-router-dom";
import { AddIcon, BusinessPlanIcon, CheckedCircle, CreditsIcon, CustomPlanIcon, EditPlanIcon, EmptyCircle, MembersIcon, OfferIcon, PaymentsIcon, PaymentsViewIcon, ProPlanIcon, RefreshIcon, TeamPlanIcon } from "../icons/icons";
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
        name: `${t("Standard")}`,
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
      if (userDetails?.subscriptionDurationType === "monthly"){
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
        return <p className="text-red-500 pb-3">Your Trail Plan ended on {DateFormat(userDetails?.subscriptionEndDate)}</p>
      } else {
        return <p className="text-green-500 pb-3">Your Trail Plan ends on {DateFormat(userDetails?.subscriptionEndDate)}</p>
      }
    } else if (new Date() > new Date(userDetails?.subscriptionEndDate)) {
      return <p className="text-red-500 pb-3">Your current plan ended on {DateFormat(userDetails?.subscriptionEndDate)}</p>
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
              className={`border ${((userDetails?.subscriptionDurationType === activeTab) && (index == planIndex)) ? "border-[#675FFF]" : "border-[#E1E4EA]"} rounded-xl p-4`}
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
            className="text-gray-500 cursor-pointer absolute right-2 top-2 hover:text-gray-700"
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
          <button className="flex-1 cursor-pointer py-2 px-4 bg-[#675FFF] text-white rounded-lg">
            {t("settings.tab_2_list.accept_discount")}
          </button>
          <button
            onClick={() => setInitailTab(false)}
            className="flex-1 py-2 px-4 cursor-pointer border border-[#FF3B30] rounded-lg text-[#FF3B30]"
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
            className="text-gray-500 cursor-pointer absolute right-2 top-2 hover:text-gray-700"
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
            className="flex-1 cursor-pointer p-2 text-center bg-[#FF3B30] rounded-lg text-[#fff]"
          >
            {t("settings.tab_2_list.confirm_cancel")}
          </button>
          <button onClick={onClose} className="flex-1 cursor-pointer w-full text-center p-2 bg-trasparent border border-[#5A687C] text-[#5A687C] rounded-lg">
            {t("settings.tab_2_list.i_changed_my_mind")}
          </button>
        </div>
      </div>}
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
const getPlanDisplayName = (subscriptionType) => {
  const planMap = {
    'pro': 'Standard',
    'team': 'Pro',
    'business': 'Business',
    'enterprise': 'Enterprise',
    'trial': 'Trial'
  };
  return planMap[subscriptionType] || subscriptionType?.charAt(0).toUpperCase() + subscriptionType?.slice(1) || 'Standard';
};

const Plan = ({ t, teamMembersData, setActiveSidebarItem, showPlanPopup, setShowPlanPopup, handleAddSeatsTeam, setShowManagePlan, setSearchParams }) => {
  const navigate = useNavigate();
  const [showCreditPopup, setShowCreditPopup] = useState(false);
  const [cancelPopup, setCancelPopup] = useState(false);
  const [roleSelect, setRoleSelect] = useState("All");
  const [pastMonths, setPastMonths] = useState(6);
  const userDetails = useSelector((state) => state.profile.user);
  const [creditUsageData, setCreditUsageData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);

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

  // Calculate credit usage percentage
  // If credits represents available credits, calculate used credits
  // Otherwise, treat it as used credits
  const creditLimit = teamMembersData?.creditLimit || 1000; // Default limit, can be made dynamic
  const availableCredits = teamMembersData?.credits || 0;
  // For display: if we have a limit, show used credits (limit - available), otherwise show available
  const usedCredits = creditLimit > 0 ? Math.max(0, creditLimit - availableCredits) : availableCredits;
  const creditUsage = creditLimit > 0 ? Math.min((usedCredits / creditLimit) * 100, 100) : 0;

  // Pagination calculations
  const totalPages = Math.ceil((creditUsageData?.length || 0) / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedData = creditUsageData?.slice(startIndex, endIndex) || [];

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push('...');
      for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
        pages.push(i);
      }
      if (currentPage < totalPages - 2) pages.push('...');
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div className="py-2 pr-4 w-full h-full p-8">
      {/* Header */}
      <div className="flex flex-col gap-2 mb-6">
        <h1 className="text-[24px] sm:text-[28px] font-[600] text-[#1E1E1E]">
          Plan & Billing
        </h1>
        <p className="text-[14px] sm:text-[16px] text-[#5A687C] font-[400]">
          Manage your subscription, billing methods, and team seats in one place.
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

      {/* Cards Container - 4 Cards Layout */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
        {/* Current Plan Card */}
        <div className="bg-white p-4 sm:p-6 rounded-xl border border-[#E1E4EA]">
          <div className="mb-4">
            <h3 className="text-[14px] font-[500] text-[#5A687C] mb-3">Current plan</h3>
            <h2 className="text-[20px] sm:text-[24px] font-[600] text-[#1E1E1E] mb-2">
              {getPlanDisplayName(userDetails?.subscriptionType)}
            </h2>
            {userDetails?.subscriptionEndDate && (
              <p className="text-[14px] font-[400] text-[#5A687C]">
                Auto renew on {formatRenewalDate(userDetails.subscriptionEndDate)}
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
            className="w-full px-4 py-2 bg-white border border-[#E1E4EA] rounded-lg text-[#1E1E1E] text-[14px] font-[500] hover:bg-[#F9F8FF] transition-colors"
          >
            Manage Plan
          </button>
        </div>

        {/* Payment Method Card */}
        <div className="bg-white p-4 sm:p-6 rounded-xl border border-[#E1E4EA]">
          <div className="mb-4">
            <h3 className="text-[14px] font-[500] text-[#5A687C] mb-3">Payment method</h3>
            <h2 className="text-[20px] sm:text-[24px] font-[600] text-[#1E1E1E] mb-2">
              Visa
            </h2>
            <p className="text-[14px] font-[400] text-[#5A687C]">
              **** 2131 • 12/25
            </p>
          </div>
          <button
            onClick={() => setActiveSidebarItem("transaction-history")}
            className="w-full px-4 py-2 bg-white border border-[#E1E4EA] rounded-lg text-[#1E1E1E] text-[14px] font-[500] hover:bg-[#F9F8FF] transition-colors"
          >
            Change Method
          </button>
        </div>

        {/* Member Seats Card */}
        <div className="bg-white p-4 sm:p-6 rounded-xl border border-[#E1E4EA]">
          <div className="mb-4">
            <h3 className="text-[14px] font-[500] text-[#5A687C] mb-3">Member Seats</h3>
            <h2 className="text-[20px] sm:text-[24px] font-[600] text-[#1E1E1E] mb-1">
              {teamMembersData?.teamMembers || 0} / {teamMembersData?.teamSize || 0}
            </h2>
            <p className="text-[14px] font-[400] text-[#5A687C]">Total Users</p>
          </div>
          <button
            onClick={handleAddSeatsTeam}
            className="w-full px-4 py-2 bg-white border border-[#E1E4EA] rounded-lg text-[#1E1E1E] text-[14px] font-[500] hover:bg-[#F9F8FF] transition-colors"
          >
            + Add New Seats
          </button>
        </div>

        {/* Credit Usage Card */}
        <div className="bg-white p-4 sm:p-6 rounded-xl border border-[#E1E4EA]">
          <div className="mb-4">
            <h3 className="text-[14px] font-[500] text-[#5A687C] mb-3">Credit Usage</h3>
            <div className="flex items-baseline justify-between mb-3">
              <h2 className="text-[20px] sm:text-[24px] font-[600] text-[#1E1E1E]">
                {usedCredits.toLocaleString()}
              </h2>
              <p className="text-[14px] font-[400] text-[#5A687C]">
                Limit {creditLimit.toLocaleString()}
              </p>
            </div>
            {/* Progress Bar */}
            <div className="w-full h-2 bg-[#E1E4EA] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#675FFF] transition-all duration-300"
                style={{ width: `${creditUsage}%` }}
              />
            </div>
          </div>
          <button
            onClick={() => setShowCreditPopup(true)}
            className="w-full px-4 py-2 bg-white border border-[#E1E4EA] rounded-lg text-[#1E1E1E] text-[14px] font-[500] hover:bg-[#F9F8FF] transition-colors"
          >
            + Add Credits
          </button>
        </div>
      </div>

      {/* Credit Usage Section */}
      <div className="bg-white rounded-xl border border-[#E1E4EA] p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h2 className="text-[20px] sm:text-[24px] font-[600] text-[#1E1E1E]">
            Credit Usage
          </h2>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full sm:w-auto">
            <SelectDropdown
              name="role_select"
              options={roleOptions}
              value={roleSelect}
              onChange={(updated) => {
                setRoleSelect(updated)
              }}
              placeholder="By User"
              className="w-[155px]"
            />
            <SelectDropdown
              name="past_month"
              options={pastMonthOptions}
              value={pastMonths}
              onChange={(updated) => {
                setPastMonths(updated)
              }}
              placeholder="Last 6 Month"
              className="w-[160px]"
            />
            <div className="flex items-center px-3 gap-2 cursor-pointer bg-white border border-[#E1E4EA] rounded-[8px] py-[8px]">
              <RefreshIcon />
              <button className="text-[16px] cursor-pointer text-[#5A687C]">
                {t("refresh")}
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="border border-[#D6D6D6] rounded-2xl overflow-hidden">
          <table className="min-w-full border-separate border-spacing-0">
            <thead className="bg-[#F7F7F8]">
              <tr className="text-[#5A687C]">
                <th className="px-6 text-start py-3 text-[16px] font-[400]">{t("settings.tab_2_list.item")}</th>
                <th className="px-6 text-start py-3 text-[16px] font-[400]">{t("settings.tab_2_list.credit")}</th>
                <th className="px-6 text-start py-3 text-[16px] font-[400]">{t("settings.tab_2_list.used_by")}</th>
                <th className="px-6 text-start py-3 text-[16px] font-[400]">{t("settings.tab_2_list.date_time")}</th>
              </tr>
            </thead>

            <tbody className="bg-white [&>tr:first-child>td:first-child]:rounded-tl-2xl [&>tr:first-child>td:first-child]:border-t [&>tr:first-child>td:last-child]:rounded-tr-2xl [&>tr:first-child>td:last-child]:border-t [&>tr:first-child>td]:border-t [&>tr:last-child>td:first-child]:rounded-bl-2xl [&>tr:last-child>td:first-child]:border-b [&>tr:last-child>td:last-child]:rounded-br-2xl [&>tr:last-child>td:last-child]:border-b [&>tr:last-child>td]:border-b [&>tr>td]:border-[#D6D6D6]">
              {paginatedData?.length === 0 ? (
                <tr className="h-34">
                  <td colSpan="4" className="text-center py-8 text-[#5A687C]">
                    {t("no_data")}
                  </td>
                </tr>
              ) : (
                paginatedData.map((row, index) => {
                  // Generate avatar color based on user name
                  const avatarColors = [
                    'bg-[#EBEFFF] text-[#675FFF]',
                    'bg-[#EBF9EE] text-[#34C759]',
                    'bg-[#FFF4E6] text-[#FF9500]',
                    'bg-[#F3E8FF] text-[#9B59B6]',
                    'bg-[#FFE6E6] text-[#FF6B6B]'
                  ];
                  const colorIndex = index % avatarColors.length;
                  const userInitials = row.usedBy ? row.usedBy.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'U';
                  
                  return (
                    <tr key={index} className="text-left">
                      <td className="px-6 py-4 text-[16px] text-[#1E1E1E] font-[400]">
                        <div className="flex items-center gap-3">
                          <div className="px-3 py-3 bg-[#335BFB1A] rounded-2xl">
                            <img src="/src/assets/svg/coins.svg" alt="" className="w-5 h-5" />
                          </div>
                          {row.item || "AI Agents — LLM and Tool Cost"}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-[16px] text-[#1E1E1E] font-[400]">
                        {row.credit ? row.credit.toLocaleString() : "500,000"}
                      </td>
                      <td className="px-6 py-4 text-[16px] text-[#1E1E1E] font-[400]">
                        <div className="flex items-center gap-2">
                          <div className={`flex justify-center items-center rounded-[12px] h-[40px] w-[40px] text-[16px] font-[600] ${avatarColors[colorIndex]}`}>
                            {userInitials}
                          </div>
                          {row.usedBy || "User"}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-[16px] text-[#1E1E1E] font-[400]">
                        {row.dateTime || "27/03/2025 03:30 PM"}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex items-center justify-between bg-[#F7F7F8] px-4 py-3">
            {/* Pagination controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className={`border border-[#D6D6D6] text-[#000000] rounded-lg px-3 py-1 text-sm bg-white cursor-pointer hover:bg-gray-50 ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                ‹ Prev
              </button>
              {getPageNumbers().map((page, idx) => (
                page === '...' ? (
                  <span key={`ellipsis-${idx}`} className="text-[#000000] text-sm">…</span>
                ) : (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`rounded-lg px-3 py-1 text-sm cursor-pointer ${
                      currentPage === page
                        ? 'bg-[#675FFF] text-white'
                        : 'border border-[#D6D6D6] text-[#000000] hover:bg-white'
                    }`}
                  >
                    {page}
                  </button>
                )
              ))}
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className={`border border-[#D6D6D6] text-[#000000] rounded-lg px-3 py-1 text-sm bg-white cursor-pointer hover:bg-gray-50 ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                Next ›
              </button>
            </div>

            {/* Rows per page */}
            <div className="flex items-center gap-2 text-sm text-[#5A687C]">
              <button
                onClick={() => {
                  setRowsPerPage(5);
                  setCurrentPage(1);
                }}
                className={`border border-[#D6D6D6] rounded-lg px-2 py-1 text-[#000000] cursor-pointer ${
                  rowsPerPage === 5 ? 'bg-white' : 'hover:bg-white'
                }`}
              >
                5 rows
              </button>
              <button
                onClick={() => {
                  setRowsPerPage(10);
                  setCurrentPage(1);
                }}
                className={`border border-[#D6D6D6] rounded-lg px-2 py-1 text-[#000000] cursor-pointer ${
                  rowsPerPage === 10 ? 'bg-white' : 'hover:bg-white'
                }`}
              >
                10
              </button>
              <button
                onClick={() => {
                  setRowsPerPage(20);
                  setCurrentPage(1);
                }}
                className={`border border-[#D6D6D6] rounded-lg px-2 py-1 text-[#000000] cursor-pointer ${
                  rowsPerPage === 20 ? 'bg-white' : 'hover:bg-white'
                }`}
              >
                20
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Plan;
