import React, { useState } from "react";
import Swal from "sweetalert2";
import { MDBBtn } from "mdb-react-ui-kit";
import { useNavigate } from "react-router-dom";
import { UserRegApi } from "../../services/authServices";

const AddPartnerForm = () => {
  const partnerEmail = JSON.parse(localStorage.getItem("partnerEmail") || '""');

  const [formData, setFormData] = useState({
    fullName: "",
    designation: "",
    email: "",
    mobile: "",
    institutionName: "",
    message: "",
    panNo: "",
    aadharNo: "",
    acDetails: "",     // <-- add this
    password: "",
    Avtar: null    ,    // <-- add this, assume file upload
    create_id:partnerEmail
  });
  

  const [errors, setErrors] = useState({});
const navigate = useNavigate()


const handleInputChange = (e) => {
  const { name, value, files } = e.target;
  const newValue = name === "Avtar" ? files[0] : value;

  setFormData((prev) => ({
    ...prev,
    [name]: newValue,
  }));
};


  const validateForm = () => {
    let validationErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const mobileRegex = /^[6-9]\d{9}$/;

    if (!formData.fullName) validationErrors.fullName = "Full name is required.";
    if (!formData.designation) validationErrors.designation = "Designation is required.";
    if (!formData.email) validationErrors.email = "Email is required.";
    else if (!emailRegex.test(formData.email)) validationErrors.email = "Invalid email format.";
    if (!formData.mobile) validationErrors.mobile = "Mobile number is required.";
    else if (!mobileRegex.test(formData.mobile)) validationErrors.mobile = "Invalid mobile number.";
    if (!formData.institutionName) validationErrors.institutionName = "Institution name is required.";
    if (!formData.message) validationErrors.message = "Message is required.";
    if (!formData.panNo) validationErrors.panNo = "PAN number is required.";
    if (!formData.aadharNo) validationErrors.aadharNo = "Aadhar number is required.";
    if (!formData.password) validationErrors.password = "Password is required.";
    else if (formData.password.length < 6) validationErrors.password = "Password must be at least 6 characters long.";

    setErrors(validationErrors);

    return Object.keys(validationErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    try {
      const formPayload = new FormData();
      for (const key in formData) {
        formPayload.append(key, formData[key]);
      }
  
      const response = await UserRegApi(formPayload); // this function must support FormData
      if (response.status === 201) {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Form submitted successfully!",
          timer: 2000, // Auto close after 2 seconds
          showConfirmButton: false,
        });
  
        setTimeout(() => {
          setFormData({
            fullName: "",
            designation: "",
            email: "",
            mobile: "",
            institutionName: "",
            message: "",
            panNo: "",
            aadharNo: "",
            password: "",
            Avtar: null  ,
            acDetails: "",
            user_Id:""
          });
          navigate("/ViewTeamPage");
        }, 2000); // Delay navigation for 2 seconds
      } else {
        Swal.fire("Error", "Something went wrong. Please try again.", "error");
      }
    } catch (error) {
        const errormessage = error.response.data.error
      Swal.fire("Error", errormessage, "error");
    }
  };
  

  return (
 
          <div className="card shadow-lg rounded-4 border-0">
            <div className="card-body p-5">
              <h3 className="text-center text-primary fw-bold mb-4">Become a Partner</h3>
              <p className="text-center text-muted mb-4">Join us as a partner and grow together!</p>

              {/* Form Fields */}
              {[
                { label: "Full Name", name: "fullName", type: "text", placeholder: "Enter full name" },
                { label: "Designation", name: "designation", type: "text", placeholder: "Enter designation" },
                { label: "Email ID", name: "email", type: "email", placeholder: "Enter email" },
                { label: "Mobile", name: "mobile", type: "tel", placeholder: "Enter mobile number" },
                { label: "Institution Name", name: "institutionName", type: "text", placeholder: "Enter institution name" },
                { label: "Message", name: "message", type: "textarea", placeholder: "Enter your message" },
                { label: "PAN Number", name: "panNo", type: "text", placeholder: "Enter PAN number" },
                { label: "Aadhar Number", name: "aadharNo", type: "text", placeholder: "Enter Aadhar number" },
                { label: "Account Details", name: "acDetails", type: "text", placeholder: "Enter Account Details" },
                { label: "Password", name: "password", type: "password", placeholder: "Enter password" },
                { label: "Avtar", name: "Avtar", type: "Img", placeholder: "Select Your Image" },
                 
                ].map((field) => (
                  <div className="form-group mb-4" key={field.name}>
                    <label className="form-label">{field.label}</label>
                
                    {field.type === "Img" ? (
                      <input
                        type="file"
                        accept="image/*"
                        className={`form-control ${errors[field.name] ? "is-invalid" : ""}`}
                        name={field.name}
                        onChange={handleInputChange}
                      />
                    ) : field.type === "textarea" ? (
                      <textarea
                        className={`form-control ${errors[field.name] ? "is-invalid" : ""}`}
                        placeholder={field.placeholder}
                        name={field.name}
                        value={formData[field.name]}
                        onChange={handleInputChange}
                      ></textarea>
                    ) : (
                      <input
                        type={field.type}
                        className={`form-control ${errors[field.name] ? "is-invalid" : ""}`}
                        placeholder={field.placeholder}
                        name={field.name}
                        value={formData[field.name]}
                        onChange={handleInputChange}
                      />
                    )}
                
                    {errors[field.name] && (
                      <div className="invalid-feedback">{errors[field.name]}</div>
                    )}
                  </div>
                ))}
                

              {/* Submit Button */}
              <div className="text-center">
                <MDBBtn outline color="primary" size="lg" className="rounded-pill px-5" onClick={handleSubmit}>
                  Submit →
                </MDBBtn>
              </div>
            </div>
          </div>
       
  );
};

export default AddPartnerForm;
