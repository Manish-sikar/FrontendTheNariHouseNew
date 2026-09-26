import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2"; // For feedback
import { updateIconData } from "../../../services/socialService";

const SocialMediaEdit = () => {
  const location = useLocation();
  const navigate = useNavigate()
  const { item } = location.state || {}; // Retrieve passed item from state

  // State to manage form inputs for editing
  const [formData, setFormData] = useState({
    _id : item?._id ,
    icon_name: item?.icon_name || "",
    icon_url: item?.icon_url || "",
    icon_class: item?.icon_class || "",
  });

  // Handle input changes
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  // Handle form submission for edit
  const handleEditSubmit = async () => {
    try {
      const response = await updateIconData(formData); // Mock API service to update data
      if (response.status === 200) {
        Swal.fire({
          title: "Success!",
          text: "Data updated successfully!",
          icon: "success",
          confirmButtonText: "OK",
        });
        navigate('/admin/setting/social_media')
      } else {
        throw new Error("Failed to update data");
      }
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: "An error occurred while updating data. Please try again.",
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
        <a href="#">Setting</a>
      </li>
      <li className="separator">
        <i className="icon-arrow-right"></i>
      </li>
      <li className="nav-item">
        <a href="#">Edit Social Media</a>
      </li>
    </ul>
  </div>
  <hr></hr>
    <div className="container mt-5">
      <h3>Edit Social Media Icon</h3>
      <form>
        <div className="form-group">
          <label>Icon Name</label>
          <input
            id="icon_name"
            type="text"
            className="form-control"
            value={formData.icon_name}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Icon URL</label>
          <input
            id="icon_url"
            type="text"
            className="form-control"
            value={formData.icon_url}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Icon Class</label>
          <input
            id="icon_class"
            type="text"
            className="form-control"
            value={formData.icon_class}
            onChange={handleChange}
            placeholder="Fill Icon (e.g. bi bi-facebook)"
          />
        </div>
        <button type="button" className="btn btn-primary" onClick={handleEditSubmit}>
          Save Changes
        </button>
      </form>
    </div>
    </>
  );
};

export default SocialMediaEdit;
