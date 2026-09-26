import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { updatePartnerData } from "../../../services/applyNewUserForm";

const EditPartnerPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { partner } = location.state || {};

  const [selectedTeamImg, setSelectedTeamImg] = useState(null);

  const [formData, setFormData] = useState({
    _id: partner?._id,
    fullName: partner?.fullName || "",
    email: partner?.email || "",
    mobile: partner?.mobile || "",
    designation: partner?.designation || "",
    institutionName: partner?.institutionName || "",
    message: partner?.message || "",
    panNo: partner?.panNo || "",
    aadharNo: partner?.aadharNo || "",
    acDetails: partner?.acDetails || "",
    Avtar: null, // holds the File object if a new image is selected
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleFileChange = (e) => {
    const { files } = e.target;
    if (files.length > 0) {
      const file = files[0];
      const imageUrl = URL.createObjectURL(file);
      setSelectedTeamImg(imageUrl);
      setFormData((prevData) => ({
        ...prevData,
        Avtar: file, // Store the file object
      }));
    }
  };

  const handleEditSubmit = async () => {
    const formDataToSubmit = new FormData();

    // Append non-file fields
    Object.keys(formData).forEach((key) => {
      if (key != "Avtar") {
        formDataToSubmit.append(key, formData[key]);
      }
    });
    if (formData.Avtar instanceof File) {
  formDataToSubmit.append("Avtar", formData.Avtar);
}


//     // Append image file only if it's a File object
 
    // if (setSelectedTeamImg) {
    //   const imageFile = formData.Avtar; // This should hold the new file
    //   formDataToSubmit.append("Avtar", imageFile);
    // }

    try {
      const response = await updatePartnerData(formDataToSubmit);
      if (response.status === 200) {
        Swal.fire({
          title: "Success!",
          text: "Partner data updated successfully!",
          icon: "success",
          confirmButtonText: "OK",
        });
        navigate("/admin/partner");
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
      <h3>Edit Partner Data</h3>
      <form>
        <div className="form-group">
          <label>Full Name</label>
          <input
            id="fullName"
            type="text"
            className="form-control"
            value={formData.fullName}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input
            id="email"
            type="email"
            className="form-control"
            value={formData.email}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Phone</label>
          <input
            id="mobile"
            type="text"
            className="form-control"
            value={formData.mobile}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Designation</label>
          <input
            id="designation"
            type="text"
            className="form-control"
            value={formData.designation}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Institution</label>
          <input
            id="institutionName"
            type="text"
            className="form-control"
            value={formData.institutionName}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Message</label>
          <textarea
            id="message"
            className="form-control"
            value={formData.message}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Pan No</label>
          <input
            id="panNo"
            type="text"
            className="form-control"
            value={formData.panNo}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Aadhar No</label>
          <input
            id="aadharNo"
            type="text"
            className="form-control"
            value={formData.aadharNo}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Account Details</label>
          <textarea
            id="acDetails"
            type="text"
            className="form-control"
            value={formData.acDetails}
            onChange={handleChange}
          />
        </div>
        {/* <div className="form-group">
          <label>Partner Image</label>
          <input
            type="file"
            className="form-control"
            onChange={handleFileChange}
          />
          {selectedTeamImg && (
            <img
              src={selectedTeamImg}
              alt="Selected Partner"
              className="w-25 pt-2"
            />
          )}
        </div> */}

        <div className="form-group">
          <label>Partner Image</label>
          <input
            id="Avtar"
            type="file"
            className="form-control"
            name="Avtar"
            onChange={handleFileChange}
          />
          {selectedTeamImg ? (
            <img
              src={selectedTeamImg}
              alt="Selected Avtar"
              className="w-25 pt-2"
            />
          ) : (
            partner.Avtar && (
              <img
                src={partner.Avtar}
                alt="Current Avtar"
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

export default EditPartnerPage;
