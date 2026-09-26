import { useEffect, useState } from "react";
import { GetBannerData } from "../../services/bannerService";

const LoginBanner = () => {
  const defaultBannerData = [
    {
      banner_img:
        "https://my-jasnath-finance-project.s3.eu-north-1.amazonaws.com/banners/resized_1738144396798_d82020a7-9505-48f8-ab50-f7f0c3f981fd.jpeg",
    },
    {
      banner_img:
        "https://my-jasnath-finance-project.s3.eu-north-1.amazonaws.com/banners/resized_1738144963450_cb036896-bb88-42ca-a9bb-20fa18b0303b.jpeg",
    },
    {
      banner_img:
        "https://my-jasnath-finance-project.s3.eu-north-1.amazonaws.com/banners/resized_1738145188408_43d2d1b7-51d4-4002-b05f-c1070710bc0c.jpeg",
    },
    {
      banner_img:
        "https://my-jasnath-finance-project.s3.eu-north-1.amazonaws.com/banners/resized_1738145421552_4552469b-cf92-446c-a04e-fefe40778030.jpeg",
    },
    {
      banner_img:
        "https://my-jasnath-finance-project.s3.eu-north-1.amazonaws.com/banners/resized_1738145573568_880d7ae8-3ec1-4ddb-9e63-c972eeda71e5.jpeg",
    },
    {
      banner_img:
        "https://my-jasnath-finance-project.s3.eu-north-1.amazonaws.com/banners/resized_1738145705802_25337bb0-283b-4bd4-8125-fbe73a164b99.jpeg",
    },
    {
      banner_img:
        "https://my-jasnath-finance-project.s3.eu-north-1.amazonaws.com/banners/resized_1738145932856_d5e3bf18-9ef7-48c4-828c-1a7e1c2fa8da.jpeg",
    },
    {
      banner_img:
        "https://my-jasnath-finance-project.s3.eu-north-1.amazonaws.com/banners/resized_1738145995059_5acce86b-efbc-4ac0-a1e9-a1db1e7c5147.jpeg",
    },
  ];

  const [bannerData, setBannerData] = useState(defaultBannerData);


    useEffect(() => {
    const timer = setTimeout(() => {
      const myCarouselEl = document.querySelector('#carouselId');
      if (window.bootstrap && myCarouselEl) {
        new window.bootstrap.Carousel(myCarouselEl, {
          interval: 3000,
          ride: 'carousel',
        });
      }
    }, 1000); // wait until DOM renders
    return () => clearTimeout(timer);
  }, [bannerData]);


  
  const fetchBannerData = async () => {
    try {
      const response = await GetBannerData();
      const bannerData = response.banner_Data;
      const activeSlides = bannerData.filter((slide) => slide.status === "1");
      if (activeSlides.length > 0) {
        setBannerData(activeSlides);
      }
    } catch (error) {
      console.error("Failed to fetch banner data", error);
    }
  };

  useEffect(() => {
    fetchBannerData();
  }, []);

  useEffect(() => {
    console.log(bannerData, "bannerData");
  });

  return (
    <div className="container-fluid px-0">
      {/* <div id="carouselId" className="carousel slide" data-bs-ride="carousel"> */}
      <div
        id="carouselId"
        className="carousel slide"
        data-bs-ride="carousel"
        data-bs-interval="3000"
        data-bs-pause="hover"
      >
        {/* Carousel Indicators */}
        <ol className="carousel-indicators">
          {bannerData?.map((_, index) => (
            <li
              key={index}
              data-bs-target="#carouselId"
              data-bs-slide-to={index}
              className={index === 0 ? "active" : ""}
              aria-current={index === 0 ? "true" : undefined}
              aria-label={`Slide ${index + 1}`}
            ></li>
          ))}
        </ol>

        {/* Carousel Items */}
        <div className="carousel-inner">
          {bannerData.map((item, index) => (
            <div
              key={index}
              className={`carousel-item ${index === 0 ? "active" : ""}`}
            >
              <img
                src={item.banner_img}
                className="d-block w-100 img-fluid banner-image"
                alt={`Slide ${index + 1}`}
              />
              <div className="carousel-caption d-none d-md-block">
                {/* Add any text or buttons here if needed */}
              </div>
            </div>
          ))}
        </div>

        {/* Carousel Controls */}
        <button
          className="carousel-control-prev"
          type="button"
          data-bs-target="#carouselId"
          data-bs-slide="prev"
        >
          <span
            className="carousel-control-prev-icon"
            aria-hidden="true"
          ></span>
          <span className="visually-hidden">Previous</span>
        </button>
        <button
          className="carousel-control-next"
          type="button"
          data-bs-target="#carouselId"
          data-bs-slide="next"
        >
          <span
            className="carousel-control-next-icon"
            aria-hidden="true"
          ></span>
          <span className="visually-hidden">Next</span>
        </button>
      </div>
    </div>
  );
};

export default LoginBanner;
