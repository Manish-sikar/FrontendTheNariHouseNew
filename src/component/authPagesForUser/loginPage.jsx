import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { CustomerLoginApi } from "../../services/customerAuthServices";
import { useAuthUser } from "./contexUser";
import { AuthShell, PasswordField } from "./AuthShell";
import ForgotPasswordModal from "./ForgotPasswordModal";

const LoginUser = () => {
  const navigate = useNavigate();
  const { setTokenUser, setDataUser, setuserEmail, setuserStatus } =
    useAuthUser();

  const remembered = localStorage.getItem("rememberedLogin") || "";

  const [emailORphone, setEmailORPhone] = useState(remembered);
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(!!remembered);
  const [loading, setLoading] = useState(false);
  const [forgotOpen, setForgotOpen] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!emailORphone.trim() || !password) {
      return Swal.fire(
        "Error",
        "Email/mobile and password are required",
        "error",
      );
    }

    try {
      setLoading(true);

      const response = await CustomerLoginApi({
        emailORphone: emailORphone.trim(),
        password,
      });

      if (response.success && response.token) {
        localStorage.setItem("authTokenUser", response.token);
        localStorage.setItem("userDataUser", JSON.stringify(response.user));

        // "Remember me" only remembers the email/mobile, never the password
        if (remember) {
          localStorage.setItem("rememberedLogin", emailORphone.trim());
        } else {
          localStorage.removeItem("rememberedLogin");
        }

        setTokenUser(response.token);
        setDataUser(response.user.fullName);
        setuserEmail(response.user.email);
        setuserStatus(response.user.status);

        await Swal.fire({
          icon: "success",
          title: "Welcome back!",
          text: "Login successful.",
          timer: 1200,
          showConfirmButton: false,
        });

        navigate("/");
      }
    } catch (error) {
      Swal.fire(
        "Error",
        error?.response?.data?.message || "Login failed. Please try again.",
        "error",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AuthShell
        panelTitle="Ethnic wear you'll love wearing."
        panelText="Sign in to track your orders, save your wishlist and check out faster."
      >
        <h1>Sign in</h1>
        <p className="nh-sub">
          Welcome back. Enter your details to continue shopping.
        </p>

        <form onSubmit={handleLogin} noValidate>
          <div className="nh-field">
            <label htmlFor="emailORphone">Email or mobile number</label>
            <input
              id="emailORphone"
              className="nh-input"
              type="text"
              placeholder="you@example.com or 9876543210"
              value={emailORphone}
              onChange={(e) => setEmailORPhone(e.target.value)}
              autoComplete="username"
            />
          </div>

          <PasswordField
            id="password"
            label="Password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />

          <div className="nh-row">
            <label className="nh-check">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
              />
              Remember me
            </label>
            <button
              type="button"
              className="nh-link"
              onClick={() => setForgotOpen(true)}
            >
              Forgot password?
            </button>
          </div>

          <button className="nh-btn" type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="nh-foot">
          New to The Naari House?{" "}
          <Link className="nh-link" to="/customer-register">
            Create an account
          </Link>
        </p>
      </AuthShell>

      <ForgotPasswordModal
        open={forgotOpen}
        onClose={() => setForgotOpen(false)}
      />
    </>
  );
};

export default LoginUser;
