 

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { AddNewProject, changeStatusProject, deleteProjectData, GetProjectData } from "../../../services/projectService";
import DataTableComponent from "../../../atoms/datatables/datatables";
 

const ProjectsPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [serviceData, setServiceData] = useState([]);
  const [formData, setFormData] = useState({
    project_title: "",
    project_desc: "",
    more_project_desc : "",
    btn_txt: "",
    btn_link: "",
  });

  const navigate = useNavigate();

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  useEffect(() => {
    fetchProjectsData();
  }, []);

  const fetchProjectsData = async () => {
    try {
      const response = await GetProjectData();
      setServiceData(response.projects_Data);
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
      await AddNewProject(formDataToSend);
      Swal.fire("Success!", "Project added successfully.", "success");
      fetchProjectsData();
    
      closeModal();
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: "An error occurred while adding the Project. Please try again.",
        icon: "error",
        confirmButtonText: "Retry",
      });
    }
  };

  const handleDeleteClick = async (_id) => {
    try {
      const response = await deleteProjectData(_id);
      if (response.status === 200) {
        Swal.fire("Success!", "Data deleted successfully!", "success");
        fetchProjectsData();
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
    navigate(`/admin/project/edit`, { state: { item } });
  };

  const handleStatus = async (item) => {
    try {
      const response = await changeStatusProject(item._id);
      if (response.status === 200) {
        Swal.fire("Success!", "Status changed successfully!", "success");
        fetchProjectsData();
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
      projectimg: e.target.files[0],
    }));
  };

  const columns = [
  {
    name: "Logo",
    selector: (row) => row.projectimg,
    cell: (row) => (
      <img
        src={row.projectimg}
        alt="Project"
        className="img-fluid rounded"
        style={{ width: "60px", height: "auto" }}
      />
    ),
    width: "100px",
    sortable: false,
  },
  {
    name: "Title",
    selector: (row) => row.project_title,
    sortable: true,
  },
  {
    name: "Description",
    selector: (row) => row.project_desc,
    sortable: true,
  },
  {
    name: "More Description",
    selector: (row) => row.more_project_desc,
    sortable: true,
  },
  {
    name: "Button Text",
    selector: (row) => row.btn_txt,
    sortable: true,
  },
  {
    name: "Button Link",
    selector: (row) => row.btn_link,
    sortable: true,
  },
  {
    name: "Status",
    cell: (row) => (
      <button
        onClick={() => handleStatus(row)}
        className={`btn btn-sm ${
          row.status == 1 ? "btn-success" : "btn-danger"
        }`}
      >
        {row.status == 1 ? "Active" : "Deactive"}
      </button>
    ),
    sortable: true,
  },
  {
    name: "Action",
    cell: (row) => (
      <div className="btn-group">
        <button
          className="btn btn-sm btn-primary"
          onClick={() => handleEditClick(row)}
        >
          <i className="fa fa-edit"></i>
        </button>
        <button
          className="btn btn-sm btn-danger"
          onClick={() => handleDeleteClick(row._id)}
        >
          <i className="fa fa-times"></i>
        </button>
      </div>
    ),
    ignoreRowClick: true,
    allowOverflow: true,
    button: true,
  },
];


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
        <a href="#">Project Management</a>
      </li>
    </ul>
  </div>
      <div className="col-md-12 mt-2">
        <div className="card">
          <div className="card-header">
            <div className="d-flex align-items-center">
              <h4 className="card-title">Projects</h4>
              <button
                className="btn btn-primary btn-round ms-auto"
                onClick={openModal}
              >
                <i className="fa fa-plus"></i>
                Add Project
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
                      <h5 className="modal-title">Add Project</h5>
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
                                name="project_title"
                                type="text"
                                className="form-control"
                                placeholder="Fill title"
                                value={formData.project_title}
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
                              <label>Button Text</label>
                              <textarea
                                name="btn_txt"
                                className="form-control"
                                placeholder="Fill Button Text"
                                value={formData.btn_txt}
                                onChange={handleChange}
                              />
                            </div>
                            <div className="form-group form-group-default">
                              <label>Service Logo</label>
                              <input
                                type="file"
                                name="projectimg"
                                className="form-control"
                                placeholder="Fill Service Logo"
                                onChange={handleFileChange}
                              />
                            </div>
                            <div className="form-group form-group-default">
                              <label>Description</label>
                              <textarea
                                name="project_desc"
                                className="form-control"
                                placeholder="Fill Description"
                                value={formData.project_desc}
                                onChange={handleChange}
                              />
                            </div>
                            <div className="form-group form-group-default">
                              <label>More Description</label>
                              <textarea
                                name="more_project_desc"
                                className="form-control"
                                placeholder="Fill Description"
                                value={formData.more_project_desc}
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
           
          <DataTableComponent columns={columns} data={serviceData}   />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProjectsPage;
  //  <table
  //               id="add-row"
  //               className="display table table-striped table-hover"
  //             >
  //               <thead>
  //                 <tr>
  //                   <th>Logo</th>
  //                   <th>Title</th>
  //                   <th>Description</th>
  //                   <th>More Description</th>
  //                   <th>Button Text </th>
  //                   <th>Button Link </th>
  //                   <th>Status</th>
  //                   <th style={{ width: "10%" }}>Action</th>
  //                 </tr>
  //               </thead>
  //               <tbody>
  //                 {serviceData.map((item) => (
  //                   <tr key={item._id}>
  //                     <td>
  //                       <img src={item.projectimg}></img>
  //                     </td>
  //                     <td>{item.project_title}</td>
  //                     <td>{item.project_desc}</td>
  //                     <td>{item.more_project_desc}</td>
  //                     <td>{item.btn_txt}</td>
  //                     <td>{item.btn_link}</td>
  //                     <td>
  //                       <button
  //                         type="button"
  //                         className={`btn ${
  //                           item.status == 1 ? "active" : "inactive"
  //                         }`}
  //                         onClick={() => handleStatus(item)}
  //                         style={{
  //                           backgroundColor: item.status == 1 ? "green" : "red",
  //                           color: item.status == 1 ? "white" : "white",
  //                         }}
  //                       >
  //                         {/* <i
  //                           className={`fa ${
  //                             item.status == 1
  //                               ? "fa-check-circle"
  //                               : "fa-times-circle"
  //                           }`}
  //                           style={{
  //                             color: item.status == 1 ? "green" : "red",
  //                           }}
  //                         > </i> */}
  //                         {item.status == 1 ? "Active" : "Deactive"}
  //                       </button>
  //                     </td>
  //                     <td>
  //                       <div className="form-button-action">
  //                         <button
  //                           type="button"
  //                           className="btn btn-link btn-primary btn-lg"
  //                           onClick={() => handleEditClick(item)}
  //                         >
  //                           <i className="fa fa-edit"></i>
  //                         </button>
  //                         <button
  //                           type="button"
  //                           className="btn btn-link btn-danger"
  //                           onClick={() => handleDeleteClick(item._id)}
  //                         >
  //                           <i className="fa fa-times"></i>
  //                         </button>
  //                       </div>
  //                     </td>
  //                   </tr>
  //                 ))}
  //               </tbody>
  //             </table>