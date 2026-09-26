import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { baseURL } from "../../../services/apiService";
import { updateAboutData } from "../../../services/aboutService";

const AboutEdit = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { item } = location.state || {};

  const [selectedBannerImgs, setSelectedBannerImgs] = useState([]);
  const [formData, setFormData] = useState({
    _id: item?._id,
    title: item?.title || "",
    about_heading: item?.about_heading || "",
    desc_about: item?.desc_about || ""
  });

  useEffect(() => {
    if (item?.about_images) {
      const existingImages = item.about_images.map(image => `${baseURL}/${image}`);
      setSelectedBannerImgs(existingImages);
    }
  }, [item]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    const fileArray = Array.from(files);
    const imageUrls = fileArray.map(file => URL.createObjectURL(file));

    setSelectedBannerImgs(imageUrls); // Only show the newly selected images
    setFormData((prevData) => ({
      ...prevData,
      [name]: fileArray,
    }));
  };

  const handleEditSubmit = async () => {
    const formDataToSubmit = new FormData();
    Object.keys(formData).forEach((key) => {
      if (Array.isArray(formData[key])) {
        formData[key].forEach(file => {
          formDataToSubmit.append(key, file);
        });
      } else {
        formDataToSubmit.append(key, formData[key]);
      }
    });

    try {
      const response = await updateAboutData(formDataToSubmit);
      if (response.status === 200) {
        Swal.fire({
          title: "Success!",
          text: "Data updated successfully!",
          icon: "success",
          confirmButtonText: "OK",
        });
        navigate("/admin/setting/about");
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
    <div className="container">
      <h3>Edit About Data</h3>
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
            id="about_heading"
            type="text"
            className="form-control"
            value={formData.about_heading}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Description</label>
          <textarea
            id="desc_about"
            className="form-control"
            value={formData.desc_about}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Banner Images</label>
          <input
            id="images"
            type="file"
            className="form-control"
            name="images"
            onChange={handleFileChange}
            multiple
          />
          <div className="pt-2">
            {selectedBannerImgs.map((image, index) => (
              <img key={index} src={image} alt={`Selected Banner ${index}`} className="w-25 pt-2" />
            ))}
          </div>
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
  );
};

export default AboutEdit;
