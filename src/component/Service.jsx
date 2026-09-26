import React, { useEffect, useState } from "react";
import Card from "react-bootstrap/Card";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules"; // Import Autoplay module
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { GetServiceData } from "../services/serviceAdmin";

const Service = () => {
  const [servicesData, setServicesData] = useState([]);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await GetServiceData();
      const serviceData = response.services_Data;
      setServicesData(serviceData.filter((service) => service.status === "1"));
    } catch (error) {
      console.error("Error fetching services:", error);
    }
  };

  return (
    <div className="service-page-container" style={{ width: "100%", overflow: "hidden" }}>
      {servicesData.length === 0 ? (
        ""
      ) : (
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={7}
          slidesPerView={6} 
          loop={true}
          autoplay={{ delay: 2000, disableOnInteraction: false }}
          navigation
          pagination={{ clickable: true }}
          breakpoints={{
            320: { slidesPerView: 1, spaceBetween: 10 },  // Mobile
            640: { slidesPerView: 3, spaceBetween: 15 }, // Small tablets
            768: { slidesPerView: 4, spaceBetween: 20 }, // Tablets
            1024: { slidesPerView: 6, spaceBetween: 20 },
            1280: { slidesPerView: 8, spaceBetween: 15 }, // Desktops
          }}
          style={{ width: "100%", padding: "0" }}
        >
          {servicesData.map((item, idx) => (
            <SwiperSlide key={idx} style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
              <Card style={{ width: "100%", maxWidth: "150px" }} className="p-3 shadow-sm border-0 rounded-3">
                <Card.Img
                  variant="top"
                  src={item.card_logo ? item.card_logo : "https://via.placeholder.com/150"}
                  alt={item.card_title || `Card ${idx + 1}`}
                  className="card__img rounded-3 img-fluid"
                />
                 <Card.Title className="small-card-title text-center">
  {item.card_title || `Card ${idx + 1}`}
</Card.Title>
              </Card>
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </div>
  );
};

export default Service;
