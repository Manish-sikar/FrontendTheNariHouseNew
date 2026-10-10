import React from "react";
import { Link } from "react-router-dom";

const PromoSection = ({ section }) => {
  if (!section) return null;

  const itemImages = (section.items || []).map((i) => i.image).filter(Boolean);
  const images = (itemImages.length ? itemImages : [section.image].filter(Boolean)).slice(0, 4);
  const paragraphs = (section.description || "").split("\n").filter((p) => p.trim());

  return (
    <section className="promo-section">
      <div className="promo-container">
        <div className="promo-content">
          {section.subtitle && <span className="promo-subtitle">{section.subtitle}</span>}
          <h2>{section.title}</h2>
          {paragraphs.map((p, i) => <p key={i}>{p}</p>)}
       {section.buttonText && (
  <Link to={section.buttonLink || "/"} className="promo-btn">
    {section.buttonText} <span>→</span>
  </Link>
)}
        </div>

        <div className="promo-images">
          {images.map((src, i) => (
            <img
              key={i}
              src={src}
              alt={section.title || "Promo"}
              onError={(e) => (e.currentTarget.src = "/img/category-default.jpg")}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default PromoSection;