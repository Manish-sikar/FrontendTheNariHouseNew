import React, { useEffect, useState } from "react";
import { Button, Container } from "react-bootstrap";
import {
  GetTransHistroyData,
  GetReportData,
} from "../../services/applyNewUserForm";
import EditUserApplyForm from "../../adminComponent/adminComponent/userApplyForm/editUserApplyForm";
import DataTableComponent from "../../atoms/datatables/datatables";

const ReportPage = () => {
  const [selectedTab, setSelectedTab] = useState("new_order");
  const [ourOrderData, setOurOrderData] = useState([]);
  const [confirmOrderData, setConfirmOrderData] = useState([]);
  const [closeOrderData, setCloseOrderData] = useState([]);
  const [transHistoryData, setTransHistoryData] = useState([]); // State for Transaction History
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalType, setModalType] = useState(null); // 'edit', 'close', null

  const partnerEmail = JSON.parse(localStorage.getItem("partnerEmail") || '""');

  // Fetch Orders
  const fetchProductsByCategory = async () => {
    const response = await GetReportData(partnerEmail);
    const productsData = response?.userForm_Data || [];
    console.log(productsData , "productsData")
    setOurOrderData(productsData.filter((product) => product.status == 1));
    setConfirmOrderData(productsData.filter((product) => product.status == 2));
    setCloseOrderData(productsData.filter((product) => product.status == 3));
  };

  // Fetch Transaction History
  const fetchTransHistory = async () => {
    const response = await GetTransHistroyData(partnerEmail);
    if (response?.data?.length) {
      console.log(response.data, "respose hhhh");
      setTransHistoryData(response.data);
    }
  };

  useEffect(() => {
    fetchProductsByCategory();
    fetchTransHistory();
  }, []);

  const handleModal = (type, user = null) => {
    setSelectedUser(user);
    setModalType(type);
  };

  const [showDetails, setShowDetails] = useState(false);
  const [detailUser, setDetailUser] = useState(null);

  const handleShowDetails = (user) => {
    setDetailUser(user);
    setShowDetails(true);
  };

  const walletHistoryColumns = [
    {
      name: "#",
      selector: (row, index) => index + 1,
      width: "60px",
    },
    {
      name: "Amount Cr/Dr",
      selector: (row) =>
        `₹${row.amountDeducted ? row.amountDeducted : row.requestingAmount} (${
          row?.amountType || "debit"
        })`,
      sortable: true,
    },
    {
      name: "Available Balance After",
      selector: (row) => `₹${row.availableBalanceAfter}`,
      sortable: true,
    },
    {
      name: "Purpose",
      selector: (row) => row.purpose,
      sortable: true,
    },
    {
      name: "Date",
      selector: (row) => new Date(row.timestamp).toLocaleString(),
      sortable: true,
    },
  ];

  const orderColumns = [
    {
      name: "#",
      selector: (row, index) => index + 1,
      width: "60px",
    },
    {
      name: "Token No",
      selector: (row) => row?.token_No || "Not Available",
      sortable: true,
    },
    {
      name: "Name",
      selector: (row) => row.fullName,
      sortable: true,
    },
    {
      name: "Phone",
      selector: (row) => row.phone,
      sortable: true,
    },
    {
      name: "Service",
      selector: (row) => row.subCategory,
      sortable: true,
    },
    {
      name: "Date",
      selector: (row) => new Date(row.createdAt).toLocaleString(),
      sortable: true,
    },
    {
      name: "Status",
      cell: () => <span className="badge bg-warning text-dark">Pending</span>,
      sortable: false,
    },
    {
      name: "Edit",
      cell: (row) => (
        <button
          className="btn btn-warning btn-sm"
          onClick={() => handleModal("edit", row)}
        >
          Edit
        </button>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];

  const confirmOrderColumns = [
    {
      name: "#",
      selector: (row, index) => index + 1,
      width: "60px",
    },
    {
      name: "Token No",
      selector: (row) => row?.token_No || "Not Available",
      sortable: true,
    },
    {
      name: "Name",
      selector: (row) => row.fullName,
      sortable: true,
    },
    {
      name: "Phone",
      selector: (row) => row.phone,
      sortable: true,
    },
    {
      name: "Service",
      selector: (row) => row.subCategory,
      sortable: true,
    },
    {
      name: "Date",
      selector: (row) => new Date(row.updatedAt).toLocaleString(),
      sortable: true,
    },
    {
      name: "Status",
      cell: () => (
        <span className="badge bg-success text-white">Confirm Order</span>
      ),
      sortable: false,
    },
  ];

  const closeOrderColumns = [
    {
      name: "#",
      selector: (row, index) => index + 1,
      width: "60px",
    },
    {
      name: "Token No",
      selector: (row) => row?.token_No || "Not Available",
      sortable: true,
    },
    {
      name: "Name",
      selector: (row) => row.fullName,
      sortable: true,
    },
    {
      name: "Phone",
      selector: (row) => row.phone,
      sortable: true,
    },
    {
      name: "Service",
      selector: (row) => row.subCategory,
      sortable: true,
    },
    {
      name: "Date",
      selector: (row) => new Date(row.updatedAt).toLocaleDateString(),
      sortable: true,
    },
    {
      name: "Status",
      cell: () => (
        <span className="badge bg-danger text-white">Close Order</span>
      ),
      sortable: false,
    },
    {
      name: "Message",
      selector: (row) => row.message || "Not Available",
      sortable: false,
    },
    {
      name: "Action",
      cell: (row) => (
        <button
          className="btn btn-info btn-sm"
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

  return (
    <>
      <Container className="mt-5">
        <h2>Reports</h2>
        <div className="d-flex mb-4">
          {["new_order", "confirm_order", "close_order", "Wallet_history"].map(
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
          {/* Orders Table */}
          {selectedTab === "new_order" && (
            <>
              <h4>Your Order Details</h4>
              {ourOrderData.length > 0 ? (
                <DataTableComponent
                  columns={orderColumns}
                  data={ourOrderData}
                />
              ) : (
                <p>No Orders Found</p>
              )}
            </>
          )}

          {modalType === "edit" && (
            <EditUserApplyForm
              user={selectedUser}
              onClose={() => handleModal(null)}
              onUpdate={fetchProductsByCategory}
            />
          )}

          {/* Confirmed Orders Table */}
          {selectedTab === "confirm_order" && (
            <>
              <h4>Confirmed Order Details</h4>
              {confirmOrderData.length > 0 ? (
                <DataTableComponent
                  columns={confirmOrderColumns}
                  data={confirmOrderData}
                />
              ) : (
                <p>No Confirmed Orders Found</p>
              )}
            </>
          )}

          {/* Closed Orders Table */}
          {selectedTab === "close_order" && (
            <>
              <h4>Closed Order Details</h4>
              {closeOrderData.length > 0 ? (
                <DataTableComponent
                  columns={closeOrderColumns}
                  data={closeOrderData}
                />
              ) : (
                <p>No Closed Orders Available</p>
              )}
            </>
          )}

          {/* Transaction History Table */}
          {selectedTab === "Wallet_history" && (
            <>
              <h4>Wallet History</h4>
              {transHistoryData.length > 0 ? (
                <DataTableComponent
                  columns={walletHistoryColumns}
                  data={transHistoryData}
                />
              ) : (
                <p>No Wallet History Found</p>
              )}
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
                      <strong>🎓 Institution:</strong>{" "}
                      {detailUser.institutionName}
                    </p>
                    <p>
                      <strong>🧾 Message:</strong> {detailUser.message}
                    </p>
                  </div>

                  <div className="col-md-6">
                    <p>
                      <strong>🪪 PAN No:</strong> {detailUser.panNo}
                    </p>
                    <p>
                      <strong>🆔 Aadhar No:</strong> {detailUser.aadharNo}
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

export default ReportPage;

// <Table striped bordered hover responsive>
//               <thead>
//                 <tr>
//                   <th>#</th>
//                   <th>Amount Cr/Dr</th>
//                   <th>Available Balance After</th>
//                   <th>Purpose</th>
//                   <th>Date</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {transHistoryData.map((transaction, index) => (
//                   <tr key={index}>
//                     <td>{index + 1}</td>
//                     <td>
//                       ₹{transaction.amountDeducted?transaction.amountDeducted:transaction.requestingAmount} (
//                       {transaction?.amountType || "debit"})
//                     </td>
//                     <td>₹{transaction.availableBalanceAfter}</td>
//                     <td>{transaction.purpose}</td>
//                     <td>
//                       {new Date(transaction.timestamp).toLocaleString()}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </Table>

//  <Table striped bordered hover responsive>
//             <thead>
//               <tr>
//                 <th>#</th>
//                 <th>Token No</th>
//                 <th>Name</th>
//                 <th>Phone</th>
//                 <th>Service</th>
//                 <th>Date</th>
//                 <th>Status</th>
//                 <th>Edit</th>
//               </tr>
//             </thead>
//             <tbody>
//               {ourOrderData.map((order, index) => (
//                 <tr key={index}>
//                   <td>{index + 1}</td>
//                   <td>{order?.token_No || "Not Availabe"}</td>
//                   <td>{order.fullName}</td>
//                   <td>{order.phone}</td>
//                   <td>{order.subCategory}</td>
//                   <td>{order.createdAt}</td>
//                   <td>Pending</td>
//                   <td>
//                     <button
//                       className="btn btn-warning me-2"
//                       onClick={() => handleModal("edit", order)}
//                     >
//                       Edit
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </Table>

// <Table striped bordered hover responsive>
//         <thead>
//           <tr>
//             <th>#</th>
//             <th>Token No</th>
//             <th>Name</th>
//             <th>Phone</th>
//             <th>Service</th>
//             <th>Date</th>
//             <th>Status</th>
//           </tr>
//         </thead>
//         <tbody>
//           {confirmOrderData.map((order, index) => (
//             <tr key={index}>
//               <td>{index + 1}</td>
//               <td>{order?.token_No || "Not Availabe"}</td>
//               <td>{order.fullName}</td>
//               <td>{order.phone}</td>
//               <td>{order.subCategory}</td>
//               <td>{order.updatedAt}</td>
//               <td>Confirm Order</td>
//             </tr>
//           ))}
//         </tbody>
//       </Table>

// <Table striped bordered hover responsive>
//       <thead>
//         <tr>
//           <th>#</th>
//           <th>Token No</th>
//           <th>Name</th>
//           <th>Phone</th>
//           <th>Service</th>
//           <th>Date</th>
//           <th>Status</th>
//           <th>Message</th>
//         </tr>
//       </thead>
//       <tbody>
//         {closeOrderData.map((order, index) => {
//           const hasDocuments =
//             order.document4 ||
//             order.document5 ||
//             order.document6 ||
//             order.document7;

//           return (
//             <React.Fragment key={index}>
//               <tr>
//                 <td>{index + 1}</td>
//                 <td>{order?.token_No || "Not Available"}</td>
//                 <td>{order.fullName}</td>
//                 <td>{order.phone}</td>
//                 <td>{order.subCategory}</td>
//                 <td>
//                   {new Date(order.updatedAt).toLocaleDateString()}
//                 </td>
//                 <td>Close Order</td>
//                 <td>{order?.message || "Not Available"}</td>
//                 <td>
//                   <button
//                     className="btn btn-info btn-sm"
//                     onClick={() => handleShowDetails(order)}
//                   >
//                     View Details
//                   </button>
//                 </td>
//               </tr>
//             </React.Fragment>
//           );
//         })}
//       </tbody>
//     </Table>
