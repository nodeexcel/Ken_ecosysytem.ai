import { ChevronDown, X } from "lucide-react";
import { useEffect, useState } from "react";
import { addCredits, updateSubscriptionPaymentStatus } from "../api/payment";
import { useSelector } from "react-redux";
import { loadStripe } from "@stripe/stripe-js";
import { CheckedCircle, EmptyCircle, OfferIcon } from "../icons/icons";

const CreditPopup = ({ onClose, onOpen, stripePromise, userDetails }) => {
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
            <span className="text-[20px]  font-[600] ">Your credit</span>
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
          <h3 className="text-[17px] font-[600]  my-4">Add credit</h3>
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
                  <h2>{each.label} credits = </h2>
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
            Upgrade Plan
          </button>
        </div>

        <div className="flex gap-4">
          <button
            onClick={onClose}
            className="flex-1 py-2 px-4 border border-[#5A687C] rounded-lg text-[#5A687C]"
          >
            Cancel
          </button>
          <button disabled={loading} onClick={handleAddCredits} className="flex-1 py-2 px-4 bg-[#675FFF] text-white rounded-lg">
            {loading ? <div className="flex items-center justify-center gap-2"><p>Processing...</p><span className="loader" /></div> : `Add ${selectedCredit.label} Credits`}
          </button>
        </div>
      </div>
    </div>
  );
};

const PlanManagementPopup = ({ onClose, onOpen, stripePromise }) => {
  const [activeTab, setActiveTab] = useState("annual");
  const [activePlan, setActivePlan] = useState("");
  const [planIndex, setPlanIndex] = useState();

  const userDetails = useSelector((state) => state.profile.user)
  const token = useSelector((state) => state.auth.token)

  const plans = {
    annual: [
      {
        id: import.meta.env.VITE_PRO_PLAN,
        name: "Pro",
        key: "pro",
        svg: '/src/assets/svg/table.svg',
        price: "€97",
        period: "/ month",
        description:
          "Built for independent professionals: coaches, freelancers and consultants.",
        features: [
          "10 000 credits per month",
          "1 user",
          "100MB of Knowledge",
          "5 Integrations",
          "Schedule tool runs",
          "Live-chat support",
        ],
        selected: true,
        discount: "10% Off",
      },
      {
        id: import.meta.env.VITE_TEAM_PLAN,
        name: "Team",
        key: "team",
        svg: '/src/assets/svg/house.svg',
        price: "€179",
        period: "/ month",
        description: "For teams working collaboratively.",
        features: [
          "100 000 credits per month",
          "5 users",
          "1GB of Knowledge",
          "Full integrations",
          "Single account per platform",
          "Live-chat support",
        ],
        discount: "10% Off",
      },
      {
        id: import.meta.env.VITE_BUSINESS_PLAN,
        name: "Business",
        key: "business",
        svg: '/src/assets/svg/building.svg',
        price: "€279",
        period: "/ month",
        description: "For companies organized into functional departments.",
        features: [
          "300 000 credits per month",
          "10 users",
          "Full Integration Access",
          "Multi-Account Mode",
          "Activity Centre",
          "5GB of Knowledge",
          "Dedicated Slack channel",
        ],
      },
      {
        name: "Enterprise",
        svg: '/src/assets/svg/buildings.svg',
        price: "Custom",
        description: "Best performance, support and security.",
        features: [
          "Priority support SLAs",
          "Advanced authentication (SSO, RBAC)",
          "Support for multi-region",
          "Premier Support SLGs",
        ],
      },
    ],
    monthly: [
      {
        name: "Pro",
        svg: '/src/assets/svg/table.svg',
        price: "€107",
        period: "/ month",
        description:
          "Built for independent professionals: coaches, freelancers and consultants.",
        features: [
          "10 000 credits per month",
          "1 user",
          "100MB of Knowledge",
          "5 Integrations",
          "Schedule tool runs",
          "Live-chat support",
        ],
        selected: true,
      },
      {
        name: "Team",
        svg: '/src/assets/svg/house.svg',
        price: "€199",
        period: "/ month",
        description: "For teams working collaboratively.",
        features: [
          "100 000 credits per month",
          "5 users",
          "1GB of Knowledge",
          "Full integrations",
          "Single account per platform",
          "Live-chat support",
        ],
      },
      {
        name: "Business",
        svg: '/src/assets/svg/building.svg',
        price: "€309",
        period: "/ month",
        description: "For companies organized into functional departments.",
        features: [
          "300 000 credits per month",
          "10 users",
          "Full Integration Access",
          "Multi-Account Mode",
          "Activity Centre",
          "5GB of Knowledge",
          "Dedicated Slack channel",
        ],
      },
      {
        name: "Enterprise",
        svg: '/src/assets/svg/buildings.svg',
        price: "Custom",
        description: "Best performance, support and security.",
        features: [
          "Priority support SLAs",
          "Advanced authentication (SSO, RBAC)",
          "Support for multi-region",
          "Premier Support SLGs",
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
            <span className="text-[16px] sm:text-[20px] font-[600] ">Manage Plan</span>
            <div className="flex gap-2 bg-[#F2F2F7] p-1 rounded-lg">
              <button
                className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium ${activeTab === "annual"
                  ? "bg-white text-black"
                  : "bg-transparent text-[#5A687C]"
                  }`}
                onClick={() => setActiveTab("annual")}
              >
                Annual
              </button>
              <button
                className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium ${activeTab === "monthly"
                  ? "bg-white text-black"
                  : "bg-transparent text-[#5A687C]"
                  }`}
                onClick={() => setActiveTab("monthly")}
              >
                Monthly
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
              Manage payment method
            </button>
            <button onClick={() => {
              onClose()
              onOpen()
            }} className="text-[#FF3B30] text-[14px] font-[400]">
              Cancel Subscription
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
                  : plan.name === "Enterprise"
                    ? "border border-[#5E54FF] text-[#5E54FF]"
                    : "bg-[#5E54FF] text-white"
                  }`}
              >
                {plan.key === userDetails?.subscriptionType
                  ? "Selected"
                  : plan.name === "Enterprise"
                    ? "Get a Quote"
                    : "Upgrade"}
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

const CancelSubscriptionPopup = ({ onClose }) => {
  const [initialTab, setInitailTab] = useState(true)
  const [selectedData, setSelectedData] = useState()
  const options = [{ label: "Select", value: " " }, { label: "Too expensive", value: "too_expensive" }, { label: "Not enough value", value: "not_enough_value" }, { label: "Other", value: "other" }]
  const [otherIssue, setOtherIssue] = useState("")
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      {initialTab ? <div className="bg-white rounded-xl p-4 sm:p-8 max-w-[590px] max-h-[90%] overflow-auto relative">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <span className="text-[20px] text-[#1E1E1E] font-[600] ">Cancel Subscription</span>
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
          <h3 className="text-[17px] font-[600] ">We’re sorry to see you go! </h3>
          <h2 className="text-[14px] text-center text-[#5A687C] font-[400]">Final chance to stay! We’re offering a <span className="text-[#675FFF]">lifetime 50% discount</span>—a one-time deal! Pay just €48.50/month for Starter (save €48.50/month forever) and continue boosting your sales with our AI agents. This offer expires in 48 hours. Still want to cancel?</h2>
        </div>

        <div className="flex flex-col gap-3">
          <h2 className="text-[18px] text-[#1E1E1E] font-[600] ">Pricing Impact</h2>
          <div className="border border-[#E1E4EA] rounded-lg p-2 flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <div>
                <img src='/src/assets/svg/house.svg' alt="" className="w-8 h-8 object-contain" />
              </div>
              <p className="rounded-lg text-[#34C759] bg-[#EBF9EE] p-2">50% Off</p>
            </div>
            <div className="flex flex-col gap-2">
              <h2 className="text-[#675FFF] font-[600] text-[18px]">Starter</h2>
              <p className="text-[#1E1E1E] font-[600] text-[16px]">€97 → €48.50/month</p>
              <p className="text-[#5A687C] font-[400] text-[14px]">saving €48.50/month indefinitely</p>
            </div>

          </div>
        </div>

        <div className="flex gap-4 mt-5">
          <button className="flex-1 py-2 px-4 bg-[#675FFF] text-white rounded-lg">
            Accept Discount & Stay
          </button>
          <button
            onClick={() => setInitailTab(false)}
            className="flex-1 py-2 px-4 border border-[#FF3B30] rounded-lg text-[#FF3B30]"
          >
            No, I still want to cancel
          </button>
        </div>
      </div> : <div className="bg-white rounded-xl p-4 sm:p-8 max-w-[590px] max-h-[90%] overflow-auto relative">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <span className="text-[20px] text-[#1E1E1E] font-[600] ">Cancel Subscription</span>
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

          <h3 className="text-[17px] font-[600] ">We’re sorry to see you go! </h3>
          <h2 className="text-[14px] text-center text-[#5A687C] font-[400]">Your credits will be revoked immediately, even before the end of your billing period. Feel free to return anytime—we’d welcome you back! Confirm your cancellation below.</h2>
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-2">
            <label className="text-[14px] font-[500] mb-1">Why are you cancelling?</label>
            <select
              value={selectedData}
              onChange={(e) => setSelectedData(e.target.value)}
              className="w-full p-2 rounded-lg border border-[#E1E4EA]"
            >
              {options.map((each) => (
                <option disabled={each.value == " "} value={each.value} key={each.value}>{each.label}</option>
              ))}
            </select>
          </div>
          {selectedData === "other" && <div>
            <label className="text-[14px] font-[500]">Reason</label>
            <textarea className="mt-1 w-full rounded-lg resize-none border border-[#E1E4EA] p-2" placeholder="Enter Reason" rows={3} value={otherIssue} onChange={(e) => setOtherIssue(e.target.value)} />
          </div>}
        </div>

        <div className="flex gap-4 mt-5">
          <button
            onClick={onClose}
            className="flex-1 p-2 text-center bg-[#FF3B30] rounded-lg text-[#fff]"
          >
            Confirm Cancellation
          </button>
          <button onClick={onClose} className="flex-1 w-full text-center p-2 bg-trasparent border border-[#5A687C] text-[#5A687C] rounded-lg">
            I’ve changed my mind—I’ll stay
          </button>
        </div>
      </div>}
    </div>
  )
}

const Plan = ({ teamMembersData, setActiveSidebarItem, showPlanPopup, setShowPlanPopup }) => {
  const [showCreditPopup, setShowCreditPopup] = useState(false);
  const [cancelPopup, setCancelPopup] = useState(false);
  const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
  const userDetails = useSelector((state) => state.profile.user)
  const creditUsageData = [
    {
      item: "AI Agents - LLM and Tool Cost",
      credit: "500.000",
      usedBy: "Sami",
      dateTime: "27/03/2025 03:30 PM",
    },
    {
      item: "AI Agents - LLM and Tool Cost",
      credit: "500.000",
      usedBy: "Jeson",
      dateTime: "27/03/2025 03:30 PM",
    },
    {
      item: "AI Agents - LLM and Tool Cost",
      credit: "500.000",
      usedBy: "Marcus",
      dateTime: "27/03/2025 03:30 PM",
    },
    {
      item: "AI Agents - LLM and Tool Cost",
      credit: "500.000",
      usedBy: "Robert",
      dateTime: "27/03/2025 03:30 PM",
    },
    {
      item: "AI Agents - LLM and Tool Cost",
      credit: "500.000",
      usedBy: "Robert",
      dateTime: "27/03/2025 03:30 PM",
    },
  ];
  const role = useSelector((state) => state.profile.user.role)

  return (
    <div className="py-2 pr-4 w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-[20px] sm:text-[24px] font-semibold">
          Plan &amp; Billing
        </h1>
        <button
          onClick={() => setShowPlanPopup(true)}
          className="w-full sm:w-auto px-4 py-2 text-[#5E54FF] text-[16px]  border border-[#5E54FF] hover:bg-indigo-50 rounded-lg"
        >
          Manage Plan
        </button>
      </div>

      {showPlanPopup && (
        <PlanManagementPopup onClose={() => setShowPlanPopup(false)} onOpen={() => setCancelPopup(true)} stripePromise={stripePromise} />
      )}
      {showCreditPopup && (
        <CreditPopup onClose={() => setShowCreditPopup(false)} onOpen={() => setShowPlanPopup(true)} stripePromise={stripePromise} userDetails={userDetails} />
      )}
      {cancelPopup && (
        <CancelSubscriptionPopup onClose={() => setCancelPopup(false)} />
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
                <img src="/src/assets/svg/plan.svg" alt="" />
              </div>
              <span className="text-[16px] font-[600]   ">Plan</span>
            </div>
            <button className="text-gray-400 hover:text-gray-600 cursor-pointer bg-[#F2F2F7] rounded-lg px-2 py-2"
              onClick={() => setShowCreditPopup(true)}
            >
              <img src="/src/assets/svg/planedit.svg" alt="" />
            </button>
          </div>
          <h1 className=" mb-2 text-sm font-[400]  text-[#5A687C] " >Available Credits</h1>
          <div className="flex items-center gap-2">
            <span className="text-[24px] font-[600]  ">{teamMembersData?.credits}</span>
            <button onClick={() => setShowCreditPopup(true)} className="px-2 rounded-[5px] py-2 text-[14px] flex items-center gap-1 bg-[#335BFB1A] text-[#675FFF] font-[600] ">
              <img src="/src/assets/svg/add.svg" alt="" />
              <span>Add Credits</span>
            </button>
          </div>
        </div>

        {/* Payment Card */}
        <div className="bg-white p-4 sm:p-6 flex flex-col justify-between rounded-xl  border border-[#E1E4EA]">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <div className="">
                <img src="/src/assets/svg/payment.svg" alt="" />
              </div>
              <span className="font-medium">Payment</span>
            </div>
            <button onClick={() => setActiveSidebarItem("transaction-history")} className="text-[#5E54FF] font-[600] text-sm hover:underline flex items-center gap-2 ">
              View Details{" "}
              <span>
                <img src="/src/assets/svg/details.svg" alt="" />
              </span>
            </button>
          </div>
          <div className="inline-block w-fit px-4 py-2 bg-green-50 text-[#34C759] font-[600] rounded-lg text-sm">
            Pay By Invoice
          </div>
        </div>

        {/* Member Seats Card */}
        <div className="bg-white p-4 sm:p-6 rounded-xl  border border-[#E1E4EA]">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <div className="">
                <img src="/src/assets/svg/members.svg" alt="" />
              </div>
              <span className="font-medium">Member Seats</span>
            </div>
            <button className="text-[#5E54FF] font-[600] text-sm hover:underline flex items-center gap-1 ">
              <img src="/src/assets/svg/add.svg" alt="" />
              Add Seats{" "}
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
            Credit used
          </h2>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto">
            <div className="relative w-full sm:w-auto">
              <select className="w-full sm:w-[120px] appearance-none border border-[#E1E4EA] rounded-lg px-4 py-2 text-gray-600 text-sm bg-white pr-10">
                <option>User</option>
              </select>
              <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                <ChevronDown />
              </div>
            </div>

            <div className="relative w-full sm:w-auto">
              <select className="w-full sm:w-[160px] appearance-none border border-[#E1E4EA] rounded-lg px-4 py-2 text-gray-600 text-sm bg-white pr-10">
                <option>Past 6 Months</option>
                <option>Past 3 Months</option>
                <option>Past 2 Months</option>
              </select>
              <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                <ChevronDown />
              </div>
            </div>

            <button className="w-full sm:w-auto flex border border-[#E1E4EA] items-center justify-center gap-2 text-[#5E54FF] hover:bg-[#5E54FF]/5 px-3 py-2 rounded-lg text-sm">
              <img src="/src/assets/svg/refresh.svg" alt="" />
              <span className="text-[#5A687C]">Refresh</span>
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="text-left text-gray-600">
                <th className="pb-6 pr-8 text-[16px]  font-[400] text-[#5A687C]">
                  Item
                </th>
                <th className="pb-6 px-8 text-[16px] text-nowrap  font-[400] text-[#5A687C] flex items-center gap-2">
                  Credit{" "}
                  <span>
                    <img src="/src/assets/svg/credit.svg" alt="" />
                  </span>
                </th>
                <th className="pb-6 px-8 text-[16px] text-nowrap  font-[400] text-[#5A687C]">
                  Used By
                </th>
                <th className="pb-6 pl-8 text-[16px]  font-[400] text-[#5A687C]">
                  Date And Time
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
        </div>
      </div>
    </div>
  );
};
export default Plan;
