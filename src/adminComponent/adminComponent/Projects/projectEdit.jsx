import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { updateProjectData } from "../../../services/projectService";

const ProjectEditPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { item } = location.state || {};
  const [selectedProjectImg, setselectedProjectImg] = useState(null);

  const [formData, setFormData] = useState({
    _id: item?._id,
    project_title: item?.project_title || "",
    project_desc: item?.project_desc || "",
    more_project_desc: item?.more_project_desc || "",
    btn_txt: item?.btn_txt || "",
    btn_link: item?.btn_link || "" 
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
      if (key !== "projectimg") {
        formDataToSubmit.append(key, formData[key]);
      }
    });
  
    // Append the image file if it exists (only once)
    if (selectedProjectImg) {
      const imageFile = formData.projectimg; // This should hold the new file
      formDataToSubmit.append("projectimg", imageFile);
    }
  
    try {
      const response = await updateProjectData(formDataToSubmit);
      if (response.status === 200) {
        Swal.fire({
          title: "Success!",
          text: "Data updated successfully!",
          icon: "success",
          confirmButtonText: "OK",
        });
        navigate("/admin/setting/projects");
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
      setselectedProjectImg(imageUrl);
      setFormData((prevData) => ({
        ...prevData,
        projectimg: file, // Store the file object here
      }));
    }
  };

  return (
    <div className="container">
      <h3>Edit Project Data</h3>
      <form>
        <div className="form-group">
          <label>Title</label>
          <input
            id="project_title"
            type="text"
            className="form-control"
            placeholder="Fill Title"
            value={formData.project_title}
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
            id="project_desc"
            className="form-control"
            value={formData.project_desc}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>More Description</label>
          <textarea
            id="more_project_desc"
            className="form-control"
            value={formData.more_project_desc}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Service Image</label>
          <input
            id="projectimg"
            type="file"
            className="form-control"
            name="projectimg"
            onChange={handleFileChange}
          />
          {selectedProjectImg ? (
            <img
              src={selectedProjectImg}
              alt="Selected Banner"
              className="w-25 pt-2"
            />
          ) : (
            item.projectimg && (
              <img
                src={item.projectimg}
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

export default ProjectEditPage;
