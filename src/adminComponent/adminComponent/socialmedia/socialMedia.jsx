import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import "@fortawesome/fontawesome-free/css/all.min.css";
import {
  AddNewIconData,
  changeStatusIndb,
  deleteSocialIcon,
  getSocialData,
} from "../../../services/socialService";
import { useNavigate } from "react-router-dom";

// Mock function to simulate API call
// const addNewIconData1 = (formData) => {
//   return new Promise((resolve) => {
//     setTimeout(() => {
//       resolve({ status: 200 });
//     }, 500);
//   });
// };

const SocialMedia = () => {
  // State to manage modal visibility
  const [isModalOpen, setIsModalOpen] = useState(false);

  // State to manage form data
  const [formData, setFormData] = useState({
    icon_name: "",
    icon_url: "",
    icon_class: "",
  });

  // State to manage the list of social icons
  const [socialIcons, setSocialIcons] = useState([]);
  const navigate = useNavigate();

  // Open/Close Modal functions
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  useEffect(() => {
    fetchDataSocial();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async () => {
    try {
      const response = await AddNewIconData(formData);
      if (response.status === 200) {
        Swal.fire({
          title: "Success!",
          text: "Data added successfully!",
          icon: "success",
          confirmButtonText: "OK",
        });
        setSocialIcons([...socialIcons, formData]); // Add new icon to the list
        setFormData({ icon_name: "", icon_url: "", icon_class: "" }); // Reset form
        closeModal(); // Close modal after successful submission
        fetchDataSocial();
      } else {
        throw new Error("Failed to add data");
      }
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: "An error occurred while adding data. Please try again.",
        icon: "error",
        confirmButtonText: "Retry",
      });
    }
  };

  const fetchDataSocial = async () => {
    try {
      const response = await getSocialData();
      const data = response.social_Data;
      setSocialIcons(data);
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: "An error occurred while getting data. Please try again.",
        icon: "error",
        confirmButtonText: "Retry",
      });
    }
  };

  const handleEditClick = (item) => {
    navigate(`/admin/social_media/edit`, { state: { item } });
  };

  const handleDeleteClick = async (_id) => {
    try {
      const response = await deleteSocialIcon(_id);
      if (response.status === 200) {
        Swal.fire({
          title: "Success!",
          text: "Data deleted successfully!",
          icon: "success",
          confirmButtonText: "OK",
        });
        navigate(`/admin/setting/social_media`);
        fetchDataSocial();
      } else {
        throw new Error("Failed to add data");
      }
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: "An error occurred while getting data. Please try again.",
        icon: "error",
        confirmButtonText: "Retry",
      });
    }
  };

  const handleStatus = async (item) => {
    // Toggle the status

    try {
      const response = await changeStatusIndb(item._id);
      if (response.status === 200) {
        Swal.fire({
          title: "Success!",
          text: "status change successfully!",
          icon: "success",
          confirmButtonText: "OK",
        });
        navigate(`/admin/setting/social_media`);
        fetchDataSocial();
      } else {
        throw new Error("Failed to Change Status");
      }
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: "An error occurred while Changing Status. Please try again.",
        icon: "error",
        confirmButtonText: "Retry",
      });
    }

    // You might also want to send an API call here to persist the status change on the backend
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
            <a href="#">Setting</a>
          </li>
          <li className="separator">
            <i className="icon-arrow-right"></i>
          </li>
          <li className="nav-item">
            <a href="#">Social Media</a>
          </li>
        </ul>
      </div>
      <div className="col-md-12 mt-2">
        <div className="card">
          <div className="card-header">
            <div className="d-flex align-items-center">
              <h4 className="card-title">Social Icon</h4>
              <button
                className="btn btn-primary btn-round ms-auto"
                onClick={openModal}
              >
                <i className="fa fa-plus"></i>
                Add Icon
              </button>
            </div>
          </div>

          <div className="card-body">
            {/* Modal */}
            {isModalOpen && (
              <div
                className="modal fade show"
                id="addRowModal"
                tabIndex="-1"
                role="dialog"
                style={{ display: "block" }}
              >
                <div className="modal-dialog" role="document">
                  <div className="modal-content">
                    <div className="modal-header border-0">
                      <h5 className="modal-title">
                        <span className="fw-mediumbold"> New</span>
                        <span className="fw-light"> Icon </span>
                      </h5>
                      <button
                        type="button"
                        className="close"
                        onClick={closeModal}
                        aria-label="Close"
                      >
                        <span aria-hidden="true">&times;</span>
                      </button>
                    </div>
                    <div className="modal-body">
                      <p className="small">
                        Create a new icon using this form, make sure you fill
                        all the fields.
                      </p>
                      <form>
                        <div className="row">
                          <div className="col-sm-12">
                            <div className="form-group form-group-default">
                              <label>Icon Name</label>
                              <input
                                id="icon_name"
                                type="text"
                                className="form-control"
                                placeholder="Fill name of Icon"
                                value={formData.icon_name}
                                onChange={handleChange}
                              />
                            </div>
                          </div>
                          <div className="col-md-6 pe-0">
                            <div className="form-group form-group-default">
                              <label>Icon URL</label>
                              <input
                                id="icon_url"
                                type="text"
                                className="form-control"
                                placeholder="Fill Icon URL"
                                value={formData.icon_url}
                                onChange={handleChange}
                              />
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-group form-group-default">
                              <label>Icon Class</label>
                              <input
                                id="icon_class"
                                type="text"
                                className="form-control"
                                placeholder="Fill Icon (e.g. bi bi-facebook)"
                                value={formData.icon_class}
                                onChange={handleChange}
                              />
                            </div>
                          </div>
                        </div>
                      </form>
                    </div>
                    <div className="modal-footer border-0">
                      <button
                        type="button"
                        id="addRowButton"
                        className="btn btn-primary"
                        onClick={handleSubmit}
                      >
                        Add
                      </button>
                      <button
                        type="button"
                        className="btn btn-danger"
                        onClick={closeModal}
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="table-responsive">
              <table className="display table table-striped table-hover">
                <thead>
                  <tr>
                    <th>Icon Name</th>
                    <th>Icon URL</th>
                    <th>Icon Class</th>
                    <th>Status</th>
                    <th style={{ width: "10%" }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {socialIcons.map((item, index) => (
                    <tr key={index}>
                      <td>{item.icon_name}</td>
                      <td>{item.icon_url}</td>
                      <td>
                        <i className={item.icon_class } aria-hidden="true"></i>
                   
                      </td>
                      <td>
                      <td>
                        <button
                          type="button"
                          className={`btn ${
                            item.status == 1 ? "active" : "inactive"
                          }`}
                          onClick={() => handleStatus(item)}
                          style={{
                            backgroundColor: item.status == 1 ? "green" : "red",
                            color: item.status == 1 ? "white" : "white",
                          }}
                        >
                          {/* <i
                            className={`fa ${
                              item.status == 1
                                ? "fa-check-circle"
                                : "fa-times-circle"
                            }`}
                            style={{
                              color: item.status == 1 ? "green" : "red",
                            }}
                          > </i> */}
                          {item.status == 1 ? "Active" : "Deactive"}
                        </button>
                      </td>
                      </td>

                      <td>
                        <div className="form-button-action">
                          <button
                            type="button"
                            className="btn btn-link btn-primary btn-lg"
                            onClick={() => handleEditClick(item)}
                          >
                            <i className="fa fa-edit"></i>
                          </button>
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

export default SocialMedia;
