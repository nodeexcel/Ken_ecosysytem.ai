import { useTranslation } from "react-i18next";

function CooConnectWhatsapp() {
    const { t } = useTranslation();
    return (
        <div className='flex justify-center items-center h-screen'>
            {t("coming_soon")}
        </div>
    )
}

export default CooConnectWhatsapp
