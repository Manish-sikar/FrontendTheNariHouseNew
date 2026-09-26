import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {
  AddNewLoanData,
  changeStatusLoan,
  deleteLoanData,
  GetLoanData,
} from "../../../services/loanDataServices";
import DataTableComponent from "../../../atoms/datatables/datatables";

const LoanServicesPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loanData, setLoanData] = useState([]);
  const [formData, setFormData] = useState({
    category_name: "",
    sub_category_name: "",
    category: "",
        amount: "",
        DelarAmount:"",
    link: "",
    loanimg: null,
  });

  const navigate = useNavigate();

  useEffect(() => {
    fetchLoanData();
  }, []);

  const fetchLoanData = async () => {
    try {
      const response = await GetLoanData();
      setLoanData(response?.loan_Data || []);
    } catch (error) {
      Swal.fire("Error!", "Failed to fetch data. Please try again.", "error");
      setLoanData([]);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, loanimg: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        data.append(key, value);
      });

      await AddNewLoanData(data);
      Swal.fire("Success!", "Loan service added successfully.", "success");
      fetchLoanData();
      setIsModalOpen(false);
    } catch (error) {
      Swal.fire(
        "Error!",
        "Failed to add loan service. Please try again.",
        "error"
      );
    }
  };

  const handleDeleteClick = async (_id) => {
    try {
      await deleteLoanData(_id);
      Swal.fire("Success!", "Data deleted successfully!", "success");
      fetchLoanData();
    } catch (error) {
      Swal.fire("Error!", "Failed to delete data. Please try again.", "error");
    }
  };

  const handleEditClick = (item) => {
    navigate(`/admin/loanProduct/edit`, { state: { item } });
  };

  const handleStatus = async (item) => {
    try {
      await changeStatusLoan(item._id);
      Swal.fire("Success!", "Status changed successfully!", "success");
      fetchLoanData();
    } catch (error) {
      Swal.fire(
        "Error!",
        "Failed to change status. Please try again.",
        "error"
      );
    }
  };

  const category = [
    "insurance",
    "e_store",
    "investment",
    "account_opening",
    "cards",
    "our_service",
    "loan_product",
    "report" ,
    "support",
    "Instant_Deal"
  ];

  const columns = [
  {
    name: "Icon",
    selector: (row) => row.icon_pic,
    cell: (row) => <img src={row.icon_pic} alt="icon" className="w-50" />,
    sortable: false,
  },
  {
    name: "Category Name",
    selector: (row) => row.category_name,
    sortable: true,
  },
  {
    name: "Sub Category",
    selector: (row) => row.sub_category_name,
    sortable: true,
  },
  {
    name: "Category",
    selector: (row) => row.category,
    sortable: true,
  },
  {
    name: "Amount",
    selector: (row) => row.amount || 0,
    sortable: true,
  },
    {
    name: "Delar Amount",
    selector: (row) => row.DelarAmount || 0,
    sortable: true,
  },
  {
    name: "Link",
    selector: (row) => row.link,
    sortable: true,
  },
  {
    name: "Status",
    cell: (row) => (
      <button
        className={`btn btn-sm ${
          row.status === 1 ? "btn-success" : "btn-danger"
        }`}
        onClick={() => handleStatus(row)}
      >
        {row.status === 1 ? "Active" : "Inactive"}
      </button>
    ),
    ignoreRowClick: true,
    allowOverflow: true,
    button: true,
  },
  {
    name: "Action",
    cell: (row) => (
      <>
        <button
          className="btn btn-sm btn-primary me-2"
          onClick={() => handleEditClick(row)}
        >
          Edit
        </button>
        <button
          className="btn btn-sm btn-danger"
          onClick={() => handleDeleteClick(row._id)}
        >
          Delete
        </button>
      </>
    ),
    ignoreRowClick: true,
    allowOverflow: true,
    button: true,
  },
];


  return (
    <div className="container mt-4">
      <div className="card">
        <div className="card-header d-flex justify-content-between">
          <h4>Loan Services</h4>
          <button
            className="btn btn-primary"
            onClick={() => setIsModalOpen(true)}
          >
            <i className="fa fa-plus"></i> Add Loan Service
          </button>
        </div>

        <div className="card-body">
          {isModalOpen && (
            <div className="modal show d-block">
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5>Add Loan Service</h5>
                    <button
                      className="close"
                      onClick={() => setIsModalOpen(false)}
                    >
                      &times;
                    </button>
                  </div>
                  <div className="modal-body">
                    <form onSubmit={handleSubmit}>
                      <div className="form-group">
                        <label>Category Name</label>
                        <input
                          type="text"
                          name="category_name"
                          className="form-control"
                          onChange={handleChange}
                        />
                      </div>
                      <div className="form-group">
                        <label>Sub Category Name</label>
                        <input
                          type="text"
                          name="sub_category_name"
                          className="form-control"
                          onChange={handleChange}
                        />
                      </div>
                      <div className="form-group">
                        <div className="form-group">
                          <label>Category</label>
                          <select
                            name="category"
                            className="form-control"
                            onChange={handleChange}
                            value={formData.category}
                          >
                            <option value="">Select Category</option>
                            {category.map((category) => (
                              <option key={category} value={category}>
                                {category}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                        <div className="form-group">
                        <label>Amount</label>
                        <input
                          type="text"
                          name="amount"
                          className="form-control"
                          onChange={handleChange}
                        />
                      </div>
                       <div className="form-group">
                        <label>Delar Amount</label>
                        <input
                          type="text"
                          name="DelarAmount"
                          className="form-control"
                          onChange={handleChange}
                        />
                      </div>
                      <div className="form-group">
                        <label>Link</label>
                        <input
                          type="text"
                          name="link"
                          className="form-control"
                          onChange={handleChange}
                        />
                      </div>
                      <div className="form-group">
                        <label>Icon Image</label>
                        <input
                          type="file"
                          name="loanimg"
                          className="form-control"
                          onChange={handleFileChange}
                        />
                      </div>
                      <div className="modal-footer">
                        <button type="submit" className="btn btn-primary">
                          Add
                        </button>
                        <button
                          type="button"
                          className="btn btn-danger"
                          onClick={() => setIsModalOpen(false)}
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

          {/* <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Icon</th>
                  <th>Category Name</th>
                  <th>Sub Category</th>
                  <th>Category</th>
                   <th>amount</th>
                  <th>Link</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {loanData.length > 0 ? (
                  loanData.map((item) => (
                    <tr key={item._id}>
                      <td>
                        <img src={item.icon_pic} className="w-50" alt="icon" />
                      </td>
                      <td>{item.category_name}</td>
                      <td>{item.sub_category_name}</td>
                      <td>{item.category}</td>
                         <td>{item?.amount || 0} </td>
                      <td>{item.link}</td>
                      <td>
                        <button
                          className={`btn ${
                            item.status === 1 ? "btn-success" : "btn-danger"
                          }`}
                          onClick={() => handleStatus(item)}
                        >
                          {item.status === 1 ? "Active" : "Inactive"}
                        </button>
                      </td>
                      <td>
                        <button
                          className="btn btn-primary"
                          onClick={() => handleEditClick(item)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-danger"
                          onClick={() => handleDeleteClick(item._id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center">
                      No data available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div> */}

          <DataTableComponent columns={columns} data={loanData}   />




        </div>
      </div>
    </div>
  );
};

export default LoanServicesPage;
