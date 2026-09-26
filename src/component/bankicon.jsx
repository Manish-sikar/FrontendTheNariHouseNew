import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules"; 
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const BankServices = () => {
  const [servicesData, setServicesData] = useState([]);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setServicesData(dummyProductData); // Using dummy data
    } catch (error) {
      console.error("Error fetching services:", error);
    }
  };

  // Dummy Data (Replace with API data if available)
  const dummyProductData = [
    { card_logo: "/img/1200px-Aavas_Financiers_Logo.svg.png", title: "Muthoot Finance" },
    { card_logo: "/img/2560px-Axis_Bank_logo.svg.png", title: "Northern Arc" },
    { card_logo: "/img/2560px-HDFC_Bank_Logo.svg.png", title: "PNB Housing" },
    { card_logo: "/img/2560px-ICICI_Bank_Logo.svg.png", title: "Tyger Home Finance" },
    { card_logo: "/img/2560px-RBL_Bank_SVG_Logo.svg.png", title: "Piramal Finance" },
    { card_logo: "/img/AU_SMALL_FINANCE_BANK_.png", title: "TVS Credit" },
    { card_logo: "/img/Axis_Bank-Logo.wine.png", title: "Aavas Financiers" },
    { card_logo: "/img/axis-bank-1623303816.jpg", title: "Aavas Financiers" },
    { card_logo: "/img/cs-AU-Small-Finance-Bank.jpg", title: "Aavas Financiers" },
    { card_logo: "/img/HDFC.webp", title: "Aavas Financiers" },
    { card_logo: "/img/IDFC_First_Bank_Logo.png", title: "Aavas Financiers" },
    { card_logo: "/img/images.jpg", title: "Aavas Financiers" },
    { card_logo: "/img/Kotak_Mahindra_Group_logo.svg-1024x306.png", title: "Aavas Financiers" },
    { card_logo: "/img/Mahindra-Finance-logo-Vector.png", title: "Aavas Financiers" },
    { card_logo: "/img/download (1).jpg", title: "Aavas Financiers" },
    { card_logo: "/img/png-clipart-yes-bank-private-sector-banks-in-india-finance-business-yes-blue-angle-thumbnail.png", title: "Aavas Financiers" },
    
  ];

  return (
    <div className="bank-logos-carousel" style={{ width: "100%", background: "#fff", padding: "20px 0 " }}>
      {servicesData.length === 0 ? (
        <p className="text-center">No services available at the moment.</p>
      ) : (
        <Swiper
          modules={[Navigation, Autoplay]}
          spaceBetween={10}
          slidesPerView={8} 
          loop={true}
          autoplay={{ delay: 2000, disableOnInteraction: false }}
          navigation
          breakpoints={{
            320: { slidesPerView: 2, spaceBetween: 5 }, 
            640: { slidesPerView: 5, spaceBetween: 10 },
            1024: { slidesPerView: 8, spaceBetween: 15 },
            1280: { slidesPerView: 10, spaceBetween: 20 },
          }}
          style={{ width: "100%" }}
        >
          {servicesData.map((item, idx) => (
            <SwiperSlide key={idx} style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
              <img
                src={item.card_logo}
                alt={item.title}
                title={item.title}
                className="bank-logo"
                style={{
                  maxWidth: "100px",
                  height: "55px",
                  objectFit: "contain",
                }}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </div>
  );
};

export default BankServices;
