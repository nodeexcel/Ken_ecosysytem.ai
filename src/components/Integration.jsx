import React, { useEffect, useState } from 'react'
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
import { useDispatch, useSelector } from 'react-redux';
import { getNavbarData } from '../store/navbarSlice'
import { getInstaAccounts } from '../api/brainai';
// Define the integrations data


const Integration = () => {
  const [firstRender, setFirstRender] = useState(true)
  const [integartionData, setIntegrationData] = useState({})
  const [instagramData, setInstagramData] = useState([])
  const dispatch = useDispatch();
  const userDetails = useSelector((state) => state.profile.user)
  const [loading, setLoading] = useState(true)

  const handleInstagram = async () => {
    try {

      const response = await getInstaAccounts();
      if (response?.status === 200) {
        console.log(response?.data?.insta_account_info)
        setInstagramData(response?.data?.insta_account_info);
        if (response?.data?.insta_account_info?.length === 0) {
          setLoading(false)
        }
      }

    } catch (error) {
      console.log(error)
      setLoading(false)
    }
  }

  useEffect(() => {
    if (instagramData?.length > 0) {
      setLoading(false)
    }
  }, [instagramData])

  useEffect(() => {
    handleInstagram()
  }, [])

  const integrations = [
    {
      icon: instagram,
      name: "Instagram",
      connectedAccounts: instagramData.length,
      path: import.meta.env.VITE_INSTA_URL + `&state=${userDetails.id}`,
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
      path: import.meta.env.VITE_GOOGLE_CALENDAR_URL + `&state=${userDetails.id}`,
    },
    {
      icon: whatsapp,
      name: "WhatsApp",
      connectedAccounts: 1,
      path: import.meta.env.VITE_WHATS_APP_URL + `&state=${userDetails.id}`,
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

  const handleClick = (data) => {
    dispatch(getNavbarData("integrations"))
    setFirstRender(false)
    setIntegrationData(data)
  }

  if (loading) return <p className='flex justify-center items-center h-full'><span className='loader' /></p>

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
      </> : <AdditionalIntegration setInstagramData={setInstagramData} instagramData={instagramData} integartionData={integartionData} setFirstRender={setFirstRender} />}
    </div>
  )
}

export default Integration
