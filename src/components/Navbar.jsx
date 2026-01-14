import React, { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { logoutState } from '../store/authSlice';
import { discardData } from '../store/profileSlice';
import { getNavbarData } from '../store/navbarSlice';
import { discardSkillsData } from '../store/agentSkillsSlice';
import { logout } from '../api/auth';
import { SearchIcon } from '../icons/icons';
import logo from '../assets/images/dashboard_logo.png'
import person from '../assets/images/person.svg'
import Ecosystem from '../assets/images/ecosysteme.ai_logo.png'
import { useTranslation } from "react-i18next"

function Navbar({ sidebarItems }) {
    const { t } = useTranslation()
    const location = useLocation()
    const navigate = useNavigate();
    const [searchParams] = useSearchParams()
    const dispatch = useDispatch()
    const [showUserMenu, setShowUserMenu] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const userMenuRef = useRef(null)
    
    // Add theme state to track current theme for React re-renders
    const [theme, setTheme] = useState(() => {
        const html = document.documentElement;
        return html.getAttribute("data-theme") || "light";
    })

    const navbarDetails = useSelector((state) => state.navbar)
    const userDetails = useSelector((state) => state.profile.user)

    // Close user menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
                setShowUserMenu(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    // Keyboard shortcut for focusing search (Cmd/Ctrl + S)
    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 's') {
                e.preventDefault()
                document.getElementById('navbar-search')?.focus()
            }
        }
        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [])

    const handleLogout = async () => {
        const response = await logout()
        if (response?.data?.success) {
            navigate("/")
        }
        localStorage.clear()
        dispatch(logoutState())
        dispatch(discardData())
        setShowUserMenu(false)
    }

    const handleLogoClick = () => {
        dispatch(getNavbarData("Home"))
        dispatch(discardSkillsData())
        navigate("/dashboard")
    }

    const toggleTheme = () => {
        const html = document.documentElement;
        const isDark = html.getAttribute("data-theme") === "dark";
        const newTheme = isDark ? "light" : "dark";

        console.log(isDark);

        html.setAttribute("data-theme", newTheme);
        setTheme(newTheme); // Update React state to trigger re-render
    };


    // breadcrumbs (dynamic)
    const buildBreadcrumbs = () => {
        const paths = location.pathname.split('/').filter(Boolean)
        const breadcrumbs = []
        const searchParams = new URLSearchParams(location.search)
        const view = searchParams.get('view')
        const tab = searchParams.get('tab')

        const routeMap = {
            'dashboard': t("ai_agents"),
            'appointment-setter': 'Seth',
            'phone': 'Rebecca',
            'campaigns': 'Emile',
            'coo': 'Tara',
            'content-creation': 'Constance',
            'accounting': 'Accounting',
            'hr': 'HR',
            'seo': 'GEO',
            'customer-support': 'Calina',
            'ken': 'Ken',
            'brain': t("brain_ai.brain_ai"),
            'settings': t("settings.label"),
            'notification': t("notification"),
            'skills': t("skills"),
            'support': t("support"),
            'community': t("community"),
            'documentation': t("documentation"),
            'manage-plan': t("manage-plan")
        }

        const agentNameMap = {
            'appointment-setter': 'Seth',
            'phone': 'Rebecca',
            'campaigns': 'Emile',
            'coo': 'Tara',
            'content-creation': 'Constance',
            'customer-support': 'Calina',
            'ken': 'Ken'
        }

        // Tab name mapping for Constance (matching actual URL params)
        const constanceTabMap = {
            'chat': 'Chat',
            'creation_studio': t("creation_studio") || 'Creation Studio',
            'scheduler': 'Scheduler',
            'youtube': t("youtube_script_writer") || 'YouTube Script Writer',
            'linkedin': t("linkedin_nuke") || 'LinkedIn Nuke',
            'x_post': t("x_post_generator") || 'X Post Generator'
        }

        // Tab name mapping for Rebecca (Phone outreach) - matches Phone.jsx sideMenuList paths
        const phoneTabMap = {
            'dashboard': t("dashboard"),
            'phone-numbers': t("phone_numbers"),
            'call-agents': t("call_agents"),
            'call-campaigns': t("call_campaigns"),
            'outbound-calls': t("outbound_calls"),
            'inbound-calls': t("inbound_calls"),
        }

        // Tab name mapping for Brain AI - matches Brain.jsx sideMenuItems paths
        const brainTabMap = {
            'contacts': t("contacts"),
            'knowledge': t("knowledge"),
            'integration': t("integration"),
        }

        // Tab name mapping for Settings - matches Settings.jsx tabs
        const settingsTabMap = {
            'my-profile': t("my_profile"),
            'general': t("general_settings"),
            'billing': t("plan_billing"),
            'team': t("team_members"),
            'transaction-history': t("transaction_history"),
        }

        // Tab name mapping for GEO (SEO) - matches Seo.jsx sideMenuList paths
        const geoTabMap = {
            'product': t("product"),
            'articles': t("dashboard"),
            'audit': t("seo.seo_audit"),
            'automation': t("seo.start_seo_automation"),
        }

        // Analytics tab map under GEO
        const geoAnalyticsTabMap = {
            'citation-analytics': t("seo.citation_analytics"),
            'prompt-analytics': t("seo.prompt_analytics"),
            'content-analytics': t("seo.content_analytics"),
        }

        // Tab name mapping for Seth (Appointment Setter) - matches AppointmentSetter.jsx sideMenuList paths
        const sethTabMap = {
            'agents': t("agents"),
            'conversations': t("conversation"),
            'analytics': t("analytics"),
        }

        // Tab name mapping for Calina (Customer Support) - matches CustomerSupport.jsx sideMenuList paths
        const calinaTabMap = {
            'chat': 'Chat',
            'smart_bot': 'Smart Chatbot',
        }

        // Tab name mapping for Finn (Accounting) - matches Accounting.jsx sideMenuList paths
        const finnTabMap = {
            'chat': 'Chat',
            'balance_sheet': 'Balance Sheet Calculator',
            'profit_loss_calculator': 'Profit & Loss Calculator',
            'sales_forecaster': 'Sales Forecaster',
            'roi_calculator': 'ROI Calculator',
        }

        // Tab name mapping for Ken - matches Ken.jsx sideMenuList paths
        const kenTabMap = {
            'overview': t("overview"),
            'search-prospects': t("search_for_prospects"),
        }

        // Tab name mapping for Tara (COO) - matches Coo.jsx sideMenuList paths
        const taraTabMap = {
            'chat': t("tara.chat1"),
            'presentations': t("tara.presentation"),
        }

        if (paths.length === 0 || (paths.length === 1 && paths[0] === 'dashboard')) {
            return [{ label: t("ai_agents"), path: '/dashboard' }]
        }

        breadcrumbs.push({ label: t("ai_agents"), path: '/dashboard' })
        const currentPath = paths[paths.length - 1]
        const previousPath = paths.length > 1 ? paths[paths.length - 2] : null
        
        // Handle Seth (appointment-setter) with tab param
        if (currentPath === 'appointment-setter') {
            // Base crumb for Seth
            const sethTabKey = tab || 'agents'
            breadcrumbs.push({ label: 'Seth', path: `/dashboard/appointment-setter?tab=${sethTabKey}` })
            
            if (sethTabMap[sethTabKey]) {
                breadcrumbs.push({ label: sethTabMap[sethTabKey], path: null })
            }
            return breadcrumbs
        } else if (previousPath === 'appointment-setter') {
            // Has id param: /dashboard/appointment-setter/:id
            breadcrumbs.push({ label: 'Seth', path: '/dashboard/appointment-setter' })
            breadcrumbs.push({ label: currentPath, path: null })
            return breadcrumbs
        }
        
        // Handle Calina (customer-support) with tab param
        if (currentPath === 'customer-support') {
            // Base crumb for Calina
            const calinaTabKey = tab || 'chat'
            breadcrumbs.push({ label: 'Calina', path: `/dashboard/customer-support?tab=${calinaTabKey}` })
            
            if (calinaTabMap[calinaTabKey]) {
                breadcrumbs.push({ label: calinaTabMap[calinaTabKey], path: null })
            }
            return breadcrumbs
        } else if (previousPath === 'customer-support') {
            // Has id param: /dashboard/customer-support/:id
            breadcrumbs.push({ label: 'Calina', path: '/dashboard/customer-support' })
            breadcrumbs.push({ label: currentPath, path: null })
            return breadcrumbs
        }
        
        // Handle Settings with tab param
        if (currentPath === 'settings') {
            // Check for manage-plan view first
            if (view === 'manage-plan') {
                breadcrumbs.push({ label: t("settings.label"), path: '/dashboard/settings?tab=billing' })
                breadcrumbs.push({ label: t("plan_billing"), path: '/dashboard/settings?tab=billing' })
            breadcrumbs.push({ label: t("manage_plan"), path: null })
                return breadcrumbs
            }
            
            // Base crumb for Settings
            const settingsTabKey = tab || 'my-profile'
            breadcrumbs.push({ label: t("settings.label"), path: `/dashboard/settings?tab=${settingsTabKey}` })
            
            if (settingsTabMap[settingsTabKey]) {
                breadcrumbs.push({ label: settingsTabMap[settingsTabKey], path: null })
            }
            return breadcrumbs
        }
        
        // Handle Constance with tab param
        if (currentPath === 'content-creation') {
            const constanceTabKey = tab || 'chat'
        
            breadcrumbs.push({
                label: 'Constance',
                path: `/dashboard/content-creation?tab=${constanceTabKey}`
            })
        
            // Only add tab name if tab exists and is in the map, ignore view parameter for scheduler
            if (tab && constanceTabMap[tab]) {
                breadcrumbs.push({
                    label: constanceTabMap[tab],
                    path: null
                })
            }
        
            // Explicitly return early to prevent any view parameter, finalPage logic, or other code from adding "Create" or other breadcrumbs
            return breadcrumbs
        }

        // Handle Rebecca (Phone outreach) with tab param
        if (currentPath === 'phone') {
            // Base crumb for Rebecca
            breadcrumbs.push({ label: 'Rebecca', path: '/dashboard/phone?tab=dashboard' })

            const phoneTabKey = tab || 'dashboard'
            
            // Check if this is an Outreach submenu item (call-campaigns or outbound-calls)
            if (phoneTabKey === 'call-campaigns' || phoneTabKey === 'outbound-calls') {
                // Add Outreach as middle breadcrumb
                
                // Then add the specific tab
                if (phoneTabMap[phoneTabKey]) {
                    breadcrumbs.push({ label: phoneTabMap[phoneTabKey], path: null })
                }
            } else {
                // For other tabs, just add the tab name directly
                if (phoneTabMap[phoneTabKey]) {
                    breadcrumbs.push({ label: phoneTabMap[phoneTabKey], path: null })
                }
            }
            return breadcrumbs
        }

        // Handle Brain AI with tab param
        if (currentPath === 'brain') {
            // Base crumb for Brain AI
            breadcrumbs.push({ label: t("brain_ai.brain_ai"), path: '/dashboard/brain?tab=contacts' })

            const brainTabKey = tab || 'knowledge'
            if (brainTabMap[brainTabKey]) {
                breadcrumbs.push({ label: brainTabMap[brainTabKey], path: null })
            }
            return breadcrumbs
        }

        // Handle GEO (SEO) with tab param
        if (currentPath === 'geo') {
            // Base crumb for GEO
            breadcrumbs.push({ label: t("geo_name"), path: '/dashboard/geo?tab=product' })

            const geoTabKey = tab || 'product'

            // Analytics nested tabs
            if (geoAnalyticsTabMap[geoTabKey]) {
                breadcrumbs.push({ label: t("analytics"), path: null })
                breadcrumbs.push({ label: geoAnalyticsTabMap[geoTabKey], path: null })
                return breadcrumbs
            }

            // Prompts standalone
            if (geoTabKey === 'prompts') {
                breadcrumbs.push({ label: t("seo.prompts"), path: null })
                return breadcrumbs
            }

            // Default GEO tabs
            if (geoTabMap[geoTabKey]) {
                breadcrumbs.push({ label: geoTabMap[geoTabKey], path: null })
            }
            return breadcrumbs
        }
        
        // Handle Finn (Accounting) with tab param
        if (currentPath === 'accounting') {
            const finnTabKey = tab || 'chat'
            breadcrumbs.push({ label: 'Finn', path: `/dashboard/accounting?tab=${finnTabKey}` })
            if (finnTabMap[finnTabKey]) {
                breadcrumbs.push({ label: finnTabMap[finnTabKey], path: null })
            }
            return breadcrumbs
        }
        
        // Handle Ken with tab param
        if (currentPath === 'ken') {
            const kenTabKey = tab || 'overview'
            breadcrumbs.push({ label: 'Ken', path: `/dashboard/ken?tab=${kenTabKey}` })
            if (kenTabMap[kenTabKey]) {
                breadcrumbs.push({ label: kenTabMap[kenTabKey], path: null })
            }
            return breadcrumbs
        }
        
        // Handle Tara (COO) with tab param
        if (currentPath === 'coo') {
            const taraTabKey = tab || 'chat'
            breadcrumbs.push({ label: 'Tara', path: `/dashboard/coo?tab=${taraTabKey}` })
            if (taraTabMap[taraTabKey]) {
                breadcrumbs.push({ label: taraTabMap[taraTabKey], path: null })
            }
            return breadcrumbs
        }
        
        if (agentNameMap[currentPath]) {
            breadcrumbs.push({ label: agentNameMap[currentPath], path: `/dashboard/${currentPath}` })
        } else if (routeMap[currentPath]) {
            breadcrumbs.push({ label: routeMap[currentPath], path: `/dashboard/${currentPath}` })
        }

        const finalPage = routeMap[currentPath] || sidebarItems.find(item => item.id === currentPath)?.label || currentPath
        if (finalPage && !breadcrumbs.some(b => b.label === finalPage)) {
            breadcrumbs.push({ label: finalPage, path: null })
        } else if (currentPath === '' || currentPath === 'dashboard') {
            breadcrumbs.push({ label: 'Agents', path: null })
        }
        return breadcrumbs
    }

    let breadcrumbs = buildBreadcrumbs()

    // Filter out "Create" breadcrumb for Constance scheduler tab
    if (location.pathname.includes('content-creation') && searchParams.get('tab') === 'scheduler') {
        breadcrumbs = breadcrumbs.filter(crumb => 
            crumb.label !== 'Create' && 
            crumb.label !== 'Create Scheduler' &&
            !crumb.label.toLowerCase().includes('create')
        )
    }

    const handleBreadcrumbClick = (path) => {
        if (path) {
            navigate(path)
        }
    }

    return (
        <div className='bg-white dark:bg-black dark:text-white border-b border-[#D6D6D6]'>
            <div className='flex justify-between items-center px-6 py-3'>
                {/* Left Side: Logo, Brand, Version, Breadcrumbs */}
                <div className='flex items-center gap-2'>
                    <div
                        onClick={handleLogoClick}
                        className="flex items-center gap-2 cursor-pointer transition"
                    >
                        <img
                            src={Ecosystem}
                            alt="Ecosysteme.ai"
                            className="w-full h-12"
                        />
                    </div>

                    <span className="bg-[#EFF0F2] border border-[#E7E9EC] text-[#5A687C] text-xs px-2 py-0.5 rounded-full font-normal tracking-wide">
                        V.1.2
                    </span>

                    <div className="w-px h-4 bg-[#E1E4EA]"></div>

                    <div className="flex items-center gap-1 text-sm text-[#5A687C]">
                        {breadcrumbs.map((crumb, index) => (
                            <React.Fragment key={index}>
                                {crumb.path ? (
                                    <span
                                        onClick={() => handleBreadcrumbClick(crumb.path)}
                                        className={`cursor-pointer hover:text-[#675FFF] transition-colors ${
                                            index === breadcrumbs.length - 1 
                                                ? 'text-[#1E1E1E] dark:text-white font-[400]' 
                                                : 'text-[#5A687C] dark:text-gray-300'
                                        }`}
                                    >
                                        {crumb.label}
                                    </span>
                                ) : (
                                    <span className={index === breadcrumbs.length - 1 ? 'text-[#1E1E1E] dark:text-white font-[400]' : 'text-[#5A687C] dark:text-gray-300'}>
                                        {crumb.label}
                                    </span>
                                )}
                                {index < breadcrumbs.length - 1 && (
                                    <span className="mx-1 text-[#5A687C] dark:text-white">›</span>
                                )}
                            </React.Fragment>
                        ))}
                    </div>
                </div>

                {/* Right Side: Search + User Menu */}
                <div className='flex items-center gap-3'>
                    

                    <div className="relative" ref={userMenuRef}>
                        <button
                            onClick={() => setShowUserMenu(!showUserMenu)}
                            className="w-10 h-10 rounded-full cursor-pointer overflow-hidden border-2 border-transparent hover:border-[#675FFF] transition-colors focus:outline-none"
                        >
                            <img
                                src={userDetails?.image || person}
                                alt="User avatar"
                                className="w-full h-full object-cover"
                            />
                        </button>

                        {/* <button className="p-3 bg-red-600" onClick={toggleTheme}>
                            Toggle Theme
                        </button> */}

                        {showUserMenu && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-[#E1E4EA] z-50">
                                <div className="py-2">
                                    <div className="px-4 py-2 border-b border-[#E1E4EA]">
                                        <p className="text-sm font-medium text-[#1E1E1E]">{userDetails?.email || 'User'}</p>
                                    </div>
                                    <button
                                        onClick={handleLogout}
                                        className="cursor-pointer w-full text-left px-4 py-2 text-sm text-[#FF3B30]  transition-colors"
                                    >
                                        {t("logout") || "Logout"}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Navbar
