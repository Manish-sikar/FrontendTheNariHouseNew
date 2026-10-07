import React, { useState } from "react";
import "./auth.css";

/**
 * Split-screen layout: brand panel on the left (hidden on mobile),
 * form card on the right.
 * Put your banner image at /public/img/login-banner.jpg
 * (the plum gradient shows if the image is missing).
 */
export const AuthShell = ({ panelTitle, panelText, children }) => (
  <div className="nh-auth">
    <aside className="nh-panel">
      <h2>{panelTitle}</h2>
      <p>{panelText}</p>
      <ul className="nh-perks">
        <li>Free shipping on orders ₹999+</li>
        <li>100% authentic, verified products</li>
        <li>Easy 15-day returns</li>
        <li>24/7 support</li>
      </ul>
    </aside>

    <main className="nh-main">
      <div className="nh-card">{children}</div>
    </main>
  </div>
);

/** Password input with a Show / Hide button. */
export const PasswordField = ({
  id,
  label,
  optionalLabel,
  error,
  children,
  ...inputProps
}) => {
  const [visible, setVisible] = useState(false);

  return (
    <div className="nh-field">
      <label htmlFor={id}>
        {label}
        {optionalLabel && <span className="nh-opt">(optional)</span>}
      </label>
      <div className="nh-pass">
        <input
          id={id}
          className={`nh-input ${error ? "is-invalid" : ""}`}
          type={visible ? "text" : "password"}
          {...inputProps}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? "Hide password" : "Show password"}
        >
          {visible ? "Hide" : "Show"}
        </button>
      </div>
      {error && <div className="nh-error">{error}</div>}
      {children}
    </div>
  );
};
