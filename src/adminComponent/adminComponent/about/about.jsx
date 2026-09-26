import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  AddNewAboutData,
  changeStatusAbout,
  deleteAboutData,
  GetAboutData,
} from "../../../services/aboutService";
import { baseURL } from "../../../services/apiService";
import Swal from "sweetalert2";

const AboutAdmin = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [aboutData, setAboutData] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    about_heading: "",
    desc_about: "",
    about_images: [],
  });

  const navigate = useNavigate();

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  useEffect(() => {
    fetchAboutData();
  }, []);

  const fetchAboutData = async () => {
    try {
      const response = await GetAboutData();
      setAboutData(response.about_Data);
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
    const files = Array.from(e.target.files);
    setFormData((prev) => ({
      ...prev,
      images: files, // Store multiple images
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
      await AddNewAboutData(formDataToSend);
      Swal.fire("Success!", "Banner added successfully.", "success");
      fetchAboutData();
      setFormData({
        title: "",
        about_heading: "",
        desc_about: "",
        images: [],
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
      const response = await deleteAboutData(_id);
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
    navigate(`/admin/about/edit`, { state: { item } });
  };

  const handleStatus = async (item) => {
    try {
      const response = await changeStatusAbout(item._id);
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

  return (
    <>
      <div className="col-md-12">
        <div className="card">
          <div className="card-header">
            <div className="d-flex align-items-center">
              <h4 className="card-title">Add About</h4>
              <button className="btn btn-primary btn-round ms-auto" onClick={openModal}>
                <i className="fa fa-plus"></i>
                Add About
              </button>
            </div>
          </div>

          <div className="card-body">
            {isModalOpen && (
              <div className="modal fade show" id="addRowModal" style={{ display: "block" }}>
                <div className="modal-dialog" role="document">
                  <div className="modal-content">
                    <div className="modal-header border-0">
                      <h5 className="modal-title">New Row</h5>
                      <button type="button" className="close" onClick={closeModal}>
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
                                name="title"
                                type="text"
                                className="form-control"
                                placeholder="Fill title"
                                value={formData.title}
                                onChange={handleChange}
                              />
                            </div>
                            <div className="form-group form-group-default">
                              <label>Heading</label>
                              <input
                                name="about_heading"
                                type="text"
                                className="form-control"
                                placeholder="Fill heading"
                                value={formData.about_heading}
                                onChange={handleChange}
                              />
                            </div>
                            <div className="form-group form-group-default">
                              <label>Description</label>
                              <textarea
                                name="desc_about"
                                className="form-control"
                                placeholder="Fill Description"
                                value={formData.desc_about}
                                onChange={handleChange}
                              />
                            </div>
                           



                            <div className="form-group form-group-default">
                              <label>About Images</label>
                              <input
                                name="images"
                                type="file"
                                className="form-control"
                                multiple
                                onChange={handleFileChange}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="modal-footer border-0">
                          <button type="submit" className="btn btn-primary">Add</button>
                          <button type="button" className="btn btn-danger" onClick={closeModal}>Close</button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="table-responsive">
              <table id="add-row" className="display table table-striped table-hover">
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Title</th>
                    <th>Heading</th>
                    <th>Description</th>
                    <th>Status</th>
                    <th style={{ width: "10%" }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {aboutData.map((item) => (
                    <tr key={item._id}>
                      <td>
                        {item.about_images.map((img, imgIndex) => (
                          <img
                            key={imgIndex}
                            src={`${baseURL}/${img}`}
                            alt={`Image ${imgIndex + 1}`}
                            style={{ height: "100px", marginRight: "5px" }}
                          />
                        ))}
                      </td>
                      <td>{item.title}</td>
                      <td>{item.about_heading}</td>
                      <td>{item.desc_about}</td>
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
                          <button type="button" className="btn btn-link btn-primary btn-lg" onClick={() => handleEditClick(item)}>
                            <i className="fa fa-edit"></i>
                          </button>
                          <button type="button" className="btn btn-link btn-danger" onClick={() => handleDeleteClick(item._id)}>
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

export default AboutAdmin;
