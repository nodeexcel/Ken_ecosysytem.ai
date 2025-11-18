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
      name: "Tom & Rebecca",
      role: `${t("phone_outreach")}`,
      gradient: "bg-[#DBE5FF]",
      path: "/dashboard/phone",
      label: "Tom & Rebecca, Phone",
      image: tomImg
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
      image: rebeccaImg
    },
    {
      name: "Emile",
      role: `${t("email")}`,
      gradient: "bg-[#CEBFFD]",
      path: "/dashboard/campaigns",
      label: "Emailing",
      image: emileImg
    },
    {
      name: "Rima",
      role: `${t("hr")}`,
      gradient: "bg-[#FFE4C5]",
      path: "/dashboard/hr",
      label: "Rima",
      image: assiaImg
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
      name: "Sandro",
      role: `${t("seo_name")}`,
      gradient: "bg-[#F8DDFF]",
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
    <div className="max-w-full h-800px pt-10 overflow-y-hidden">
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
      <div className="max-w-[1400px] mx-auto px-4">
        {/* Welcome Message */}
        <div className="flex flex-col text-start gap-2 pb-5">
          <h1 className="font-[500] text-2xl">
            {t("Welcome")},{" "}
            <span className="text-[#020202]">{userDetails?.user?.firstName}</span>{" !"}
          </h1>
          <p className="font-[400] text-[16px] text-[#5A687C]">
            {t("ai_agents_heading")}
          </p>
        </div>

        {/* Card Grid */}
        <div className="flex justify-start flex-wrap gap-6">
          {employees.map((employee, index) => {
            const isDisabled =
              employee.name === "Emile" ||
              employee.name === "Tara" ||
              employee.name === "Sandro";

            return (
              <div
                key={index}
                onClick={() => {
                  if (!isDisabled) handleNavigate(employee.path, employee.label);
                }}
                className={`relative flex-shrink-0 basis-[calc(20%-1.5rem)] max-w-[290px] h-[210px] px-4 rounded-2xl shadow-sm transition-all duration-300 flex flex-col items-start pt-6
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
                    className="w-[80px] h-[80px] object-contain scale-100"
                  />
                </div>

                {/* Name */}
                <h3 className="text-[18px] font-semibold text-[#1E1E1E] mb-1 ml-2">
                  {employee.name}
                </h3>

                {/* Role */}
                <p className="text-[15px] text-[#5A687C] font-normal ml-2">
                  {employee.role}
                </p>

                {/* Tooltip for disabled cards */}
                {isDisabled && (
                  <div className="absolute inset-0 group">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 absolute top-25 right-1/6 -translate-x-1/6 bg-[#272525] text-white text-[13px] py-1 px-3 rounded-lg shadow-lg whitespace-nowrap">
                      Coming Soon!
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
