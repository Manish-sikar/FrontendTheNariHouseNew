// import { useNavigate } from "react-router-dom";
// import LoginBanner from "../bannerPages/loginBanner";
// import Service from "../Service";

// const LoanProductList = ({ products }) => {
//   const navigate = useNavigate();

//   const handleClick = (link,  category ,subcategory,amount) => {
//     if (!link) return;

//     if (typeof link === "string" && link.startsWith("http")) {
//       window.location.href = link;
//     } else {
//       navigate(link, { state: { subcategory, category ,amount } });
//     }
//   };

//   if (!products || products.length === 0) {
//     return (
//       <div className="text-center mt-3">
//         <LoginBanner />
//         <Service />
//       </div>
//     );
//   }

//   return (
//     <div className="container">
//       <div className="row justify-content-center">
//         {products.map((product, index) => {
//           if (index % 2 !== 0) return null;

//           return (
//             <div key={index} className="d-flex justify-content-center mb-4" style={{ width: "100%", display: "flex", justifyContent: "space-between" }}>
//               <div style={{ width: "10%" }}></div>

//               {/* First Image Card */}
//               <div style={{ width: "35%" }}>
//                 <div
//                   className="card shadow-sm p-2"
//                   onClick={() => product.link && handleClick(product.link, product.category, product.category_name , product.amount )}
//                   style={{ cursor: product.link ? "pointer" : "default", width: "100%" }}
//                 >
//                   <div className="d-flex justify-content-center align-items-center" style={{ height: "50px" }}>
//                     <img
//                       src={product.icon_pic}
//                       alt={product.category_name}
//                       className="card-img-top"
//                       style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
//                     />
//                   </div>
//                   <div className="card-body text-center">
//                     <h5 className="card-title">{product.category_name}</h5>
//                     <p className="card-text">{product.sub_category_name}</p>
//                   </div>
//                 </div>
//               </div>

//               <div style={{ width: "10%" }}></div>

//               {/* Second Image Card */}
//               {products[index + 1] && (
//                 <div style={{ width: "35%" }}>
//                   <div
//                     className="card shadow-sm p-2"
//                     onClick={() => handleClick(products[index + 1].link, products[index + 1].sub_category_name, products[index + 1].category_name)}
//                     style={{ cursor: products[index + 1].link ? "pointer" : "default", width: "100%" }}
//                   >
//                     <div className="d-flex justify-content-center align-items-center" style={{ height: "50px" }}>
//                       <img
//                         src={products[index + 1].icon_pic}
//                         alt={products[index + 1].category_name}
//                         className="card-img-top"
//                         style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
//                       />
//                     </div>
//                     <div className="card-body text-center">
//                       <h5 className="card-title">{products[index + 1].category_name}</h5>
//                       <p className="card-text">{products[index + 1].sub_category_name}</p>
//                     </div>
//                   </div>
//                 </div>
//               )}

//               <div style={{ width: "10%" }}></div>
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// };

// export default LoanProductList;

import { useNavigate } from "react-router-dom";
import LoginBanner from "../bannerPages/loginBanner";
import Service from "../Service";
import Swal from "sweetalert2";

import React, { useState } from "react"; // Required for useState

import { Modal, Button, Form, Spinner } from "react-bootstrap"; // Needed for Modal, Button, Form, Spinner
import { AddnewUserApplyForm1 } from "../../services/linkWithHttpServices";
// Make sure path is correct

const LoanProductList = ({ products, refreshBalance }) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const partnerEmail = JSON.parse(localStorage.getItem("partnerEmail") || '""');
  const userDelar_id = localStorage.getItem("userDelar_id") || "";

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    panCard: "",
    fullAddress: "",
  });
  const [loading, setLoading] = useState(false);
  const category_name = products[0]?.category || "";
  const navigate = useNavigate();

  const handleClick = (
    link,
    category,
    subcategory,
    amount,
    DelarAmount,
    status
  ) => {
    if (status === 0) {
      Swal.fire({
        icon: "warning",
        title: "Product Unavailable",
        text: "This product is currently inactive. Please try again later.",
        confirmButtonColor: "#d33",
      });
      return;
    }

    console.log(
      link,
      category,
      subcategory,
      amount,
      DelarAmount,
      "shdfhsh111111111j"
    );
    if (
      link.startsWith("http") 
    ) {
      // Save product info and show modal
      setSelectedProduct({ link, category, subcategory, amount, DelarAmount });
      setShowModal(true);
    } else {
      // Directly navigate without modal
      navigate(link, {
        state: { subcategory, category, amount, refreshBalance, DelarAmount },
      });
    }
  };

  if (!products || products.length === 0) {
    return (
      <div className="text-center mt-3">
        <LoginBanner />
        <Service />
      </div>
    );
  }

  const handleFormChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    console.log(selectedProduct, "seleelelle");

   const submitData = {
    ...formData,
    category: selectedProduct?.category || "",
    subcategory: selectedProduct?.subcategory || "",
    amount: selectedProduct?.amount || "",
    DelarAmount: selectedProduct?.DelarAmount || "",
    userDelar_id: userDelar_id,
    partnerEmail: partnerEmail,
  };

    try {
      const response = await AddnewUserApplyForm1(submitData);
      console.log(response, "response");
      if (response?.status == 201) {
        setFormData({
          fullName: "",
          email: "",
          phone: "",
          panCard: "",
          fullAddress: "",
          category: "",
          subcategory: "",
          amount: "",
          DelarAmount: "",
        });
        Swal.fire({
          icon: "success",
          title: "Your data is save successfully",
          text: `${response.data.message}`,
        });

        setShowModal(false);

        const { link } = selectedProduct;
        // Only external links should reach here
        if (link.startsWith("http")) {
          window.open(link, "_blank");
        }
      } else {
        throw new Error("Submission failed");
      }
    } catch (error) {
      const errMessage = error?.response?.data?.err || "Something went wrong";
      Swal.fire("Error!", errMessage, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="category-header my-3 py-2 text-center">
        <h5 className="text-uppercase fw-semibold text-primary-emphasis m-0">
          {category_name}
        </h5>
      </div>
      <div className="row justify-content-center">
        {products.map((product, index) => (
          <>
            <div
              key={index}
              className="col-md-2 col-sm-6 mb-3 d-flex justify-content-center"
            >
              <div
                className="card shadow-sm p-2"
                onClick={() =>
                  handleClick(
                    product.link,
                    product?.category,
                    product?.category_name,
                    product?.amount,
                    product?.DelarAmount || 0,
                    product?.status
                  )
                }
                style={{
                  cursor: product.link ? "pointer" : "default",
                  width: "100%",
                }}
              >
                {product.status === 0 && (
                  <div className="inactive-ribbon">Inactive</div>
                )}
                <div
                  className="d-flex justify-content-center align-items-center"
                  style={{ height: "50px" }}
                >
                  <img
                    src={product.icon_pic}
                    alt={product.category_name}
                    className="card-img-top"
                    style={{
                      maxWidth: "100%",
                      maxHeight: "100%",
                      objectFit: "contain",
                    }}
                  />
                </div>
                <div className="card-body text-center">
                  <h5
                    className="card-title"
                    style={{ fontSize: "1rem" }} // Default font size
                  >
                    {product.category_name}
                  </h5>
                  <p
                    className="card-text"
                    style={{ fontSize: "0.9rem" }} // Slightly smaller
                  >
                    {product.sub_category_name}
                  </p>
                </div>
              </div>
            </div>
          </>
        ))}
      </div>

      {/* //model */}

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Enter Your Information</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-2">
              <Form.Label>Full Name</Form.Label>
              <Form.Control
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleFormChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleFormChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Phone</Form.Label>
              <Form.Control
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleFormChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>PAN Card</Form.Label>
              <Form.Control
                type="text"
                name="panCard"
                value={formData.panCard}
                onChange={handleFormChange}
              />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Full Address</Form.Label>
              <Form.Control
                as="textarea"
                name="fullAddress"
                rows={2}
                value={formData.fullAddress}
                onChange={handleFormChange}
                required
              />
            </Form.Group>

            <div className="text-end">
              <Button
                variant="secondary"
                onClick={() => setShowModal(false)}
                className="me-2"
              >
                Cancel
              </Button>
              <Button type="submit" variant="primary" disabled={loading}>
                {loading ? (
                  <Spinner size="sm" animation="border" />
                ) : (
                  "Submit & Continue"
                )}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Responsive Font Size for Mobile */}
      <style>
        {`
        
          @media (max-width: 768px) {
            .card-title { font-size: 0.9rem !important; } /* Smaller on tablets */
            .card-text { font-size: 0.8rem !important; }
          }
          @media (max-width: 480px) {
            .card-title { font-size: 0.8rem !important; } /* Even smaller on mobile */
            .card-text { font-size: 0.7rem !important; }
          }
          @media (max-width: 360px) {
            .card-title { font-size: x-small !important; } /* Extra small for very small screens */
            .card-text { font-size: x-small !important; }
          }

    .category-header {
      border-bottom: 2px solid #0d6efd22;
      background: #f8f9fa;
      border-radius: 0.5rem;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    }

    @media (max-width: 768px) {
      .category-header h5 {
        font-size: 1rem;
      }
    }

    @media (max-width: 480px) {
      .category-header h5 {
        font-size: 0.95rem;
      }
    }

     .inactive-ribbon {
      position: absolute;
      top: 5px;
      right: -10px;
      background: red;
      color: white;
      padding: 5px 10px;
      transform: rotate(45deg);
      font-size: 12px;
      font-weight: bold;
      z-index: 1;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
    }

    @media (max-width: 768px) {
      .inactive-ribbon {
        font-size: 10px;
        padding: 2px 10px;
        right: -10px;
      }
    }
  
        `}
      </style>
    </div>
  );
};

export default LoanProductList;
