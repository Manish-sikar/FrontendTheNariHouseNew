import React, { useEffect, useState } from "react";

import DataTableComponent from "../../../atoms/datatables/datatables";
import Swal from "sweetalert2";
import { DeleteLinkWithHttpData, GetlinkWithHttpData } from "../../../services/linkWithHttpServices";

const LinkWithHttpDataTable = () => {
  const [tableData, setTableData] = useState([]);

  const fetchData = async () => {
    try {
      const res = await GetlinkWithHttpData();
      setTableData(res.data.linkWithHttp_Data);
    } catch (error) {
      console.error("Failed to fetch data", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Delete entry?",
      text: "Are you sure you want to delete this entry?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    });

    if (confirm.isConfirmed) {
      try {
        await DeleteLinkWithHttpData(id);
        Swal.fire("Deleted!", "Entry deleted successfully", "success");
        fetchData();
      } catch (error) {
        Swal.fire("Error", "Failed to delete entry", "error");
      }
    }
  };

  const columns = [
    { name: "Full Name", selector: (row) => row.fullName },
    { name: "Email", selector: (row) => row.email },
    { name: "Phone", selector: (row) => row.phone },
    { name: "Pan Card", selector: (row) => row.panCard },
    { name: "Address", selector: (row) => row.fullAddress },
    { name: "category", selector: (row) => row.category },
    { name: "subcategory", selector: (row) => row.subcategory },
    { name: "Jn_Id", selector: (row) => row.partnerEmail },
    { name: "Delar Id", selector: (row) => row.userDelar_id },
    {
      name: "Actions",
      cell: (row) => (
        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(row._id)}>
          Delete
        </button>
      ),
    },
  ];

  return (
    <div className="mt-5">
      <DataTableComponent title="Link With HTTP Submissions" columns={columns} data={tableData} />
    </div>
  );
};

export default LinkWithHttpDataTable;
