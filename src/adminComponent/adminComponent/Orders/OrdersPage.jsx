import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { GetOrders } from "../../../services/orderServices";

const OrdersPage = ({ status = "" }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchOrders = async () => {
    try {
      setLoading(true);

      const response = await GetOrders(status);

      setOrders(response?.data || []);
    } catch (error) {
      console.error("Orders Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [status]);

  const columns = [
    {
      name: "Order ID",
      selector: (row) => row._id || "-",
      sortable: true,
    },

    {
      name: "Customer",
      selector: (row) => row.customer?.name || row.customerName || "-",
      sortable: true,
    },

    {
      name: "Phone",
      selector: (row) => row.customer?.phone || row.phone || "-",
    },

    {
      name: "Items",
      selector: (row) => row.items?.length || 0,
    },

    {
      name: "Amount",
      selector: (row) => `₹${row.totalAmount || row.amount || 0}`,
      sortable: true,
    },

    {
      name: "Payment",
      selector: (row) => row.paymentStatus || "-",
    },

    {
      name: "Status",
      cell: (row) => (
        <span className="badge bg-primary">
          {row.status || "-"}
        </span>
      ),
    },

    {
      name: "Date",
      selector: (row) =>
        row.createdAt
          ? new Date(row.createdAt).toLocaleDateString()
          : "-",
      sortable: true,
    },
  ];

  return (
    <div className="container-fluid">

      <div className="page-inner">

        <div className="d-flex justify-content-between align-items-center mb-4">

          <div>
            <h3 className="fw-bold">
              {status
                ? `${status} Orders`
                : "All Orders"}
            </h3>

            <p className="text-muted mb-0">
              Manage your ecommerce orders
            </p>
          </div>

        </div>

        <div className="card">

          <div className="card-header">
            <h4 className="card-title mb-0">
              {status
                ? `${status} Orders`
                : "All Orders"}
            </h4>
          </div>

          <div className="card-body">

            <DataTable
              columns={columns}
              data={orders}
              progressPending={loading}
              pagination
              highlightOnHover
              responsive
              striped
            />

          </div>

        </div>

      </div>

    </div>
  );
};

export default OrdersPage;