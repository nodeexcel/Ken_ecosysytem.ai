import React from 'react'
import { ChevronRight } from "lucide-react";
import instagram from '../assets/svg/instagram.svg'
import google from '../assets/svg/google.svg'
import linkedin from '../assets/svg/linkedin.svg'
import facebook from '../assets/svg/facebook.svg'
import systemio from '../assets/svg/systemio.svg'
import calendly from '../assets/svg/calendly.svg'
import google_calender from '../assets/svg/google_calender.svg'
import whatsapp from '../assets/svg/whatsapp.svg'
// Define the integrations data
const integrations = [
    {
      icon: instagram,
      name: "Instagram",
      connectedAccounts: 1,
    },
    {
      icon: google,
      name: "Google",
      connectedAccounts: 0,
    },
    {
      icon: linkedin,
      name: "LinkedIn",
      connectedAccounts: 0,
    },
    {
      icon: facebook,
      name: "Facebook",
      connectedAccounts: 0,
    },
    {
      icon: systemio,
      name: "System.io",
      connectedAccounts: 0,
    },
    {
      icon: calendly,
      name: "Calendly",
      connectedAccounts: 0,
    },
    {
      icon: google_calender,
      name: "Google Calendar",
      connectedAccounts: 0,
    },
    {
      icon: whatsapp,
      name: "WhatsApp",
      connectedAccounts: 0,
    },
  ];

const Integration = () => {
  return (
    <>
         {/* Header */}
         <header className="flex items-center justify-between w-full onest">
          <h1 className="font-semibold text-[#1e1e1e] text-2xl leading-8">
            Integrations
          </h1>
          <button className="px-5 py-[7px] bg-primary-color rounded opacity-0">
            <span className="font-medium text-white text-base leading-6">
              Add Campaign
            </span>
          </button>
        </header>

        {/* Integrations List */}
        <div className="flex flex-col py-3 items-center justify-center gap-3 w-full">
          {integrations.map((integration, index) => (
            <div
              key={index}
              className="onest w-[763.81px] border-[0.5px] border-solid border-[#e1e4ea] rounded-lg"
            >
              <div className="flex items-center justify-between p-5">
                <div className="flex items-center gap-2.5">
                  {integration.icon ? (
                    <img
                      className="w-5 h-5"
                      alt={integration.name}
                      src={integration.icon}
                    />
                  ) : (
                    <div className="w-5 h-5 bg-[url(${integration.iconBg})] bg-[100%_100%]" />
                  )}
                  <span className="font-medium text-[#1E1E1E] text-base leading-5">
                    {integration.name}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-[#5A687C] text-base leading-5">
                    {integration.connectedAccounts} connected account
                  </span>
                  <ChevronRight className="w-5 h-5" color='#5A687C' />
                </div>
              </div>
            </div>
          ))}
        </div>
    </>
  )
}

export default Integration
