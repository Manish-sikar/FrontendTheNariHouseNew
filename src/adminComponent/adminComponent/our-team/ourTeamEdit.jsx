import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { updateOurTeamData } from "../../../services/ourTeamService";

const OurTeamEdit = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { item } = location.state || {};
  const [selectedTeamImg, setSelectedTeamImg] = useState(null);

  const [formData, setFormData] = useState({
    _id: item?._id,
    team_member: item?.team_member || "",
    degination: item?.degination || "",
    social_icons: item?.social_icons || [],
  });

  // Handle change for text inputs
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  // Handle change for social icon fields
  const handleSocialIconChange = (index, field, value) => {
    const updatedSocialIcons = [...formData.social_icons];
    updatedSocialIcons[index][field] = value;
    setFormData((prevData) => ({
      ...prevData,
      social_icons: updatedSocialIcons,
    }));
  };

  // Add a new social icon entry
  const addSocialIcon = () => {
    setFormData((prevData) => ({
      ...prevData,
      social_icons: [
        ...prevData.social_icons,
        { icon_name: "", icon_url: "", icon_class: "" },
      ],
    }));
  };

  // Remove a social icon entry
  const removeSocialIcon = (index) => {
    setFormData((prevData) => ({
      ...prevData,
      social_icons: prevData.social_icons.filter((_, i) => i !== index),
    }));
  };

  const handleEditSubmit = async () => {
    const formDataToSubmit = new FormData();

    // Append non-file fields, stringifying social_icons to ensure proper format
    Object.keys(formData).forEach((key) => {
      if (key === "social_icons") {
        formDataToSubmit.append(key, JSON.stringify(formData[key])); // Stringify social_icons array
      } else if (key !== "teamimg") {
        formDataToSubmit.append(key, formData[key]);
      }
    });

    // Append the image file if it exists
    if (selectedTeamImg) {
      formDataToSubmit.append("teamimg", formData.teamimg);
    }

    try {
      const response = await updateOurTeamData(formDataToSubmit);
      if (response.status === 200) {
        Swal.fire({
          title: "Success!",
          text: "Data updated successfully!",
          icon: "success",
          confirmButtonText: "OK",
        });
        navigate("/admin/setting/ourTeam");
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
      setSelectedTeamImg(imageUrl);
      setFormData((prevData) => ({
        ...prevData,
        teamimg: file,
      }));
    }
  };

  return (
    <div className="container">
      <h3>Edit Team Data</h3>
      <form>
        <div className="form-group">
          <label>Team Member Name</label>
          <input
            id="team_member"
            type="text"
            className="form-control"
            placeholder="Enter team member name"
            value={formData.team_member}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Designation</label>
          <textarea
            id="degination"
            className="form-control"
            placeholder="Enter designation"
            value={formData.degination}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Social Icons</label>
          {formData.social_icons.map((icon, index) => (
            <div key={index} className="mb-2">
              <input
                type="text"
                placeholder="Facebook"
                value={icon.icon_name}
                onChange={(e) => handleSocialIconChange(index, "icon_name", e.target.value)}
                className="form-control mb-1"
              />
              <input
                type="text"
                placeholder="http://facebook.com"
                value={icon.icon_url}
                onChange={(e) => handleSocialIconChange(index, "icon_url", e.target.value)}
                className="form-control mb-1"
              />
              <input
                type="text"
                placeholder="fab fa-facebook"
                value={icon.icon_class}
                onChange={(e) => handleSocialIconChange(index, "icon_class", e.target.value)}
                className="form-control mb-1"
              />
              <button type="button" onClick={() => removeSocialIcon(index)} className="btn btn-danger">
                Remove Icon
              </button>
            </div>
          ))}
          <button type="button" onClick={addSocialIcon} className="btn btn-primary mt-2">
            Add Social Icon
          </button>
        </div>

        <div className="form-group">
          <label>Team Image</label>
          <input
            id="teamimg"
            type="file"
            className="form-control"
            name="teamimg"
            onChange={handleFileChange}
          />
          {selectedTeamImg ? (
            <img
              src={selectedTeamImg}
              alt="Selected Team Member"
              className="w-25 pt-2"
            />
          ) : (
            item.teamimg && (
              <img
                src={item.teamimg}
                alt="Current Team Member"
                className="w-25 pt-2 img-fluid"
              />
            )
          )}
        </div>
        <button type="button" className="btn btn-primary" onClick={handleEditSubmit}>
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default OurTeamEdit;
