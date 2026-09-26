import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import {
  GetContactFormData,
  AddNewContactForm,
  deleteContactFormData,
} from "../../../services/contactFormService"; // Ensure the correct import for AddNewContactForm

const ContactForm = () => {
  const [contactFormData, setContactFormData] = useState([]);
  const [formData, setFormData] = useState({
    fullName: "",
    designation: "",
    email: "",
    mobile: "",
    institutionName: "",
    message: "",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchContactFormData();
  }, []);

  const fetchContactFormData = async () => {
    try {
      const response = await GetContactFormData();
      const data = response.contactForm_Data;

      // Filter the data to include only entries with status 1
      const filteredData = data.filter((contact) => contact.status === 1);
      setContactFormData(filteredData);
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: "An error occurred while getting data. Please try again.",
        icon: "error",
        confirmButtonText: "Retry",
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const { fullName, designation, email, mobile, institutionName, message } = formData;
    if (!fullName.trim()) return Swal.fire("Validation Error", "Full Name is required.", "warning");
    if (!designation.trim()) return Swal.fire("Validation Error", "Designation is required.", "warning");
    if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email)) return Swal.fire("Validation Error", "A valid Email is required.", "warning");
    if (!mobile.trim() || !/^\d{10}$/.test(mobile)) return Swal.fire("Validation Error", "Mobile must be a 10-digit number.", "warning");
    if (!institutionName.trim()) return Swal.fire("Validation Error", "Institution Name is required.", "warning");
    if (!message.trim()) return Swal.fire("Validation Error", "Message is required.", "warning");
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await AddNewContactForm(formData);
      Swal.fire("Success!", "Contact form submitted successfully.", "success");
      fetchContactFormData(); // Refresh data
      setFormData({
        fullName: "",
        designation: "",
        email: "",
        mobile: "",
        institutionName: "",
        message: "",
      });
      closeModal(); // Close modal
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: "An error occurred while submitting the form. Please try again.",
        icon: "error",
        confirmButtonText: "Retry",
      });
    }
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleDeleteClick = async (_id) => {
    try {
      const response = await deleteContactFormData(_id);
      if (response.status === 200) {
        Swal.fire("Success!", "Data deleted successfully!", "success");
        fetchContactFormData();
      } else {
        throw new Error("Failed to delete data");
      }
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: "An error occurred while deleting data. Please try again.",
        icon: "error",
        confirmButtonText: "Retry",
      });
    }
  };

  return (
    <>
      <div>
        <h3 className="fw-bold mb-3">Setting</h3>
        <ul className="breadcrumbs mb-3">
          <li className="nav-home">
            <a href="#">
              <i className="icon-home"></i>
            </a>
          </li>
          <li className="separator">
            <i className="icon-arrow-right"></i>
          </li>
          <li className="nav-item">
            <a href="#">CMS</a>
          </li>
          <li className="separator">
            <i className="icon-arrow-right"></i>
          </li>
          <li className="nav-item">
            <a href="#">Contact Form Management</a>
          </li>
        </ul>
      </div>
      <div className="col-md-12 mt-2">
        <div className="card">
          <div className="card-header">
            <h4 className="card-title">Contact Form</h4>
            <button className="btn btn-primary btn-round ms-auto" onClick={openModal}>
              <i className="fa fa-plus"></i>
              Add
            </button>
          </div>
          <div className="card-body">
            {isModalOpen && (
              <div className="modal fade show" style={{ display: "block" }}>
                <div className="modal-dialog" role="document">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h5 className="modal-title">Add Contact</h5>
                      <button type="button" className="close" onClick={closeModal}>
                        <span aria-hidden="true">&times;</span>
                      </button>
                    </div>
                    <div className="modal-body">
                      <form onSubmit={handleSubmit}>
                        <div className="form-group">
                          <label>Full Name</label>
                          <input
                            name="fullName"
                            type="text"
                            className="form-control"
                            placeholder="Enter your name"
                            value={formData.fullName}
                            onChange={handleChange}
                          />
                        </div>
                        <div className="form-group">
                          <label>Designation</label>
                          <input
                            name="designation"
                            type="text"
                            className="form-control"
                            placeholder="Enter your designation"
                            value={formData.designation}
                            onChange={handleChange}
                          />
                        </div>
                        <div className="form-group">
                          <label>Email</label>
                          <input
                            name="email"
                            type="email"
                            className="form-control"
                            placeholder="Enter your email"
                            value={formData.email}
                            onChange={handleChange}
                          />
                        </div>
                        <div className="form-group">
                          <label>Mobile</label>
                          <input
                            name="mobile"
                            type="text"
                            className="form-control"
                            placeholder="Enter your mobile"
                            value={formData.mobile}
                            onChange={handleChange}
                          />
                        </div>
                        <div className="form-group">
                          <label>Institution Name</label>
                          <input
                            name="institutionName"
                            type="text"
                            className="form-control"
                            placeholder="Enter your institution name"
                            value={formData.institutionName}
                            onChange={handleChange}
                          />
                        </div>
                        <div className="form-group">
                          <label>Message</label>
                          <textarea
                            name="message"
                            className="form-control"
                            placeholder="Enter your message"
                            value={formData.message}
                            onChange={handleChange}
                          />
                        </div>
                        <button type="submit" className="btn btn-primary">
                          Submit
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="table-responsive mt-4">
              <table className="display table table-striped table-hover">
                <thead>
                  <tr>
                    <th>Full Name</th>
                    <th>Designation</th>
                    <th>Email</th>
                    <th>Mobile</th>
                    <th>Institution Name</th>
                    <th>Message</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {contactFormData.map((item, index) => (
                    <tr key={index}>
                      <td>{item.fullName}</td>
                      <td>{item.designation}</td>
                      <td>{item.email}</td>
                      <td>{item.mobile}</td>
                      <td>{item.institutionName}</td>
                      <td>{item.message}</td>
                      <td>
                        <div className="form-button-action">
                          <button
                            type="button"
                            className="btn btn-link btn-danger"
                            onClick={() => handleDeleteClick(item._id)}
                          >
                            <i className="fa fa-times"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ContactForm;
