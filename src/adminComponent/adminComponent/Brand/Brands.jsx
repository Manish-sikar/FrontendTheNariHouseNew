import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";

import {
  getBrands,
  addBrand,
  updateBrand,
  deleteBrand,
} from "../../../services/brandService";

const Brands = () => {
  const [brands, setBrands] = useState([]);

  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);

  const [editId, setEditId] = useState(null);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    status: 1,
  });

  // ========================================
  // Get All Brands
  // ========================================

  const loadBrands = async () => {
    try {
      setLoading(true);

      const response = await getBrands();

      if (response.data?.success) {
        setBrands(response.data.data || []);
      } else {
        setBrands([]);
      }
    } catch (error) {
      console.error("Brand API Error:", error);

      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          error.response?.data?.message ||
          "Unable to load brands",
      });
    } finally {
      setLoading(false);
    }
  };

  // ========================================
  // Initial Load
  // ========================================

  useEffect(() => {
    loadBrands();
  }, []);

  // ========================================
  // Handle Change
  // ========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ========================================
  // Open Add Modal
  // ========================================

  const openAddModal = () => {
    setEditId(null);

    setFormData({
      name: "",
      description: "",
      status: 1,
    });

    setShowModal(true);
  };

  // ========================================
  // Open Edit Modal
  // ========================================

  const openEditModal = (brand) => {
    setEditId(brand._id);

    setFormData({
      name: brand.name || "",
      description: brand.description || "",
      status: Number(brand.status) === 1 ? 1 : 0,
    });

    setShowModal(true);
  };

  // ========================================
  // Close Modal
  // ========================================

  const closeModal = () => {
    if (saving) return;

    setShowModal(false);
    setEditId(null);

    setFormData({
      name: "",
      description: "",
      status: 1,
    });
  };

  // ========================================
  // Add / Update Brand
  // ========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      Swal.fire(
        "Warning",
        "Brand name is required",
        "warning"
      );

      return;
    }

    try {
      setSaving(true);

      const payload = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        status: Number(formData.status),
      };

      let response;

      if (editId) {
        response = await updateBrand(
          editId,
          payload
        );
      } else {
        response = await addBrand(payload);
      }

      if (response.data?.success) {
        Swal.fire({
          icon: "success",
          title: editId ? "Updated!" : "Added!",
          text:
            response.data.message ||
            (editId
              ? "Brand updated successfully"
              : "Brand added successfully"),
          timer: 1500,
          showConfirmButton: false,
        });

        closeModal();

        await loadBrands();
      }
    } catch (error) {
      console.error(
        "Brand Submit Error:",
        error
      );

      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          error.response?.data?.message ||
          "Something went wrong",
      });
    } finally {
      setSaving(false);
    }
  };

  // ========================================
  // Delete Brand
  // ========================================

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Delete Brand?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Delete",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#d33",
    });

    if (!result.isConfirmed) return;

    try {
      const response = await deleteBrand(id);

      if (response.data?.success) {
        Swal.fire({
          icon: "success",
          title: "Deleted!",
          text:
            response.data.message ||
            "Brand deleted successfully",
          timer: 1500,
          showConfirmButton: false,
        });

        loadBrands();
      }
    } catch (error) {
      console.error(
        "Delete Brand Error:",
        error
      );

      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          error.response?.data?.message ||
          "Unable to delete brand",
      });
    }
  };

  // ========================================
  // Toggle Status
  // ========================================

  const toggleStatus = async (brand) => {
    try {
      const newStatus =
        Number(brand.status) === 1 ? 0 : 1;

      const payload = {
        name: brand.name,
        description: brand.description || "",
        status: newStatus,
      };

      const response = await updateBrand(
        brand._id,
        payload
      );

      if (response.data?.success) {
        loadBrands();
      }
    } catch (error) {
      console.error(
        "Brand Status Error:",
        error
      );

      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          error.response?.data?.message ||
          "Unable to update brand status",
      });
    }
  };

  // ========================================
  // Search
  // ========================================

  const searchText = search.toLowerCase().trim();

  const filteredBrands = brands.filter(
    (brand) => {
      const name =
        brand.name?.toLowerCase() || "";

      const description =
        brand.description?.toLowerCase() || "";

      return (
        name.includes(searchText) ||
        description.includes(searchText)
      );
    }
  );

  return (
    <div className="container-fluid">

      {/* ===================================
          Header
      ==================================== */}

      <div className="d-flex justify-content-between align-items-center mb-4">

        <div>
          <h3 className="fw-bold mb-1">
            Brands
          </h3>

          <p className="text-muted mb-0">
            Manage your product brands
          </p>
        </div>

        <button
          type="button"
          className="btn btn-primary"
          onClick={openAddModal}
        >
          <i className="fas fa-plus me-2"></i>
          Add Brand
        </button>

      </div>

      {/* ===================================
          Table Card
      ==================================== */}

      <div className="card shadow-sm border-0">

        <div className="card-body">

          {/* Search */}

          <div className="row mb-3">

            <div className="col-md-4">

              <div className="input-group">

                <span className="input-group-text">
                  <i className="fas fa-search"></i>
                </span>

                <input
                  type="text"
                  className="form-control"
                  placeholder="Search brand..."
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                />

              </div>

            </div>

          </div>

          {/* Table */}

          <div className="table-responsive">

            <table className="table table-hover align-middle">

              <thead>

                <tr>
                  <th>#</th>
                  <th>Brand Name</th>
                  <th>Description</th>
                  <th>Status</th>
                  <th className="text-center">
                    Actions
                  </th>
                </tr>

              </thead>

              <tbody>

                {loading ? (

                  <tr>

                    <td
                      colSpan="5"
                      className="text-center py-5"
                    >

                      <div
                        className="spinner-border text-primary"
                        role="status"
                      >
                        <span className="visually-hidden">
                          Loading...
                        </span>
                      </div>

                      <div className="mt-2 text-muted">
                        Loading brands...
                      </div>

                    </td>

                  </tr>

                ) : filteredBrands.length > 0 ? (

                  filteredBrands.map(
                    (brand, index) => (

                      <tr key={brand._id}>

                        <td>
                          {index + 1}
                        </td>

                        <td>
                          <strong>
                            {brand.name}
                          </strong>
                        </td>

                        <td>
                          {brand.description || "-"}
                        </td>

                        <td>

                          <button
                            type="button"
                            className={`btn btn-sm ${
                              Number(brand.status) === 1
                                ? "btn-success"
                                : "btn-secondary"
                            }`}
                            onClick={() =>
                              toggleStatus(brand)
                            }
                          >
                            {Number(brand.status) === 1
                              ? "Active"
                              : "Inactive"}
                          </button>

                        </td>

                        <td className="text-center">

                          <button
                            type="button"
                            className="btn btn-sm btn-outline-primary me-2"
                            title="Edit"
                            onClick={() =>
                              openEditModal(brand)
                            }
                          >
                            <i className="fas fa-edit"></i>
                          </button>

                          <button
                            type="button"
                            className="btn btn-sm btn-outline-danger"
                            title="Delete"
                            onClick={() =>
                              handleDelete(
                                brand._id
                              )
                            }
                          >
                            <i className="fas fa-trash"></i>
                          </button>

                        </td>

                      </tr>

                    )
                  )

                ) : (

                  <tr>

                    <td
                      colSpan="5"
                      className="text-center py-4"
                    >

                      <div className="text-muted">

                        <i className="fas fa-tags fa-2x mb-2"></i>

                        <div>
                          No brands found
                        </div>

                      </div>

                    </td>

                  </tr>

                )}

              </tbody>

            </table>

          </div>

        </div>

      </div>

      {/* ===================================
          Add / Edit Modal
      ==================================== */}

      {showModal && (

        <div
          className="modal fade show d-block"
          style={{
            backgroundColor:
              "rgba(0,0,0,.5)",
          }}
        >

          <div className="modal-dialog modal-dialog-centered">

            <div className="modal-content">

              {/* Header */}

              <div className="modal-header">

                <h5 className="modal-title">
                  {editId
                    ? "Edit Brand"
                    : "Add Brand"}
                </h5>

                <button
                  type="button"
                  className="btn-close"
                  onClick={closeModal}
                  disabled={saving}
                ></button>

              </div>

              {/* Form */}

              <form onSubmit={handleSubmit}>

                <div className="modal-body">

                  {/* Brand Name */}

                  <div className="mb-3">

                    <label className="form-label fw-semibold">

                      Brand Name

                      <span className="text-danger">
                        *
                      </span>

                    </label>

                    <input
                      type="text"
                      name="name"
                      className="form-control"
                      placeholder="Enter brand name"
                      value={formData.name}
                      onChange={handleChange}
                      disabled={saving}
                    />

                  </div>

                  {/* Description */}

                  <div className="mb-3">

                    <label className="form-label fw-semibold">
                      Description
                    </label>

                    <textarea
                      name="description"
                      className="form-control"
                      rows="3"
                      placeholder="Enter brand description"
                      value={formData.description}
                      onChange={handleChange}
                      disabled={saving}
                    ></textarea>

                  </div>

                  {/* Status */}

                  {editId && (

                    <div className="mb-3">

                      <label className="form-label fw-semibold">
                        Status
                      </label>

                      <select
                        name="status"
                        className="form-select"
                        value={formData.status}
                        onChange={handleChange}
                        disabled={saving}
                      >

                        <option value={1}>
                          Active
                        </option>

                        <option value={0}>
                          Inactive
                        </option>

                      </select>

                    </div>

                  )}

                </div>

                {/* Footer */}

                <div className="modal-footer">

                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={closeModal}
                    disabled={saving}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={saving}
                  >

                    {saving ? (

                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                        ></span>

                        {editId
                          ? "Updating..."
                          : "Saving..."}
                      </>

                    ) : (

                      <>
                        <i
                          className={`fas ${
                            editId
                              ? "fa-save"
                              : "fa-plus"
                          } me-2`}
                        ></i>

                        {editId
                          ? "Update Brand"
                          : "Save Brand"}
                      </>

                    )}

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

export default Brands;