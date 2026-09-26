import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { CustomerRegisterApi } from "../../services/customerAuthServices";

const CustomerRegister = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const {
      fullName,
      email,
      mobile,
      password,
      confirmPassword,
    } = formData;

    if (
      !fullName ||
      !email ||
      !mobile ||
      !password ||
      !confirmPassword
    ) {
      return Swal.fire(
        "Error",
        "All fields are required",
        "error"
      );
    }

    if (password !== confirmPassword) {
      return Swal.fire(
        "Error",
        "Passwords do not match",
        "error"
      );
    }

    try {
      setLoading(true);

      await CustomerRegisterApi({
        fullName,
        email,
        mobile,
        password,
      });

      await Swal.fire(
        "Success",
        "Registration successful. Please login",
        "success"
      );

      navigate("/login-User");
    } catch (error) {
      Swal.fire(
        "Error",
        error?.response?.data?.message ||
          "Registration failed",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <h2 className="mb-4">Create Customer Account</h2>

          <form onSubmit={handleSubmit}>
            <input
              className="form-control mb-3"
              name="fullName"
              placeholder="Full Name"
              value={formData.fullName}
              onChange={handleChange}
            />

            <input
              className="form-control mb-3"
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
            />

            <input
              className="form-control mb-3"
              name="mobile"
              placeholder="Mobile Number"
              value={formData.mobile}
              onChange={handleChange}
            />

            <input
              className="form-control mb-3"
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
            />

            <input
              className="form-control mb-3"
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
            />

            <button
              className="btn btn-success w-100"
              type="submit"
              disabled={loading}
            >
              {loading ? "Registering..." : "Register"}
            </button>
          </form>

          <p className="mt-3">
            Already have an account?{" "}
            <Link to="/login-User">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default CustomerRegister;