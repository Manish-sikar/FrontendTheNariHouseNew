
import React from "react";

const BenefitsStrip = ({ settings = {} }) => {
  const benefits = [
    {
      icon: "🚚",
      title: settings.shippingTitle || "Free Shipping",
      text: settings.shippingText || "On orders above ₹999",
    },
    {
      icon: "🔒",
      title: settings.paymentTitle || "Secure Payments",
      text: settings.paymentText || "100% secure checkout",
    },
    {
      icon: "↩️",
      title: settings.returnTitle || "Easy Returns",
      text: settings.returnText || "15-day returns",
    },
    {
      icon: "💬",
      title: settings.supportTitle || "24/7 Support",
      text: settings.supportText || "We're here to help",
    },
  ];

  return (
    <section className="benefits-strip">

      <div className="home-container benefits-grid">

        {benefits.map((item, index) => (
          <div className="benefit-item" key={index}>

            <span className="benefit-icon">
              {item.icon}
            </span>

            <div>
              <h4>{item.title}</h4>
              <p>{item.text}</p>
            </div>

          </div>
        ))}

      </div>

    </section>
  );
};

export default BenefitsStrip;