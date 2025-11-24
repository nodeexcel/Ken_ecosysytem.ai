import React, { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom'
import { logoutState } from '../store/authSlice';
import { discardData } from '../store/profileSlice';
import { getNavbarData } from '../store/navbarSlice';
import { discardSkillsData } from '../store/agentSkillsSlice';
import { logout } from '../api/auth';
import { SearchIcon } from '../icons/icons';
import logo from '../assets/images/dashboard_logo.png'
import person from '../assets/images/person.svg'
import Ecosystem from '../assets/images/ecosysteme.ai_logo.png'

function Navbar({ sidebarItems }) {
    const location = useLocation()
    const navigate = useNavigate();
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

        const routeMap = {
            'dashboard': 'AI Agents',
            'appointment-setter': 'Seth',
            'phone': 'Tom & Rebecca',
            'campaigns': 'Emile',
            'coo': 'Tara',
            'content-creation': 'Constance',
            'accounting': 'Accounting',
            'hr': 'HR',
            'seo': 'SEO',
            'customer-support': 'Customer Support',
            'brain': 'Brain AI',
            'settings': 'Settings',
            'notification': 'Notification',
            'skills': 'Skills',
            'support': 'Support',
            'community': 'Community',
            'documentation': 'Documentation',
            'manage-plan': 'Manage Plan'
        }

        const agentNameMap = {
            'appointment-setter': 'Seth',
            'phone': 'Tom & Rebecca',
            'campaigns': 'Emile',
            'coo': 'Tara',
            'content-creation': 'Constance'
        }

        if (paths.length === 0 || (paths.length === 1 && paths[0] === 'dashboard')) {
            return ['AI Agents', 'Agents']
        }

        breadcrumbs.push('AI Agents')
        const currentPath = paths[paths.length - 1]
        
        // Check if we're in settings with manage-plan view
        if (currentPath === 'settings' && view === 'manage-plan') {
            breadcrumbs.push('Settings')
            breadcrumbs.push('Manage Plan')
            return breadcrumbs
        }
        
        if (agentNameMap[currentPath]) {
            breadcrumbs.push(agentNameMap[currentPath])
        } else if (routeMap[currentPath]) {
            breadcrumbs.push(routeMap[currentPath])
        }

        const finalPage = routeMap[currentPath] || sidebarItems.find(item => item.id === currentPath)?.label || currentPath
        if (finalPage && !breadcrumbs.includes(finalPage)) {
            breadcrumbs.push(finalPage)
        } else if (currentPath === '' || currentPath === 'dashboard') {
            breadcrumbs.push('Agents')
        }
        return breadcrumbs
    }

    const breadcrumbs = buildBreadcrumbs()

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

                    <span className="bg-[#EFF0F2] border border-[#E7E9EC] text-[#5A687C] text-xs px-2 py-0.5 rounded-full font-medium tracking-wide">
                        V.1.2
                    </span>

                    <div className="w-px h-4 bg-[#E1E4EA]"></div>

                    <div className="flex items-center gap-1 text-sm text-[#5A687C]">
                        {breadcrumbs.map((crumb, index) => (
                            <React.Fragment key={index}>
                                <span className={index === breadcrumbs.length - 1 ? 'text-[#1E1E1E] dark:text-white font-medium' : ''}>
                                    {crumb}
                                </span>
                                {index < breadcrumbs.length - 1 && (
                                    <span className="mx-1 text-[#5A687C] dark:text-white">›</span>
                                )}
                            </React.Fragment>
                        ))}
                    </div>
                </div>

                {/* Right Side: Search + User Menu */}
                <div className='flex items-center gap-3'>
                    <div className="relative w-[300px]">
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                            <SearchIcon />
                        </div>
                        <input
                            id="navbar-search"
                            type="text"
                            placeholder="Search everything"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-14 py-2 text-sm border border-[#E1E4EA] rounded-xl bg-white focus:outline-none focus:border-[#9f9ea5] text-[#1E1E1E] placeholder:text-[#9CA3AF]"
                        />
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-[#F5F5F5] text-[#5A687C] text-xs px-2 py-[2px] rounded border border-[#E1E4EA] font-medium pointer-events-none">
                            ⌘ S
                        </div>
                    </div>

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
                                        Logout
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
