import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {
  AddNewService,
  changeStatusService,
  deleteServiceData,
  GetServiceData,
} from "../../../services/serviceAdmin";

const ServicesPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [serviceData, setServiceData] = useState([]);
  const [formData, setFormData] = useState({
    card_title: "",
    btn_link: "",
  });

  const navigate = useNavigate();

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  useEffect(() => {
    fetchAboutData();
  }, []);

  const fetchAboutData = async () => {
    try {
      const response = await GetServiceData();
      setServiceData(response.services_Data);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((file) => formDataToSend.append(key, file));
      } else {
        formDataToSend.append(key, value);
      }
    });

    try {
      await AddNewService(formDataToSend);
      Swal.fire("Success!", "Banner added successfully.", "success");
      fetchAboutData();
    
      closeModal();
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: "An error occurred while adding the banner. Please try again.",
        icon: "error",
        confirmButtonText: "Retry",
      });
    }
  };

  const handleDeleteClick = async (_id) => {
    try {
      const response = await deleteServiceData(_id);
      if (response.status === 200) {
        Swal.fire("Success!", "Data deleted successfully!", "success");
        fetchAboutData();
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

  const handleEditClick = (item) => {
    navigate(`/admin/service/edit`, { state: { item } });
  };

  const handleStatus = async (item) => {
    try {
      const response = await changeStatusService(item._id);
      if (response.status === 200) {
        Swal.fire("Success!", "Status changed successfully!", "success");
        fetchAboutData();
      }
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: "An error occurred while changing status. Please try again.",
        icon: "error",
        confirmButtonText: "Retry",
      });
    }
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      serviceimg: e.target.files[0],
    }));
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
        <a href="#">Services</a>
      </li>
    </ul>
  </div>
  
      <div className="col-md-12 mt-2">
        <div className="card">
          <div className="card-header">
            <div className="d-flex align-items-center">
              <h4 className="card-title">Admin Services</h4>
              <button
                className="btn btn-primary btn-round ms-auto"
                onClick={openModal}
              >
                <i className="fa fa-plus"></i>
                Add Service
              </button>
            </div>
          </div>

          <div className="card-body">
            {isModalOpen && (
              <div
                className="modal fade show"
                id="addRowModal"
                style={{ display: "block" }}
              >
                <div className="modal-dialog" role="document">
                  <div className="modal-content">
                    <div className="modal-header border-0">
                      <h5 className="modal-title">Add Service</h5>
                      <button
                        type="button"
                        className="close"
                        onClick={closeModal}
                      >
                        <span aria-hidden="true">&times;</span>
                      </button>
                    </div>
                    <div className="modal-body">
                      <form onSubmit={handleSubmit}>
                        <div className="row">
                          <div className="col-sm-12">
                            <div className="form-group form-group-default">
                              <label>Title</label>
                              <input
                                name="card_title"
                                type="text"
                                className="form-control"
                                placeholder="Fill title"
                                value={formData.card_title}
                                onChange={handleChange}
                              />
                            </div>
                            <div className="form-group form-group-default">
                              <label>Button Link</label>
                              <input
                                name="btn_link"
                                type="text"
                                className="form-control"
                                placeholder="Fill Button Link"
                                value={formData.btn_link}
                                onChange={handleChange}
                              />
                            </div>
                           
                            <div className="form-group form-group-default">
                              <label>Service Logo</label>
                              <input
                                type="file"
                                name="card_logo"
                                className="form-control"
                                placeholder="Fill Service Logo"
                                onChange={handleFileChange}
                              />
                            </div>
                           
                         
                          </div>
                        </div>
                        <div className="modal-footer border-0">
                          <button type="submit" className="btn btn-primary">
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
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="table-responsive">
              <table
                id="add-row"
                className="display table table-striped table-hover"
              >
                <thead>
                  <tr>
                    <th>Logo</th>
                    <th>Title</th>
                    <th>Button Link </th>
                    <th>Status</th>
                    <th style={{ width: "10%" }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {serviceData.map((item) => (
                    <tr key={item._id}>
                      <td>
                        <img src={item.card_logo} className="w-75 img-fluid" /> 
                      </td>
                      <td>{item.card_title}</td>
                      <td>{item.btn_link}</td>
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

export default ServicesPage;
