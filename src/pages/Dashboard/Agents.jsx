import { CircleArrowRightIcon } from "lucide-react";
import React from "react";
import image1 from '../../assets/svg/agent_image1.svg'
import image2 from '../../assets/svg/agent_image2.svg'
import { useNavigate } from "react-router-dom";
import { RequestSend } from "../../icons/icons";

const employees = [
  {
    name: "Rebecca",
    role: "Receptionist",
    gradient: "bg-gradient-to-br from-[#FCC42A] to-[#F4056A]",
    path: ""
  },
  {
    name: "Tom",
    role: "Phone",
    gradient: "bg-gradient-to-br from-[#0068FF] to-[#0049B2]",
    path: "/dashboard/phone"
  },
  {
    name: "Seth",
    role: "Appointment Setter",
    gradient: "bg-gradient-to-br from-[#0A66C2] to-[#053361]",
    path: "/dashboard/appointment-setter"
  },
  {
    name: "Constance",
    role: "Content Creation",
    gradient: "bg-gradient-to-br from-[#40C9FF] to-[#E81CFF]",
    path: ""
  },
  {
    name: "Emile",
    role: "Emailing",
    gradient: "bg-gradient-to-br from-[#919BFF] to-[#133A94]",
    path: "/dashboard/campaigns"
  },
  {
    name: "Assia",
    role: "Executive Assistant",
    gradient: "bg-gradient-to-br from-[#FF0F7B] to-[#F89B29]",
    path: ""
  },
  {
    name: "Vania",
    role: "HR",
    gradient: "bg-gradient-to-br from-[#FF0F7B] to-[#FFF95B]",
    path: ""
  },
  {
    name: "X",
    role: "Customer Support",
    gradient: "bg-gradient-to-br from-[#FF930F] to-[#FFF95B]",
    path: ""
  },
  {
    name: "Finn",
    role: "Accounting",
    gradient: "bg-gradient-to-br from-[#F8997D] to-[#AD336D]",
    path: ""
  },
];

const Agents = () => {

  const navigate = useNavigate()
  const handleNavigate = (path) => {
    if (path !== "") {
      navigate(path)
    }
  }
  return (
    <div className="">
      {/* Top Right Button */}
      <div className="flex justify-end items-end pt-3 pr-2">
        <button className="bg-white gap-2 rounded-lg flex items-center p-3 text-[#5A687C] border-[1.5px] border-[#E1E4EA] font-[600] text-[16px]">
          <span><img src={image1} alt="image1" /></span>
          Request new feature
          <div className="pb-0.5">
            <RequestSend />
          </div>
        </button>
      </div>

      {/* Welcome Message */}
      <div className="flex justify-center flex-col items-center text-center gap-2 pb-5">
        <h1 className="font-[600] text-2xl">Welcome Merry</h1>
        <p className="font-[400] text-[16px] text-[#5A687C]">
          Your AI agents are ready to boost your outreach.
        </p>
      </div>

      {/* Responsive Centered Grid */}
      <div className="flex justify-center w-full py-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 justify-center">
          {employees.map((employee, index) => (
            <div
              onClick={() => handleNavigate(employee.path)}
              key={index}
              className={`w-[227px] h-[266px] rounded-lg shadow-lg ${employee.gradient}`}
            >
              <div className="flex flex-col items-start p-[21px] h-full justify-between">
                <div className="w-full relative">
                  <div className="font-inter text-lg text-white leading-[26px]">
                    <span className="font-semibold">
                      {employee.name}
                      <br />
                    </span>
                    <span>{employee.role}</span>
                  </div>
                  <CircleArrowRightIcon className="absolute w-5 h-5 top-0 right-0 text-white" />
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
