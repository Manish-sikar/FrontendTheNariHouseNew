import { useEffect, useState } from "react";
import {
  GetBannerData,
  AddNewBanner,
  deleteBannerData,
  changeStatusBanner,
} from "../../../services/bannerService";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const BannerTable = () => {
  // State to manage modal visibility
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bannerData, setBannerData] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    heading: "",
    btn_link: "",
    btn_txt: "",
    bannerimg: null,
    desc_txt: "",
  });
  const navigate = useNavigate();

  // Open/Close Modal functions
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  useEffect(() => {
    fetchBannerData();
  }, []);

  const fetchBannerData = async () => {
    try {
      const response = await GetBannerData();
      const data = response.banner_Data;
      setBannerData(data);
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

  const handleFileChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      bannerimg: e.target.files[0],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      formDataToSend.append(key, value);
    });

    try {
      await AddNewBanner(formDataToSend);
      Swal.fire("Success!", "Banner added successfully.", "success");
      fetchBannerData(); // Refresh the banner data
      setFormData({
        title: "",
        heading: "",
        btn_link: "",
        btn_txt: "",
        bannerimg: null,
        desc_txt: "",
      });
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
      const response = await deleteBannerData(_id);
      if (response.status === 200) {
        Swal.fire({
          title: "Success!",
          text: "Data deleted successfully!",
          icon: "success",
          confirmButtonText: "OK",
        });
        navigate(`/admin/setting/banner`);
        fetchBannerData();
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

  const handleEditClick = (item) => {
    navigate(`/admin/banner/edit`, { state: { item } });
  };


  const handleStatus = async (item) => {
    // Toggle the status
    try {
      const response = await changeStatusBanner(item._id);
      if (response.status === 200) {
        Swal.fire({
          title: "Success!",
          text: "status change successfully!",
          icon: "success",
          confirmButtonText: "OK",
        });
        navigate(`/admin/setting/banner`);
        fetchBannerData();
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
        <a href="#"> Banner</a>
      </li>
    </ul>
  </div>
 
      <div className="col-md-12 mt-2">
        <div className="card">
          <div className="card-header">
            <div className="d-flex align-items-center">
              <h4 className="card-title">Banner's</h4>
              <button
                className="btn btn-primary btn-round ms-auto"
                onClick={openModal}
              >
                <i className="fa fa-plus"></i>
                Add Banner 
              </button>
            </div>
          </div>

          <div className="card-body">
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
                        <span className="fw-mediumbold">Add</span>
                        <span className="fw-light"> Banner</span>
                      </h5>
                      <button
                        type="button"
                        className="close"
                        data-dismiss="modal"
                        onClick={closeModal}
                      >
                        <span aria-hidden="true">&times;</span>
                      </button>
                    </div>
                    <div className="modal-body">
                      <p className="small">
                        Create a new row using this form, make sure you fill
                        them all
                      </p>
                      <form onSubmit={handleSubmit}>
                        <div className="row">
                          <div className="col-md-6 pe-0">
                            <div className="form-group form-group-default">
                              <label>Title</label>
                              <input
                                name="title"
                                type="text"
                                className="form-control"
                                placeholder="fill title"
                                value={formData.title}
                                onChange={handleChange}
                              />
                            </div>
                            <div className="form-group form-group-default">
                              <label>Heading</label>
                              <input
                                name="heading"
                                type="text"
                                className="form-control"
                                placeholder="fill heading"
                                value={formData.heading}
                                onChange={handleChange}
                              />
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-group form-group-default">
                              <label>Button Link</label>
                              <input
                                name="btn_link"
                                type="text"
                                className="form-control"
                                placeholder="fill link (e.g., /contact)"
                                value={formData.btn_link}
                                onChange={handleChange}
                              />
                            </div>
                            <div className="form-group form-group-default">
                              <label>Button Text</label>
                              <input
                                name="btn_txt"
                                type="text"
                                className="form-control"
                                placeholder="fill Text (e.g., Read More)"
                                value={formData.btn_txt}
                                onChange={handleChange}
                              />
                            </div>
                          </div>
                          <div className="col-sm-12">
                            <div className="form-group form-group-default">
                              <label>Banner Image</label>
                              <input
                                name="bannerimg"
                                type="file"
                                className="form-control"
                                onChange={handleFileChange}
                              />
                            </div>
                          </div>
                          <div className="col-sm-12">
                            <div className="form-group form-group-default">
                              <label>Description</label>
                              <textarea
                                name="desc_txt"
                                className="form-control"
                                placeholder="fill Description"
                                value={formData.desc_txt}
                                onChange={handleChange}
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
                    <th>Image</th>
                    <th>Title</th>
                    <th>Heading</th>
                    <th>Description</th>
                    <th>Button Text</th>
                    <th>Button Link</th>
                    <th>Status</th>
                    <th style={{ width: "10%" }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {bannerData.map((item, index) => (
                    <tr key={index}>
                      <td>
                        <img
                          src={item.banner_img}
                          alt="Banner"
                          style={{ height: "100px" }}
                        />
                      </td>
                      <td>{item.title}</td>
                      <td>{item.heading}</td>
                      <td>{item.desc_txt}</td>
                      <td>{item.btn_txt}</td>
                      <td>{item.btn_link}</td>
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
                            data-bs-toggle="tooltip"
                            title="Edit Task"
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

export default BannerTable;
