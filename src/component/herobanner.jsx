
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getHomeBanners } from "../services/homeService";


const HeroSlider = () => {
  const [banners, setBanners] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBanners();
  }, []);

  // Auto Slide
  useEffect(() => {
    if (banners.length <= 1) return;

    const timer = setInterval(() => {
      setActiveIndex(
        (prev) => (prev + 1) % banners.length
      );
    }, 5000);

    return () => clearInterval(timer);
  }, [banners.length]);

  const fetchBanners = async () => {
    try {
      const response = await getHomeBanners();

      console.log("Banner API Response:", response);

      // API response ke according data extract
      const data =
        response?.banner_Data ||
        response?.data?.banner_Data ||
        (Array.isArray(response?.data)
          ? response.data
          : []);

      // Active banners only
      const activeBanners = data.filter(
        (item) => Number(item.status) === 1
      );

      setBanners(activeBanners);
      setActiveIndex(0);

    } catch (error) {
      console.error("Banner Error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="home-loader">
        Loading Banner...
      </div>
    );
  }

  if (!banners.length) {
    return (
      <div className="home-loader">
        No Banner Available
      </div>
    );
  }

  const banner = banners[activeIndex];

  return (
    <section className="hero-slider">

      <div className="hero-slide">

        {/* Left Content */}
        <div className="hero-slide-content">

          <span className="hero-label">
            {banner.title || "SEASON'S PICK"}
          </span>

          <h1>
            {banner.heading}
          </h1>

          <h2>
            {banner.title}
          </h2>

          <p>
            {banner.desc_txt}
          </p>

          <div className="hero-buttons">

            {/* Dynamic Button */}
            <Link
              to={banner.btn_link || "/products"}
              className="hero-btn primary"
            >
              {banner.btn_txt || "Explore Now"}
            </Link>

            {/* View All */}
            <Link
              to="/products"
              className="hero-btn secondary"
            >
              View All
            </Link>

          </div>

        </div>

        {/* Right Image */}
        <div className="hero-slide-image">

          <img
            src={banner.banner_img}
            alt={banner.heading || banner.title}
            loading="eager"
          />

        </div>

      </div>

      {/* Previous Button */}
      {banners.length > 1 && (
        <button
          className="hero-arrow prev"
          aria-label="Previous banner"
          onClick={() =>
            setActiveIndex(
              (activeIndex - 1 + banners.length) %
                banners.length
            )
          }
        >
          ‹
        </button>
      )}

      {/* Next Button */}
      {banners.length > 1 && (
        <button
          className="hero-arrow next"
          aria-label="Next banner"
          onClick={() =>
            setActiveIndex(
              (activeIndex + 1) % banners.length
            )
          }
        >
          ›
        </button>
      )}

      {/* Dynamic Dots */}
      {banners.length > 1 && (
        <div className="hero-dots">

          {banners.map((item, index) => (
            <button
              key={item._id || index}
              aria-label={`Go to banner ${index + 1}`}
              className={
                index === activeIndex ? "active" : ""
              }
              onClick={() => setActiveIndex(index)}
            />
          ))}

        </div>
      )}

    </section>
  );
};

export default HeroSlider;