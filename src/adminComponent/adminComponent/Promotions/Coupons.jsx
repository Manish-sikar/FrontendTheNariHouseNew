import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import DataTable from "react-data-table-component";

import {
  GetCoupons,
  AddCoupon,
  UpdateCoupon,
  DeleteCoupon,
} from "../../../services/couponServices";

import {
  GetCategoryData,
} from "../../../services/catalogService";

import {
  GetProducts,
} from "../../../services/productServices";

const Coupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(false);

  const [showModal, setShowModal] = useState(false);

  const [editId, setEditId] = useState(null);

  const [formData, setFormData] = useState({
    code: "",
    description: "",
    discountType: "percentage",
    discountValue: "",
    minOrderAmount: "",
    maxDiscount: "",
    applyOn: "all",
    products: [],
    categories: [],
    startDate: "",
    endDate: "",
    usageLimit: "",
    status: 1,
  });

  // ==========================================
  // GET COUPONS
  // ==========================================

  const fetchCoupons = async () => {
    try {
      setLoading(true);

      const response = await GetCoupons();

      setCoupons(response?.data || []);
    } catch (error) {
      console.error("Get Coupons Error:", error);

      Swal.fire(
        "Error",
        "Unable to load coupons",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // GET CATEGORIES
  // ==========================================

  const fetchCategories = async () => {
    try {
      const response = await GetCategoryData();

      setCategories(response?.data || []);
    } catch (error) {
      console.error(
        "Get Categories Error:",
        error
      );
    }
  };

  // ==========================================
  // GET PRODUCTS
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
        "Get Products Error:",
        error
      );
    }
  };

  useEffect(() => {
    fetchCoupons();
    fetchCategories();
    fetchProducts();
  }, []);

  // ==========================================
  // INPUT CHANGE
  // ==========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ==========================================
  // MULTIPLE PRODUCT SELECT
  // ==========================================

  const handleProductSelect = (e) => {
    const selectedValues = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );

    setFormData((prev) => ({
      ...prev,
      products: selectedValues,
    }));
  };

  // ==========================================
  // MULTIPLE CATEGORY SELECT
  // ==========================================

  const handleCategorySelect = (e) => {
    const selectedValues = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );

    setFormData((prev) => ({
      ...prev,
      categories: selectedValues,
    }));
  };

  // ==========================================
  // RESET FORM
  // ==========================================

  const resetForm = () => {
    setFormData({
      code: "",
      description: "",
      discountType: "percentage",
      discountValue: "",
      minOrderAmount: "",
      maxDiscount: "",
      applyOn: "all",
      products: [],
      categories: [],
      startDate: "",
      endDate: "",
      usageLimit: "",
      status: 1,
    });

    setEditId(null);
  };

  // ==========================================
  // OPEN ADD MODAL
  // ==========================================

  const handleAdd = () => {
    resetForm();
    setShowModal(true);
  };

  // ==========================================
  // EDIT COUPON
  // ==========================================

  const handleEdit = (row) => {
    setEditId(row._id);

    setFormData({
      code: row.code || "",
      description: row.description || "",

      discountType:
        row.discountType || "percentage",

      discountValue:
        row.discountValue || "",

      minOrderAmount:
        row.minOrderAmount || "",

      maxDiscount:
        row.maxDiscount || "",

      applyOn:
        row.applyOn || "all",

      products:
        row.products?.map((item) =>
          item._id || item
        ) || [],

      categories:
        row.categories?.map((item) =>
          item._id || item
        ) || [],

      startDate: row.startDate
        ? new Date(row.startDate)
            .toISOString()
            .split("T")[0]
        : "",

      endDate: row.endDate
        ? new Date(row.endDate)
            .toISOString()
            .split("T")[0]
        : "",

      usageLimit:
        row.usageLimit || "",

      status:
        row.status !== undefined
          ? row.status
          : 1,
    });

    setShowModal(true);
  };

  // ==========================================
  // SUBMIT
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.code.trim()) {
      Swal.fire(
        "Warning",
        "Coupon code is required",
        "warning"
      );
      return;
    }

    if (!formData.discountValue) {
      Swal.fire(
        "Warning",
        "Discount value is required",
        "warning"
      );
      return;
    }

    if (!formData.startDate) {
      Swal.fire(
        "Warning",
        "Start date is required",
        "warning"
      );
      return;
    }

    if (!formData.endDate) {
      Swal.fire(
        "Warning",
        "End date is required",
        "warning"
      );
      return;
    }

    if (
      formData.applyOn === "product" &&
      formData.products.length === 0
    ) {
      Swal.fire(
        "Warning",
        "Please select at least one product",
        "warning"
      );
      return;
    }

    if (
      formData.applyOn === "category" &&
      formData.categories.length === 0
    ) {
      Swal.fire(
        "Warning",
        "Please select at least one category",
        "warning"
      );
      return;
    }

    try {
      const payload = {
        ...formData,

        discountValue: Number(
          formData.discountValue
        ),

        minOrderAmount: Number(
          formData.minOrderAmount || 0
        ),

        maxDiscount: Number(
          formData.maxDiscount || 0
        ),

        usageLimit: Number(
          formData.usageLimit || 0
        ),

        products:
          formData.applyOn === "product"
            ? formData.products
            : [],

        categories:
          formData.applyOn === "category"
            ? formData.categories
            : [],
      };

      if (editId) {
        await UpdateCoupon(
          editId,
          payload
        );

        Swal.fire(
          "Success",
          "Coupon updated successfully",
          "success"
        );
      } else {
        await AddCoupon(payload);

        Swal.fire(
          "Success",
          "Coupon added successfully",
          "success"
        );
      }

      setShowModal(false);

      resetForm();

      fetchCoupons();
    } catch (error) {
      console.error(
        "Coupon Submit Error:",
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

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You want to delete this coupon?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Delete",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) {
      return;
    }

    try {
      await DeleteCoupon(id);

      Swal.fire(
        "Deleted",
        "Coupon deleted successfully",
        "success"
      );

      fetchCoupons();
    } catch (error) {
      console.error(
        "Delete Coupon Error:",
        error
      );

      Swal.fire(
        "Error",
        "Unable to delete coupon",
        "error"
      );
    }
  };

  // ==========================================
  // TABLE COLUMNS
  // ==========================================

  const columns = [
    {
      name: "#",
      cell: (row, index) => index + 1,
      width: "60px",
    },

    {
      name: "Coupon Code",
      selector: (row) => row.code || "-",
      sortable: true,
      cell: (row) => (
        <strong>{row.code || "-"}</strong>
      ),
    },

    {
      name: "Discount",
      cell: (row) => (
        <span>
          {row.discountType === "percentage"
            ? `${row.discountValue}%`
            : `₹${row.discountValue}`}
        </span>
      ),
    },

    {
      name: "Apply On",
      cell: (row) => {
        if (row.applyOn === "product") {
          return (
            <span className="badge bg-info">
              Product
            </span>
          );
        }

        if (row.applyOn === "category") {
          return (
            <span className="badge bg-warning text-dark">
              Category
            </span>
          );
        }

        return (
          <span className="badge bg-primary">
            All
          </span>
        );
      },
    },

    {
      name: "Products",
      cell: (row) =>
        row.products?.length || 0,
    },

    {
      name: "Categories",
      cell: (row) =>
        row.categories?.length || 0,
    },

    {
      name: "Start Date",
      cell: (row) =>
        row.startDate
          ? new Date(
              row.startDate
            ).toLocaleDateString()
          : "-",
    },

    {
      name: "End Date",
      cell: (row) =>
        row.endDate
          ? new Date(
              row.endDate
            ).toLocaleDateString()
          : "-",
    },

    {
      name: "Status",
      cell: (row) => (
        <span
          className={`badge ${
            row.status === 1
              ? "bg-success"
              : "bg-danger"
          }`}
        >
          {row.status === 1
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
            className="btn btn-sm btn-primary"
            onClick={() =>
              handleEdit(row)
            }
          >
            <i className="fas fa-edit"></i>
          </button>

          <button
            className="btn btn-sm btn-danger"
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

  return (
    <div className="container-fluid">

      <div className="page-inner">

        {/* HEADER */}
        <div className="d-flex justify-content-between align-items-center mb-4">

          <div>
            <h3 className="fw-bold">
              Coupons
            </h3>

            <p className="text-muted mb-0">
              Manage your coupons
            </p>
          </div>

          <button
            className="btn btn-primary"
            onClick={handleAdd}
          >
            <i className="fas fa-plus me-2"></i>
            Add Coupon
          </button>

        </div>

        {/* TABLE */}

        <div className="card">

          <div className="card-header">

            <h4 className="card-title mb-0">
              All Coupons
            </h4>

          </div>

          <div className="card-body">

            <DataTable
              columns={columns}
              data={coupons}
              progressPending={loading}
              pagination
              responsive
              highlightOnHover
              striped
            />

          </div>

        </div>

      </div>

      {/* =====================================
          ADD / EDIT MODAL
      ===================================== */}

      {showModal && (
        <div
          className="modal d-block"
          tabIndex="-1"
          style={{
            backgroundColor:
              "rgba(0,0,0,0.5)",
          }}
        >

          <div className="modal-dialog modal-lg modal-dialog-centered">

            <div className="modal-content">

              <form onSubmit={handleSubmit}>

                <div className="modal-header">

                  <h5 className="modal-title">
                    {editId
                      ? "Edit Coupon"
                      : "Add Coupon"}
                  </h5>

                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => {
                      setShowModal(false);
                      resetForm();
                    }}
                  ></button>

                </div>

                <div className="modal-body">

                  <div className="row">

                    {/* CODE */}

                    <div className="col-md-6 mb-3">

                      <label className="form-label fw-bold">
                        Coupon Code
                        <span className="text-danger">
                          *
                        </span>
                      </label>

                      <input
                        type="text"
                        name="code"
                        value={formData.code}
                        onChange={handleChange}
                        className="form-control"
                        placeholder="WELCOME10"
                      />

                    </div>

                    {/* DESCRIPTION */}

                    <div className="col-md-6 mb-3">

                      <label className="form-label fw-bold">
                        Description
                      </label>

                      <input
                        type="text"
                        name="description"
                        value={
                          formData.description
                        }
                        onChange={handleChange}
                        className="form-control"
                        placeholder="10% off"
                      />

                    </div>

                    {/* DISCOUNT TYPE */}

                    <div className="col-md-6 mb-3">

                      <label className="form-label fw-bold">
                        Discount Type
                      </label>

                      <select
                        name="discountType"
                        value={
                          formData.discountType
                        }
                        onChange={handleChange}
                        className="form-select"
                      >

                        <option value="percentage">
                          Percentage (%)
                        </option>

                        <option value="fixed">
                          Fixed Amount (₹)
                        </option>

                      </select>

                    </div>

                    {/* DISCOUNT VALUE */}

                    <div className="col-md-6 mb-3">

                      <label className="form-label fw-bold">
                        Discount Value
                        <span className="text-danger">
                          *
                        </span>
                      </label>

                      <input
                        type="number"
                        name="discountValue"
                        value={
                          formData.discountValue
                        }
                        onChange={handleChange}
                        className="form-control"
                        min="0"
                        placeholder="10"
                      />

                    </div>

                    {/* APPLY ON */}

                    <div className="col-md-12 mb-3">

                      <label className="form-label fw-bold">
                        Apply Coupon On
                      </label>

                      <select
                        name="applyOn"
                        value={
                          formData.applyOn
                        }
                        onChange={(e) => {
                          handleChange(e);

                          setFormData(
                            (prev) => ({
                              ...prev,
                              products: [],
                              categories: [],
                            })
                          );
                        }}
                        className="form-select"
                      >

                        <option value="all">
                          All Products
                        </option>

                        <option value="product">
                          Specific Products
                        </option>

                        <option value="category">
                          Specific Categories
                        </option>

                      </select>

                    </div>

                    {/* PRODUCTS */}

                    {formData.applyOn ===
                      "product" && (
                      <div className="col-md-12 mb-3">

                        <label className="form-label fw-bold">
                          Select Products
                          <span className="text-danger">
                            *
                          </span>
                        </label>

                        <select
                          multiple
                          className="form-select"
                          value={
                            formData.products
                          }
                          onChange={
                            handleProductSelect
                          }
                          style={{
                            minHeight: "140px",
                          }}
                        >

                          {products.map(
                            (product) => (
                              <option
                                key={
                                  product._id
                                }
                                value={
                                  product._id
                                }
                              >
                                {product.productName}
                              </option>
                            )
                          )}

                        </select>

                        <small className="text-muted">
                          Ctrl + Click to select
                          multiple products
                        </small>

                      </div>
                    )}

                    {/* CATEGORIES */}

                    {formData.applyOn ===
                      "category" && (
                      <div className="col-md-12 mb-3">

                        <label className="form-label fw-bold">
                          Select Categories
                          <span className="text-danger">
                            *
                          </span>
                        </label>

                        <select
                          multiple
                          className="form-select"
                          value={
                            formData.categories
                          }
                          onChange={
                            handleCategorySelect
                          }
                          style={{
                            minHeight: "140px",
                          }}
                        >

                          {categories.map(
                            (category) => (
                              <option
                                key={
                                  category._id
                                }
                                value={
                                  category._id
                                }
                              >
                                {category.name}
                              </option>
                            )
                          )}

                        </select>

                        <small className="text-muted">
                          Ctrl + Click to select
                          multiple categories
                        </small>

                      </div>
                    )}

                    {/* MIN ORDER */}

                    <div className="col-md-4 mb-3">

                      <label className="form-label fw-bold">
                        Minimum Order Amount
                      </label>

                      <input
                        type="number"
                        name="minOrderAmount"
                        value={
                          formData.minOrderAmount
                        }
                        onChange={handleChange}
                        className="form-control"
                        min="0"
                        placeholder="0"
                      />

                    </div>

                    {/* MAX DISCOUNT */}

                    <div className="col-md-4 mb-3">

                      <label className="form-label fw-bold">
                        Maximum Discount
                      </label>

                      <input
                        type="number"
                        name="maxDiscount"
                        value={
                          formData.maxDiscount
                        }
                        onChange={handleChange}
                        className="form-control"
                        min="0"
                        placeholder="0"
                      />

                    </div>

                    {/* USAGE LIMIT */}

                    <div className="col-md-4 mb-3">

                      <label className="form-label fw-bold">
                        Usage Limit
                      </label>

                      <input
                        type="number"
                        name="usageLimit"
                        value={
                          formData.usageLimit
                        }
                        onChange={handleChange}
                        className="form-control"
                        min="0"
                        placeholder="0 = Unlimited"
                      />

                    </div>

                    {/* START DATE */}

                    <div className="col-md-6 mb-3">

                      <label className="form-label fw-bold">
                        Start Date
                        <span className="text-danger">
                          *
                        </span>
                      </label>

                      <input
                        type="date"
                        name="startDate"
                        value={
                          formData.startDate
                        }
                        onChange={handleChange}
                        className="form-control"
                      />

                    </div>

                    {/* END DATE */}

                    <div className="col-md-6 mb-3">

                      <label className="form-label fw-bold">
                        End Date
                        <span className="text-danger">
                          *
                        </span>
                      </label>

                      <input
                        type="date"
                        name="endDate"
                        value={
                          formData.endDate
                        }
                        onChange={handleChange}
                        className="form-control"
                      />

                    </div>

                    {/* STATUS */}

                    <div className="col-md-6 mb-3">

                      <label className="form-label fw-bold">
                        Status
                      </label>

                      <select
                        name="status"
                        value={
                          formData.status
                        }
                        onChange={handleChange}
                        className="form-select"
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

                <div className="modal-footer">

                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {
                      setShowModal(false);
                      resetForm();
                    }}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="btn btn-primary"
                  >
                    {editId
                      ? "Update Coupon"
                      : "Save Coupon"}
                  </button>

                </div>

              </form>

            </div>

          </div>

        </div>
      )}

    </div>
  );
};

export default Coupons;