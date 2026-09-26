import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { updateServiceData } from "../../../services/serviceAdmin";

const ServiceEdit = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { item } = location.state || {};
  const [selectedServiceImg, setSelectedServiceImg] = useState(null);

  const [formData, setFormData] = useState({
    _id: item?._id,
    card_title: item?.card_title || "",
    btn_link: item?.btn_link || "",
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleEditSubmit = async () => {
    const formDataToSubmit = new FormData();

    // Append the non-file fields
    Object.keys(formData).forEach((key) => {
      if (key !== "serviceimg") {
        formDataToSubmit.append(key, formData[key]);
      }
    });

    // Append the image file if it exists (only once)
    if (selectedServiceImg) {
      formDataToSubmit.append("serviceimg", formData.serviceimg); // Using serviceimg as the key
    }

    try {
      const response = await updateServiceData(formDataToSubmit);
      if (response.status === 200) {
        Swal.fire({
          title: "Success!",
          text: "Data updated successfully!",
          icon: "success",
          confirmButtonText: "OK",
        });
        navigate("/admin/setting/services");
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
    const { files } = e.target;
    if (files.length > 0) {
      const file = files[0];
      const imageUrl = URL.createObjectURL(file);
      setSelectedServiceImg(imageUrl);
      setFormData((prevData) => ({
        ...prevData,
        serviceimg: file, // Store the file object as serviceimg
      }));
    }
  };

  return (
    <div className="container">
      <h3>Edit Service Data</h3>
      <form>
        <div className="form-group">
          <label>Title</label>
          <input
            id="card_title"
            type="text"
            className="form-control"
            placeholder="Fill Title"
            value={formData.card_title}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Button Link</label>
          <input
            id="btn_link"
            type="text"
            className="form-control"
            placeholder="Link (e.g., /service)"
            value={formData.btn_link}
            onChange={handleChange}
          />
        </div>
     
 
   
        <div className="form-group">
          <label>Service Image</label>
          <input
            id="serviceimg"
            type="file"
            className="form-control"
            name="serviceimg"
            onChange={handleFileChange}
          />
          {selectedServiceImg ? (
            <img
              src={selectedServiceImg}
              alt="Selected Banner"
              className="w-25 pt-2"
           
            />
          ) : (
            item.card_logo && (
              <img
                src={item.card_logo}
                alt="Current Banner"
                className="w-25 pt-2 img-fluid"
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
  );
};

export default ServiceEdit;
