import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { AddnewUserApplyForm } from "../../services/applyNewUserForm";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuthUser } from "../authPagesForUser/contexUser";

const UserFormFillPage = () => {
  const [statesData, setStatesData] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [receiptData, setReceiptData] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { setuserBalance } = useAuthUser();
  const [loading, setLoading] = useState(false);


  const partnerEmail = JSON.parse(localStorage.getItem("partnerEmail") || '""');
const userDelar_id = localStorage.getItem("userDelar_id") || "";


  const [formData, setFormData] = useState({
    partnerEmail,
    fullName: "",
    email: "",
    phone: "",
    panCard: "",
    state: "",
    district: "",
    fullAddress: "",
    category: location.state?.category || "",
    subCategory: location.state?.subcategory || "",
    amount: location.state?.amount || 0,
    document1: null,
    document2: null,
    document3: null,
    userDelar_id:userDelar_id , 
    DelarAmount:location.state?.DelarAmount || ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files.length > 0) {
      setFormData((prev) => ({
        ...prev,
        [name]: files[0],
      }));
    }
  };

  useEffect(() => {
    const fetchStatesData = async () => {
      try {
        const response = await fetch("/assets/json/states-and-districts.json");
        const data = await response.json();
        setStatesData(data.states);
      } catch (error) {
        Swal.fire(
          "Error!",
          "Failed to load states and districts data.",
          "error"
        );
      }
    };
    fetchStatesData();
  }, []);

  const handleStateChange = (e) => {
    const selectedState = e.target.value;
    // setSelectedState(selectedState);
    const stateData = statesData.find((state) => state.state === selectedState);
    setDistricts(stateData ? stateData.districts : []);
    setFormData((prev) => ({ ...prev, state: selectedState, district: "" }));
  };

  // useEffect(() => {
  //   if (receiptData) {
  //     handlePrint();
  //   }
  // }, [receiptData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
setLoading(true)
    const formDataToSubmit = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value) {
        formDataToSubmit.append(key, value);
      }
    });

    try {
      const response = await AddnewUserApplyForm(formDataToSubmit);
      const formattedDate = new Date().toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }).replace(' ', ' ').toUpperCase();

      if (response.status === 201) {
        setReceiptData({
          companyName: "JASNATH FINANCE",
          customerName: formData.fullName,
          category: formData.subCategory,
          price: formData.amount,
          orderDate: formattedDate,
          userId: response?.data.form_user_id,
          paymentStatus: "PAID",
          partnerEmail: response?.data.partnerEmail || partnerEmail
        });
        setFormData({
          fullName: "",
          email: "",
          phone: "",
          panCard: "",
          state: "",
          district: "",
          fullAddress: "",
          category: "",
          subCategory: "",
          document1: null,
          document2: null,
          document3: null,
        });
        // setSelectedState("");
        setDistricts([]);
        setuserBalance(response.data.user_balance);
        setLoading(false)
      } else {
        throw new Error("Failed to submit form");
      }
    } catch (error) {
      console.log(error.response.data.err);
      const errMessage = error.response.data.err;
      Swal.fire("Error!", errMessage, "error");
      setLoading(false)
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      <div className="container mt-5">
        {receiptData ? (
          <div
            className="receipt card shadow-lg p-4 mt-4"
            style={{ maxWidth: "600px", margin: "auto" }}
          >
            {/* Data Table with Logo */}
            <table className="table table-bordered" border={2}>
              <thead>
                <tr>
                  <th colSpan={2} className="text-center">
                    <img
                      src="./img/jasnathNewPrintIcon.png"
                      alt="JASNATH FINANCE Logo"
                      className="img-fluid"
                    />
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th>Customer Name:</th>
                  <td>{receiptData.customerName}</td>
                </tr>
                <tr>
                  <th>Service:</th>
                  <td>{receiptData.category}</td>
                </tr>
                <tr>
                  <th>Price:</th>
                  <td>RS.{receiptData.price}/-</td>
                </tr>
                <tr>
                  <th>Order Date:</th>
                  <td>{receiptData.orderDate}</td>
                </tr>
                <tr>
                  <th>Order No:</th>
                  <td>{receiptData.userId}</td>
                </tr>
                <tr>
                  <th>User ID:</th>
                  <td>{receiptData.partnerEmail}</td>
                </tr>
                <tr>
                  <th>Payment Status:</th>
                  <td
                    className={
                      receiptData.paymentStatus === "PAID"
                        ? "text-success fw-bold"
                        : "text-danger fw-bold"
                    }
                  >
                    {receiptData.paymentStatus}
                  </td>
                </tr>
              </tbody>
            </table>

            {/* Action Buttons (Hide During Print) */}
            <div className="d-flex justify-content-center gap-3 mt-4 d-print-none">
              <button className="btn btn-primary" onClick={handlePrint}>
                🖨️ Print Receipt
              </button>
              <button
                className="btn btn-danger"
                onClick={() => navigate("/dashboard")}
              >
                ❌ Cancel
              </button>
            </div>
          </div>
        ) : (
          <>
            <h2 className="text-center mb-4">User Form</h2>
            <form onSubmit={handleSubmit}>
              {/* Full Name */}
              <div className="form-group mb-3">
                <label htmlFor="fullName">Full Name</label>
                <input
                  type="text"
                  className="form-control"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  required
                />
              </div>

              {/* Email */}
              <div className="form-group mb-3">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                />
              </div>

              {/* Phone */}
              <div className="form-group mb-3">
                <label htmlFor="phone">Phone Number</label>
                <input
                  type="tel"
                  className="form-control"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                  required
                />
              </div>

              {/* PAN Card */}
              <div className="form-group mb-3">
                <label htmlFor="panCard">PAN Card Number</label>
                <input
                  type="text"
                  className="form-control"
                  id="panCard"
                  name="panCard"
                  value={formData.panCard}
                  onChange={handleChange}
                  placeholder="Enter your PAN card number"
                  required
                />
              </div>

              {/* State */}
              <div className="form-group mb-3">
                <label htmlFor="state">State</label>
                <select
                  className="form-control"
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleStateChange}
                  required
                >
                  <option value="" disabled>
                    Choose your state...
                  </option>
                  {statesData.map((state, index) => (
                    <option key={index} value={state.state}>
                      {state.state}
                    </option>
                  ))}
                </select>
              </div>

              {/* District */}
              <div className="form-group mb-3">
                <label htmlFor="district">District</label>
                <select
                  className="form-control"
                  id="district"
                  name="district"
                  value={formData.district}
                  onChange={handleChange}
                  required
                >
                  <option value="" disabled>
                    Choose your district...
                  </option>
                  {districts.map((district, index) => (
                    <option key={index} value={district}>
                      {district}
                    </option>
                  ))}
                </select>
              </div>

              {/* Full Address */}
              <div className="form-group mb-3">
                <label htmlFor="fullAddress">Full Address</label>
                <textarea
                  className="form-control"
                  id="fullAddress"
                  name="fullAddress"
                  rows="3"
                  value={formData.fullAddress}
                  onChange={handleChange}
                  placeholder="Enter your full address here"
                  required
                ></textarea>
              </div>

              {/* Category Auto-Fill */}
              <div className="form-group mb-3">
                <label htmlFor="category">Category</label>
                <input
                  type="text"
                  className="form-control"
                  id="category"
                  name="category"
                  value={formData.category}
                  readOnly
                />
              </div>

              {/* SubCategory Auto-Fill */}
              <div className="form-group mb-3">
                <label htmlFor="subCategory">SubCategory</label>
                <input
                  type="text"
                  className="form-control"
                  id="subCategory"
                  name="subCategory"
                  value={formData.subCategory}
                  readOnly
                />
              </div>
              <div className="form-group mb-3">
                <label htmlFor="document1">Upload Document 1 (Optional)</label>
                <input
                  type="file"
                  className="form-control"
                  id="document1"
                  name="document1"
                  onChange={handleFileChange}
                  accept="image/*,.pdf,.doc,.docx"
                />
              </div>
              <div className="form-group mb-3">
                <label htmlFor="document2">Upload Document 2 (Optional)</label>
                <input
                  type="file"
                  className="form-control"
                  id="document2"
                  name="document2"
                  onChange={handleFileChange}
                  accept="image/*,.pdf,.doc,.docx"
                />
              </div>
              <div className="form-group mb-3">
                <label htmlFor="document3">Upload Document 3 (Optional)</label>
                <input
                  type="file"
                  className="form-control"
                  id="document3"
                  name="document3"
                  onChange={handleFileChange}
                  accept="image/*,.pdf,.doc,.docx"
                />
              </div>

              {/* Submit */}
              <div className="col-12 text-center mt-3">
                  <button
                    type="submit"
                    className="btn btn-primary w-50"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                        />
                        Submitting...
                      </>
                    ) : (
                      "Submit"
                    )}
                  </button>
                </div>
            </form>
          </>
        )}
      </div>
    </>
  );
};

export default UserFormFillPage;

// import React, { useState, useEffect } from "react";
// import Swal from "sweetalert2";
// import { AddnewUserApplyForm } from "../../services/applyNewUserForm";
// import { useLocation, useNavigate } from "react-router-dom";
// import { useAuthUser } from "../authPagesForUser/contexUser";
// import Input from "../../atoms/inputs/basicInput";

// const UserFormFillPage = () => {
//   const [statesData, setStatesData] = useState([]);
//   const [selectedState, setSelectedState] = useState("");
//   const [districts, setDistricts] = useState([]);
//   const [receiptData, setReceiptData] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { setuserBalance } = useAuthUser();

//   const partnerEmail = JSON.parse(localStorage.getItem("partnerEmail") || '""');

//   const [formData, setFormData] = useState({
//     partnerEmail,
//     fullName: "",
//     email: "",
//     phone: "",
//     panCard: "",
//     state: "",
//     district: "",
//     fullAddress: "",
//     category: location.state?.category || "",
//     subCategory: location.state?.subcategory || "",
//     amount: location.state?.amount || 0,
//     document1: null,
//     document2: null,
//     document3: null,
//   });

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleFileChange = (e) => {
//     const { name, files } = e.target;
//     if (files.length > 0) {
//       setFormData((prev) => ({
//         ...prev,
//         [name]: files[0],
//       }));
//     }
//   };

//   const handleStateChange = (e) => {
//     const selectedState = e.target.value;
//     setSelectedState(selectedState);
//     const stateData = statesData.find((state) => state.state === selectedState);
//     setDistricts(stateData ? stateData.districts : []);
//     setFormData((prev) => ({ ...prev, state: selectedState, district: "" }));
//   };

//   useEffect(() => {
//     const fetchStatesData = async () => {
//       try {
//         const response = await fetch("/assets/json/states-and-districts.json");
//         const data = await response.json();
//         setStatesData(data.states);
//       } catch (error) {
//         Swal.fire(
//           "Error!",
//           "Failed to load states and districts data.",
//           "error"
//         );
//       }
//     };
//     fetchStatesData();
//   }, []);

//   const validateForm = () => {
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     const phoneRegex = /^[6-9]\d{9}$/;
//     const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;

//     if (!emailRegex.test(formData.email)) {
//       Swal.fire(
//         "Invalid Email",
//         "Please enter a valid email address.",
//         "warning"
//       );
//       return false;
//     }
//     if (!phoneRegex.test(formData.phone)) {
//       Swal.fire(
//         "Invalid Phone Number",
//         "Enter a valid 10-digit Indian phone number.",
//         "warning"
//       );
//       return false;
//     }
//     if (!panRegex.test(formData.panCard)) {
//       Swal.fire(
//         "Invalid PAN",
//         "Enter a valid PAN card number (e.g., ABCDE1234F).",
//         "warning"
//       );
//       return false;
//     }
//     return true;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!formData.name || !formData.phone) {
//       Swal.fire("Validation Error", "Name and Phone are required!", "error");
//       return;
//     }

//     setLoading(true);

//     const formDataToSubmit = new FormData();
//     Object.entries(formData).forEach(([key, value]) => {
//       if (value) {
//         formDataToSubmit.append(key, value);
//       }
//     });

//     try {
//       const response = await AddnewUserApplyForm(formDataToSubmit);
//       const formattedDate = new Date()
//         .toLocaleDateString("en-GB", {
//           day: "2-digit",
//           month: "short",
//           year: "numeric",
//         })
//         .toUpperCase();

//       if (response.status == 201) {
//         setReceiptData({
//           companyName: "JASNATH FINANCE",
//           customerName: formData.fullName,
//           category: formData.subCategory,
//           price: formData.amount,
//           orderDate: formattedDate,
//           userId: response.data.form_user_id,
//           paymentStatus: "PAID",
//         });
//         setFormData({
//           fullName: "",
//           email: "",
//           phone: "",
//           panCard: "",
//           state: "",
//           district: "",
//           fullAddress: "",
//           category: "",
//           subCategory: "",
//           document1: null,
//           document2: null,
//           document3: null,
//         });
//         setSelectedState("");
//         setDistricts([]);
//         setuserBalance(response.data.user_balance);
//       } else {
//         throw new Error("Failed to submit form");
//       }
//     } catch (error) {
//       const errMessage = error?.response?.data?.err || "Submission failed";
//       Swal.fire("Error!", errMessage, "error");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handlePrint = () => {
//     window.print();
//   };

//   return (
//     <div className="container py-5" style={{ backgroundColor: "#f8f9fa" }}>
//       <div className="card shadow p-4">
//         {receiptData ? (
//           <>
//             <div className="text-center mb-4">
//               <img src="./img/jasnathNewPrintIcon.png" alt="Logo" height="80" />
//               <h4 className="mt-2">{receiptData.companyName}</h4>
//             </div>
//             <table className="table table-bordered">
//               <tbody>
//                 <tr>
//                   <th>Customer Name:</th>
//                   <td>{receiptData.customerName}</td>
//                 </tr>
//                 <tr>
//                   <th>Service:</th>
//                   <td>{receiptData.category}</td>
//                 </tr>
//                 <tr>
//                   <th>Price:</th>
//                   <td>₹{receiptData.price}/-</td>
//                 </tr>
//                 <tr>
//                   <th>Order Date:</th>
//                   <td>{receiptData.orderDate}</td>
//                 </tr>
//                 <tr>
//                   <th>Order No:</th>
//                   <td>{receiptData.userId}</td>
//                 </tr>
//                 <tr>
//                   <th>User ID:</th>
//                   <td>{partnerEmail}</td>
//                 </tr>
//                 <tr>
//                   <th>Payment Status:</th>
//                   <td className="text-success fw-bold">
//                     {receiptData.paymentStatus}
//                   </td>
//                 </tr>
//               </tbody>
//             </table>
//             <div className="d-print-none text-center mt-4">
//               <button className="btn btn-primary me-2" onClick={handlePrint}>
//                 🖨️ Print
//               </button>
//               <button
//                 className="btn btn-secondary"
//                 onClick={() => navigate("/dashboard")}
//               >
//                 🔙 Back to Dashboard
//               </button>
//             </div>
//           </>
//         ) : (
//           <>
//             <h3 className="text-center mb-4">User Registration Form</h3>
//             <form onSubmit={handleSubmit} className="text-dark">
//               <div className="row g-3">
//                 {[
//                   { label: "Full Name", name: "fullName", type: "text" },
//                   { label: "Email", name: "email", type: "email" },
//                   { label: "Phone Number", name: "phone", type: "tel" },
//                   { label: "PAN Card", name: "panCard", type: "text" },
//                 ].map(({ label, name, type }) => (
//                   <div key={name} className="col-md-6">
//                     <Input
//                       label={label}
//                       name={name}
//                       type={type}
//                       value={formData[name]}
//                       onChange={handleChange}
//                     />
//                   </div>
//                 ))}

//                 <div className="col-md-6">
//                   <label className="form-label">State</label>
//                   <select
//                     className="form-select"
//                     name="state"
//                     value={formData.state}
//                     onChange={handleStateChange}
//                     required
//                   >
//                     <option value="">Select State</option>
//                     {statesData.map((s, idx) => (
//                       <option key={idx} value={s.state}>
//                         {s.state}
//                       </option>
//                     ))}
//                   </select>
//                 </div>

//                 <div className="col-md-6">
//                   <label className="form-label">District</label>
//                   <select
//                     className="form-select"
//                     name="district"
//                     value={formData.district}
//                     onChange={handleChange}
//                     required
//                   >
//                     <option value="">Select District</option>
//                     {districts.map((d, idx) => (
//                       <option key={idx} value={d}>
//                         {d}
//                       </option>
//                     ))}
//                   </select>
//                 </div>

//                 <div className="col-12">
//                   <label className="form-label">Full Address</label>
//                   <textarea
//                     className="form-control"
//                     name="fullAddress"
//                     value={formData.fullAddress}
//                     onChange={handleChange}
//                     rows={3}
//                     required
//                   />
//                 </div>

//                 <div className="col-md-6">
//                   <label className="form-label">Category</label>
//                   <input
//                     className="form-control"
//                     value={formData.category}
//                     readOnly
//                   />
//                 </div>
//                 <div className="col-md-6">
//                   <label className="form-label">SubCategory</label>
//                   <input
//                     className="form-control"
//                     value={formData.subCategory}
//                     readOnly
//                   />
//                 </div>

//                 {[1, 2, 3].map((num) => (
//                   <div className="col-md-4" key={num}>
//                     <label className="form-label">{`Document ${num} (Optional)`}</label>
//                     <input
//                       type="file"
//                       className="form-control"
//                       name={`document${num}`}
//                       onChange={handleFileChange}
//                       accept="image/*,.pdf,.doc,.docx"
//                     />
//                   </div>
//                 ))}

//                 <div className="col-12 text-center mt-3">
//                   <button
//                     type="submit"
//                     className="btn btn-primary w-50"
//                     disabled={loading}
//                   >
//                     {loading ? (
//                       <>
//                         <span
//                           className="spinner-border spinner-border-sm me-2"
//                           role="status"
//                         />
//                         Submitting...
//                       </>
//                     ) : (
//                       "Submit"
//                     )}
//                   </button>
//                 </div>
//               </div>
//             </form>
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// export default UserFormFillPage;
