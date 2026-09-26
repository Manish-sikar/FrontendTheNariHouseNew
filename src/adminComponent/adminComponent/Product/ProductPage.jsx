import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import {
  GetProducts,
  DeleteProduct,
  ChangeProductStatus,
} from "../../../services/productServices";

import DataTableComponent from "../../../atoms/datatables/datatables";


const ProductPage = () => {

  const [productData, setProductData] = useState([]);

  const navigate = useNavigate();


  // ==========================================
  // FETCH PRODUCTS
  // ==========================================

  useEffect(() => {
    fetchProducts();
  }, []);


  const fetchProducts = async () => {

    try {

      const response = await GetProducts();

      setProductData(
        response?.product_Data || []
      );

    } catch (error) {

      console.error(error);

      Swal.fire(
        "Error!",
        "Failed to fetch products.",
        "error"
      );

      setProductData([]);
    }
  };


  // ==========================================
  // DELETE
  // ==========================================

  const handleDelete = async (id) => {

    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You want to delete this product?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Delete",
      cancelButtonText: "Cancel",
    });


    if (!result.isConfirmed) {
      return;
    }


    try {

      await DeleteProduct(id);

      Swal.fire(
        "Deleted!",
        "Product deleted successfully.",
        "success"
      );

      fetchProducts();

    } catch (error) {

      Swal.fire(
        "Error!",
        "Failed to delete product.",
        "error"
      );
    }
  };


  // ==========================================
  // STATUS
  // ==========================================

  const handleStatus = async (item) => {

    try {

      await ChangeProductStatus(
        item._id
      );

      Swal.fire(
        "Success!",
        "Product status changed.",
        "success"
      );

      fetchProducts();

    } catch (error) {

      Swal.fire(
        "Error!",
        "Failed to change status.",
        "error"
      );
    }
  };


  // ==========================================
  // EDIT
  // ==========================================

  const handleEdit = (item) => {

    navigate(
      "/admin/products/edit",
      {
        state: {
          item,
        },
      }
    );
  };


  // ==========================================
  // TABLE COLUMNS
  // ==========================================

  const columns = [

    {
      name: "Image",

      selector: (row) =>
        row.images?.[0],

      cell: (row) => (

        row.images?.[0] ? (

          <img
            src={row.images[0]}
            alt={row.productName}
            style={{
              width: "55px",
              height: "55px",
              objectFit: "cover",
              borderRadius: "6px",
            }}
          />

        ) : (

          <span>
            No Image
          </span>

        )

      ),

      sortable: false,
    },


    {
      name: "Product",

      selector: (row) =>
        row.productName,

      sortable: true,
    },


    {
      name: "SKU",

      selector: (row) =>
        row.sku,

      sortable: true,
    },


{
  name: "Category",

  selector: (row) =>
    row.category?.name || "-",

  cell: (row) =>
    row.category?.name || "-",

  sortable: true,
},

{
  name: "Sub Category",

  selector: (row) =>
    row.subCategory?.name || "-",

  cell: (row) =>
    row.subCategory?.name || "-",

  sortable: true,
},

{
  name: "Brand",

  selector: (row) =>
    row.brand?.name || "-",

  cell: (row) =>
    row.brand?.name || "-",

  sortable: true,
},


    {
      name: "Price",

      selector: (row) =>
        row.price || 0,

      sortable: true,

      cell: (row) =>
        `₹${row.price || 0}`,
    },


    {
      name: "Sale Price",

      selector: (row) =>
        row.salePrice || 0,

      sortable: true,

      cell: (row) =>
        row.salePrice
          ? `₹${row.salePrice}`
          : "-",
    },


    {
      name: "Stock",

      selector: (row) =>
        row.stock || 0,

      sortable: true,

      cell: (row) => (

        <span
          className={
            row.stock > 0
              ? "text-success"
              : "text-danger"
          }
        >
          {row.stock || 0}
        </span>

      ),
    },


    {
      name: "Status",

      cell: (row) => (

        <button
          className={`btn btn-sm ${
            row.status === 1
              ? "btn-success"
              : "btn-danger"
          }`}

          onClick={() =>
            handleStatus(row)
          }
        >

          {row.status === 1
            ? "Active"
            : "Inactive"}

        </button>

      ),

      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },


    {
      name: "Action",

      cell: (row) => (

        <div className="d-flex gap-2">

          <button
            className="btn btn-sm btn-primary"

            onClick={() =>
              handleEdit(row)
            }
          >
            Edit
          </button>


          <button
            className="btn btn-sm btn-danger"

            onClick={() =>
              handleDelete(row._id)
            }
          >
            Delete
          </button>

        </div>

      ),

      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },

  ];


  return (

    <div className="container mt-4">

      <div className="card">

        {/* HEADER */}

        <div className="card-header d-flex justify-content-between align-items-center">

          <h4 className="mb-0">
            Products
          </h4>


          <button
            className="btn btn-primary"

            onClick={() =>
              navigate("/admin/products/add")
            }
          >

            <i className="fa fa-plus me-1"></i>

            Add Product

          </button>

        </div>


        {/* BODY */}

        <div className="card-body">

          <DataTableComponent
            columns={columns}
            data={productData}
          />

        </div>

      </div>

    </div>

  );
};


export default ProductPage;