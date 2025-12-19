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
import tiktok from '../assets/svg/tiktok.png'
import AdditionalIntegration from './AdditionalIntegrations';
import { useDispatch, useSelector } from 'react-redux';
import { getNavbarData } from '../store/navbarSlice'
import { getGoogleCalendarAccounts, getInstaAccounts, getLinkedInAccounts, getWhatsappAccounts, getTikTokAccounts } from '../api/brainai';


const Integration = ({ firstRender, setFirstRender }) => {
  const navbarDetails = useSelector((state) => state.navbar)
  const [integartionData, setIntegrationData] = useState({})
  const [instagramData, setInstagramData] = useState([])
  const [whatsappData, setWhatsappData] = useState([])
  const [googleCalendarData, setGoogleCalendarData] = useState([])
  const [linkedInData, setLinkedInData] = useState([])
  const [tikTokData, setTikTokData] = useState([])
  const dispatch = useDispatch();
  const userDetails = useSelector((state) => state.profile.user)
  const [loading, setLoading] = useState({
  instagram: true,
  whatsapp: true,
  google_calendar: true,
  linkedin: true,
  tiktok: true,
})


  const handleInstagram = async () => {
    try {

      const response = await getInstaAccounts();
      if (response?.status === 200) {
        console.log(response?.data?.insta_account_info)
        setInstagramData(response?.data?.insta_account_info);
        if (response?.data?.insta_account_info?.length === 0) {
          setLoading((prev) => ({
            ...prev, instagram: false
          }))
        }
      }

    } catch (error) {
      console.log(error)
      setLoading((prev) => ({
        ...prev, instagram: false
      }))
    }
  }

  const handleLinkedIn = async () => {
    try {

      const response = await getLinkedInAccounts();
      if (response?.status === 200) {
        console.log(response?.data?.linkedin_account_info)
        setLinkedInData(response?.data?.linkedin_account_info);
        if (response?.data?.linkedin_account_info?.length === 0) {
          setLoading((prev) => ({
            ...prev, linkedin: false
          }))
        }
      }

    } catch (error) {
      console.log(error)
      setLoading((prev) => ({
        ...prev, linkedin: false
      }))
    }
  }

  const handleWhatsapp = async () => {
    try {

      const response = await getWhatsappAccounts();
      if (response?.status === 200) {
        console.log(response?.data?.whatsapp_account_info)
        setWhatsappData(response?.data?.whatsapp_account_info);
        if (response?.data?.whatsapp_account_info?.length === 0) {
          setLoading((prev) => ({
            ...prev, whatsapp: false
          }))
        }
      }

    } catch (error) {
      console.log(error)
      setLoading((prev) => ({
        ...prev, whatsapp: false
      }))
    }
  }

  const handleTikTok = async () => {
    try {

      const response = await getTikTokAccounts();
      if (response?.status === 200) {
        console.log(response?.data?.tiktok_account_info)
        setTikTokData(response?.data?.tiktok_account_info);
        if (response?.data?.tiktok_account_info?.length === 0) {
          setLoading((prev) => ({
            ...prev, tiktok: false
          }))
        }
      }

    } catch (error) {
      console.log(error)
      setLoading((prev) => ({
        ...prev, tiktok: false
      }))
    }
  }


  const handleGoogleCalender = async () => {
    try {
      const response = await getGoogleCalendarAccounts();
      if (response?.status === 200) {
        console.log(response?.data?.google_calendar_info)
        setGoogleCalendarData(response?.data?.google_calendar_info);
        if (response?.data?.google_calendar_info?.length === 0) {
          setLoading((prev) => ({
            ...prev, google_calendar: false
          }))
        }
      }

    } catch (error) {
      console.log(error)
      setLoading((prev) => ({
        ...prev, google_calendar: false
      }))
    }
  }

  useEffect(() => {
    if (instagramData?.length > 0) {
      setLoading((prev) => ({
        ...prev, instagram: false
      }))
    }
    if (whatsappData?.length > 0) {
      setLoading((prev) => ({
        ...prev, whatsapp: false
      }))
    }
    if (tikTokData?.length > 0) {
  setLoading((prev) => ({
    ...prev, tiktok: false
  }))
}
  }, [instagramData, whatsappData, tikTokData])

  useEffect(() => {
    handleInstagram()
    handleWhatsapp()
    handleGoogleCalender()
    handleLinkedIn()
    handleTikTok()
  }, [])

  const integrations = [
    {
      icon: instagram,
      name: "Instagram",
      description: "It works with only professional and creator account.",
      connectedAccounts: instagramData?.length,
      path: import.meta.env.VITE_INSTA_URL + `&state=${userDetails.id}`,
      isActive: true,
    },
    {
      icon: whatsapp,
      name: "WhatsApp",
      description: "Only possible with a WhatsApp Business Account.",
      connectedAccounts: whatsappData?.length,
      path: import.meta.env.VITE_WHATS_APP_URL + `&state=${userDetails.id}`,
      isActive: true,
    },
    {
      icon: tiktok,
      name: "TikTok",
      description: "Using regular TikTok account.",
      connectedAccounts: tikTokData?.length,
      path:  import.meta.env.VITE_TIK_TOK_URL + `&state=${userDetails.id}`,
      isActive: true,
    },
    {
      icon: linkedin,
      name: "LinkedIn",
      description: "Using regular linkedin account.",
      connectedAccounts: linkedInData?.length,
      path: import.meta.env.VITE_LINKEDIN_URL + `&state=${userDetails.id}`,
      isActive: true,
    },
    {
      icon: google_calender,
      name: "Google Calendar",
      description: "Using regular Google Calendar account.",
      connectedAccounts: googleCalendarData?.length,
      path: import.meta.env.VITE_GOOGLE_CALENDAR_URL + `&state=${userDetails.id}`,
      isActive: true,
    },
    {
      icon: google,
      name: "Google",
      description: "Using regular google account.",
      connectedAccounts: 0,
      isActive: false,
    },
    {
      icon: facebook,
      name: "Facebook",
      description: "Using regular facebook account.",
      connectedAccounts: 0,
      isActive: false,
    },
    {
      icon: systemio,
      name: "Systeme.io",
      description: "Using regular systeme account.",
      connectedAccounts: 0,
      isActive: false,
    },
    {
      icon: calendly,
      name: "Calendly",
      description: "Using regular Calendly account.",
      connectedAccounts: 0,
      isActive: false,
    },
    {
      icon: active_campaign,
      name: "Active Campaign",
      description: "Using regular ActiveCampaign account.",
      connectedAccounts: 0,
      isActive: false,
    },
    {
      icon: hubspot,
      name: "Hubspot",
      description: "Using regular Hubspot account.",
      connectedAccounts: 0,
      isActive: false,
    },
    {
      icon: mailchimp,
      name: "Mailchimp",
      description: "Using regular Mailchimp account.",
      connectedAccounts: 0,
      isActive: false,
    },

  ];

  const handleClick = (data) => {
    dispatch(getNavbarData("integrations"))
    setFirstRender(false)
    setIntegrationData(data)
    // Save to localStorage to persist across tab switches
    localStorage.setItem('selectedIntegration', JSON.stringify(data))
  }

  // Reset to list view when switching back to integration tab from another tab
  useEffect(() => {
    if (firstRender) {
      // Clear saved integration and reset state when firstRender is true
      localStorage.removeItem('selectedIntegration')
      setIntegrationData({})
    }
  }, [firstRender])

  // Ensure navbar/sidebar stays visible when navigating into a specific integration
  useEffect(() => {
    if (!firstRender) {
      dispatch(getNavbarData("integrations"))
    }
  }, [firstRender, dispatch])

  if (loading.whatsapp && loading.instagram) return (
    <div className='fixed inset-0 flex justify-end items-center pr-[40%]'>
      <span className='loader' />
    </div>
  )

  // Determine if we should show the list or detail view
  const shouldShowList = firstRender || !integartionData || Object.keys(integartionData).length === 0

  return (
    <div className={`flex flex-col  ${shouldShowList ? 'py-13 px-7' : 'pb-4 pr-0'} w-full items-start gap-6 `}>
      {shouldShowList ? <>
        {/* Header */}
        <header className="flex items-center justify-between w-full ">
          <h1 className="font-semibold text-[#1e1e1e] text-2xl leading-8 px-5">
            Integration
          </h1>
        </header>

        {/* Integrations List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-5 py-3 w-full">
          {integrations.map((integration, index) => (
            <div
              key={index}
              onClick={() => integration.isActive && handleClick(integration)}
              className={`relative bg-white border-[0.5px] border-solid border-[#e1e4ea] rounded-2xl ${
                integration.isActive 
                  ? 'cursor-pointer hover:opacity-80' 
                  : 'cursor-not-allowed opacity-70'
              }`}
            >
              <div className="flex items-center justify-between p-5">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  {integration.icon ? (
                    <img
                      loading='lazy'
                      className="w-10 h-10 flex-shrink-0 rounded-lg"
                      alt={integration.name}
                      src={integration.icon}
                    />
                  ) : (
                    <div className="w-10 h-10 bg-[url(${integration.iconBg})] bg-[100%_100%] flex-shrink-0 rounded-lg" />
                  )}
                  <div className="flex flex-col gap-1 flex-1 min-w-0">
                    <span className={`font-semibold text-base leading-tight ${
                      integration.isActive ? 'text-[#1E1E1E]' : 'text-[#9CA3AF]'
                    }`}>
                    {integration.name}
                  </span>
                    <span className={`text-sm leading-tight ${
                      integration.isActive ? 'text-[#5A687C]' : 'text-[#9CA3AF]'
                    }`}>
                      {integration.description}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0 ml-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                    integration.isActive ? 'bg-[#F3F4F6]' : 'bg-[#E5E7EB]'
                  }`}>
                    <span className={`font-medium text-sm ${
                      integration.isActive ? 'text-[#1E1E1E]' : 'text-[#9CA3AF]'
                    }`}>
                      {integration.connectedAccounts}
                  </span>
                  </div>
                  <ChevronRight className="w-5 h-5 flex-shrink-0" color={integration.isActive ? '#5A687C' : '#9CA3AF'} />
                </div>
              </div>
              {!integration.isActive && (
                <div className="absolute inset-0 flex items-center justify-end pr-25 rounded-2xl">
                  <span className="font-semibold text-[#9CA3AF] text-base">
                    Coming soon
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </> : <AdditionalIntegration
        setInstagramData={setInstagramData}
        instagramData={instagramData}
        integartionData={integartionData}
        setFirstRender={setFirstRender}
        whatsappData={whatsappData}
        setWhatsappData={setWhatsappData}
        googleCalendarData={googleCalendarData}
        setGoogleCalendarData={setGoogleCalendarData}
        linkedInData={linkedInData}
        setLinkedInData={setLinkedInData}
        tikTokData={tikTokData}
        setTikTokData={setTikTokData}
      />}
    </div>
  )
}

export default Integration

