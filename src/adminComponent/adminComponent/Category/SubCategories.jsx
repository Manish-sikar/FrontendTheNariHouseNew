import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";

import {
  getSubCategories,
  addSubCategory,
  updateSubCategory,
  deleteSubCategory,
} from "../../../services/subCategoryService";

import { getCategories } from "../../../services/categoryService";

const SubCategories = () => {
  const [subCategories, setSubCategories] = useState([]);
  const [categories, setCategories] = useState([]);

  const [search, setSearch] = useState("");

  const [showModal, setShowModal] = useState(false);

  const [editId, setEditId] = useState(null);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    categoryId: "",
    name: "",
    description: "",
    status: 1,
  });

  // ================================
  // Load Categories
  // ================================

  const loadCategories = async () => {
    try {
      const response = await getCategories();

      if (response.data?.success) {
        setCategories(response.data.data || []);
      } else {
        setCategories([]);
      }
    } catch (error) {
      console.error("Category API Error:", error);

      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          error.response?.data?.message ||
          "Unable to load categories",
      });
    }
  };

  // ================================
  // Load Sub Categories
  // ================================

  const loadSubCategories = async () => {
    try {
      setLoading(true);

      const response = await getSubCategories();

      if (response.data?.success) {
        setSubCategories(response.data.data || []);
      } else {
        setSubCategories([]);
      }
    } catch (error) {
      console.error("Sub Category API Error:", error);

      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          error.response?.data?.message ||
          "Unable to load sub categories",
      });
    } finally {
      setLoading(false);
    }
  };

  // ================================
  // Initial Load
  // ================================

  useEffect(() => {
    loadCategories();
    loadSubCategories();
  }, []);

  // ================================
  // Handle Input
  // ================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ================================
  // Open Add Modal
  // ================================

  const openAddModal = () => {
    setEditId(null);

    setFormData({
      categoryId: "",
      name: "",
      description: "",
      status: 1,
    });

    setShowModal(true);
  };

  // ================================
  // Open Edit Modal
  // ================================

  const openEditModal = (item) => {
    setEditId(item._id);

    setFormData({
      categoryId:
        item.categoryId?._id ||
        item.categoryId ||
        "",
      name: item.name || "",
      description: item.description || "",
      status: Number(item.status) === 1 ? 1 : 0,
    });

    setShowModal(true);
  };

  // ================================
  // Close Modal
  // ================================

  const closeModal = () => {
    if (saving) return;

    setShowModal(false);
    setEditId(null);

    setFormData({
      categoryId: "",
      name: "",
      description: "",
      status: 1,
    });
  };

  // ================================
  // Submit Add / Edit
  // ================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.categoryId) {
      Swal.fire(
        "Warning",
        "Please select category",
        "warning"
      );
      return;
    }

    if (!formData.name.trim()) {
      Swal.fire(
        "Warning",
        "Sub category name is required",
        "warning"
      );
      return;
    }

    try {
      setSaving(true);

      const payload = {
        categoryId: formData.categoryId,
        name: formData.name.trim(),
        description: formData.description.trim(),
        status: Number(formData.status),
      };

      let response;

      // UPDATE
      if (editId) {
        response = await updateSubCategory(
          editId,
          payload
        );
      }

      // ADD
      else {
        response = await addSubCategory(payload);
      }

      if (response.data?.success) {
        Swal.fire({
          icon: "success",
          title: editId
            ? "Updated!"
            : "Added!",
          text:
            response.data.message ||
            (editId
              ? "Sub category updated successfully"
              : "Sub category added successfully"),
          timer: 1500,
          showConfirmButton: false,
        });

        closeModal();

        await loadSubCategories();
      }
    } catch (error) {
      console.error(
        "Sub Category Submit Error:",
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

  // ================================
  // Delete
  // ================================

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Delete Sub Category?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Delete",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#d33",
    });

    if (!result.isConfirmed) return;

    try {
      const response = await deleteSubCategory(id);

      if (response.data?.success) {
        Swal.fire({
          icon: "success",
          title: "Deleted!",
          text:
            response.data.message ||
            "Sub category deleted successfully",
          timer: 1500,
          showConfirmButton: false,
        });

        loadSubCategories();
      }
    } catch (error) {
      console.error(
        "Delete Sub Category Error:",
        error
      );

      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          error.response?.data?.message ||
          "Unable to delete sub category",
      });
    }
  };

  // ================================
  // Toggle Status
  // ================================

  const toggleStatus = async (item) => {
    try {
      const currentStatus = Number(item.status);

      const newStatus =
        currentStatus === 1 ? 0 : 1;

      const categoryId =
        item.categoryId?._id ||
        item.categoryId ||
        "";

      const payload = {
        categoryId,
        name: item.name,
        description: item.description || "",
        status: newStatus,
      };

      const response = await updateSubCategory(
        item._id,
        payload
      );

      if (response.data?.success) {
        loadSubCategories();
      }
    } catch (error) {
      console.error(
        "Status Update Error:",
        error
      );

      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          error.response?.data?.message ||
          "Unable to update status",
      });
    }
  };

  // ================================
  // Search
  // ================================

  const searchText = search.toLowerCase().trim();

  const filteredSubCategories =
    subCategories.filter((item) => {
      const subCategoryName =
        item.name?.toLowerCase() || "";

      const categoryName =
        item.categoryId?.name?.toLowerCase() || "";

      const description =
        item.description?.toLowerCase() || "";

      return (
        subCategoryName.includes(searchText) ||
        categoryName.includes(searchText) ||
        description.includes(searchText)
      );
    });

  return (
    <div className="container-fluid">

      {/* ================================
          Header
      ================================= */}

      <div className="d-flex justify-content-between align-items-center mb-4">

        <div>
          <h3 className="fw-bold mb-1">
            Sub Categories
          </h3>

          <p className="text-muted mb-0">
            Manage your product sub categories
          </p>
        </div>

        <button
          type="button"
          className="btn btn-primary"
          onClick={openAddModal}
        >
          <i className="fas fa-plus me-2"></i>
          Add Sub Category
        </button>

      </div>

      {/* ================================
          Table Card
      ================================= */}

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
                  placeholder="Search sub category..."
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                />

              </div>

            </div>

          </div>

          {/* ================================
              Table
          ================================= */}

          <div className="table-responsive">

            <table className="table table-hover align-middle">

              <thead>

                <tr>
                  <th>#</th>
                  <th>Category</th>
                  <th>Sub Category</th>
                  <th>Description</th>
                  <th>Status</th>
                  <th className="text-center">
                    Actions
                  </th>
                </tr>

              </thead>

              <tbody>

                {/* Loading */}

                {loading ? (

                  <tr>
                    <td
                      colSpan="6"
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
                        Loading sub categories...
                      </div>
                    </td>
                  </tr>

                ) : filteredSubCategories.length > 0 ? (

                  filteredSubCategories.map(
                    (item, index) => (

                      <tr key={item._id}>

                        <td>
                          {index + 1}
                        </td>

                        {/* Category */}

                        <td>

                          <span className="badge bg-info">
                            {item.categoryId?.name ||
                              "-"}
                          </span>

                        </td>

                        {/* Sub Category */}

                        <td>
                          <strong>
                            {item.name}
                          </strong>
                        </td>

                        {/* Description */}

                        <td>
                          {item.description || "-"}
                        </td>

                        {/* Status */}

                        <td>

                          <button
                            type="button"
                            className={`btn btn-sm ${
                              Number(item.status) === 1
                                ? "btn-success"
                                : "btn-secondary"
                            }`}
                            onClick={() =>
                              toggleStatus(item)
                            }
                          >
                            {Number(item.status) === 1
                              ? "Active"
                              : "Inactive"}
                          </button>

                        </td>

                        {/* Actions */}

                        <td className="text-center">

                          <button
                            type="button"
                            className="btn btn-sm btn-outline-primary me-2"
                            title="Edit"
                            onClick={() =>
                              openEditModal(item)
                            }
                          >
                            <i className="fas fa-edit"></i>
                          </button>

                          <button
                            type="button"
                            className="btn btn-sm btn-outline-danger"
                            title="Delete"
                            onClick={() =>
                              handleDelete(item._id)
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
                      colSpan="6"
                      className="text-center py-4"
                    >
                      <div className="text-muted">
                        <i className="fas fa-folder-open fa-2x mb-2"></i>

                        <div>
                          No sub categories found
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

      {/* ================================
          Add / Edit Modal
      ================================= */}

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

              {/* Modal Header */}

              <div className="modal-header">

                <h5 className="modal-title">
                  {editId
                    ? "Edit Sub Category"
                    : "Add Sub Category"}
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

                  {/* Category */}

                  <div className="mb-3">

                    <label className="form-label fw-semibold">

                      Category

                      <span className="text-danger">
                        *
                      </span>

                    </label>

                    <select
                      name="categoryId"
                      className="form-select"
                      value={formData.categoryId}
                      onChange={handleChange}
                      disabled={saving}
                    >

                      <option value="">
                        Select Category
                      </option>

                      {categories.map(
                        (category) => (

                          <option
                            key={category._id}
                            value={category._id}
                          >
                            {category.name}
                          </option>

                        )
                      )}

                    </select>

                    {categories.length === 0 && (
                      <small className="text-danger">
                        No categories available. Please
                        create a category first.
                      </small>
                    )}

                  </div>

                  {/* Sub Category */}

                  <div className="mb-3">

                    <label className="form-label fw-semibold">

                      Sub Category Name

                      <span className="text-danger">
                        *
                      </span>

                    </label>

                    <input
                      type="text"
                      name="name"
                      className="form-control"
                      placeholder="Enter sub category"
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
                      placeholder="Enter description"
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

                {/* Modal Footer */}

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
                          ? "Update Sub Category"
                          : "Save Sub Category"}
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

export default SubCategories;