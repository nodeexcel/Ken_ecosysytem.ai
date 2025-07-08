import CustomChat from "./CustomChat"
import rimaImg from "../assets/svg/rima_msg_logo.svg"
import interviewImg from "../assets/svg/interview_planner_hr.svg";
import { useTranslation } from "react-i18next";

function InterviewPlannerHr() {
    const { t } = useTranslation()
    const listedData = {
        header: `${t("rima.interview_planner.heading")}`, label: `${t("rima.interview_planner.heading")}`, description: `${t("rima.interview_planner.description")}`,
        form: { label_1: `${t("rima.job_role")}`, placeholder_1: `${t("rima.job_role_placeholder")}`, label_2: `${t("rima.custom_instructions")}`, placeholder_2: `${t("rima.custom_instructions_placeholder")}` },
        initialMessage: `${t("rima.initial_message")}`,
        agentName: "Rima",
        agentImg: rimaImg,
        headerLogo: interviewImg
    }
    return (
        <CustomChat listedProps={listedData} />
    )
}

export default InterviewPlannerHr
