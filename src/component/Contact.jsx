import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { AddNewContactForm } from "../services/contactFormService";
import { GetContactDetailsData } from "../services/contactService";


const Contact = () => {

  const [contactState, setContactState] = useState([]);
  const [formData, setFormData] = useState({
    fullName: "", 
    designation: "not Available",
    email: "not Available",
    mobile: "",
    institutionName: "",
    message: "",
  });

  const validateForm = () => {
    const { fullName, mobile, institutionName, message } =
      formData;

    if (!fullName.trim()) {
      Swal.fire("Validation Error", "Full Name is required.", "warning");
      return false;
    }

    


    if (!mobile.trim() || !/^\d{10}$/.test(mobile)) {
      Swal.fire(
        "Validation Error",
        "Mobile must be a 10-digit number.",
        "warning"
      );
      return false;
    }

    if (!institutionName.trim()) {
      Swal.fire("Validation Error", "Institution Name is required.", "warning");
      return false;
    }

    if (!message.trim()) {
      Swal.fire("Validation Error", "Message is required.", "warning");
      return false;
    }

    return true; // All fields are valid
  };
 
  
 

useEffect(()=>{
  fetchcontactData()
},[])

const handleChange = (e) => {
  const { name, value } = e.target; // Extract name and value from the event
  setFormData((prevData) => ({
    ...prevData,
    [name]: value, // Dynamically update the field by name
  }));
};

const handleSubmit = async (e) => {
  e.preventDefault(); // Prevent default browser form submission
  // Validate form
  if (!validateForm()) {
    return;
  }
  try {
   const response =  await AddNewContactForm(formData);
   console.log(response)
    // Show success notification
    Swal.fire("Success!", "Contact form submitted successfully.", "success");
    // Reset form fields
    setFormData({
      fullName: "",
      mobile: "",
      institutionName: "",
      message: "",
    });
  } catch (error) {
    // Show error notification
    const errMessage = error?.response?.data?.err || "Something went wrong!";
    Swal.fire({
      title: "Error!",
      text: errMessage,
      icon: "error",
      confirmButtonText: "Retry",
    });
  }
};


  const fetchcontactData = async () => {
    const response = await GetContactDetailsData();
    const contactData = response.contact_Data;
    setContactState(contactData[0]);
  };




  return (
    <>
      {/* <!-- Page Header Start --> */}
      <div class="container-fluid page-header py-5">
        <div class="container text-center py-5">
          <h1 class="display-2 text-white mb-4 animated slideInDown">
            Contact Us
          </h1>
          <nav aria-label="breadcrumb animated slideInDown">
            <ol class="breadcrumb justify-content-center mb-0">
              <li class="breadcrumb-item">
                <Link to="/">Home</Link>
              </li>
              <li class="breadcrumb-item">
                <Link to="/contact">Pages</Link>
              </li>
              <li class="breadcrumb-item" aria-current="page">
                Contact
              </li>
            </ol>
          </nav>
        </div>
      </div>
      {/* <!-- Page Header End --> */}
      {/* <!-- Fact Start --> */}
      <div class="container-fluid bg-secondary py-5">
        <div class="container">
          <div class="row">
            <div class="col-lg-3 wow fadeIn" data-wow-delay=".1s">
              <div class="d-flex counter">
                <h1 class="me-3 text-primary counter-value">99</h1>
                <h5 class="text-white mt-1">
                  Success in getting happy customer
                </h5>
              </div>
            </div>
            <div class="col-lg-3 wow fadeIn" data-wow-delay=".3s">
              <div class="d-flex counter">
                <h1 class="me-3 text-primary counter-value">25</h1>
                <h5 class="text-white mt-1">
                  Thousands of successful business
                </h5>
              </div>
            </div>
            <div class="col-lg-3 wow fadeIn" data-wow-delay=".5s">
              <div class="d-flex counter">
                <h1 class="me-3 text-primary counter-value">120</h1>
                <h5 class="text-white mt-1">Total clients who love Diditaladdworldtech</h5>
              </div>
            </div>
            <div class="col-lg-3 wow fadeIn" data-wow-delay=".7s">
              <div class="d-flex counter">
                <h1 class="me-3 text-primary counter-value">5</h1>
                <h5 class="text-white mt-1">
                  Stars reviews given by satisfied clients
                </h5>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <!-- Fact End --> */}

      {/* <!-- Contact Start --> */}
      <div class="container-fluid py-5 mb-5">
        <div class="container">
          <div
            class="text-center mx-auto pb-5 wow fadeIn"
            data-wow-delay=".3s"
            style={{ maxWidth: "600px" }}
          >
            <h5 class="text-primary">Get In Touch</h5>
            <h1 class="mb-3">Contact for any query</h1>
            <p class="mb-2">
              The contact form is currently inactive. Get a functional and
              working contact form with Ajax & Javascript in a few minutes. Just
              copy and paste the files, add a little code and you're done.{" "}
            </p>
          </div>
          <div class="contact-detail position-relative p-5">
            <div class="row g-5 mb-5 justify-content-center">
              <div class="col-xl-4 col-lg-6 wow fadeIn" data-wow-delay=".3s">
                <div class="d-flex bg-light p-3 rounded">
                  <div
                    class="flex-shrink-0 btn-square bg-secondary rounded-circle"
                    style={{ width: "50px", height: "50px" }}
                  >
                    <i class="fas fa-map-marker-alt text-white"></i>
                  </div>
                  <div class="ms-3">
                    <h4 class="text-primary">Address</h4>
                    <Link
                      to={`${contactState?.address_link}`}
                      target="_blank"
                      class="h5"
                    >
                      {contactState?.address_name}{" "}
                    </Link>
                  </div>
                </div>
              </div>
              <div class="col-xl-4 col-lg-6 wow fadeIn" data-wow-delay=".5s">
                <div class="d-flex bg-light p-3 rounded">
                  <div
                    class="flex-shrink-0 btn-square bg-secondary rounded-circle"
                    style={{ width: "50px", height: "50px" }}
                  >
                    <i class="fa fa-phone text-white"></i>
                  </div>
                  <div class="ms-3">
                    <h4 class="text-primary">Call Us</h4>
                    <Link class="h5" href={`tel:${contactState?.mob_no}`} target="_blank">
                      {contactState?.mob_no}
                    </Link>
                  </div>
                </div>
              </div>
              <div class="col-xl-4 col-lg-6 wow fadeIn" data-wow-delay=".7s">
                <div class="d-flex bg-light p-3 rounded">
                  <div
                    class="flex-shrink-0 btn-square bg-secondary rounded-circle"
                    style={{ width: "50px", height: "50px" }}
                  >
                    <i class="fa fa-envelope text-white"></i>
                  </div>
                  <div class="ms-3">
                    <h4 class="text-primary">Email Us</h4>
                    <Link
                      class="h5"
                      href={`mailto:${contactState?.email}`}
                      target="_blank"
                    >
                      {" "}
                    {contactState?.email}{" "}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            <div class="row g-5">
              <div class="col-lg-6 wow fadeIn" data-wow-delay=".3s">
                <div class="p-3 h-100 rounded contact-map">
                  <iframe
                    class="rounded w-100 h-100"
                    src= {`${contactState?.iframe_link}`}
                    style={{ border: "0" }}
                    allowfullscreen=""
                    loading="lazy"
                    referrerpolicy="no-referrer-when-downgrade"
                  ></iframe>
                </div>
              </div>
              <div class="col-lg-6 wow fadeIn" data-wow-delay=".5s">
              <div className="p-3 rounded contact-form">
                  <div className="mb-4">
                    <input
                       id="fullName"
                      type="text"
                      className="form-control border-0 py-3"
                      placeholder="Your Name"
                      name="fullName"
                      onChange={handleChange}
                      value={formData.fullName} 
                    />
                  </div>
                  <div className="mb-4">
                    <input
                       id="mobile"
                      type="tel"
                      className="form-control border-0 py-3"
                      placeholder="Your Phone"
                      name="mobile"
                      onChange={handleChange}
                      value={formData.mobile}
                    />
                  </div>
                  <div className="mb-4">
                    <input
                       id="institutionName"
                      type="text"
                      className="form-control border-0 py-3"
                      placeholder="institutionName"
                      name="institutionName"
                      onChange={handleChange}
                      value={formData.institutionName}
                    />
                  </div>
                  <div className="mb-4">
                    <textarea
                       id="message"
                      className="form-control border-0 py-3"
                      rows="6"
                      placeholder="Message"
                      name="message"
                      onChange={handleChange}
                      value={formData.message} 
                    ></textarea>
                  </div>
                  <button
                    className="btn bg-primary text-white py-3 px-3"
                    onClick={handleSubmit}
                  >
                    Send Message
                  </button>
                </div>
              
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <!-- Contact End --> */}

      {/* <!-- Back to Top --> */}
      <button
        className="btn btn-secondary btn-square rounded-circle back-to-top"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      >
        <i className="fa fa-arrow-up text-white"></i>
      </button>
    </>
  );
};

export default Contact;
