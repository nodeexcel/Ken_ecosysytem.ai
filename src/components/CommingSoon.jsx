
import { useTranslation } from "react-i18next";
import commingSoonLogo from "../assets/svg/comming_soon_logo.svg";

function CommingSoon() {
    const { t } = useTranslation()
    return (
        <div className="h-full flex flex-col w-full justify-center items-center gap-5">
            <div className="flex justify-center">
                <img src={commingSoonLogo} alt="comming-soon" className="object-fit" />
            </div>
            <div className="flex flex-col items-center gap-3">
                <h2 className="text-[#675FFF] font-[700] text-[30px]">{t("coming_soon")}</h2>
                <p className="text-[#1E1E1E] font-[500] text-[21px]">{t("just_a_moment")}</p>
            </div>

        </div>
    )
}

export default CommingSoon
