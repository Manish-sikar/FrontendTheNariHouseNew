import React from "react";

const StatsStrip = ({ section }) => {
  const items = Array.isArray(section?.items) ? section.items : [];
  if (!items.length) return null;

  return (
    <section className="stats-strip">
      <div className="home-container stats-grid">
        {items.map((item) => (
          <div className="stat-item" key={item._id}>
            <strong>{item.title}</strong>
            <span>{item.description}</span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default StatsStrip;