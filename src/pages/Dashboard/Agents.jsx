import React from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getNavbarData } from "../../store/navbarSlice";
import taraImg from '../../assets/svg/TaraHome.svg'
import constanceImg from '../../assets/svg/ConstanceSidebar.svg'
import tomImg from '../../assets/svg/KenNewLogo.svg'
import rebeccaImg from '../../assets/svg/rebecca.svg'
import sethImg from '../../assets/svg/SethSidebar.svg'
import emileImg from '../../assets/svg/emile.svg'
import calinaImg from '../../assets/svg/CalinaSidebar.svg'
import finnImg from '../../assets/svg/FinnSidebar.svg'
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
      gradient: "bg-[#CEBFFD]",
      borderColor: "border-[#BB96D9]",
      path: "/dashboard/coo",
      label: "Tara",
      image: taraImg,
    },
    {
      name: "Constance",
      role: `${t("content_creation")}`,
      gradient: "bg-[#CEBFFD]",
      borderColor: "border-[#BB96D9]",
      path: "/dashboard/content-creation",
      label: "Content Creation",
      image: constanceImg
    },
    {
      name: "Rebecca",
      role: `${t("phone_outreach")}`,
      gradient: "bg-[#DBE5FF]",
      borderColor: "border-[#BDC1DB]",
      path: "/dashboard/phone",
      label: "Rebecca, Phone",
      image: rebeccaImg
    },
    {
      name: "Seth",
      role: `${t("appointment_setter")}`,
      gradient: "bg-[#FFE4C5]",
      borderColor: "border-[#DFC6AA]",
      path: "/dashboard/appointment-setter",
      label: "Seth, Appointment Setter",
      image: sethImg
    },
    {
      name: "Calina",
      role: `${t("customer_support")}`,
      gradient: "bg-[#E3F6ED]",
      borderColor: "border-[#BED6CC]",
      path: "/dashboard/customer-support",
      label: "Customer Support",
      image: calinaImg
    },
    {
      name: "Ken",
      role: `${t("receptionist")}`,
      gradient: "bg-[#DBE5FF]",
      borderColor: "border-[#DEB4DB]",
      path: "/dashboard/ken",
      label: "Ken",
      image: tomImg
    },

    {
      name: "Finn",
      role: `${t("accouting")}`,
      gradient: "bg-[#E3F6ED]",
      borderColor: "border-[#BED6CC]",
      path: "/dashboard/accounting",
      label: "Accounting",
      image: finnImg
    },
    {
      name: "Georgio",
      role: `${t("geo_name")}`,
      gradient: "bg-[#F8DDFF]",
      borderColor: "border-[#BB96D9]",
      path: "/dashboard/geo",
      label: "Sandro",
      image: emileImg
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
    <div className="max-w-full h-800px pt-16 overflow-y-hidden">
      {/* Main Content */}
      <div className="max-w-full mx-auto pl-10 pr-20">
        {/* Welcome Message */}
        <div className="flex flex-col text-start gap-2 pb-5 px-40 ">
          <h1 className="font-[500] text-[30px]">
            {t("welcome")},{" "}
            <span className="text-[#675FFF] ">{userDetails?.user?.firstName}</span>{" !"}
          </h1>
          <p className="font-[400] text-[16px] text-[#5A687C]">
            {t("ai_agents_heading")}
          </p>
        </div>

        {/* Card Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-start px-40">
          {employees.map((employee, index) => {
            return (
              <div
                key={index}
                onClick={() => {
                  handleNavigate(employee.path, employee.label);
                }}
                className="relative h-[210px] px-4 rounded-2xl shadow-sm transition-all duration-300 flex flex-col items-start pt-6 w-full bg-white hover:shadow-md border border-[#D6D6D6] cursor-pointer hover:bg-[#f8fafa]"
              >
                {/* Avatar */}
                <div
                  className={`w-[80px] h-[80px] rounded-full flex items-center justify-center mb-6 ml-2 border-1 ${employee.gradient} ${employee.borderColor}`}
                >
                  <img
                    src={employee.image}
                    alt={employee.name}
                    loading="lazy"
                    className={`object-contain ${employee.name === "Ken" ? "w-[110px] h-[110px] scale-110" : "w-[80px] h-[80px] scale-100"}`}
                  />
                </div>

                {/* Name */}
                <h3 className="text-[20px] font-[500] text-[#1E1E1E] mb-1 ml-2">
                  {employee.name}
                </h3>

                {/* Role */}
                <p className="text-[14px] text-[#5A687C] font-[400] ml-2">
                  {employee.role}
                </p>
              </div>
            );
          })}
        </div>


      </div>
    </div>


  );
};

export default Agents
