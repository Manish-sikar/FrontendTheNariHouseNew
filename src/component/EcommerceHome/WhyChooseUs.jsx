import React from "react";

const WhyChooseUs = ({ section }) => {
  if (!section) return null;

  const items = Array.isArray(section.items)
    ? section.items
    : [];

  const imageUrl =
    section.image || "/img/category-default.jpg";

  return (
    <section className="why-choose-section">

      <div className="home-container">

        <div className="section-heading center">

          {section.subtitle && (
            <span>
              {section.subtitle}
            </span>
          )}

          <h2>
            {section.title || "Why Choose Us"}
          </h2>

          {section.description && (
            <p>
              {section.description}
            </p>
          )}

        </div>

        {/* IMAGE */}
        <div className="why-choose-image">
          <img
            src={imageUrl}
            alt={section.title || "Why Choose Us"}
            onError={(e) => {
              e.currentTarget.src =
                "/img/category-default.jpg";
            }}
          />
        </div>

        {/* ITEMS */}
        <div className="why-choose-grid">

          {items.map((item, index) => (
            <div
              className="why-choose-card"
              key={item._id || index}
            >

              {item.icon && (
                <div className="why-icon">
                  <i className={item.icon}></i>
                </div>
              )}

              {item.title && (
                <h4>{item.title}</h4>
              )}

              {item.description && (
                <p>
                  {item.description}
                </p>
              )}

            </div>
          ))}

        </div>

      </div>

    </section>
  );
};

export default WhyChooseUs;