import React, { useState } from 'react'
import { ChevronRight } from "lucide-react";
import instagram from '../assets/svg/instagram.svg'
import google from '../assets/svg/google.svg'
import linkedin from '../assets/svg/linkedin.svg'
import facebook from '../assets/svg/facebook.svg'
import systemio from '../assets/svg/systemio.svg'
import calendly from '../assets/svg/calendly.svg'
import google_calender from '../assets/svg/google_calender.svg'
import whatsapp from '../assets/svg/whatsapp.svg'
import active_campaign from '../assets/svg/activecampaign.svg'
import hubspot from '../assets/svg/hubspot.svg'
import mailchimp from '../assets/svg/mailchimp.svg'
import click_funnels from '../assets/svg/click-funnels.svg'
import AdditionalIntegration from './AdditionalIntegrations';
import { useDispatch } from 'react-redux';
import { getNavbarData } from '../store/navbarSlice'
// Define the integrations data
const integrations = [
  {
    icon: instagram,
    name: "Instagram",
    connectedAccounts: 1,
    path: import.meta.env.VITE_INSTA_URL
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
    connectedAccounts: 1,
  },
  {
    icon: active_campaign,
    name: "Active Campaign",
    connectedAccounts: 0,
  },
  {
    icon: hubspot,
    name: "Hubspot",
    connectedAccounts: 0,
  },
  {
    icon: mailchimp,
    name: "Mailchimp",
    connectedAccounts: 0,
  },
  {
    icon: click_funnels,
    name: "Clickfunnels",
    connectedAccounts: 0,
  },
];

const Integration = () => {
  const [firstRender, setFirstRender] = useState(true)
  const [integartionData, setIntegrationData] = useState({})
  const dispatch = useDispatch();

  const handleClick = (data) => {
    dispatch(getNavbarData("integrations"))
    setFirstRender(false)
    setIntegrationData(data)
  }
  return (
    <div className={`flex flex-col  ${firstRender ? 'py-4' : 'pb-4'}  pr-4 w-full items-start gap-6 `}>
      {firstRender ? <>
        {/* Header */}
        <header className="flex items-center justify-between w-full ">
          <h1 className="font-semibold text-[#1e1e1e] text-2xl leading-8">
            Integrations
          </h1>
        </header>

        {/* Integrations List */}
        <div className="flex flex-col px-5 py-3 items-center justify-center gap-3 w-full">
          {integrations.map((integration, index) => (
            <div
              key={index}
              onClick={() => handleClick(integration)}
              className=" w-full md:max-w-[763px] mx-auto border-[0.5px] border-solid border-[#e1e4ea] rounded-lg"
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
      </> : <AdditionalIntegration integartionData={integartionData} setFirstRender={setFirstRender} />}
    </div>
  )
}

export default Integration
