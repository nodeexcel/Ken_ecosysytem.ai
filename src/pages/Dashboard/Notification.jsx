import { CheckIcon, XIcon } from "lucide-react";
import { useEffect } from "react";


const NotificationsComponent = ({ setNotification }) => {

  // Data for the notification items
  const todayNotifications = [
    {
      id: 1,
      title: "Loream ipsum is simply dummy text",
      date: "March 16, 2025",
      time: "09:00 PM",
      selected: false
    },
    {
      id: 2,
      title: "Loream ipsum is simply dummy text",
      date: "March 16, 2025",
      time: "09:00 PM",
      selected: true
    },
    {
      id: 3,
      title: "Loream ipsum is simply dummy text",
      date: "March 16, 2025",
      time: "09:00 PM",
      selected: false
    },
    {
      id: 4,
      title: "Loream ipsum is simply dummy text",
      date: "March 16, 2025",
      time: "09:00 PM",
      selected: false
    },
  ];

  const tomorrowNotifications = [
    {
      id: 1,
      title: "Loream ipsum is simply dummy text",
      date: "March 16, 2025",
      time: "09:00 PM",
    },
    {
      id: 2,
      title: "Loream ipsum is simply dummy text",
      date: "March 16, 2025",
      time: "09:00 PM",
    },
    {
      id: 3,
      title: "Loream ipsum is simply dummy text",
      date: "March 16, 2025",
      time: "09:00 PM",
    },
  ];

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    // <div className="fixed inset-0 bg-black/2 z-50 flex items-center justify-center">
      <div className="flex flex-col inset-0 w-[512px] items-start bg-white rounded-xl  border border-solid border-[#e1e4ea] absolute z-50 left-18 top-25 h-[80%]">
        {/* Header */}
        <header className="flex items-center justify-between px-5 py-3.5 w-full border-b border-[#e1e4ea]">
          <h2 className="font-bold text-black text-lg tracking-[-0.36px] leading-5">
            Notifications
          </h2>

          <div className="flex items-center gap-5 cursor-pointer">
            <button
              className="flex items-center gap-2 p-0 h-auto bg-transparent   transition-opacity"
            >
              <div className="relative w-[22.5px] h-[18px]">
                <CheckIcon className="absolute w-[18px] h-[18px] top-0 left-0 text-blue-600" />
                <CheckIcon className="absolute w-[18px] h-[18px] top-0 left-1 text-blue-600" />
              </div>
              <span className="font-semibold text-blue-600 text-base tracking-[-0.32px] leading-5">
                Mark all as Read
              </span>
            </button>

            <div className="flex items-center gap-2" onClick={() => setNotification(false)}>
              <button className=" h-6 w-6 flex items-center justify-center cursor-pointer rounded-full transition-colors" >
                <XIcon className="h-6 w-6 text-black" />
              </button>
            </div>
          </div>
        </header>
        <div className="overflow-auto w-full">
          {/* Today section */}
          <div className="flex items-center gap-2.5 p-2.5 relative self-stretch w-full flex-[0_0_auto] bg-gray-50">
            <h2 className="relative w-fit mt-[-1.00px] font-semibold text-gray-500 text-base tracking-[-0.32px] leading-5 whitespace-nowrap">
              Today
            </h2>
          </div>
          <section className="flex flex-col items-start gap-3 p-3 w-full">
            {todayNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`w-full p-2.5 ${notification.selected ? "bg-[#675fff17]" : "bg-transparent"} rounded-[10px] transition-colors`}
              >
                <div className="flex flex-col items-start gap-2">
                  <h3 className="self-stretch font-semibold text-black text-base tracking-[-0.32px] leading-5 font-sans">
                    {notification.title}
                  </h3>

                  <div className="flex items-center gap-2.5">
                    <span className="font-normal text-gray-500 text-sm tracking-[-0.28px] leading-5 whitespace-nowrap font-sans">
                      {notification.date}
                    </span>

                    <div className="h-4 w-px bg-gray-300"></div>

                    <span className="font-normal text-gray-500 text-sm tracking-[-0.28px] leading-5 whitespace-nowrap font-sans">
                      {notification.time}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </section>

          {/* Tomorrow section */}
          <div className="flex items-center gap-2.5 p-2.5 relative self-stretch w-full flex-[0_0_auto] bg-gray-50">
            <h2 className="relative w-fit mt-[-1.00px] font-semibold text-gray-500 text-base tracking-[-0.32px] leading-5 whitespace-nowrap">
              Tomorrow
            </h2>
          </div>
          <div className="gap-3 p-3 flex flex-col items-start w-full">
            {tomorrowNotifications.map((item) => (
              <div key={item.id} className="w-full p-2.5 rounded-[10px] hover:bg-gray-50 transition-colors">
                <div className="gap-2 flex flex-col items-start">
                  <h3 className="self-stretch mt-[-1.00px] font-semibold text-black text-base tracking-[-0.32px] leading-5 font-sans">
                    {item.title}
                  </h3>

                  <div className="inline-flex items-center gap-2.5">
                    <span className="w-fit mt-[-1.00px] font-normal text-gray-500 text-sm tracking-[-0.28px] leading-5 whitespace-nowrap font-sans">
                      {item.date}
                    </span>

                    <div className="h-4 w-px bg-gray-300"></div>

                    <span className="w-fit mt-[-1.00px] font-normal text-gray-500 text-sm tracking-[-0.28px] leading-5 whitespace-nowrap font-sans">
                      {item.time}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    // </div>
  );
};

export default NotificationsComponent;