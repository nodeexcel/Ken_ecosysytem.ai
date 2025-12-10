
import { useState, useEffect, useRef } from "react"
import Contacts from "../../components/Contacts"
import Knowledge from "../../components/Knowledge"
import Integration from "../../components/Integration"
import { LeftArrow } from "../../icons/icons"
import integrationSvg from "../../assets/svg/Integration.svg"
import userBrainSvg from "../../assets/svg/UserBrain.svg"
import knowledgeBookSvg from "../../assets/svg/KnowledgeBook.svg"
import { useSelector } from "react-redux"
import { useNavigate, useSearchParams } from "react-router-dom"
import { CheckCircle, XCircle, Instagram, ArrowRight, RefreshCw, X } from "lucide-react"
import { useTranslation } from "react-i18next";
import { BsThreeDots } from "react-icons/bs"

const BrainAI = () => {
  const navigate = useNavigate()
  const navbarDetails = useSelector((state) => state.navbar)
  const [searchParams, setSearchParams] = useSearchParams()
  const { t } = useTranslation();
  
  // Get tab from URL or default to "contacts"
  const tabFromUrl = searchParams.get('tab') || 'contacts'
  const [activePath, setActivePath] = useState(tabFromUrl)
  const [showModal, setShowModal] = useState(true)
  const [sidebarStatus, setSideBarStatus] = useState(false)
  const [firstRender, setFirstRender] = useState(true)
  const prevTabRef = useRef(tabFromUrl)

  // Sync activePath with URL param
  useEffect(() => {
    const tabFromUrl = searchParams.get('tab') || 'contacts'
    if (tabFromUrl && ['contacts', 'knowledge', 'integration'].includes(tabFromUrl)) {
      const prevTab = prevTabRef.current
      setActivePath(tabFromUrl)
      
      // Reset firstRender when switching to integration tab from another tab
      if (tabFromUrl === 'integration' && prevTab !== 'integration') {
        setFirstRender(true)
        // Clear saved integration when switching back to integration tab
        localStorage.removeItem('selectedIntegration')
      }
      
      prevTabRef.current = tabFromUrl
    }
  }, [searchParams])


  const IntegrationIcon = ({ isActive, isHover }) => {
    const color = isActive ? "#2563eb" : isHover ? "#1E1E1E" : "#5A687C"
    return (
      <img 
        src={integrationSvg} 
        alt="Integration" 
        className="w-4 h-4" 
        style={{ 
          filter: isActive 
            ? "brightness(0) saturate(100%) invert(27%) sepia(96%) saturate(7482%) hue-rotate(245deg) brightness(98%) contrast(96%)" 
            : isHover 
            ? "brightness(0) saturate(100%) invert(8%) sepia(4%) saturate(0%) hue-rotate(0deg) brightness(100%) contrast(100%)"
            : "brightness(0) saturate(100%) invert(38%) sepia(6%) saturate(1000%) hue-rotate(180deg) brightness(95%) contrast(88%)"
        }} 
      />
    )
  }

  const ContactsIcon = ({ isActive, isHover }) => {
    return (
      <img
        src={userBrainSvg}
        alt="Contacts"
        className="w-4 h-4"
        style={{
          filter: isActive
            ? "brightness(0) saturate(100%) invert(30%) sepia(96%) saturate(2291%) hue-rotate(221deg) brightness(92%) contrast(99%)"
            : isHover
            ? "brightness(0) saturate(100%) invert(8%) sepia(4%) saturate(0%) hue-rotate(0deg) brightness(100%) contrast(100%)"
            : "brightness(0) saturate(100%) invert(38%) sepia(6%) saturate(1000%) hue-rotate(180deg) brightness(95%) contrast(88%)"
        }}
      />
    )
  }

  const KnowledgeIconLocal = ({ isActive, isHover }) => {
    return (
      <img
        src={knowledgeBookSvg}
        alt="Knowledge"
        className="w-4 h-4"
        style={{
          filter: isActive
            ? "brightness(0) saturate(100%) invert(30%) sepia(96%) saturate(2291%) hue-rotate(221deg) brightness(92%) contrast(99%)"
            : isHover
            ? "brightness(0) saturate(100%) invert(8%) sepia(4%) saturate(0%) hue-rotate(0deg) brightness(100%) contrast(100%)"
            : "brightness(0) saturate(100%) invert(38%) sepia(6%) saturate(1000%) hue-rotate(180deg) brightness(95%) contrast(88%)"
        }}
      />
    )
  }

  const sideMenuItems = [
    { label: `${t("contacts")}`, icon: <ContactsIcon isActive={activePath == "contacts"} />, hoverIcon: <ContactsIcon isHover={true} />, path: "contacts" },
    { label: `${t("knowledge")}`, icon: <KnowledgeIconLocal isActive={activePath == "knowledge"} />, hoverIcon: <KnowledgeIconLocal isHover={true} />, path: "knowledge" },
    { label: `${t("integration")}`, icon: <IntegrationIcon isActive={activePath == "integration"} />, hoverIcon: <IntegrationIcon isHover={true} />, path: "integration" },
  ]

  const renderMainContent = () => {
    switch (activePath) {
      case "knowledge":
        return <Knowledge />
      case "integration":
        return <Integration setFirstRender={setFirstRender} firstRender={firstRender} />
      default:
        return <Contacts />
    }
  }

  const InstagramStatus = () => {
    // Get the status from URL parameters
    const status = searchParams.get("status")

    // Don't render modal if no status parameter or modal is closed
    if (!status || !showModal) {
      return null
    }

    const handleCloseModal = () => {
      setShowModal(false)
      // Remove status parameter from URL
      searchParams.delete("status")
      setSearchParams(searchParams)
    }

    // Success state content
    const renderSuccessContent = () => (
      <div className="w-full max-w-md bg-white rounded-xl shadow-2xl border-0 overflow-hidden relative">
        {/* Close Button */}
        <button
          onClick={handleCloseModal}
          className="absolute top-4 right-4 z-10 p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>

        {/* Header */}
        <div className="text-center space-y-4 p-6 pb-2">
          <div className="mx-auto w-20 h-20 bg-gradient-to-tr from-purple-500 via-pink-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
            <Instagram className="w-10 h-10 text-white" />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-center gap-2">
              <CheckCircle className="w-6 h-6 text-green-500" />
              <h1 className="text-2xl font-bold text-gray-900">Successfully Connected!</h1>
            </div>
            <p className="text-gray-600">
              Your Instagram account has been linked successfully. You can now access all Instagram features.
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-6 p-6">
          <div className="bg-gradient-to-r from-purple-100 via-pink-100 to-orange-100 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-tr from-purple-500 via-pink-500 to-orange-500 rounded-full flex items-center justify-center">
                <Instagram className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">@your_instagram_handle</h3>
                <p className="text-sm text-gray-600">Connected just now</p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={handleCloseModal}
              className="w-full bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 hover:from-purple-600 hover:via-pink-600 hover:to-orange-600 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
            >
              <ArrowRight className="w-4 h-4" />
              Continue
            </button>
          </div>

          <div className="text-center pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              Need help?{" "}
              <a href="#" className="text-purple-600 hover:underline">
                Contact Support
              </a>
            </p>
          </div>
        </div>
      </div>
    )

    // Error state content
    const renderErrorContent = () => (
      <div className="w-full max-w-md bg-white rounded-xl shadow-2xl border-0 overflow-hidden relative">
        {/* Close Button */}
        <button
          onClick={handleCloseModal}
          className="absolute top-4 right-4 z-10 p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>

        {/* Header */}
        <div className="text-center space-y-4 p-6 pb-2">
          <div className="mx-auto w-20 h-20 bg-gray-200 rounded-2xl flex items-center justify-center shadow-lg">
            <Instagram className="w-10 h-10 text-gray-500" />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-center gap-2">
              <XCircle className="w-6 h-6 text-red-500" />
              <h1 className="text-2xl font-bold text-gray-900">Connection Failed</h1>
            </div>
            <p className="text-gray-600">
              We couldn't connect to your Instagram account. Please try again or contact support.
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-6 p-6">
          <div className="bg-gray-100 rounded-lg p-4">
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900">Possible reasons:</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span>Instagram authentication expired</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span>Permission was denied</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span>Network connection issue</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {/* <button className="w-full bg-gray-800 hover:bg-gray-900 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2">
              <RefreshCw className="w-4 h-4" />
              Try Again
            </button> */}

            <button
              onClick={handleCloseModal}
              className="w-full py-2 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    )

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4  bg-opacity-50 bg-transparent">
        <div className="relative">{status === "success" ? renderSuccessContent() : renderErrorContent()}</div>
      </div>
    )
  }

  return (
    <div className="h-full w-full relative">
      <div className="lg:hidden flex absolute top-4 right-4 z-[9999] cursor-pointer" onClick={() => setSideBarStatus(true)} ><BsThreeDots size={24} color='#1e1e1e' /></div>
      <div className="flex h-screen flex-col md:flex-row items-start gap-8 relative w-full">
        {/* Sidebar */}
          <div className="lg:flex hidden flex-col bg-white gap-8 border border-[#D6D6D6]
    min-w-[272px] h-[calc(100vh-89px)] mt-2 rounded-r-2xl rounded-tl-none rounded-bl-none fixed overflow-y-auto">

            <div className="">
              <div
                className="flex justify-between items-center cursor-pointer w-fit"
                onClick={() => navigate("/dashboard")}
              >
                <div className="flex gap-4 pl-4 items-center h-[57px]">
                  {/* <LeftArrow /> */}
                  <h1 className="text-[20px] font-[600]">Brain AI</h1>
                </div>
              </div>
              <hr className="text-[#E1E4EA] px-6"  />
            </div>
            <div className="flex flex-col w-full items-start gap-2 px-3">
              {sideMenuItems.map((item, i) => {
                const Icon = item.icon
                const hoverIcon = item.hoverIcon
                const isActive = activePath === item.path

                return (
                  <button
                    key={i}
                    onClick={() => {
                      setActivePath(item.path);
                      setSearchParams({ tab: item.path }, { replace: true });
                    }}
                    className={`cursor-pointer group flex items-center justify-start gap-1.5 px-2 py-2 w-full h-auto rounded-2xl ${isActive ? "bg-[#F0EFFF] text-blue-600" : "text-[#5A687C] hover:bg-[#F9F8FF]"
                      }`}
                  >
                    {isActive ? Icon
                      : <div className="flex items-center gap-2"><div className='group-hover:hidden'>{Icon}</div> <div className='hidden group-hover:block'>{hoverIcon}</div></div>
                    }
                    <span className={`font-[400] text-[16px] ${isActive ? "text-blue-600" : "text-[#5A687C] group-hover:text-[#1E1E1E]"}`}>
                      {item.label}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

        {/* Instagram Status Modal */}
        <InstagramStatus />

        {/* Main Content */}
        <div className="w-full lg:ml-[280px] overflow-hidden pr-0 py-8 pl-3 lg:pl-0 lg:pr-4 lg:py-3">
  {renderMainContent()}
</div>

      </div>
      {sidebarStatus && (
        <div className="lg:hidden fixed inset-0 bg-black/20 flex items-end z-50">
          <div className="flex flex-col relative bg-white gap-8 w-full max-h-[80%] overflow-auto py-8 rounded-t-[20px]">
            <button
              className="absolute top-4 cursor-pointer right-4 text-[#1e1e1e]"
              onClick={() => {
                setSideBarStatus(false)
              }}
            >
              <X size={20} />
            </button>
            <div className="">
              <div
                className="flex justify-center items-center cursor-pointer"
                onClick={() => navigate("/dashboard")}
              >
                <div className="flex gap-4 pl-3 items-center h-[57px]">
                  {/* <LeftArrow /> */}
                  <h1 className="text-[20px] font-[600]">Brain AI</h1>
                </div>
              </div>
              <hr className="text-[#E1E4EA]" />
            </div>
            <div className="flex flex-col w-full items-start gap-2 px-5">
              {sideMenuItems.map((item, i) => {
                const Icon = item.icon
                const hoverIcon = item.hoverIcon
                const isActive = activePath === item.path

                return (
                  <button
                    key={i}
                    onClick={() => {
                      setActivePath(item.path);
                      setSearchParams({ tab: item.path }, { replace: true });
                      setSideBarStatus(false)
                    }}
                    className={`cursor-pointer group flex items-center justify-start gap-1.5 px-2 py-2 w-full h-auto rounded ${isActive ? "bg-[#F0EFFF] text-blue-600" : "text-[#5A687C] hover:bg-[#F9F8FF]"
                      }`}
                  >
                    {isActive ? Icon
                      : <div className="flex items-center gap-2"><div className='group-hover:hidden'>{Icon}</div> <div className='hidden group-hover:block'>{hoverIcon}</div></div>
                    }
                    <span className={`font-[400] text-[16px] ${isActive ? "text-blue-600" : "text-[#5A687C] group-hover:text-[#1E1E1E]"}`}>
                      {item.label}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default BrainAI
