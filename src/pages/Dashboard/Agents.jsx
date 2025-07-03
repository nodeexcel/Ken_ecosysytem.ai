import { CircleArrowRightIcon } from "lucide-react";
import React from "react";
import image1 from '../../assets/svg/agent_image1.svg'
import image2 from '../../assets/svg/agent_image2.svg'
import { useNavigate } from "react-router-dom";
import { RequestSend } from "../../icons/icons";
import { useDispatch, useSelector } from "react-redux";
import { getNavbarData } from "../../store/navbarSlice";
import taraImg from '../../assets/svg/tara.svg'
import constanceImg from '../../assets/svg/constance.svg'
import tomImg from '../../assets/svg/tom.svg'
import rebeccaImg from '../../assets/svg/rebecca.svg'
import sethImg from '../../assets/svg/seth.svg'
import assiaImg from '../../assets/svg/assia.svg'
import emileImg from '../../assets/svg/emile.svg'
import calinaImg from '../../assets/svg/calina.svg'
import finnImg from '../../assets/svg/finn.svg'
import sandroImg from '../../assets/svg/sandro.svg'
import { logoutState } from "../../store/authSlice";
import { discardData } from "../../store/profileSlice";
import { logout } from "../../api/auth";
import { useTranslation } from "react-i18next";



const Agents = () => {

  const navigate = useNavigate();
  const userDetails = useSelector((state) => state.profile);
  const dispatch = useDispatch()
  const { t } = useTranslation();


  const employees = [
    {
      name: "Tara",
      role: `${t("coo")}`,
      gradient: "bg-gradient-to-br from-[#CEBFFD] to-[#CEBFFD]",
      path: "/dashboard/coo",
      label: "Tara",
      image: taraImg,
    },
    {
      name: "Constance",
      role: `${t("content_creation")}`,
      gradient: "bg-gradient-to-br from-[#F8DDFF] to-[#F8DDFF]",
      path: "/dashboard/content-creation",
      label: "Content Creation",
      image: constanceImg
    },
    {
      name: "Tom",
      role: `${t("phone_outreach")}`,
      gradient: "bg-gradient-to-br from-[#DBE5FF] to-[#DBE5FF]",
      path: "/dashboard/phone",
      label: "Tom & Rebecca, Phone",
      image: tomImg
    },
    {
      name: "Seth",
      role: `${t("appointment_setter")}`,
      gradient: "bg-gradient-to-br from-[#FFE4C5] to-[#FFE4C5]",
      path: "/dashboard/appointment-setter",
      label: "Seth, Appointment Setter",
      image: sethImg
    },
    {
      name: "Calina",
      role: `${t("customer_support")}`,
      gradient: "bg-gradient-to-br from-[#E3F6ED] to-[#E3F6ED]",
      path: "/dashboard/customer-support",
      label: "Customer Support",
      image: calinaImg
    },
    {
      name: "Rebecca",
      role: `${t("receptionist")}`,
      gradient: "bg-gradient-to-br from-[#DBE5FF] to-[#DBE5FF]",
      path: "/dashboard/phone",
      label: "Rebecca",
      image: rebeccaImg
    },
    {
      name: "Emile",
      role: `${t("email")}`,
      gradient: "bg-gradient-to-br from-[#CEBFFD] to-[#CEBFFD]",
      path: "/dashboard/campaigns",
      label: "Emailing",
      image: emileImg
    },
    {
      name: "Rima",
      role: `${t("hr")}`,
      gradient: "bg-gradient-to-br from-[#FFE4C5] to-[#FFE4C5]",
      path: "/dashboard/hr",
      label: "Rima",
      image: assiaImg
    },
    {
      name: "Finn",
      role: `${t("accouting")}`,
      gradient: "bg-gradient-to-br from-[#E3F6ED] to-[#E3F6ED]",
      path: "/dashboard/accounting",
      label: "Accounting",
      image: finnImg
    },
    {
      name: "Sandro",
      role: `${t("seo_name")}`,
      gradient: "bg-gradient-to-br from-[#F8DDFF] to-[#F8DDFF]",
      path: "/dashboard/seo",
      label: "Sandro",
      image: sandroImg
    },
  ];

  const handleNavigate = (path, label) => {
    if (path !== "") {
      navigate(path)
      dispatch(getNavbarData(label))
    }
  }

  const handleLogout = async () => {
    const response = await logout()
    if (response?.data?.success) {
      navigate("/")
    }
    localStorage.clear()
    dispatch(logoutState())
    dispatch(discardData())

  }

  if (userDetails?.loading) return <p className='flex justify-center items-center h-[70vh]'><span className='loader' /></p>

  return (
    <div className="overflow-auto h-screen">
      <div className=''>
        <div className='flex justify-between px-2 items-center'>
          {/* <MdOutlineKeyboardArrowLeft size={25} /> */}
          <div className="flex gap-2 items-center h-[57px]">
            <h1 className="text-[20px] font-[600] pl-3">{t("home")}</h1>
          </div>
          <div>
            <button className='bg-[#675FFF] py-2 px-10 text-[14px] rounded-lg text-white cursor-pointer' onClick={handleLogout}>{t("logout")}</button>
          </div>
        </div>
        <hr className='text-[#E1E4EA]' />
      </div>
      {/* Top Right Button */}
      <div className="flex justify-end items-end pt-3 pr-2">
        <button className="gap-2 cursor-pointer rounded-lg flex items-center p-3 text-[#5A687C] font-[400] text-[16px]">
          {/* <span><img src={image1} alt="image1" /></span> */}
          {t("request_new_feature")}
          <div className="pb-0.5">
            <RequestSend />
          </div>
        </button>
      </div>

      {/* Welcome Message */}
      <div className="flex justify-center flex-col items-center text-center gap-2 pb-5">
        <h1 className="font-[600] text-2xl">{t("hello")}, <span className="text-[#5E54FF]">{userDetails?.user?.firstName}</span>{" "}<span className="!mb-1">👋</span></h1>
        <p className="font-[400] text-[16px] text-[#5A687C]">
          {t("ai_agents_heading")}
        </p>
      </div>

      {/* Responsive Centered Grid */}
      <div className="flex justify-between max-w-[1289px] mx-auto py-5 px-2">
        <div className="flex flex-wrap gap-4 justify-center items-center">
          {employees.map((employee, index) => (
            <div
              onClick={() => handleNavigate(employee.path, employee.label)}
              key={index}
              className={`w-[227px] h-[266px] rounded-lg  ${employee.gradient} hover:opacity-80 cursor-pointer`}
            >
              <div className="flex flex-col items-start p-[21px] h-full justify-between">
                <div className="w-full relative">
                  <div className="text-[18px] text-[#1E1E1E] font-[400] leading-[26px]">
                    <span className="font-[600]">
                      {employee.name}
                      <br />
                    </span>
                    <span>{employee.role}</span>
                  </div>
                  <CircleArrowRightIcon className="absolute w-5 h-5 top-0 right-0 text-[#1E1E1E]" />
                </div>
                <div>
                  <img loading='lazy' src={employee.image} alt={employee.label} className="object-fit" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>

  );
};

export default Agents
