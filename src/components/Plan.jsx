import { ChevronDown, X } from "lucide-react";
import React, { useState } from "react";

const CreditPopup = ({ onClose }) => {
  const [selectedCredit, setSelectedCredit] = useState(350);
  const creditOptions = [2000, 3000, 1000];

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl p-4 sm:p-6 w-[75%] h-[60vh] lg:h-[511px] lg:w-[516px] overflow-y-auto relative">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-[#335BFB1A] rounded-lg">
              <img src="/src/assets/svg/coins.svg" alt="" />
            </div>
            <span className="text-[20px] onest font-medium ">Your credit</span>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 absolute right-2 top-2 hover:text-gray-700"
          >
           <X />
          </button>
        </div>

        <div className="bg-[#5E54FF] text-white p-4 rounded-lg mb-6 flex justify-between items-center ">
          <div className=" text-[16px] onest font-[500] text-[#E1E4EA] ">
            Available Credit
          </div>
          <div className="text-[36px] font-700 onest  font-semibold">100</div>
        </div>

        <div className="mb-6">
          <h3 className="text-[17px] font-[600] onest mb-4">Add credit</h3>
          <div className="relative mb-4">
            <input
              type="range"
              min="100"
              max="30000"
              value={selectedCredit}
              onChange={(e) => setSelectedCredit(Number(e.target.value))}
              className="w-full h-3.5 bg-gray-200 rounded-lg appearance-none cursor-pointer custom-thumb"
              style={{
                background: `linear-gradient(to right, #675FFF ${
                  ((selectedCredit - 100) / (30000 - 100)) * 100
                }%, #e5e7eb ${
                  ((selectedCredit - 100) / (30000 - 100)) * 100
                }%)`,
              }}
            />
            <div className="flex justify-between mt-2">
              <span className="text-[17px] font-[600] onest ">100</span>
              <span className="text-[17px] font-[600] onest ">30000</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mb-4">
            {creditOptions.map((credit, index) => (
              <button
                key={index}
                onClick={() => setSelectedCredit(credit)}
                className="flex-1 py-2 px-4 border border-gray-300 bg-[#F2F2F7] rounded-lg text-[17px] font-[600] onest text-center hover:bg-gray-50"
              >
                {credit}
              </button>
            ))}
            <input
              type="number"
              value={selectedCredit}
              onChange={(e) => setSelectedCredit(Number(e.target.value))}
              className="flex-1 py-2 px-4 border border-gray-300 rounded-lg text-center"
              min="100"
              max="30000"
            />
          </div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={onClose}
            className="flex-1 py-2 px-4 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Close
          </button>
          <button className="flex-1 py-2 px-4 bg-[#5E54FF] text-white rounded-lg hover:bg-[#4B43CC]">
            Add {selectedCredit} Credit
          </button>
        </div>
      </div>
    </div>
  );
};

const PlanManagementPopup = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState("annual");

  const plans = {
    annual: [
      {
        name: "Pro",
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
        name: "Team",
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
        name: "Business",
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

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-3 sm:p-6 mx-2 w-full max-w-[95%] lg:max-w-[90%] h-[80vh] overflow-y-auto relative">
        <div className="flex flex-wrap items-start justify-between gap-3 mb-6">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-[#335BFB1A] rounded-lg">
             <img src="/src/assets/svg/MangePlan.svg" alt="" />
            </div>
            <span className="text-[16px] sm:text-[20px] font-[600] onest">Manage Plan</span>
            <div className="flex gap-2 bg-[#F2F2F7] p-1 rounded-lg">
              <button
                className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium ${
                  activeTab === "annual"
                    ? "bg-white text-black"
                    : "bg-transparent text-[#5A687C]"
                }`}
                onClick={() => setActiveTab("annual")}
              >
                Annual
              </button>
              <button
                className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium ${
                  activeTab === "monthly"
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
            <button className="text-gray-600 hover:text-gray-800 text-sm">
              Manage payment method
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {plans[activeTab].map((plan, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-xl p-4"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex flex-col gap-2">
                  <div className="p-2 rounded-lg">
                    <img src={plan.svg} alt="" className="w-8 h-8 object-contain" />
                  </div>
                  <span className="font-[600] text-[15px] sm:text-[16px] onest">{plan.name}</span>
                </div>
                {plan.discount && (
                  <span className="text-[#34C759] text-[13px] sm:text-[14px] onest bg-[#34C7591A] px-2 py-1 rounded whitespace-nowrap">
                    {plan.discount}
                  </span>
                )}
              </div>
              <div className="flex items-baseline gap-1 mb-2 flex-wrap">
                <span className="text-[18px] sm:text-[22px] font-[600] onest">{plan.price}</span>
                {plan.period && (
                  <span className="text-[#5A687C] font-[600] text-[13px] sm:text-[14px]">
                    {plan.period}
                  </span>
                )}
              </div>
              <p className="text-gray-600 text-[13px] sm:text-sm mb-4 line-clamp-2">{plan.description}</p>
              <button
                className={`w-full py-2 px-3 rounded-lg mb-4 text-[13px] sm:text-sm ${
                  plan.selected
                    ? "bg-gray-100 text-gray-700"
                    : plan.name === "Enterprise"
                    ? "border border-[#5E54FF] text-[#5E54FF]"
                    : "bg-[#5E54FF] text-white"
                }`}
              >
                {plan.selected
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

const Plan = () => {
  const [showCreditPopup, setShowCreditPopup] = useState(false);
  const [showPlanPopup, setShowPlanPopup] = useState(false);
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

  return (
    <div className="p-4 sm:p-6 w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-[20px] sm:text-[24px] font-semibold">
          Plan &amp; Billing
        </h1>
        <button
          onClick={() => setShowPlanPopup(true)}
          className="w-full sm:w-auto px-4 py-2 text-[#5E54FF] text-[16px] onest border border-[#5E54FF] hover:bg-indigo-50 rounded-lg"
        >
          Manage Plan
        </button>
      </div>

      {showPlanPopup && (
        <PlanManagementPopup onClose={() => setShowPlanPopup(false)} />
      )}
      {showCreditPopup && (
        <CreditPopup onClose={() => setShowCreditPopup(false)} />
      )}

      {/* Cards Container */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
        {/* Plan Card */}
        <div
          className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-[#E1E4EA]"
        >
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <div className="">
                <img src="/src/assets/svg/plan.svg" alt="" />
              </div>
              <span className="text-[16px] font-[600] onest  ">Plan</span>
            </div>
            <button className="text-gray-400 hover:text-gray-600 cursor-pointer bg-[#F2F2F7] rounded-lg px-2 py-2"
            onClick={() => setShowCreditPopup(true)}
            >
              <img src="/src/assets/svg/planedit.svg" alt="" />
            </button>
          </div>
          <h1 className=" mb-2 text-sm font-[400] onest text-[#5A687C] " >Available Credits</h1>
          <div className="flex items-center gap-2">
            <span className="text-[24px] font-[600] onest ">100</span>
            <button className="px-2 rounded-[5px] py-2 text-[14px] flex items-center gap-1 bg-[#335BFB1A] text-[#5E54FF] ">
              <img src="/src/assets/svg/add.svg" alt="" />
              <span>Add Credits</span>
            </button>
          </div>
        </div>

        {/* Payment Card */}
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-[#E1E4EA]">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <div className="">
                <img src="/src/assets/svg/payment.svg" alt="" />
              </div>
              <span className="font-medium">Payment</span>
            </div>
            <button className="text-[#5E54FF] font-[600] text-sm hover:underline flex items-center gap-2 onest">
              View Details{" "}
              <span>
                <img src="/src/assets/svg/details.svg" alt="" />
              </span>
            </button>
          </div>
          <div className="inline-block px-4 py-2 bg-green-50 text-green-600 rounded-lg text-sm">
            Pay By Invoice
          </div>
        </div>

        {/* Member Seats Card */}
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-[#E1E4EA]">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <div className="">
                  <img src="/src/assets/svg/members.svg" alt="" />
              </div>
              <span className="font-medium">Member Seats</span>
            </div>
            <button className="text-[#5E54FF] font-[600] text-sm hover:underline flex items-center gap-1 onest">
                <img src="/src/assets/svg/add.svg" alt="" />
              Add Seats{" "}
            </button>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-gray-500 text-sm">Users</span>
            <span className="text-[24px] font-[600] onest ">1/5</span>
          </div>
        </div>
      </div>

      {/* Credit Usage Section */}
      <div className="bg-white rounded-xl shadow-sm border border-[#E1E4EA] p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h2 className="text-[20px] sm:text-[24px] font-[600] onest">
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
              Refresh
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="text-left text-gray-600">
                <th className="pb-6 pr-8 text-[16px] onest font-[400] text-[#5A687C]">
                  Item
                </th>
                <th className="pb-6 px-8 text-[16px] text-nowrap onest font-[400] text-[#5A687C] flex items-center gap-2">
                  Credit{" "}
                  <span>
                    <img src="/src/assets/svg/credit.svg" alt="" />
                  </span>
                </th>
                <th className="pb-6 px-8 text-[16px] text-nowrap onest font-[400] text-[#5A687C]">
                  Used By
                </th>
                <th className="pb-6 pl-8 text-[16px] onest font-[400] text-[#5A687C]">
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
