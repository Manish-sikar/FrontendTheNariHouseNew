import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {
  AddNewOurTeam,
  changeStatusOurTeam,
  deleteOurTeamData,
  GetOurTeamData,
} from "../../../services/ourTeamService";
import DataTableComponent from "../../../atoms/datatables/datatables";

const OurTeamPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [teamsData, setTeamsData] = useState([]);
  const [formData, setFormData] = useState({
    team_member: "",
    degination: "",
    social_icons: [],
    teamimg: null,
  });

  const navigate = useNavigate();

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  useEffect(() => {
    fetchTeamsData();
  }, []);

  const handleSocialIconChange = (index, key, value) => {
    const newIcons = [...formData.social_icons];
    newIcons[index] = { ...newIcons[index], [key]: value };
    setFormData((prev) => ({
      ...prev,
      social_icons: newIcons,
    }));
  };

  const addSocialIcon = () => {
    setFormData((prev) => ({
      ...prev,
      social_icons: [
        ...prev.social_icons,
        { icon_name: "", icon_url: "", icon_class: "" },
      ],
    }));
  };

  const fetchTeamsData = async () => {
    try {
      const response = await GetOurTeamData();
      setTeamsData(response.team_Data);
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

    // Append basic fields
    formDataToSend.append("team_member", formData.team_member);
    formDataToSend.append("degination", formData.degination);
    formDataToSend.append("teamimg", formData.teamimg);

    // Append social_icons as a JSON string
    if (formData.social_icons.length > 0) {
      formDataToSend.append(
        "social_icons",
        JSON.stringify(formData.social_icons)
      );
    }

    try {
      await AddNewOurTeam(formDataToSend);
      Swal.fire("Success!", "Team member added successfully.", "success");
      fetchTeamsData();
      closeModal();
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: "An error occurred while adding the team member. Please try again.",
        icon: "error",
        confirmButtonText: "Retry",
      });
    }
  };

  const removeSocialIcon = (index) => {
    const newIcons = formData.social_icons.filter((_, i) => i !== index);
    setFormData((prev) => ({
      ...prev,
      social_icons: newIcons,
    }));
  };

  const handleDeleteClick = async (_id) => {
    try {
      const response = await deleteOurTeamData(_id);
      if (response.status === 200) {
        Swal.fire("Success!", "Data deleted successfully!", "success");
        fetchTeamsData();
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
    navigate(`/admin/ourTeam/edit`, { state: { item } });
  };

  const handleStatus = async (item) => {
    try {
      const response = await changeStatusOurTeam(item._id);
      if (response.status === 200) {
        Swal.fire("Success!", "Status changed successfully!", "success");
        fetchTeamsData();
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
      teamimg: e.target.files[0],
    }));
  };

  const columns = [
    {
      name: "Avatar",
      selector: (row) => row.teamimg,
      cell: (row) => (
        <img src={row.teamimg} alt={row.team_member} className="w-25 rounded" />
      ),
      sortable: false,
      width: "120px",
    },
    {
      name: "Name",
      selector: (row) => row.team_member,
      sortable: true,
    },
    {
      name: "Designation",
      selector: (row) => row.degination,
      sortable: true,
    },
    {
      name: "Social Icons",
      cell: (row) => (
        <div className="d-flex flex-column">
          {row.social_icons?.map((icon, i) => (
            <a
              key={i}
              href={icon.icon_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-decoration-none"
            >
              <i className={icon.icon_class}></i> {icon.icon_name}
            </a>
          ))}
        </div>
      ),
      sortable: false,
      grow: 2,
    },
    {
      name: "Status",
      cell: (row) => (
        <button
          onClick={() => handleStatus(row)}
          className={`btn btn-sm ${
            row.status === "1" ? "btn-success" : "btn-danger"
          }`}
        >
          {row.status === "1" ? "Active" : "Inactive"}
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
            <a href="#">Our Team Management</a>
          </li>
        </ul>
      </div>
      <div className="col-md-12 mt-2">
        <div className="card">
          <div className="card-header">
            <div className="d-flex align-items-center">
              <h4 className="card-title">Our Team</h4>
              <button
                className="btn btn-primary btn-round ms-auto"
                onClick={openModal}
              >
                <i className="fa fa-plus"></i>
                Add Team
              </button>
            </div>
          </div>

          <div className="card-body">
            {isModalOpen && (
              <div className="modal fade show" style={{ display: "block" }}>
                <div className="modal-dialog" role="document">
                  <div className="modal-content">
                    <div className="modal-header border-0">
                      <h5 className="modal-title">Add Team Member</h5>
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
                              <label>Name</label>
                              <input
                                name="team_member"
                                type="text"
                                className="form-control"
                                placeholder="Fill name"
                                value={formData.team_member}
                                onChange={handleChange}
                              />
                            </div>
                            <div className="form-group form-group-default">
                              <label>Designation</label>
                              <input
                                name="degination"
                                type="text"
                                className="form-control"
                                placeholder="Fill designation"
                                value={formData.degination}
                                onChange={handleChange}
                              />
                            </div>
                            <div className="form-group form-group-default">
                              <label>Social Icons</label>
                              {formData.social_icons.map((icon, index) => (
                                <div key={index} className="d-flex mb-2">
                                  <input
                                    type="text"
                                    className="form-control me-2"
                                    placeholder="Icon Name"
                                    value={icon.icon_name}
                                    onChange={(e) =>
                                      handleSocialIconChange(
                                        index,
                                        "icon_name",
                                        e.target.value
                                      )
                                    }
                                  />
                                  <input
                                    type="text"
                                    className="form-control me-2"
                                    placeholder="http://facebook.com"
                                    value={icon.icon_url}
                                    onChange={(e) =>
                                      handleSocialIconChange(
                                        index,
                                        "icon_url",
                                        e.target.value
                                      )
                                    }
                                  />
                                  <input
                                    type="text"
                                    className="form-control me-2"
                                    placeholder="fab fa-facebook"
                                    value={icon.icon_class}
                                    onChange={(e) =>
                                      handleSocialIconChange(
                                        index,
                                        "icon_class",
                                        e.target.value
                                      )
                                    }
                                  />
                                  <button
                                    type="button"
                                    className="btn btn-danger"
                                    onClick={() => removeSocialIcon(index)}
                                  >
                                    &times;
                                  </button>
                                </div>
                              ))}
                              <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={addSocialIcon}
                              >
                                Add Social Icon
                              </button>
                            </div>
                            <div className="form-group form-group-default">
                              <label>Team Image</label>
                              <input
                                type="file"
                                name="teamimg"
                                className="form-control"
                                onChange={handleFileChange}
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
             <DataTableComponent columns={columns} data={teamsData}/>

            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OurTeamPage;
//  <table id="add-row" className="display table table-striped table-hover">
//               <thead>
//                 <tr>
//                   <th>Avtar</th>
//                   <th>Name</th>
//                   <th>Designation</th>
//                   <th>Social Icons</th>
//                   <th>Status</th>
//                   <th style={{ width: "10%" }}>Action</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {teamsData.map((item) => (
//                   <tr key={item._id}>
//                     <td>
//                       <img src={item.teamimg} className="w-25" alt={item.team_member} />
//                     </td>
//                     <td>{item.team_member}</td>
//                     <td>{item.degination}</td>
//                     <td>
//                       {item.social_icons.map((icon) => (
//                         <a key={icon._id} href={icon.icon_url} target="_blank" rel="noopener noreferrer">
//                            &nbsp;<i className={icon.icon_class}></i>{icon.icon_name}
//                         </a>
//                       ))}
//                     </td>
//                     <td>
//                       <button
//                         type="button"
//                         className={`btn ${item.status === "1" ? "active" : "inactive"}`}
//                         onClick={() => handleStatus(item)}
//                         style={{
//                           backgroundColor: item.status === "1" ? "green" : "red",
//                           color: "white",
//                         }}
//                       >
//                         {item.status === "1" ? "Active" : "Inactive"}
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
