import React, { useState } from "react";

const NewsletterSection = ({ section }) => {
  const [email, setEmail] = useState("");
  if (!section) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmedEmail = email.trim();
    if (!trimmedEmail) return;
    console.log("Newsletter Email:", trimmedEmail);
    setEmail("");
  };

  return (
    <section className="newsletter-section">
      <div className="newsletter-container">
        {section.subtitle && (
          <span className="newsletter-subtitle">{section.subtitle}</span>
        )}
        <h2>{section.title || "Stay in the Loop"}</h2>
        {section.description && <p>{section.description}</p>}

        <form onSubmit={handleSubmit} className="newsletter-form">
          <input
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit">{section.buttonText || "Subscribe"}</button>
        </form>

        <small className="newsletter-note">
          {section.note || "Unsubscribe anytime. No spam, promise."}
        </small>
      </div>
    </section>
  );
};

export default NewsletterSection;