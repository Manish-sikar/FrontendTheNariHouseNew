import React from "react";

const TestimonialSection = ({ section }) => {
  if (!section) return null;
  const items = Array.isArray(section.items) ? section.items : [];
  if (!items.length) return null;

  return (
    <section className="testimonial-section">
      <div className="home-container">
        <div className="section-heading center">
          {section.subtitle && <span>{section.subtitle}</span>}
          <h2>{section.title || "What Our Naaris Say"}</h2>
        </div>

        <div className="testimonial-grid">
          {items.map((item, index) => {
            const rating = Math.min(Number(item.rating || section.rating) || 5, 5);
            const location = item.location || item.buttonText || "";

            return (
              <div className="testimonial-card" key={item._id || index}>
                <div className="testimonial-stars">{"★".repeat(rating)}</div>

                <p className="testimonial-text">{item.description}</p>

                <div className="testimonial-user">
                  <img
                    className="testimonial-avatar"
                    src={item.image || "/img/category-default.jpg"}
                    alt={item.title}
                    onError={(e) => (e.currentTarget.src = "/img/category-default.jpg")}
                  />
                  <div>
                    <h5>{item.title}</h5>
                    {location && <small>{location}</small>}
                  </div>
                </div>

                <span className="testimonial-icon">☺</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;