import CustomChat from "./CustomChat";
import rimaImg from "../assets/svg/rima_msg_logo.svg";
import jobImg from "../assets/svg/job_description_hr.svg";
import { useTranslation } from "react-i18next";

function JobDescriptionHr() {
    const { t } = useTranslation();
  const listedData = {
    header: `${t("rima.job_description_writer")}`,
    label: `${t("rima.job_description_writer")}`,
    description: `${t("rima.precise_description")}`,
    form: {
      label_1: `${t("rima.job_role")}`,
      placeholder_1: `${t("rima.job_role_placeholder")}`,
      label_2: `${t("rima.custom_instructions")}`,
      placeholder_2: `${t("rima.custom_instructions_placeholder")}`,
    },
    initialMessage:
      `${t("rima.initial_message")}`,
    agentName: "Rima",
    agentImg: rimaImg,
    headerLogo: jobImg,
  };
  return <CustomChat listedProps={listedData} />;
}

export default JobDescriptionHr;
