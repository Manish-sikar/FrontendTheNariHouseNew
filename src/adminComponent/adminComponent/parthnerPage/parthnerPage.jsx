import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {
  GetnewpartnerData,
  deletePartner,
  ParthnerChangepass,
} from "../../../services/applyNewUserForm";
import { baseURL } from "../../../services/apiService";
import DataTableComponent from "../../../atoms/datatables/datatables";

const PartnerPage = () => {
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchTableData = async () => {
    try {
      const response = await GetnewpartnerData(1);
      if (response && Array.isArray(response?.partner_Data)) {
        setTableData(response?.partner_Data);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (err) {
      console.error("Error fetching table data:", err);
      setError("Failed to load partner data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
      fetchTableData();
    
  }, []);

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await deletePartner(id);
        Swal.fire("Deleted!", "Partner has been deleted.", "success");
        fetchTableData();
      } catch (error) {
        Swal.fire("Error!", "Failed to delete partner.", "error");
      }
    }
  };

  const handleEdit = (partner) => {
    navigate("/admin/partner/edit", { state: { partner } });
  };

  const handleChangePassword = async (id) => {
    const { value: newPassword } = await Swal.fire({
      title: "Enter new password",
      input: "password",
      inputPlaceholder: "Enter new password",
      showCancelButton: true,
      inputValidator: (value) => {
        if (!value) return "Password is required!";
      },
    });

    if (newPassword) {
      try {
        await ParthnerChangepass({ id, newPassword });
        Swal.fire("Success!", "Password changed successfully.", "success");
      } catch (error) {
        Swal.fire("Error!", "Failed to change password.", "error");
      }
    }
  };

  // const handleAddAmount = async (JN_Id) => {
  //   // Step 1: Get the amount
  //   Swal.fire({
  //     title: "Enter the amount to add:",
  //     input: "text",
  //     inputLabel: "Amount",
  //     inputPlaceholder: "Enter a number",
  //     inputValidator: (value) => {
  //       if (!value || isNaN(value) || Number(value) <= 0) {
  //         return "Please enter a valid number";
  //       }
  //     },
  //     showCancelButton: true,
  //   }).then((amountResult) => {
  //     if (amountResult.isConfirmed) {
  //       const amount = parseFloat(amountResult.value);

  //       // Step 2: Get the remark
  //       Swal.fire({
  //         title: "Enter the remark for this transaction:",
  //         input: "text",
  //         inputLabel: "Remark",
  //         inputPlaceholder: "Enter a remark",
  //         inputValidator: (value) => {
  //           if (!value.trim()) {
  //             return "Remark cannot be empty";
  //           }
  //         },
  //         showCancelButton: true,
  //       }).then(async (remarkResult) => {
  //         if (remarkResult.isConfirmed) {
  //           const remark = remarkResult.value;

  //           try {
  //             const response = await fetch(`${baseURL}/addAmountByAdmin`, {
  //               method: "POST",
  //               headers: {
  //                 "Content-Type": "application/json",
  //               },
  //               body: JSON.stringify({
  //                 amount,
  //                 partnerEmail: JN_Id,
  //                 remark,
  //               }),
  //             });

  //             const result = await response.json();
  //             if (response.ok) {
  //               Swal.fire(
  //                 "Success!",
  //                 `Amount added successfully! Updated Balance: ₹${result.updatedBalance}`,
  //                 "success"
  //               );
  //               fetchTableData();
  //             } else {
  //               Swal.fire(
  //                 "Error",
  //                 result.error || "Failed to add amount.",
  //                 "error"
  //               );
  //             }
  //           } catch (error) {
  //             console.error("Error adding amount:", error);
  //             Swal.fire(
  //               "Error",
  //               "An error occurred. Please try again.",
  //               "error"
  //             );
  //           }
  //         }
  //       });
  //     }
  //   });
  // };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  const columns = [
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
      name: "Delar Id",
      selector: (row) => (row?.create_id ?? "") ,
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
    {
      name: "Actions",
      cell: (row) => (
        <>
          <button
            className="btn btn-sm btn-primary me-2"
            onClick={() => handleEdit(row)}
          >
            <i className="fa fa-edit"></i>
          </button>
          <button
            className="btn btn-sm btn-danger me-2"
            onClick={() => handleDelete(row._id)}
          >
            <i className="fa fa-trash"></i>
          </button>
          <button
            className="btn btn-sm btn-warning"
            onClick={() => handleChangePassword(row._id)}
          >
            <i className="fa fa-key"></i>
          </button>
        </>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];

  return (
    <div className="col-md-12 mt-5">
      <div className="card">
        <div className="card-header">
          <Link
            to="/admin/become-partner"
            className="btn btn-primary btn-round ms-auto"
          >
            <i className="fa fa-plus"></i> Add Partner
          </Link>
        </div>
        {/* {message && <div className="alert alert-success">{message}</div>} */}
        {/*     
<DataTableComponent columns={columns} data={tableData} title="Partner's Data" /> */}

        {tableData.length === 0 ? (
          <div className="alert alert-warning">No partner data available.</div>
        ) : (
          <DataTableComponent
            columns={columns}
            data={tableData}
            title="Partner's Data"
          />
        )}
      </div>
    </div>
  );
};

export default PartnerPage;

// <div className="card-body">
//       <div className="table-responsive">
//         {tableData.length === 0 ? (
//           <div className="alert alert-warning">
//             No partner data available.
//           </div>
//         ) : (
//           <table className="table table-striped table-hover">
//             <thead>
//               <tr>
//                 <th>Avtar</th>
//                 <th>JN Id </th>
//                 <th>Full Name</th>
//                 <th>Email</th>
//                 <th>Phone</th>
//                 <th>Wallet Balance</th>
//                 <th>Designation</th>
//                 <th>Institution</th>
//                 <th>Message</th>
//                 <th>Pan No</th>
//                 <th>Aadhar No</th>
//                 <th>Account Details </th>
//                 {/* <th>Add Amount</th> */}
//                 <th>Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {tableData.map((item) => (
//                 <tr key={item._id}>
//                   <td>
//                   <img
//                 src={item.Avtar}
//                 alt="team"
//                 style={{ width: "50px", height: "50px", borderRadius: "50%" }}
//               />
//                   </td>
//                   <td>{item.JN_Id}</td>
//                   <td>{item.fullName}</td>
//                   <td>{item.email}</td>
//                   <td>{item.mobile}</td>
//                   <td>{item.balance}</td>
//                   <td>{item.designation}</td>
//                   <td>{item.institutionName}</td>
//                   <td>{item.message}</td>
//                   <td>{item.panNo}</td>
//                   <td>{item.aadharNo}</td>
//                   <td>{item.acDetails}</td>
//                   {/* <td>

//                     <button
//                       className="btn btn-sm btn-success"
//                       onClick={() => handleAddAmount(item.JN_Id)}
//                     >
//                       Add Amount
//                     </button>
//                   </td> */}
//                   <td>
//                     <button
//                       className="btn btn-sm btn-primary me-2"
//                       onClick={() => handleEdit(item)}
//                     >
//                       <i className="fa fa-edit"></i>
//                     </button>
//                     <button
//                       className="btn btn-sm btn-danger me-2"
//                       onClick={() => handleDelete(item._id)}
//                     >
//                       <i className="fa fa-trash"></i>
//                     </button>
//                     <button
//                       className="btn btn-sm btn-warning"
//                       onClick={() => handleChangePassword(item._id)}
//                     >
//                       <i className="fa fa-key"></i>
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         )}
//       </div>
//     </div>
