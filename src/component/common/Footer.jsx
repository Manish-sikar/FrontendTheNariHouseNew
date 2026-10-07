import { Link } from "react-router-dom";
import { GetFooterDetailsData } from "../../services/footerService";
import { useEffect, useState } from "react";

const Footer = () => {
  const [footerData, setFooterData] = useState(null);

  useEffect(() => {
    fetchFooterData();
  }, []);

  const fetchFooterData = async () => {
    try {
      const response = await GetFooterDetailsData();
      const data = response.footer_Data[0];
      setFooterData(data);
    } catch (error) {
      console.error("Error fetching footer data:", error);
    }
  };

  return (
    <>
      {/* <!-- Footer Start --> */}
      <div className="container-fluid footer bg-dark wow fadeIn" data-wow-delay=".3s">
        <div className="container pt-5 pb-4">
          <div className="row g-5">
            <div className="col-lg-3 col-md-3">
              <Link to="#">
                <h1 className="text-white fw-bold d-block">
                  {footerData?.footer_title}
                </h1>
              </Link>
              <p className="mt-4 text-light">{footerData?.footer_desc}</p>
              <div className="d-flex hightech-link">
                {footerData?.footer_social_details?.map((social) => (
                  <Link
                    to={social.icon_url}
                    className="btn-light nav-fill btn btn-square rounded-circle me-2"
                    key={social._id}
                  >
                    <i className={social.icon_class + " text-primary"}></i>
                  </Link>
                ))}
              </div>
            </div>

            <div className="col-lg-2 col-md-2">
              <Link to="" className="h3 text-secondary text-white">CATEGORIES</Link>
              <div className="mt-4 d-flex flex-column help-link">
                {footerData?.footer_our_services?.map((service) => (
                  <Link to={`/${service.service_name}`} className="mb-2 text-white" key={service._id}>
                    <i className="fas fa-angle-right text-secondary me-2"></i>
                    {service.service_name}
                  </Link>
                ))}
              </div>
            </div>
            <div className="col-lg-2 col-md-2">
              <Link to="" className="h3 text-secondary text-white">QUICK LINK</Link>
              <div className="mt-4 d-flex flex-column help-link">
                {footerData?.footer_banking_services?.map((service) => (
                  <Link to={`/${service.service_name}`} className="mb-2 text-white" key={service._id}>
                    <i className="fas fa-angle-right text-secondary me-2"></i>
                    {service.service_name}
                  </Link>
                ))}
              </div>
            </div>
            <div className="col-lg-2 col-md-2">
              <Link to="" className="h3 text-secondary text-white">SUPPORT</Link>
              <div className="mt-4 d-flex flex-column help-link">
                {footerData?.footer_other_services?.map((service) => (
                  <Link to={`/${service.service_name}`} className="mb-2 text-white" key={service._id}>
                    <i className="fas fa-angle-right text-secondary me-2"></i>
                    {service.service_name}
                  </Link>
                ))}
              </div>
            </div>

            <div class="col-lg-3 col-md-2 position-relative">
              <Link to="" className="h3 text-secondary text-white">CONTACT</Link>
              <div className="text-white mt-4 d-flex flex-column contact-link">
                <Link to="" className="pb-3 text-light border-bottom border-primary">
                  
                  <div class="col-lg-6 wow fadeIn" data-wow-delay=".3s">
    <div class=" h-100 rounded contact-map">
        <iframe
            class="rounded w-101 h-100 "
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d225.1839507334776!2d75.790472!3d26.850811!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjbCsDUxJzAyLjkiTiA3NcKwNDcnMjUuNyJF!5e0!3m2!1sen!2sin!4v1707075441804!5m2!1sen!2sin"
            allowfullscreen=""
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade">
        </iframe>
    </div>
</div>

                </Link>
                <Link
                  to="https://www.google.com/maps/search/?api=1&query=26.850811,75.790472"
                  target="_blank"
                  className="pb-3 text-light border-bottom border-primary"
                >
                  <i className="fas fa-map-marker-alt text-secondary me-2"></i>
                  {footerData?.footer_address2}
                </Link>
                <Link to={`mailto:${footerData?.footer_email}`} className="py-3 text-light border-bottom border-primary">
                  <i className="fas fa-envelope text-secondary me-2"></i>
                  {footerData?.footer_email}
                </Link>
              </div>
            </div>
          </div>
          <hr className="text-light mt-5 mb-4" />
          <div className="row">
            <div className="col-md-12 text-center text-md-start">
              <span className="text-light">
                <Link to="" className="text-secondary">
                  © 2024 {footerData?.footer_title}
                </Link>
                , All rights reserved. {footerData?.footer_email}
              </span>
            </div>
          </div>
        </div>
      </div>
      {/* <!-- Footer End --> */}
    </>
  );
};

export default Footer;