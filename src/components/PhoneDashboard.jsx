import { Plus } from 'lucide-react'
import React, { useState } from 'react'

const PhoneDashboard = () => {

  const [autoRefill, setAutoRefill] = useState(true);
  return (

    <div className="py-4 pr-2 flex flex-col gap-4 w-full h-screen overflow-auto">
      <h1 className="text-2xl font-bold mb-3 text-gray-800">Dashboard</h1>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Credit Panel */}
        <div className="w-full lg:w-[360px] rounded-lg border border-[#E1E4EA] bg-white  flex flex-col justify-between">

          <div className="flex items-center justify-between bg-[#F1F1FF] px-5 py-4 rounded-t-lg">
            <h2 className="font-[400] text-[14px] text-[#1E1E1E]">Credit</h2>
            <button className="bg-[#675FFF] border border-[#5F58E8] text-white text-sm font-medium px-4 py-2 rounded-lg flex items-center  gap-1">
              <Plus size={16} />
              Add Credit
            </button>
          </div>

          <div className="p-6">
            <h3 className="text-5xl font-bold mb-2">$0</h3>
            <p className="text-black mb-6 font-[500]">Credit 0.20$/mnt</p>

            <div className="flex items-center justify-between">
              <span className="text-sm text-[#1E1E1E]">Auto-refill is</span>
              <div className="flex items-center gap-2">
                <span className={`text-xs px-2 py-1 rounded-full ${autoRefill ? "bg-green-100 text-green-600" : "bg-gray-200 text-gray-500"
                  }`}>
                  {autoRefill ? "Active" : "Inactive"}
                </span>
                <button
                  onClick={() => setAutoRefill(!autoRefill)}
                  className={`w-10 h-6 rounded-full flex items-center px-1 transition-colors duration-300 ${autoRefill ? "bg-indigo-500" : "bg-gray-300"
                    }`}
                >
                  <div
                    className={`w-4 h-4 bg-white rounded-full shadow transform transition-transform duration-300 ${autoRefill ? "translate-x-4" : "translate-x-0"
                      }`}
                  ></div>
                </button>
              </div>
            </div>
          </div>


        </div>

        {/* Stat Cards */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Agents */}
          <div className="rounded-lg border border-[#E1E4EA] bg-white p-4 flex  flex-col gap-1">
            <div className="flex w-10 h-10  justify-center border boarder-2 border-[#E1E4EA] rounded-[10px] p-2">
              <svg width="17" height="22" viewBox="0 0 17 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12.078 5C12.078 5.99456 11.6829 6.94839 10.9796 7.65165C10.2764 8.35491 9.32254 8.75 8.32798 8.75C7.33342 8.75 6.37959 8.35491 5.67633 7.65165C4.97307 6.94839 4.57798 5.99456 4.57798 5C4.57798 4.00544 4.97307 3.05161 5.67633 2.34835C6.37959 1.64509 7.33342 1.25 8.32798 1.25C9.32254 1.25 10.2764 1.64509 10.9796 2.34835C11.6829 3.05161 12.078 4.00544 12.078 5ZM0.828979 19.118C0.861114 17.1504 1.66532 15.2742 3.06816 13.894C4.471 12.5139 6.36007 11.7405 8.32798 11.7405C10.2959 11.7405 12.185 12.5139 13.5878 13.894C14.9906 15.2742 15.7948 17.1504 15.827 19.118C13.4744 20.1968 10.9161 20.7535 8.32798 20.75C5.65198 20.75 3.11198 20.166 0.828979 19.118Z" stroke="#675FFF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold">1</h3>
            <p className="text-[#1E1E1E]">Agent</p>
            <p className="text-sm text-gray-500">You have 1 agent active now</p>
            <a href="#" className="text-[#675FFF] mt-2 inline-block text-sm font-[400] underline">See More</a>
          </div>

          {/* Campaigns */}
          <div className="rounded-lg border border-[#E1E4EA] bg-white p-4 flex  flex-col gap-1">
            <div className="flex w-10 h-10 items-center justify-center border boarder-2 border-[#E1E4EA] rounded-[10px] p-2">
              <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M11.168 15.84C10.48 15.78 9.782 15.75 9.078 15.75H8.328C7.13453 15.75 5.98994 15.2759 5.14602 14.432C4.30211 13.5881 3.828 12.4435 3.828 11.25C3.828 10.0565 4.30211 8.91193 5.14602 8.06802C5.98994 7.22411 7.13453 6.75 8.328 6.75H9.078C9.782 6.75 10.48 6.72 11.168 6.66M11.168 15.84C11.421 16.802 11.752 17.732 12.153 18.623C12.4 19.173 12.213 19.833 11.69 20.134L11.033 20.514C10.482 20.832 9.773 20.631 9.506 20.053C8.87229 18.682 8.38946 17.2463 8.066 15.771M11.168 15.84C10.775 14.3417 10.5767 12.799 10.578 11.25C10.578 9.664 10.783 8.126 11.168 6.66M11.168 15.84C14.2495 16.1041 17.2502 16.9651 20.003 18.375M11.168 6.66C14.2495 6.39592 17.2503 5.53493 20.003 4.125M20.003 18.375C19.885 18.755 19.758 19.129 19.623 19.5M20.003 18.375C20.547 16.6216 20.8872 14.8113 21.017 12.98M20.003 4.125C19.8857 3.74689 19.759 3.37177 19.623 3M20.003 4.125C20.547 5.87844 20.8872 7.6887 21.017 9.52M21.017 9.52C21.512 9.933 21.828 10.555 21.828 11.25C21.828 11.945 21.512 12.567 21.017 12.98M21.017 9.52C21.0991 10.6719 21.0991 11.8281 21.017 12.98" stroke="#3D4BEB" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
              </svg>

            </div>


            <h3 className="text-2xl font-bold">0</h3>
            <p className="text-[#1E1E1E]">Campaigns</p>
            <p className="text-sm text-gray-500">You don’t have campaigns yet</p>
            <a href="#" className="text-[#675FFF] mt-2 inline-block text-sm font-[400] underline">See More</a>
          </div>

          {/* Called Clients */}
          <div className="rounded-lg border border-[#E1E4EA] bg-white p-4 flex  flex-col gap-1">


            <div className="flex w-10 h-10  justify-center border boarder-2 border-[#E1E4EA] rounded-[10px] p-2">
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1.578 5.75C1.578 14.034 8.294 20.75 16.578 20.75H18.828C19.4247 20.75 19.997 20.5129 20.419 20.091C20.8409 19.669 21.078 19.0967 21.078 18.5V17.128C21.078 16.612 20.727 16.162 20.226 16.037L15.803 14.931C15.363 14.821 14.901 14.986 14.63 15.348L13.66 16.641C13.378 17.017 12.891 17.183 12.45 17.021C10.8129 16.4191 9.32616 15.4686 8.09278 14.2352C6.85941 13.0018 5.90888 11.5151 5.307 9.878C5.145 9.437 5.311 8.95 5.687 8.668L6.98 7.698C7.343 7.427 7.507 6.964 7.397 6.525L6.291 2.102C6.23014 1.85869 6.08972 1.6427 5.89206 1.48834C5.69439 1.33397 5.45081 1.25008 5.2 1.25H3.828C3.23127 1.25 2.65897 1.48705 2.23701 1.90901C1.81506 2.33097 1.578 2.90326 1.578 3.5V5.75Z" stroke="#F60C9D" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold">0</h3>
            <p className="text-[#1E1E1E]">Called clients</p>
            <p className="text-sm text-gray-500">You don’t have calls yet</p>
            <a href="#" className="text-[#675FFF] mt-2 inline-block text-sm font-[400] underline">See More</a>
          </div>

          {/* Average Call Duration */}
          <div className="rounded-lg border border-[#E1E4EA] bg-white p-4 flex  flex-col gap-1">
            <div className="flex w-10 h-10  justify-center border boarder-2 border-[#E1E4EA] rounded-[10px] p-2">
              <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12.828 6V12H17.328M21.828 12C21.828 13.1819 21.5952 14.3522 21.1429 15.4442C20.6906 16.5361 20.0277 17.5282 19.192 18.364C18.3562 19.1997 17.3641 19.8626 16.2722 20.3149C15.1802 20.7672 14.0099 21 12.828 21C11.6461 21 10.4758 20.7672 9.38385 20.3149C8.29192 19.8626 7.29977 19.1997 6.46404 18.364C5.62831 17.5282 4.96538 16.5361 4.51309 15.4442C4.06079 14.3522 3.828 13.1819 3.828 12C3.828 9.61305 4.77621 7.32387 6.46404 5.63604C8.15187 3.94821 10.4411 3 12.828 3C15.215 3 17.5041 3.94821 19.192 5.63604C20.8798 7.32387 21.828 9.61305 21.828 12Z" stroke="#109972" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
              </svg>

            </div>
            <h3 className="text-2xl font-bold">00:00:00</h3>
            <p className="text-[#1E1E1E]">Average call duration</p>
            <p className="text-sm text-gray-500">You don’t have calls yet</p>
            <a href="#" className="text-[#675FFF] mt-2 inline-block text-sm font-[400] underline">See More</a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PhoneDashboard
