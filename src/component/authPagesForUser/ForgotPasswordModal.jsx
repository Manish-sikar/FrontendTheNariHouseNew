import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";

import {
  ForgotPasswordApi,
  VerifyOtpApi,
  ResetPasswordApi,
} from "../../services/authServices";

import { PasswordField } from "./AuthShell";
import "./auth.css";

const ForgotPasswordModal = ({ open, onClose }) => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [busy, setBusy] = useState(false);

  // Reset modal when closed
  useEffect(() => {
    if (!open) {
      setStep(1);
      setEmail("");
      setOtp("");
      setNewPassword("");
      setConfirmPassword("");
      setBusy(false);
    }
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  const run = async (fn) => {
    try {
      setBusy(true);
      await fn();
    } finally {
      setBusy(false);
    }
  };

  // ==========================================
  // SEND OTP
  // ==========================================

  const sendOtp = (e) => {
    e.preventDefault();

    const emailValue = email.trim().toLowerCase();

    if (!emailValue) {
      return Swal.fire(
        "Error",
        "Please enter your email address.",
        "error"
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue)) {
      return Swal.fire(
        "Error",
        "Enter a valid email address.",
        "error"
      );
    }

    run(async () => {
      try {
        const response = await ForgotPasswordApi({
          email: emailValue,
        });

        if (response?.data?.success) {
          setEmail(emailValue);
          setStep(2);

          await Swal.fire(
            "Success",
            response?.data?.message ||
              "OTP sent to your email.",
            "success"
          );
        } else {
          Swal.fire(
            "Error",
            response?.data?.message ||
              "Failed to send OTP.",
            "error"
          );
        }
      } catch (error) {
        console.error(
          "Send OTP Error:",
          error?.response?.data || error
        );

        Swal.fire(
          "Error",
          error?.response?.data?.message ||
            "Failed to send OTP.",
          "error"
        );
      }
    });
  };

  // ==========================================
  // VERIFY OTP
  // ==========================================

  const verifyOtp = (e) => {
    e.preventDefault();

    const otpValue = otp.trim();

    if (!otpValue) {
      return Swal.fire(
        "Error",
        "Enter the OTP.",
        "error"
      );
    }

    run(async () => {
      try {
        const response = await VerifyOtpApi({
          email: email.trim().toLowerCase(),
          otp: otpValue,
        });

        if (response?.data?.success) {
          setOtp(otpValue);
          setStep(3);
        } else {
          Swal.fire(
            "Error",
            response?.data?.message ||
              "Invalid or expired OTP.",
            "error"
          );
        }
      } catch (error) {
        console.error(
          "Verify OTP Error:",
          error?.response?.data || error
        );

        Swal.fire(
          "Error",
          error?.response?.data?.message ||
            "Invalid or expired OTP.",
          "error"
        );
      }
    });
  };

  // ==========================================
  // RESET PASSWORD
  // ==========================================

  const resetPassword = (e) => {
    e.preventDefault();

    if (!email.trim()) {
      return Swal.fire(
        "Error",
        "Email is required.",
        "error"
      );
    }

    if (!otp.trim()) {
      return Swal.fire(
        "Error",
        "OTP is required.",
        "error"
      );
    }

    if (!newPassword) {
      return Swal.fire(
        "Error",
        "Please enter a new password.",
        "error"
      );
    }

    if (newPassword.length < 6) {
      return Swal.fire(
        "Error",
        "Password must be at least 6 characters.",
        "error"
      );
    }

    if (!confirmPassword) {
      return Swal.fire(
        "Error",
        "Please confirm your password.",
        "error"
      );
    }

    if (newPassword !== confirmPassword) {
      return Swal.fire(
        "Error",
        "Passwords do not match.",
        "error"
      );
    }

    run(async () => {
      try {
        const response = await ResetPasswordApi({
          email: email.trim().toLowerCase(),
          otp: otp.trim(),
          newPassword,
          confirmPassword,
        });

        if (response?.data?.success) {
          await Swal.fire(
            "Success",
            "Password changed successfully. Please sign in.",
            "success"
          );

          onClose();
        } else {
          Swal.fire(
            "Error",
            response?.data?.message ||
              "Failed to reset password.",
            "error"
          );
        }
      } catch (error) {
        console.error(
          "Reset Password Error:",
          error?.response?.data || error
        );

        Swal.fire(
          "Error",
          error?.response?.data?.message ||
            "Failed to reset password.",
          "error"
        );
      }
    });
  };

  return (
    <div
      className="nh-overlay"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className="nh-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="fp-title"
      >
        {/* CLOSE */}
        <button
          type="button"
          className="nh-close"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>

        {/* STEP */}
        <div className="nh-step">
          Step {step} of 3
        </div>

        {/* =====================================
            STEP 1 - EMAIL
        ===================================== */}

     {step === 1 && (
  <form onSubmit={sendOtp}>
    <h2 id="fp-title">
      Forgot password?
    </h2>

    <p className="nh-sub">
      Enter your account email and we'll send you a one-time code.
    </p>

    <div className="nh-field">
      <label htmlFor="fp-email">
        Email address
      </label>

      <input
        id="fp-email"
        className="nh-input"
        type="email"
        placeholder="you@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        autoFocus
      />
    </div>

    {/* SEND OTP BUTTON */}
 <button
  type="submit"
  className="nh-btn"
  disabled={busy}
  style={{
    display: "block",
    width: "100%",
    height: "48px",
    marginTop: "12px",
    background: "#1f8a8a",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "15px",
    fontWeight: "600",
    position: "relative",
    zIndex: 9999,
  }}
>
  {busy ? "Sending..." : "Send OTP"}
</button>
  </form>
)}

        {/* =====================================
            STEP 2 - OTP
        ===================================== */}

        {step === 2 && (
          <form onSubmit={verifyOtp}>
            <h2 id="fp-title">
              Enter the code
            </h2>

            <p className="nh-sub">
              We sent a code to {email}.
            </p>

            <div className="nh-field">
              <label htmlFor="fp-otp">
                One-time code
              </label>

              <input
                id="fp-otp"
                className="nh-input"
                type="text"
                inputMode="numeric"
                maxLength={6}
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) =>
                  setOtp(
                    e.target.value.replace(
                      /\D/g,
                      ""
                    )
                  )
                }
                autoFocus
              />
            </div>

            <button
              className="nh-btn"
              type="submit"
              disabled={busy}
            >
              {busy
                ? "Verifying..."
                : "Verify OTP"}
            </button>

            <p className="nh-foot">
              Wrong email?{" "}
              <button
                type="button"
                className="nh-link"
                onClick={() => {
                  setOtp("");
                  setStep(1);
                }}
              >
                Go back
              </button>
            </p>
          </form>
        )}

        {/* =====================================
            STEP 3 - RESET PASSWORD
        ===================================== */}

        {step === 3 && (
          <form onSubmit={resetPassword}>
            <h2 id="fp-title">
              Set a new password
            </h2>

            <p className="nh-sub">
              Use at least 6 characters.
            </p>

            <PasswordField
              id="fp-new"
              label="New password"
              value={newPassword}
              onChange={(e) =>
                setNewPassword(e.target.value)
              }
            />

            <PasswordField
              id="fp-confirm"
              label="Confirm password"
              value={confirmPassword}
              onChange={(e) =>
                setConfirmPassword(e.target.value)
              }
            />

            <button
              className="nh-btn"
              type="submit"
              disabled={busy}
            >
              {busy
                ? "Saving..."
                : "Reset password"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordModal;