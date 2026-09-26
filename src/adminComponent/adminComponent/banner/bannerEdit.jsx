import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { updateBannerData } from "../../../services/bannerService";

const BannerEdit = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { item } = location.state || {}; // Retrieve passed item from state
  const [selectedBannerImg, setSelectedBannerImg] = useState(null);

  const [formData, setFormData] = useState({
    _id: item?._id,
    heading: item?.heading || "",
    btn_link: item?.btn_link || "",
    btn_txt: item?.btn_txt || "",
    banner_img: item?.banner_img || null,
    desc_txt: item?.desc_txt || "",
    title: item?.title || "",
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
    const formDataToSubmit = new FormData();
    Object.keys(formData).forEach((key) => {
      formDataToSubmit.append(key, formData[key]);
    });

    try {
      const response = await updateBannerData(formDataToSubmit); // Mock API service to update data
      if (response.status === 200) {
        Swal.fire({
          title: "Success!",
          text: "Data updated successfully!",
          icon: "success",
          confirmButtonText: "OK",
        });
        navigate("/admin/setting/banner");
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

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    const file = files[0];
    if (name === "bannerimg") {
      const imageUrl = URL.createObjectURL(file);
      setSelectedBannerImg(imageUrl);
    }
    setFormData((prevData) => ({
      ...prevData,
      [name]: file,
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
        <a href="#">Edit Banner</a>
      </li>
    </ul>
  </div>
  <hr></hr>
    <div className="container mt-5">
      <h3>Edit Banner Data</h3>
      <form>
        <div className="form-group">
          <label>Title</label>
          <input
            id="title"
            type="text"
            className="form-control"
            value={formData.title}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Heading</label>
          <input
            id="heading"
            type="text"
            className="form-control"
            value={formData.heading}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Button Link</label>
          <input
            id="btn_link"
            type="text"
            className="form-control"
            value={formData.btn_link}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Button Text</label>
          <input
            id="btn_txt"
            type="text"
            className="form-control"
            value={formData.btn_txt}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Description</label>
          <textarea
            id="desc_txt"
            type="text"
            className="form-control"
            value={formData.desc_txt}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Banner Image</label>
          <input
            id="bannerimg"
            type="file"
            className="form-control"
            name="bannerimg"
            onChange={handleFileChange}
          />
          {selectedBannerImg ? (
            <img
              src={selectedBannerImg}
              alt="Selected Banner"
              className="w-25  pt-2 "
            />
          ) : (
            formData?.banner_img && (
              <img
                src={formData?.banner_img}
                alt="Banner Image "
                className="w-25 pt-2"
              />
            )
          )}
        </div>
        <button
          type="button"
          className="btn btn-primary"
          onClick={handleEditSubmit}
        >
          Save Changes
        </button>
      </form>
    </div>
    
</>
  );
};

export default BannerEdit;
