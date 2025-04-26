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
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
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
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 w-full p-4">
      <div className="bg-white rounded-xl p-4 sm:p-6 w-full max-w-[90%] h-[80vh] overflow-y-auto relative">
        <div className="flex items-center gap-5 mb-6 ">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-[#335BFB1A] rounded-lg">
              <svg
                width="22"
                height="18"
                viewBox="0 0 22 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M21.1268 2.47144C20.8547 2.1498 20.4737 1.95333 20.0538 1.91827L5.26538 0.683454C4.84547 0.648386 4.4372 0.778938 4.11551 1.05099C3.79514 1.32198 3.59896 1.70109 3.56279 2.11891L3.26526 4.91026H2.07725C1.20756 4.91026 0.5 5.61782 0.5 6.48751V15.7448C0.5 16.6145 1.20756 17.322 2.07725 17.322H16.9172C17.7869 17.322 18.4945 16.6145 18.4945 15.7448V14.2431L19.0211 14.2871C19.0655 14.2907 19.1097 14.2926 19.1535 14.2926C19.9643 14.2926 20.6554 13.6688 20.7241 12.8465L21.4944 3.62135C21.5294 3.20148 21.3989 2.79313 21.1268 2.47144ZM2.07725 5.73057H16.9172C17.3346 5.73057 17.6742 6.07014 17.6742 6.48751V7.33104H1.32031V6.48751C1.32031 6.07014 1.65988 5.73057 2.07725 5.73057ZM1.32031 8.15135H17.6742V9.85303H1.32031V8.15135ZM16.9172 16.5017H2.07725C1.65988 16.5017 1.32031 16.1622 1.32031 15.7448V10.6733H17.6742V15.7448C17.6742 16.1622 17.3346 16.5017 16.9172 16.5017ZM20.6769 3.55306L19.9066 12.7782C19.8719 13.1942 19.5052 13.5044 19.0893 13.4696L18.4945 13.4199V6.48751C18.4945 5.61782 17.7869 4.91026 16.9172 4.91026H4.09025L4.37896 2.2016C4.37928 2.19848 4.37957 2.19541 4.37982 2.19225C4.41456 1.77631 4.78107 1.46607 5.19713 1.50093L19.9856 2.73575C20.1871 2.75256 20.37 2.84686 20.5005 3.00124C20.6311 3.15562 20.6938 3.35155 20.6769 3.55306Z"
                  fill="#5E54FF"
                />
                <path
                  d="M15.9577 11.8928H12.0103C11.7837 11.8928 11.6001 12.0764 11.6001 12.303V14.8783C11.6001 15.1048 11.7837 15.2885 12.0103 15.2885H15.9577C16.1842 15.2885 16.3678 15.1048 16.3678 14.8783V12.303C16.3678 12.0764 16.1842 11.8928 15.9577 11.8928ZM15.5475 14.4682H12.4204V12.7131H15.5475V14.4682Z"
                  fill="#5E54FF"
                />
              </svg>
            </div>
            <span className="text-[20px] font-[600] onest ">Manage Plan</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 absolute top-2 right-2"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 ">
            <div className="flex gap-2 w-full sm:w-auto bg-[#F2F2F7] px-2 py-1 rounded-lg">
              <button
                className={`flex-1 sm:flex-none px-4 py-2 rounded-lg font-medium ${
                  activeTab === "annual"
                    ? "bg-white text-black"
                    : "bg-transparent text-[#5A687C] "
                }`}
                onClick={() => setActiveTab("annual")}
              >
                Annual
              </button>
              <button
                className={`flex-1 sm:flex-none px-4 py-2 rounded-lg font-medium ${
                  activeTab === "monthly"
                    ? "bg-white text-black"
                    : "bg-transparent text-[#5A687C] "
                }`}
                onClick={() => setActiveTab("monthly")}
              >
                Monthly
              </button>
            </div>
            <div className="w-full sm:w-auto">
              <button className="w-full sm:w-auto text-gray-600 hover:text-gray-800 text-sm">
                Manage payment method
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {plans[activeTab].map((plan, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-xl p-4 sm:p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className=" flex flex-col gap-2">
                  <div className="p-2  rounded-lg">
                    <img src={plan.svg} alt="" />
                  </div>
                  <span className="font-[600] text-[18px] onest ">{plan.name}</span>
                </div>
                {plan.discount && (
                  <span className="text-[#34C759] text-[18px] onest bg-[#34C7591A] px-2 py-1 rounded">
                    {plan.discount}
                  </span>
                )}
              </div>
              <div className="flex items-baseline gap-1 mb-2">
                <span className="text-[25px] font-[600] onest ">{plan.price}</span>
                {plan.period && (
                  <span className="text-[#5A687C] font-[600] text-[18px] ">{plan.period}</span>
                )}
              </div>
              <p className="text-gray-600 text-sm mb-4">{plan.description}</p>
              <button
                className={`w-full py-2 rounded-lg mb-4 ${
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
              <div className="space-y-3">
                {plan.features.map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                   <svg width="15" height="16" viewBox="0 0 15 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M5.375 8.53125L6.96875 10.125L9.625 6.40625M13.875 8C13.875 8.83718 13.7101 9.66616 13.3897 10.4396C13.0694 11.2131 12.5998 11.9158 12.0078 12.5078C11.4158 13.0998 10.7131 13.5694 9.93961 13.8897C9.16616 14.2101 8.33718 14.375 7.5 14.375C6.66282 14.375 5.83384 14.2101 5.06039 13.8897C4.28694 13.5694 3.58417 13.0998 2.99219 12.5078C2.40022 11.9158 1.93064 11.2131 1.61027 10.4396C1.28989 9.66616 1.125 8.83718 1.125 8C1.125 6.30924 1.79665 4.68774 2.99219 3.49219C4.18774 2.29665 5.80924 1.625 7.5 1.625C9.19075 1.625 10.8123 2.29665 12.0078 3.49219C13.2033 4.68774 13.875 6.30924 13.875 8Z" stroke="#5E54FF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>

                    <span className="text-sm">{feature}</span>
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
                <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 1.5L6 6.5L11 1.5" stroke="#5A687C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>

            <div className="relative w-full sm:w-auto">
              <select className="w-full sm:w-[160px] appearance-none border border-[#E1E4EA] rounded-lg px-4 py-2 text-gray-600 text-sm bg-white pr-10">
                <option>Past 6 Months</option>
                <option>Past 3 Months</option>
                <option>Past 2 Months</option>
              </select>
              <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 1.5L6 6.5L11 1.5" stroke="#5A687C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
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
