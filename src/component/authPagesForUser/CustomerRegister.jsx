import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { CustomerRegisterApi } from "../../services/customerAuthServices";
import { AuthShell, PasswordField } from "./AuthShell";

const STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Delhi", "Jammu and Kashmir", "Ladakh", "Chandigarh", "Puducherry",
];

const MAX_IMAGE_MB = 2;

const initialForm = {
  // required
  fullName: "",
  email: "",
  mobile: "",
  password: "",
  confirmPassword: "",
  // optional
  gender: "",
  dob: "",
  alternateMobile: "",
  addressLine: "",
  city: "",
  state: "",
  pincode: "",
  newsletter: true,
  terms: false,
};

const passwordScore = (p) => {
  let s = 0;
  if (p.length >= 6) s++;
  if (p.length >= 10 && /[A-Z]/.test(p) && /\d/.test(p)) s++;
  if (/[^A-Za-z0-9]/.test(p) && p.length >= 8) s++;
  return s;
};

const CustomerRegister = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [showMore, setShowMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState("");

  // clean up the preview URL
  useEffect(() => {
    return () => preview && URL.revokeObjectURL(preview);
  }, [preview]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
    if (errors[name]) setErrors((er) => ({ ...er, [name]: "" }));
  };

  const handleImage = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      return Swal.fire("Error", "Please choose an image file.", "error");
    }
    if (file.size > MAX_IMAGE_MB * 1024 * 1024) {
      return Swal.fire("Error", `Image must be under ${MAX_IMAGE_MB} MB.`, "error");
    }

    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const removeImage = () => {
    setImageFile(null);
    setPreview("");
  };

  const validate = () => {
    const e = {};
    if (!form.fullName.trim()) e.fullName = "Enter your full name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = "Enter a valid email address.";
    if (!/^\d{10}$/.test(form.mobile))
      e.mobile = "Enter a 10-digit mobile number.";
    if (form.password.length < 6)
      e.password = "Password must be at least 6 characters.";
    if (form.password !== form.confirmPassword)
      e.confirmPassword = "Passwords do not match.";

    // optional fields: validate only when filled in
    if (form.alternateMobile && !/^\d{10}$/.test(form.alternateMobile))
      e.alternateMobile = "Enter a 10-digit mobile number.";
    if (form.pincode && !/^\d{6}$/.test(form.pincode))
      e.pincode = "Enter a 6-digit pincode.";

    if (!form.terms) e.terms = "Please accept the terms to continue.";

    // make sure hidden optional errors are visible
    if ((e.alternateMobile || e.pincode) && !showMore) setShowMore(true);

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    if (!validate()) return;

    // FormData because of the profile image
    const data = new FormData();
    const { confirmPassword, terms, ...rest } = form;

    Object.entries(rest).forEach(([key, value]) => {
      if (typeof value === "boolean") data.append(key, value);
      else if (String(value).trim() !== "") data.append(key, String(value).trim());
    });
    if (imageFile) data.append("profileImage", imageFile);

    try {
      setLoading(true);
      await CustomerRegisterApi(data);

      await Swal.fire(
        "Success",
        "Registration successful. Please sign in.",
        "success",
      );
      navigate("/login-User");
    } catch (error) {
      Swal.fire(
        "Error",
        error?.response?.data?.message || "Registration failed",
        "error",
      );
    } finally {
      setLoading(false);
    }
  };

  const score = passwordScore(form.password);

  const Field = ({ name, label, optional, type = "text", ...props }) => (
    <div className="nh-field">
      <label htmlFor={name}>
        {label}
        {optional && <span className="nh-opt">(optional)</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        className={`nh-input ${errors[name] ? "is-invalid" : ""}`}
        value={form[name]}
        onChange={handleChange}
        {...props}
      />
      {errors[name] && <div className="nh-error">{errors[name]}</div>}
    </div>
  );

  return (
    <AuthShell
      panelTitle="Join The Naari House."
      panelText="Create an account to save your favourites, get order updates and enjoy faster checkout."
    >
      <h1>Create your account</h1>
      <p className="nh-sub">
        It takes a minute. Only the first five fields are required.
      </p>

      <form onSubmit={handleSubmit} noValidate>
        {Field({
          name: "fullName",
          label: "Full name",
          placeholder: "Your full name",
          autoComplete: "name",
        })}

        <div className="nh-grid-2">
          {Field({
            name: "email",
            label: "Email address",
            type: "email",
            placeholder: "you@example.com",
            autoComplete: "email",
          })}
          {Field({
            name: "mobile",
            label: "Mobile number",
            type: "tel",
            placeholder: "10-digit number",
            maxLength: 10,
            inputMode: "numeric",
            autoComplete: "tel",
          })}
        </div>

        <div className="nh-grid-2">
          <PasswordField
            id="password"
            name="password"
            label="Password"
            placeholder="At least 6 characters"
            value={form.password}
            onChange={handleChange}
            error={errors.password}
            autoComplete="new-password"
          >
            {form.password && (
              <div className="nh-strength" aria-hidden="true">
                {[1, 2, 3].map((n) => (
                  <span key={n} className={score >= n ? `on-${score}` : ""} />
                ))}
              </div>
            )}
          </PasswordField>

          <PasswordField
            id="confirmPassword"
            name="confirmPassword"
            label="Confirm password"
            placeholder="Re-enter password"
            value={form.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
            autoComplete="new-password"
          />
        </div>

        {/* ---------- Optional details ---------- */}
        <button
          type="button"
          className="nh-toggle"
          onClick={() => setShowMore((s) => !s)}
          aria-expanded={showMore}
        >
          <span>Add profile and delivery details (optional)</span>
          <span>{showMore ? "−" : "+"}</span>
        </button>

        {showMore && (
          <>
            <div className="nh-section">
              <h3>Profile</h3>
              <p>Helps us personalise your account. You can add this later.</p>

              <div className="nh-avatar">
                <div
                  className="nh-avatar-preview"
                  style={preview ? { backgroundImage: `url(${preview})` } : {}}
                >
                  {!preview && (form.fullName.trim()[0] || "N").toUpperCase()}
                </div>
                <div>
                  <input
                    id="profileImage"
                    className="nh-file"
                    type="file"
                    accept="image/*"
                    onChange={handleImage}
                  />
                  <label htmlFor="profileImage" className="nh-file-btn">
                    {preview ? "Change photo" : "Upload photo"}
                  </label>{" "}
                  {preview && (
                    <button type="button" className="nh-link" onClick={removeImage}>
                      Remove
                    </button>
                  )}
                  <small>JPG or PNG, up to {MAX_IMAGE_MB} MB</small>
                </div>
              </div>

              <div className="nh-grid-2">
                <div className="nh-field">
                  <label htmlFor="gender">
                    Gender<span className="nh-opt">(optional)</span>
                  </label>
                  <select
                    id="gender"
                    name="gender"
                    className="nh-select"
                    value={form.gender}
                    onChange={handleChange}
                  >
                    <option value="">Select</option>
                    <option value="female">Female</option>
                    <option value="male">Male</option>
                    <option value="other">Other</option>
                    <option value="prefer_not_to_say">Prefer not to say</option>
                  </select>
                </div>

                {Field({
                  name: "dob",
                  label: "Date of birth",
                  optional: true,
                  type: "date",
                  max: new Date().toISOString().split("T")[0],
                })}
              </div>

              {Field({
                name: "alternateMobile",
                label: "Alternate mobile",
                optional: true,
                type: "tel",
                placeholder: "10-digit number",
                maxLength: 10,
                inputMode: "numeric",
              })}
            </div>

            <div className="nh-section" style={{ marginTop: 0 }}>
              <h3>Delivery address</h3>
              <p>Save an address now and checkout will be quicker.</p>

              {Field({
                name: "addressLine",
                label: "Address",
                optional: true,
                placeholder: "House no., street, area",
                autoComplete: "street-address",
              })}

              <div className="nh-grid-2">
                {Field({
                  name: "city",
                  label: "City",
                  optional: true,
                  placeholder: "City",
                  autoComplete: "address-level2",
                })}

                <div className="nh-field">
                  <label htmlFor="state">
                    State<span className="nh-opt">(optional)</span>
                  </label>
                  <select
                    id="state"
                    name="state"
                    className="nh-select"
                    value={form.state}
                    onChange={handleChange}
                  >
                    <option value="">Select state</option>
                    {STATES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {Field({
                name: "pincode",
                label: "Pincode",
                optional: true,
                placeholder: "6-digit pincode",
                maxLength: 6,
                inputMode: "numeric",
                autoComplete: "postal-code",
              })}
            </div>
          </>
        )}

        {/* ---------- Preferences ---------- */}
        <label className="nh-check" style={{ marginBottom: 12 }}>
          <input
            type="checkbox"
            name="newsletter"
            checked={form.newsletter}
            onChange={handleChange}
          />
          Send me updates about new arrivals and offers
        </label>

        <label className="nh-check" style={{ marginBottom: errors.terms ? 4 : 22 }}>
          <input
            type="checkbox"
            name="terms"
            checked={form.terms}
            onChange={handleChange}
          />
          <span>
            I agree to the{" "}
            <Link className="nh-link" to="/terms" target="_blank">
              Terms &amp; Conditions
            </Link>{" "}
            and{" "}
            <Link className="nh-link" to="/privacy-policy" target="_blank">
              Privacy Policy
            </Link>
          </span>
        </label>
        {errors.terms && (
          <div className="nh-error" style={{ marginBottom: 18 }}>
            {errors.terms}
          </div>
        )}

        <button className="nh-btn" type="submit" disabled={loading}>
          {loading ? "Creating account..." : "Create account"}
        </button>
      </form>

      <p className="nh-foot">
        Already have an account?{" "}
        <Link className="nh-link" to="/login-User">
          Sign in
        </Link>
      </p>
    </AuthShell>
  );
};

export default CustomerRegister;
