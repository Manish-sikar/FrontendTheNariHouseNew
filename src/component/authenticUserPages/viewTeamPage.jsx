import React, { useEffect, useState } from "react";
import { Button, Container } from "react-bootstrap";
import {
  GetnewpartnerData,
  GetnewUserApplyForm,
} from "../../services/applyNewUserForm";
import DataTableComponent from "../../atoms/datatables/datatables";
import AuthUserHeader from "./headerUser";
import AddPartnerForm from "./addPathnerPage";
import { useNavigate } from "react-router-dom";
 

const ViewTeamPage = () => {
  const [selectedTab, setSelectedTab] = useState("View_Team_Orders");
  const [closeOrderData, setCloseOrderData] = useState([]);
  const [transHistoryData, setTransHistoryData] = useState([]); // State for Transaction History
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalType, setModalType] = useState(null); // 'edit', 'close', null
  const [closeMessage, setCloseMessage] = useState("");
  const [documents, setDocuments] = useState({});

  const partnerEmail = JSON.parse(localStorage.getItem("partnerEmail") || '""');

 

    const fetchProductsByCategory = async () => {
    try {
      const response = await GetnewUserApplyForm(partnerEmail);
      setCloseOrderData(response.userForm_Data);
    } catch (error) {
      console.error("Error fetching table data:", error);
    }
  };

  // Fetch Transaction History
  const fetchTransHistory = async () => {
    const response = await GetnewpartnerData({status:2 , delar_id:partnerEmail});
    if (response && Array.isArray(response?.partner_Data)) {
      setTransHistoryData(response?.partner_Data);
    }
  };

  useEffect(() => {
    fetchProductsByCategory();
    fetchTransHistory();
  }, [selectedTab]);

  const handleModal = (type, user = null) => {
    setSelectedUser(user);
    setModalType(type);
    setCloseMessage("");
    setDocuments({});
  };

  const [showDetails, setShowDetails] = useState(false);
  const [detailUser, setDetailUser] = useState(null);

  const handleShowDetails = (user) => {
    console.log(user)
    setDetailUser(user);
    setShowDetails(true);
  };

  const Teamscolumns = [
    {
      name: "Avatar",
      selector: (row) => row.Avtar,
      cell: (row) => (
        <img
          src={row.Avtar}
          alt="avatar"
          style={{ width: "50px", height: "50px", borderRadius: "50%" }}
        />
      ),
      sortable: false,
    },
    {
      name: "JN Id",
      selector: (row) => row.JN_Id,
      sortable: true,
    },
    {
      name: "Full Name",
      selector: (row) => row.fullName,
      sortable: true,
    },
    {
      name: "Email",
      selector: (row) => row.email,
      sortable: true,
    },
    {
      name: "Phone",
      selector: (row) => row.mobile,
      sortable: true,
    },
    {
      name: "Wallet Balance",
      selector: (row) => row.balance,
      sortable: true,
    },
    {
      name: "Designation",
      selector: (row) => row.designation,
      sortable: true,
    },
    {
      name: "Institution",
      selector: (row) => row.institutionName,
      sortable: true,
    },
    {
      name: "Message",
      selector: (row) => row.message,
      sortable: false,
    },
    {
      name: "Pan No",
      selector: (row) => row.panNo,
      sortable: true,
    },
    {
      name: "Aadhar No",
      selector: (row) => row.aadharNo,
      sortable: true,
    },
    {
      name: "Account Details",
      selector: (row) => row.acDetails,
      sortable: false,
    },
    // {
    //   name: "Actions",
    //   cell: (row) => (
    //     <>
    //       <button
    //         className="btn btn-sm btn-primary me-2"
    //         onClick={() => handleEdit(row)}
    //       >
    //         <i className="fa fa-edit"></i>
    //       </button>
    //       <button
    //         className="btn btn-sm btn-danger me-2"
    //         onClick={() => handleDelete(row._id)}
    //       >
    //         <i className="fa fa-trash"></i>
    //       </button>
    //       <button
    //         className="btn btn-sm btn-warning"
    //         onClick={() => handleChangePassword(row._id)}
    //       >
    //         <i className="fa fa-key"></i>
    //       </button>
    //     </>
    //   ),
    //   ignoreRowClick: true,
    //   allowOverflow: true,
    //   button: true,
    // },
  ];

 

const FillFormcolumns = [
  {
    name: "Partner Id",
    selector: (row) => row.partnerEmail,
    sortable: true,
  },
  {
    name: "Full Name",
    selector: (row) => row.fullName,
    sortable: true,
  },
  {
    name: "Email",
    selector: (row) => row.email,
    sortable: true,
  },
  {
    name: "Phone",
    selector: (row) => row.phone,
    sortable: true,
  },
  {
    name: "Pan Card No",
    selector: (row) => row.panCard,
  },
  {
    name: "State",
    selector: (row) => row.state,
  },
  {
    name: "District",
    selector: (row) => row.district,
  },
  {
    name: "Category",
    selector: (row) => row.category,
  },
  {
    name: "Sub-Category",
    selector: (row) => row.subCategory,
  },
  {
    name: "Status",
    selector: (row) =>
      row.status === "1"
        ? "Pending"
        : row.status === "2"
        ? "Confirmed"
        : "Closed",
    sortable: true,
  },
  
  {
    name: "Actions",
    cell: (row) => (
      <button
        className="btn btn-info btn-sm me-2"
        onClick={() => handleShowDetails(row)}
      >
        View Details
      </button>
    ),
    ignoreRowClick: true,
    allowOverflow: true,
    button: true,
  },
];

const navigate = useNavigate()
  return (
    <>
    <AuthUserHeader />
      <Container className="mt-5">
        <h2>My Team Reports</h2>
        <div className="d-flex mb-4">
        <span className="me-3"><button className="btn btn-danger" onClick={()=>{ navigate("/dashboard")}}>Back</button></span>

          {["View_Team_Orders", "View_Partner" , "Add_Partner" ].map(
            (tab) => (
              <Button
                key={tab}
                variant={selectedTab === tab ? "primary" : "secondary"}
                onClick={() => setSelectedTab(tab)}
                className="me-2"
              >
                {tab.replace("_", " ").toUpperCase()}
              </Button>
            )
          )}
        </div>

        <div>
  

          {/* Closed Orders Table */}
          {selectedTab === "View_Team_Orders" && (
            <>
              <h4>Team Order Details</h4>
              {closeOrderData.length > 0 ? (
                <DataTableComponent
                  columns={FillFormcolumns}
                  data={closeOrderData}
                />
              ) : (
                <p>No Team Orders Available</p>
              )}
            </>
          )}

          {/* Transaction History Table */}
          {selectedTab === "View_Partner" && (
            <>
              <h4>Teams</h4>
              {transHistoryData.length > 0 ? (
                <DataTableComponent
                  columns={Teamscolumns}
                  data={transHistoryData}
                />
              ) : (
                <p>No Teams Found</p>
              )}
            </>
          )}

           {selectedTab === "Add_Partner" && (
            <>
            <AddPartnerForm></AddPartnerForm>
            </>
          )}
        </div>
      </Container>
      {showDetails && detailUser && (
        <div
          className="modal show fade"
          style={{ display: "block", background: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg rounded-4">
              <div className="modal-header bg-primary text-white rounded-top-4">
                <h5 className="modal-title">
                  📋 Order Details - {detailUser.fullName}
                </h5>
                <button
                  className="btn-close btn-close-white"
                  onClick={() => setShowDetails(false)}
                ></button>
              </div>

              <div className="modal-body px-4 py-3">
                <div className="row g-3">
                  <div className="col-md-6">
                    <p>
                      <strong>📛 Full Name:</strong> {detailUser.fullName}
                    </p>
                    <p>
                      <strong>📞 Phone:</strong> {detailUser.phone}
                    </p>
                    <p>
                      <strong>📧 Email:</strong> {detailUser.email}
                    </p>
                  
                    <p>
                      <strong>🧾 Message:</strong> {detailUser.message}
                    </p>
                  </div>

                  <div className="col-md-6">
                    <p>
                      <strong>🪪 PAN No:</strong> {detailUser.panCard}
                    </p>
                    
                    <p>
                      <strong>📂 Category:</strong> {detailUser.category}
                    </p>
                    <p>
                      <strong>🔖 Sub-Category:</strong> {detailUser.subCategory}
                    </p>
                    <p>
                      <strong>📌 Status:</strong>{" "}
                      <span
                        className={`badge ${
                          detailUser.status === "1"
                            ? "bg-warning text-dark"
                            : detailUser.status === "2"
                            ? "bg-success"
                            : "bg-danger"
                        }`}
                      >
                        {detailUser.status === "1"
                          ? "Pending"
                          : detailUser.status === "2"
                          ? "Confirmed"
                          : "Closed"}
                      </span>
                    </p>
                  </div>
                </div>

                {/* Documents */}
                <div className="mt-4">
                  <h6 className="mb-3">📎 Attached Documents</h6>
                  <div className="row">
                    {Object.entries(detailUser).map(([key, value]) => {
                      if (key.startsWith("document") && value) {
                        return (
                          <div className="col-md-6 mb-2" key={key}>
                            <strong>{key.toUpperCase()}:</strong>{" "}
                            <a
                              href={value}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn btn-sm btn-outline-primary ms-2"
                            >
                              View Document 🔗
                            </a>
                          </div>
                        );
                      }
                      return null;
                    })}
                  </div>
                </div>
              </div>

              <div className="modal-footer bg-light rounded-bottom-4">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowDetails(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};


export default ViewTeamPage;
 
