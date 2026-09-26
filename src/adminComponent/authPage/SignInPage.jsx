import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {LoginApi} from "../../services/authServices";
 import { useAuth } from "./contex";
import Swal from "sweetalert2";

const SinInPage = () => {
  const [UserName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { setToken, setData , setStatus , setUser_Id} = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await LoginApi({ UserName, password });
      if (response.token) {
        localStorage.setItem("authToken", response.token);
        setToken(response.token)
        setData (response.admin_name)
        setStatus (response.status)
        setUser_Id (response.user_Id)
        navigate("/admin/apply-form-data");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || "Login failed. Please try again.";
      Swal.fire("Error", errorMessage, "error");
    }
  };

  return (
    <section className="vh-100" style={{ backgroundColor: "#9A616D" }}>
      <div className="container py-5 h-100">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col col-xl-10">
            <div className="card" style={{ borderRadius: "1rem" }}>
              <div className="row g-0">
                <div className="col-md-6 col-lg-7 d-flex align-items-center">
                  <div className="card-body p-4 p-lg-5 text-black">
                    <form onSubmit={handleLogin}>
                      <div className="d-flex align-items-center mb-3 pb-1">
                     
                        <span className="h1 fw-bold mb-0">The Nari House</span>
                      </div>
                      <h5
                        className="fw-normal mb-3 pb-3"
                        style={{ letterSpacing: "1px" }}
                      >
                        Log In your account
                      </h5>
                      <div className="form-outline mb-4">
                        <input
                          type="text"
                          className="form-control form-control-lg"
                          value={UserName}
                          onChange={(e) => setUserName(e.target.value)}
                          required
                        />
                        <label className="form-label">Email address</label>
                      </div>
                      <div className="form-outline mb-4">
                        <input
                          type="password"
                          className="form-control form-control-lg"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                        />
                        <label className="form-label">Password</label>
                      </div>
                      <div className="pt-1 mb-4">
                        <button
                          className="btn btn-dark btn-lg btn-block"
                          type="submit"
                        >
                          Login
                        </button>
                      </div>
                      <a className="small text-muted" href="#!">
                        Forgot password?
                      </a>
                      <p className="mb-5 pb-lg-2" style={{ color: "#393f81" }}>
                        Don't have an account?{" "}
                        <a href="#!" style={{ color: "#393f81" }}>
                          Register here
                        </a>
                      </p>
                      <a href="#!" className="small text-muted">
                        Terms of use.
                      </a>
                      <a href="#!" className="small text-muted">
                        Privacy policy
                      </a>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SinInPage;
