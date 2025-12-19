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
import tomImg from '../../assets/images/Sami_rev.png'
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
      gradient: "bg-[#CEBFFD]",
      path: "/dashboard/coo",
      label: "Tara",
      image: taraImg,
    },
    {
      name: "Constance",
      role: `${t("content_creation")}`,
      gradient: "bg-[#CEBFFD]",
      path: "/dashboard/content-creation",
      label: "Content Creation",
      image: constanceImg
    },
    {
      name: "Rebecca",
      role: `${t("phone_outreach")}`,
      gradient: "bg-[#DBE5FF]",
      path: "/dashboard/phone",
      label: "Rebecca, Phone",
      image: rebeccaImg
    },
    {
      name: "Seth",
      role: `${t("appointment_setter")}`,
      gradient: "bg-[#FFE4C5]",
      path: "/dashboard/appointment-setter",
      label: "Seth, Appointment Setter",
      image: sethImg
    },
    {
      name: "Calina",
      role: `${t("customer_support")}`,
      gradient: "bg-[#E3F6ED]",
      path: "/dashboard/customer-support",
      label: "Customer Support",
      image: calinaImg
    },
    {
      name: "Ken",
      role: `${t("receptionist")}`,
      gradient: "bg-[#DBE5FF]",
      path: "/dashboard/phone",
      label: "Rebecca",
      image: tomImg
    },

    {
      name: "Finn",
      role: `${t("accouting")}`,
      gradient: "bg-[#E3F6ED]",
      path: "/dashboard/accounting",
      label: "Accounting",
      image: finnImg
    },
    {
      name: "Georgio",
      role: `${t("geo_name")}`,
      gradient: "bg-[#F8DDFF]",
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
      {/* Header */}
      {/* <div>
        <div className="flex justify-between px-2 items-center">
          <div className="flex gap-2 items-center h-[57px]">
            <h1 className="text-[20px] font-[600] pl-10 lg:pl-3">{t("home")}</h1>
          </div>
          <div className="flex gap-2 items-center">
            <button
              className="bg-[#675FFF] py-2 px-10 text-[14px] rounded-lg text-white cursor-pointer"
              onClick={handleLogout}
            >
              {t("logout")}
            </button>
          </div>
        </div>
        <hr className="text-[#E1E4EA]" />
      </div> */}

      {/* Top Right Button */}
      {/* <div className="flex justify-end items-end pt-3 pr-2">
        <button className="gap-2 cursor-pointer rounded-lg flex items-center p-3 text-[#5A687C] font-[400] text-[16px]">
          {t("request_new_feature")}
          <div className="pb-0.5">
            <RequestSend />
          </div>
        </button>
      </div> */}

      {/* Main Content */}
      <div className="max-w-full mx-auto pl-10 pr-20">
        {/* Welcome Message */}
        <div className="flex flex-col text-start gap-2 pb-5 px-40 ">
          <h1 className="font-[500] text-[30px]">
            {t("Welcome")},{" "}
            <span className="text-[#675FFF] ">{userDetails?.user?.firstName}</span>{" !"}
          </h1>
          <p className="font-[400] text-[16px] text-[#5A687C]">
            {t("ai_agents_heading")}
          </p>
        </div>

        {/* Card Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-start px-40">
          {employees.map((employee, index) => {
            const isDisabled =
              employee.name === "Ken" ;

            return (
              <div
                key={index}
                onClick={() => {
                  if (!isDisabled) handleNavigate(employee.path, employee.label);
                }}
                className={`relative h-[210px] px-4 rounded-2xl shadow-sm transition-all duration-300 flex flex-col items-start pt-6 w-full
          ${isDisabled
                    ? 'bg-[#d6dbe3] cursor-not-allowed opacity-70 border border-[#D6D6D6] '
                    : 'bg-white hover:shadow-md border border-[#D6D6D6] cursor-pointer hover:bg-[#f8fafa]'
                  }`}
              >
                {/* Avatar */}
                <div
                  className={`w-[80px] h-[80px] rounded-full flex items-center justify-center mb-6 ml-2 ${employee.gradient}`}
                >
                  <img
                    src={employee.image}
                    alt={employee.name}
                    loading="lazy"
                    className={`object-contain ${employee.name === "Ken" ? "w-[110px] h-[110px] scale-110" : "w-[80px] h-[80px] scale-100"}`}
                  />
                </div>

                {/* Name */}
                <h3 className="text-[20px] font-semibold text-[#1E1E1E] mb-1 ml-2">
                  {employee.name}
                </h3>

                {/* Role */}
                <p className="text-[14px] text-[#5A687C] font-normal ml-2">
                  {employee.role}
                </p>

                {/* Tooltip for disabled cards */}
                {isDisabled && employee.name === "Ken" && (
                  <div className="absolute inset-0">
                    <div className="absolute top-5 font-[500] right-1/20 -translate-x-1/20 text-grey-200 text-[14px] py-1 px-3 whitespace-nowrap opacity-100">
                      Coming soon!
                    </div>
                  </div>
                )}

              </div>
            );
          })}
        </div>


      </div>
    </div>


  );
};

export default Agents
