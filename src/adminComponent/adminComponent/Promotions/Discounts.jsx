import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import DataTable from "react-data-table-component";

import {
  GetDiscounts,
  AddDiscount,
  UpdateDiscount,
  DeleteDiscount,
} from "../../../services/discountServices";

import { GetProducts } from "../../../services/productServices";

import {
  GetCategoryData,
  GetSubCategoryData,
} from "../../../services/catalogService";


const Discounts = () => {
  // ==========================================
  // STATES
  // ==========================================

  const [discounts, setDiscounts] = useState([]);

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);

  const [loading, setLoading] = useState(false);
  const [loadingMasterData, setLoadingMasterData] = useState(false);

  const [showModal, setShowModal] = useState(false);

  const [editId, setEditId] = useState(null);

  const [formData, setFormData] = useState({
    name: "",

    // all / product / category / subcategory
    applyOn: "all",

    // multiple selection
    products: [],
    categories: [],
    subCategories: [],

    discountType: "percentage",

    discountValue: "",

    minOrderAmount: "",

    maxDiscount: "",

    startDate: "",

    endDate: "",

    usageLimit: "",

    status: 1,
  });


  // ==========================================
  // FETCH DISCOUNTS
  // ==========================================

  const fetchDiscounts = async () => {
    try {
      setLoading(true);

      const response = await GetDiscounts();

      setDiscounts(response?.data || []);
    } catch (error) {
      console.error(
        "Discount fetch error:",
        error
      );

      Swal.fire(
        "Error",
        error?.response?.data?.message ||
          "Failed to load discounts",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };


  // ==========================================
  // FETCH PRODUCTS
  // ==========================================

  const fetchProducts = async () => {
    try {
      const response = await GetProducts();

      setProducts(
        response?.product_Data ||
          response?.data ||
          []
      );
    } catch (error) {
      console.error(
        "Product fetch error:",
        error
      );
    }
  };


  // ==========================================
  // FETCH CATEGORIES
  // ==========================================

  const fetchCategories = async () => {
    try {
      const response =
        await GetCategoryData();

      setCategories(
        response?.data || []
      );
    } catch (error) {
      console.error(
        "Category fetch error:",
        error
      );
    }
  };


  // ==========================================
  // FETCH SUB CATEGORIES
  // ==========================================

  const fetchSubCategories = async () => {
    try {
      setLoadingMasterData(true);

      /*
        Agar tumhara API all subcategories
        return karta hai to ye chalega.

        Agar API categoryId mandatory karta hai
        to neeche alternative function diya hai.
      */

      const response =
        await GetSubCategoryData();

      setSubCategories(
        response?.data || []
      );
    } catch (error) {
      console.error(
        "SubCategory fetch error:",
        error
      );
    } finally {
      setLoadingMasterData(false);
    }
  };


  // ==========================================
  // INITIAL LOAD
  // ==========================================

  useEffect(() => {
    fetchDiscounts();
    fetchProducts();
    fetchCategories();
    fetchSubCategories();
  }, []);


  // ==========================================
  // HANDLE INPUT
  // ==========================================

  const handleChange = (e) => {
    const {
      name,
      value,
    } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };


  // ==========================================
  // MULTIPLE SELECT HANDLER
  // ==========================================

  const handleMultipleSelect = (
    e,
    field
  ) => {
    const values = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );

    setFormData((prev) => ({
      ...prev,
      [field]: values,
    }));
  };


  // ==========================================
  // OPEN ADD MODAL
  // ==========================================

  const openAddModal = () => {
    setEditId(null);

    setFormData({
      name: "",

      applyOn: "all",

      products: [],
      categories: [],
      subCategories: [],

      discountType: "percentage",

      discountValue: "",

      minOrderAmount: "",

      maxDiscount: "",

      startDate: "",

      endDate: "",

      usageLimit: "",

      status: 1,
    });

    setShowModal(true);
  };


  // ==========================================
  // DATE FORMAT
  // ==========================================

  const formatDateForInput = (
    date
  ) => {
    if (!date) {
      return "";
    }

    try {
      return new Date(date)
        .toISOString()
        .split("T")[0];
    } catch (error) {
      return "";
    }
  };


  // ==========================================
  // GET ID FROM OBJECT / STRING
  // ==========================================

  const getId = (item) => {
    if (!item) {
      return "";
    }

    return item?._id || item;
  };


  // ==========================================
  // OPEN EDIT MODAL
  // ==========================================

  const openEditModal = (row) => {
    setEditId(row._id);

    setFormData({
      name: row.name || "",

      applyOn:
        row.applyOn || "all",

      products:
        row.products?.map(getId) || [],

      categories:
        row.categories?.map(getId) || [],

      subCategories:
        row.subCategories?.map(getId) || [],

      discountType:
        row.discountType ||
        "percentage",

      discountValue:
        row.discountValue ?? "",

      minOrderAmount:
        row.minOrderAmount ?? "",

      maxDiscount:
        row.maxDiscount ?? "",

      startDate:
        formatDateForInput(
          row.startDate
        ),

      endDate:
        formatDateForInput(
          row.endDate
        ),

      usageLimit:
        row.usageLimit ?? "",

      status:
        row.status !== undefined
          ? row.status
          : 1,
    });

    setShowModal(true);
  };


  // ==========================================
  // VALIDATE APPLY ON
  // ==========================================

  const validateApplyOn = () => {
    if (
      formData.applyOn === "product" &&
      formData.products.length === 0
    ) {
      Swal.fire(
        "Validation",
        "Please select at least one product",
        "warning"
      );

      return false;
    }


    if (
      formData.applyOn === "category" &&
      formData.categories.length === 0
    ) {
      Swal.fire(
        "Validation",
        "Please select at least one category",
        "warning"
      );

      return false;
    }


    if (
      formData.applyOn === "subcategory" &&
      formData.subCategories.length === 0
    ) {
      Swal.fire(
        "Validation",
        "Please select at least one sub category",
        "warning"
      );

      return false;
    }


    return true;
  };


  // ==========================================
  // SUBMIT
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();


    // NAME
    if (!formData.name.trim()) {
      Swal.fire(
        "Validation",
        "Please enter discount name",
        "warning"
      );

      return;
    }


    // APPLY ON
    if (!validateApplyOn()) {
      return;
    }


    // DISCOUNT VALUE
    if (
      formData.discountValue === "" ||
      Number(formData.discountValue) <= 0
    ) {
      Swal.fire(
        "Validation",
        "Please enter valid discount value",
        "warning"
      );

      return;
    }


    // PERCENTAGE
    if (
      formData.discountType ===
        "percentage" &&
      Number(formData.discountValue) > 100
    ) {
      Swal.fire(
        "Validation",
        "Percentage discount cannot be more than 100",
        "warning"
      );

      return;
    }


    // DATE
    if (
      !formData.startDate ||
      !formData.endDate
    ) {
      Swal.fire(
        "Validation",
        "Please select start and end date",
        "warning"
      );

      return;
    }


    // DATE CHECK
    if (
      new Date(formData.endDate) <
      new Date(formData.startDate)
    ) {
      Swal.fire(
        "Validation",
        "End date must be greater than start date",
        "warning"
      );

      return;
    }


    try {
      const payload = {
        name:
          formData.name.trim(),

        applyOn:
          formData.applyOn,

        products:
          formData.applyOn ===
          "product"
            ? formData.products
            : [],

        categories:
          formData.applyOn ===
          "category"
            ? formData.categories
            : [],

        subCategories:
          formData.applyOn ===
          "subcategory"
            ? formData.subCategories
            : [],

        discountType:
          formData.discountType,

        discountValue:
          Number(formData.discountValue),

        minOrderAmount:
          Number(
            formData.minOrderAmount || 0
          ),

        maxDiscount:
          Number(
            formData.maxDiscount || 0
          ),

        startDate:
          formData.startDate,

        endDate:
          formData.endDate,

        usageLimit:
          Number(
            formData.usageLimit || 0
          ),

        status:
          Number(formData.status),
      };


      // ======================================
      // UPDATE
      // ======================================

      if (editId) {
        await UpdateDiscount(
          editId,
          payload
        );

        Swal.fire(
          "Success",
          "Discount updated successfully",
          "success"
        );
      }


      // ======================================
      // ADD
      // ======================================

      else {
        await AddDiscount(
          payload
        );

        Swal.fire(
          "Success",
          "Discount added successfully",
          "success"
        );
      }


      setShowModal(false);

      setEditId(null);

      fetchDiscounts();

    } catch (error) {
      console.error(
        "Discount submit error:",
        error
      );

      Swal.fire(
        "Error",
        error?.response?.data?.message ||
          "Something went wrong",
        "error"
      );
    }
  };


  // ==========================================
  // DELETE
  // ==========================================

  const handleDelete = async (
    id
  ) => {
    const result =
      await Swal.fire({
        title: "Are you sure?",
        text:
          "You want to delete this discount?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText:
          "Yes, Delete",
        cancelButtonText:
          "Cancel",
      });


    if (!result.isConfirmed) {
      return;
    }


    try {
      await DeleteDiscount(id);

      Swal.fire(
        "Deleted",
        "Discount deleted successfully",
        "success"
      );

      fetchDiscounts();

    } catch (error) {
      console.error(
        "Delete discount error:",
        error
      );

      Swal.fire(
        "Error",
        error?.response?.data?.message ||
          "Failed to delete discount",
        "error"
      );
    }
  };


  // ==========================================
  // GET APPLY ON LABEL
  // ==========================================

  const getApplyOnLabel = (
    row
  ) => {
    switch (row.applyOn) {
      case "product":
        return "Products";

      case "category":
        return "Categories";

      case "subcategory":
        return "Sub Categories";

      default:
        return "All Products";
    }
  };


  // ==========================================
  // GET SELECTED NAMES
  // ==========================================

  const getProductNames = (
    row
  ) => {
    if (
      !row.products ||
      row.products.length === 0
    ) {
      return "-";
    }

    return row.products
      .map(
        (item) =>
          item?.productName ||
          "-"
      )
      .join(", ");
  };


  const getCategoryNames = (
    row
  ) => {
    if (
      !row.categories ||
      row.categories.length === 0
    ) {
      return "-";
    }

    return row.categories
      .map(
        (item) =>
          item?.name || "-"
      )
      .join(", ");
  };


  const getSubCategoryNames = (
    row
  ) => {
    if (
      !row.subCategories ||
      row.subCategories.length === 0
    ) {
      return "-";
    }

    return row.subCategories
      .map(
        (item) =>
          item?.name || "-"
      )
      .join(", ");
  };


  // ==========================================
  // DATATABLE
  // ==========================================

  const columns = [
    {
      name: "#",

      selector: (
        row,
        index
      ) => index + 1,

      width: "60px",
    },


    {
      name: "Discount Name",

      selector: (row) =>
        row.name || "-",

      sortable: true,

      wrap: true,
    },


    {
      name: "Apply On",

      cell: (row) => (
        <span className="badge bg-primary">
          {getApplyOnLabel(row)}
        </span>
      ),

      sortable: true,
    },


    {
      name: "Products",

      cell: (row) => (
        <div
          style={{
            maxWidth: "220px",
            whiteSpace: "normal",
          }}
        >
          {getProductNames(row)}
        </div>
      ),

      wrap: true,
    },


    {
      name: "Categories",

      cell: (row) => (
        <div
          style={{
            maxWidth: "200px",
            whiteSpace: "normal",
          }}
        >
          {getCategoryNames(row)}
        </div>
      ),

      wrap: true,
    },


    {
      name: "Sub Categories",

      cell: (row) => (
        <div
          style={{
            maxWidth: "200px",
            whiteSpace: "normal",
          }}
        >
          {getSubCategoryNames(row)}
        </div>
      ),

      wrap: true,
    },


    {
      name: "Discount",

      cell: (row) => (
        <span className="badge bg-info">
          {row.discountType ===
          "percentage"
            ? `${row.discountValue}%`
            : `₹${row.discountValue}`}
        </span>
      ),

      sortable: true,
    },


    {
      name: "Min Order",

      selector: (row) =>
        row.minOrderAmount
          ? `₹${row.minOrderAmount}`
          : "-",

      sortable: true,
    },


    {
      name: "Start Date",

      selector: (row) =>
        row.startDate
          ? new Date(
              row.startDate
            ).toLocaleDateString(
              "en-IN"
            )
          : "-",
    },


    {
      name: "End Date",

      selector: (row) =>
        row.endDate
          ? new Date(
              row.endDate
            ).toLocaleDateString(
              "en-IN"
            )
          : "-",
    },


    {
      name: "Status",

      cell: (row) => (
        <span
          className={`badge ${
            Number(row.status) === 1
              ? "bg-success"
              : "bg-danger"
          }`}
        >
          {Number(row.status) === 1
            ? "Active"
            : "Inactive"}
        </span>
      ),
    },


    {
      name: "Action",

      cell: (row) => (
        <div className="d-flex gap-2">

          <button
            className="btn btn-sm btn-warning"
            title="Edit"
            onClick={() =>
              openEditModal(row)
            }
          >
            <i className="fas fa-edit"></i>
          </button>


          <button
            className="btn btn-sm btn-danger"
            title="Delete"
            onClick={() =>
              handleDelete(row._id)
            }
          >
            <i className="fas fa-trash"></i>
          </button>

        </div>
      ),
    },
  ];


  // ==========================================
  // RENDER
  // ==========================================

  return (
    <div className="container-fluid">

      <div className="page-inner">


        {/* ==================================
            HEADER
        ================================== */}

        <div className="d-flex justify-content-between align-items-center mb-4">

          <div>

            <h3 className="fw-bold">
              Discounts
            </h3>

            <p className="text-muted mb-0">
              Manage product, category and
              sub-category discounts
            </p>

          </div>


          <button
            className="btn btn-primary"
            onClick={
              openAddModal
            }
          >
            + Add Discount
          </button>

        </div>


        {/* ==================================
            TABLE
        ================================== */}

        <div className="card">

          <div className="card-header">

            <h4 className="card-title mb-0">
              All Discounts
            </h4>

          </div>


          <div className="card-body">

            <DataTable
              columns={columns}
              data={discounts}
              progressPending={
                loading
              }
              pagination
              highlightOnHover
              responsive
              persistTableHead
              noDataComponent={
                "No discounts found"
              }
            />

          </div>

        </div>


        {/* ==================================
            MODAL
        ================================== */}

        {showModal && (

          <div
            className="modal fade show"
            style={{
              display: "block",
              backgroundColor:
                "rgba(0,0,0,0.5)",
            }}
            tabIndex="-1"
          >

            <div className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">

              <div className="modal-content">


                {/* ==========================
                    MODAL HEADER
                ========================== */}

                <div className="modal-header">

                  <div>

                    <h5 className="modal-title fw-bold">
                      {editId
                        ? "Edit Discount"
                        : "Add Discount"}
                    </h5>

                    <small className="text-muted">
                      Create discount for
                      products, categories
                      or sub-categories
                    </small>

                  </div>


                  <button
                    type="button"
                    className="btn-close"
                    onClick={() =>
                      setShowModal(false)
                    }
                  ></button>

                </div>


                {/* ==========================
                    FORM
                ========================== */}

                <form
                  onSubmit={
                    handleSubmit
                  }
                >

                  <div className="modal-body">


                    <div className="row g-3">


                      {/* ========================
                          DISCOUNT NAME
                      ======================== */}

                      <div className="col-md-6">

                        <label className="form-label fw-bold">

                          Discount Name

                          <span className="text-danger">
                            *
                          </span>

                        </label>


                        <input
                          type="text"
                          name="name"
                          className="form-control"
                          value={
                            formData.name
                          }
                          onChange={
                            handleChange
                          }
                          placeholder="e.g. Diwali Sale 20%"
                        />

                      </div>


                      {/* ========================
                          APPLY ON
                      ======================== */}

                      <div className="col-md-6">

                        <label className="form-label fw-bold">

                          Apply Discount On

                          <span className="text-danger">
                            *
                          </span>

                        </label>


                        <select
                          name="applyOn"
                          className="form-select"
                          value={
                            formData.applyOn
                          }
                          onChange={
                            handleChange
                          }
                        >

                          <option value="all">
                            All Products
                          </option>

                          <option value="product">
                            Specific Products
                          </option>

                          <option value="category">
                            Categories
                          </option>

                          <option value="subcategory">
                            Sub Categories
                          </option>

                        </select>

                      </div>


                      {/* ========================
                          PRODUCT MULTI SELECT
                      ======================== */}

                      {formData.applyOn ===
                        "product" && (

                        <div className="col-12">

                          <label className="form-label fw-bold">

                            Select Products

                            <span className="text-danger">
                              *
                            </span>

                          </label>


                          <select
                            multiple
                            className="form-select"
                            style={{
                              minHeight:
                                "180px",
                            }}
                            value={
                              formData.products
                            }
                            onChange={(e) =>
                              handleMultipleSelect(
                                e,
                                "products"
                              )
                            }
                          >

                            {products.length ===
                            0 ? (

                              <option disabled>
                                No products found
                              </option>

                            ) : (

                              products.map(
                                (product) => (

                                  <option
                                    key={
                                      product._id
                                    }
                                    value={
                                      product._id
                                    }
                                  >
                                    {product.productName ||
                                      "Unnamed Product"}

                                    {product.sku
                                      ? ` - ${product.sku}`
                                      : ""}
                                  </option>

                                )
                              )

                            )}

                          </select>


                          <small className="text-muted">
                            Hold Ctrl / Cmd to
                            select multiple
                            products.
                          </small>

                        </div>

                      )}


                      {/* ========================
                          CATEGORY MULTI SELECT
                      ======================== */}

                      {formData.applyOn ===
                        "category" && (

                        <div className="col-12">

                          <label className="form-label fw-bold">

                            Select Categories

                            <span className="text-danger">
                              *
                            </span>

                          </label>


                          <select
                            multiple
                            className="form-select"
                            style={{
                              minHeight:
                                "160px",
                            }}
                            value={
                              formData.categories
                            }
                            onChange={(e) =>
                              handleMultipleSelect(
                                e,
                                "categories"
                              )
                            }
                          >

                            {categories.length ===
                            0 ? (

                              <option disabled>
                                No categories found
                              </option>

                            ) : (

                              categories.map(
                                (category) => (

                                  <option
                                    key={
                                      category._id
                                    }
                                    value={
                                      category._id
                                    }
                                  >
                                    {
                                      category.name
                                    }
                                  </option>

                                )
                              )

                            )}

                          </select>


                          <small className="text-muted">
                            Select multiple
                            categories.
                          </small>

                        </div>

                      )}


                      {/* ========================
                          SUBCATEGORY MULTI SELECT
                      ======================== */}

                      {formData.applyOn ===
                        "subcategory" && (

                        <div className="col-12">

                          <label className="form-label fw-bold">

                            Select Sub Categories

                            <span className="text-danger">
                              *
                            </span>

                          </label>


                          <select
                            multiple
                            className="form-select"
                            style={{
                              minHeight:
                                "160px",
                            }}
                            value={
                              formData.subCategories
                            }
                            onChange={(e) =>
                              handleMultipleSelect(
                                e,
                                "subCategories"
                              )
                            }
                          >

                            {subCategories.length ===
                            0 ? (

                              <option disabled>
                                {loadingMasterData
                                  ? "Loading sub categories..."
                                  : "No sub categories found"}
                              </option>

                            ) : (

                              subCategories.map(
                                (subCategory) => (

                                  <option
                                    key={
                                      subCategory._id
                                    }
                                    value={
                                      subCategory._id
                                    }
                                  >
                                    {
                                      subCategory.name
                                    }
                                  </option>

                                )
                              )

                            )}

                          </select>


                          <small className="text-muted">
                            Select multiple
                            sub-categories.
                          </small>

                        </div>

                      )}


                      {/* ========================
                          DISCOUNT TYPE
                      ======================== */}

                      <div className="col-md-6">

                        <label className="form-label fw-bold">

                          Discount Type

                        </label>


                        <select
                          name="discountType"
                          className="form-select"
                          value={
                            formData.discountType
                          }
                          onChange={
                            handleChange
                          }
                        >

                          <option value="percentage">
                            Percentage (%)
                          </option>

                          <option value="fixed">
                            Fixed Amount (₹)
                          </option>

                        </select>

                      </div>


                      {/* ========================
                          DISCOUNT VALUE
                      ======================== */}

                      <div className="col-md-6">

                        <label className="form-label fw-bold">

                          Discount Value

                          <span className="text-danger">
                            *
                          </span>

                        </label>


                        <div className="input-group">

                          <input
                            type="number"
                            name="discountValue"
                            className="form-control"
                            value={
                              formData.discountValue
                            }
                            onChange={
                              handleChange
                            }
                            min="0"
                            max={
                              formData.discountType ===
                              "percentage"
                                ? "100"
                                : undefined
                            }
                            step="0.01"
                            placeholder="Enter discount"
                          />


                          <span className="input-group-text">

                            {formData.discountType ===
                            "percentage"
                              ? "%"
                              : "₹"}

                          </span>

                        </div>

                      </div>


                      {/* ========================
                          MIN ORDER
                      ======================== */}

                      <div className="col-md-4">

                        <label className="form-label fw-bold">

                          Minimum Order Amount

                        </label>


                        <div className="input-group">

                          <span className="input-group-text">
                            ₹
                          </span>


                          <input
                            type="number"
                            name="minOrderAmount"
                            className="form-control"
                            value={
                              formData.minOrderAmount
                            }
                            onChange={
                              handleChange
                            }
                            min="0"
                            step="0.01"
                            placeholder="0"
                          />

                        </div>


                        <small className="text-muted">
                          0 means no minimum
                          order.
                        </small>

                      </div>


                      {/* ========================
                          MAX DISCOUNT
                      ======================== */}

                      <div className="col-md-4">

                        <label className="form-label fw-bold">

                          Maximum Discount

                        </label>


                        <div className="input-group">

                          <span className="input-group-text">
                            ₹
                          </span>


                          <input
                            type="number"
                            name="maxDiscount"
                            className="form-control"
                            value={
                              formData.maxDiscount
                            }
                            onChange={
                              handleChange
                            }
                            min="0"
                            step="0.01"
                            placeholder="0"
                          />

                        </div>


                        <small className="text-muted">
                          Mainly useful for
                          percentage discounts.
                        </small>

                      </div>


                      {/* ========================
                          USAGE LIMIT
                      ======================== */}

                      <div className="col-md-4">

                        <label className="form-label fw-bold">

                          Usage Limit

                        </label>


                        <input
                          type="number"
                          name="usageLimit"
                          className="form-control"
                          value={
                            formData.usageLimit
                          }
                          onChange={
                            handleChange
                          }
                          min="0"
                          placeholder="0"
                        />


                        <small className="text-muted">
                          0 means unlimited.
                        </small>

                      </div>


                      {/* ========================
                          START DATE
                      ======================== */}

                      <div className="col-md-6">

                        <label className="form-label fw-bold">

                          Start Date

                          <span className="text-danger">
                            *
                          </span>

                        </label>


                        <input
                          type="date"
                          name="startDate"
                          className="form-control"
                          value={
                            formData.startDate
                          }
                          onChange={
                            handleChange
                          }
                        />

                      </div>


                      {/* ========================
                          END DATE
                      ======================== */}

                      <div className="col-md-6">

                        <label className="form-label fw-bold">

                          End Date

                          <span className="text-danger">
                            *
                          </span>

                        </label>


                        <input
                          type="date"
                          name="endDate"
                          className="form-control"
                          value={
                            formData.endDate
                          }
                          onChange={
                            handleChange
                          }
                        />

                      </div>


                      {/* ========================
                          STATUS
                      ======================== */}

                      <div className="col-md-6">

                        <label className="form-label fw-bold">

                          Status

                        </label>


                        <select
                          name="status"
                          className="form-select"
                          value={
                            formData.status
                          }
                          onChange={
                            handleChange
                          }
                        >

                          <option value={1}>
                            Active
                          </option>

                          <option value={0}>
                            Inactive
                          </option>

                        </select>

                      </div>


                    </div>

                  </div>


                  {/* ==========================
                      FOOTER
                  ========================== */}

                  <div className="modal-footer">

                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() =>
                        setShowModal(false)
                      }
                    >
                      Cancel
                    </button>


                    <button
                      type="submit"
                      className="btn btn-primary"
                    >
                      {editId
                        ? "Update Discount"
                        : "Add Discount"}
                    </button>

                  </div>


                </form>

              </div>

            </div>

          </div>

        )}

      </div>

    </div>
  );
};


export default Discounts;