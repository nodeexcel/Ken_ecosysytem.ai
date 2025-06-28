import { useState, useEffect } from 'react'
import Sidebar from '../components/Sidebar'
import { Outlet, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import { getProfileData } from '../store/profileSlice';
import { getProfile } from '../api/profile';
import { loginSuccess } from '../store/authSlice';
import Navbar from '../components/Navbar';
import { getCountryData } from '../store/countryCodeSlice';
import CountryList from 'country-list-with-dial-code-and-flag'
import i18n from '../i18n';


function Dashboard() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const token = localStorage.getItem("token")
    const userDetails = useSelector((state) => state.profile)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    useEffect(() => {

        if (token && userDetails.loading) {
            handleProfile()
            getCountryCode()
            dispatch(loginSuccess({ token: token }))
        }
        if (!token && userDetails.loading) {
            navigate("/")
        }

    }, [token, userDetails.loading])


    useEffect(() => {
        if (isSidebarOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }

        // Cleanup function to reset overflow when component unmounts
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isSidebarOpen]);

    const SidebarItems = [
        { id: "", label: "Home" },
        { id: "brain", label: "Brain AI" },
        { id: "settings", label: "Settings" },
        { id: "documentation", label: "Documentation" },
        { id: "support", label: "Support" },
        { id: "community", label: "Community" },
        { id: "notification", label: "Notification" },
    ]


    const getCountryCode = async () => {
        try {
            const response = CountryList.getAll()
            if (response?.length > 0) {
                const data = response?.map((e) => ({
                    name: e.data.name,
                    code: e.data.code,
                    dial_code: e.data.dial_code,
                    flag: `${(e.data.code).toLowerCase()}`
                }))
                dispatch(getCountryData(data))
            }

        } catch (error) {
            console.log(error)
        }
    }

    const handleProfile = async () => {
        try {

            const response = await getProfile()
            if (response?.status === 200) {
                console.log(response?.data)
                if (!response?.data?.isProfileComplete) {
                    navigate("settings")
                }
                dispatch(getProfileData(response?.data))
                i18n.changeLanguage(response?.data?.language);

            }
        } catch (error) {
            console.log(error)
        }
    }


    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    if (userDetails?.loading) return <p className='flex justify-center items-center h-full'><span className='loader' /></p>



    return (
        <div className='w-full flex'>
            <div className={`transition-all duration-300 ${isSidebarOpen ? 'w-[250px]' : 'w-[0%]'} md:w-[58px] relative z-50`}>
                <Sidebar sidebarItems={SidebarItems} isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
            </div>
            <div style={{ width: 'calc(100% - 58px)' }}>
                {/* <Navbar sidebarItems={SidebarItems} /> */}
                <Outlet />
            </div>
        </div>
    )
}

export default Dashboard
