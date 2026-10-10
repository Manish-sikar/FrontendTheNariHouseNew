import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";

import {
  getCategories,
  addCategory,
  updateCategory,
  deleteCategory,
} from "../../../services/categoryService";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

const [formData, setFormData] = useState({
  name: "",
  description: "",
  image: null,
  imagePreview: "",
  status: 1,
});

  // ================================
  // GET ALL CATEGORIES
  // ================================

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);

      const response = await getCategories();

      if (response.data.success) {
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
    } finally {
      setLoading(false);
    }
  };

  // ================================
  // INPUT CHANGE
  // ================================

const handleChange = (e) => {
  const { name, value, files } = e.target;

  if (name === "image") {
    const file = files?.[0];

    if (!file) return;

    setFormData((prev) => ({
      ...prev,
      image: file,
      imagePreview: URL.createObjectURL(file),
    }));

    return;
  }

  setFormData((prev) => ({
    ...prev,
    [name]: value,
  }));
};

  // ================================
  // OPEN ADD MODAL
  // ================================

const openAddModal = () => {
  setEditId(null);

  setFormData({
    name: "",
    description: "",
    image: null,
    imagePreview: "",
    status: 1,
  });

  setShowModal(true);
};

  // ================================
  // OPEN EDIT MODAL
  // ================================

const openEditModal = (category) => {
  setEditId(category._id);

  setFormData({
    name: category.name || "",
    description: category.description || "",
    image: null,
    imagePreview: category.image || "",
    status: category.status ?? 1,
  });

  setShowModal(true);
};
  // ================================
  // CLOSE MODAL
  // ================================

const closeModal = () => {
  setShowModal(false);
  setEditId(null);

  setFormData({
    name: "",
    description: "",
    image: null,
    imagePreview: "",
    status: 1,
  });
};
  // ================================
  // ADD / UPDATE CATEGORY
  // ================================

const handleSubmit = async (e) => {
  e.preventDefault();

  const categoryName = formData.name.trim();

  if (!categoryName) {
    Swal.fire({
      icon: "warning",
      title: "Category Name Required",
      text: "Please enter category name",
    });

    return;
  }

  try {
    setSaving(true);

    const data = new FormData();

    data.append("name", categoryName);
    data.append(
      "description",
      formData.description.trim()
    );

    if (editId) {
      data.append(
        "status",
        Number(formData.status)
      );
    }

    if (formData.image) {
      data.append("image", formData.image);
    }

    let response;

    if (editId) {
      response = await updateCategory(
        editId,
        data
      );
    } else {
      response = await addCategory(data);
    }

    if (response.data.success) {

      Swal.fire({
        icon: "success",
        title: editId
          ? "Category Updated"
          : "Category Added",
        text: response.data.message,
        timer: 1500,
        showConfirmButton: false,
      });

      closeModal();

      await loadCategories();
    }

  } catch (error) {

    console.error(
      editId
        ? "Update Category Error:"
        : "Add Category Error:",
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
  // DELETE CATEGORY
  // ================================

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Delete Category?",
      text: "You will not be able to recover this category!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Delete",
      cancelButtonText: "Cancel",
      reverseButtons: true,
    });

    if (!result.isConfirmed) {
      return;
    }

    try {
      const response = await deleteCategory(id);

      if (response.data.success) {
        Swal.fire({
          icon: "success",
          title: "Deleted!",
          text: response.data.message,
          timer: 1500,
          showConfirmButton: false,
        });

        // Refresh from database
        await loadCategories();
      }
    } catch (error) {
      console.error("Delete Category Error:", error);

      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          error.response?.data?.message ||
          "Unable to delete category",
      });
    }
  };

  // ================================
  // TOGGLE STATUS
  // ================================

  const toggleStatus = async (category) => {
    try {
      const newStatus =
        Number(category.status) === 1 ? 0 : 1;

      const response = await updateCategory(
        category._id,
        {
          name: category.name,
          description: category.description || "",
          status: newStatus,
        }
      );

      if (response.data.success) {
        await loadCategories();

        Swal.fire({
          icon: "success",
          title:
            newStatus === 1
              ? "Category Activated"
              : "Category Deactivated",
          timer: 1000,
          showConfirmButton: false,
        });
      }
    } catch (error) {
      console.error("Status Update Error:", error);

      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          error.response?.data?.message ||
          "Unable to update category status",
      });
    }
  };

  // ================================
  // SEARCH
  // ================================

  const filteredCategories = categories.filter(
    (category) => {
      const name = category.name || "";
      const description =
        category.description || "";

      const searchText = search.toLowerCase();

      return (
        name.toLowerCase().includes(searchText) ||
        description
          .toLowerCase()
          .includes(searchText)
      );
    }
  );

  // ================================
  // UI
  // ================================

  return (
    <div className="container-fluid">

      {/* ============================
          HEADER
      ============================ */}

      <div className="d-flex justify-content-between align-items-center mb-4">

        <div>
          <h3 className="fw-bold mb-1">
            Categories
          </h3>

          <p className="text-muted mb-0">
            Manage your product categories
          </p>
        </div>

        <button
          type="button"
          className="btn btn-primary"
          onClick={openAddModal}
        >
          <i className="fas fa-plus me-2"></i>
          Add Category
        </button>

      </div>

      {/* ============================
          CATEGORY CARD
      ============================ */}

      <div className="card shadow-sm border-0">

        <div className="card-body">

          {/* SEARCH */}

          <div className="row mb-3">

            <div className="col-md-4">

              <div className="input-group">

                <span className="input-group-text">
                  <i className="fas fa-search"></i>
                </span>

                <input
                  type="text"
                  className="form-control"
                  placeholder="Search category..."
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                />

              </div>

            </div>

          </div>

          {/* ============================
              TABLE
          ============================ */}

          <div className="table-responsive">

            <table className="table table-hover align-middle">

              <thead>

                <tr>
                  <th>#</th>
                  <th>Category Name</th>
                  <th>Description</th>
                  <th>Status</th>
                  <th className="text-center">
                    Actions
                  </th>
                </tr>

              </thead>

              <tbody>

                {/* LOADING */}

                {loading ? (

                  <tr>

                    <td
                      colSpan="5"
                      className="text-center py-5"
                    >

                      <div
                        className="spinner-border text-primary"
                        role="status"
                      ></div>

                      <div className="mt-2">
                        Loading categories...
                      </div>

                    </td>

                  </tr>

                ) : filteredCategories.length > 0 ? (

                  filteredCategories.map(
                    (category, index) => (

                      <tr key={category._id}>

                        {/* NUMBER */}

                        <td>
                          {index + 1}
                        </td>

                        {/* NAME */}

                        <td>
                          <strong>
                            {category.name}
                          </strong>
                        </td>

                        {/* DESCRIPTION */}

                        <td>
                          {category.description ||
                            "-"}
                        </td>

                        {/* STATUS */}

                        <td>

                          <button
                            type="button"
                            className={`btn btn-sm ${
                              Number(
                                category.status
                              ) === 1
                                ? "btn-success"
                                : "btn-secondary"
                            }`}
                            onClick={() =>
                              toggleStatus(category)
                            }
                          >

                            <i
                              className={`fas ${
                                Number(
                                  category.status
                                ) === 1
                                  ? "fa-check-circle"
                                  : "fa-times-circle"
                              } me-1`}
                            ></i>

                            {Number(
                              category.status
                            ) === 1
                              ? "Active"
                              : "Inactive"}

                          </button>

                        </td>

                        {/* ACTIONS */}

                        <td className="text-center">

                          {/* EDIT */}

                          <button
                            type="button"
                            className="btn btn-sm btn-outline-primary me-2"
                            title="Edit"
                            onClick={() =>
                              openEditModal(
                                category
                              )
                            }
                          >

                            <i className="fas fa-edit"></i>

                          </button>

                          {/* DELETE */}

                          <button
                            type="button"
                            className="btn btn-sm btn-outline-danger"
                            title="Delete"
                            onClick={() =>
                              handleDelete(
                                category._id
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
                      className="text-center py-5 text-muted"
                    >

                      <i className="fas fa-folder-open fa-2x mb-2"></i>

                      <div>
                        No categories found
                      </div>

                    </td>

                  </tr>

                )}

              </tbody>

            </table>

          </div>

        </div>

      </div>

      {/* ============================
          ADD / EDIT MODAL
      ============================ */}

      {showModal && (

        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{
            backgroundColor:
              "rgba(0, 0, 0, 0.5)",
          }}
        >

          <div className="modal-dialog modal-dialog-centered">

            <div className="modal-content">

              {/* MODAL HEADER */}

              <div className="modal-header">

                <h5 className="modal-title">

                  {editId
                    ? "Edit Category"
                    : "Add Category"}

                </h5>

                <button
                  type="button"
                  className="btn-close"
                  onClick={closeModal}
                  disabled={saving}
                ></button>

              </div>

              {/* FORM */}

              <form onSubmit={handleSubmit}>

                <div className="modal-body">

                  {/* CATEGORY NAME */}

                  <div className="mb-3">

                    <label className="form-label fw-semibold">

                      Category Name

                      <span className="text-danger">
                        *
                      </span>

                    </label>

                    <input
                      type="text"
                      name="name"
                      className="form-control"
                      placeholder="Enter category name"
                      value={formData.name}
                      onChange={handleChange}
                      disabled={saving}
                      autoFocus
                    />

                  </div>

                  {/* DESCRIPTION */}

                  <div className="mb-3">

                    <label className="form-label fw-semibold">
                      Description
                    </label>

                    <textarea
                      name="description"
                      className="form-control"
                      rows="4"
                      placeholder="Enter category description"
                      value={
                        formData.description
                      }
                      onChange={handleChange}
                      disabled={saving}
                    ></textarea>

                  </div>
                  {/* CATEGORY IMAGE */}

<div className="mb-3">

  <label className="form-label fw-semibold">
    Category Image
  </label>

  <input
    type="file"
    name="image"
    className="form-control"
    accept="image/*"
    onChange={handleChange}
    disabled={saving}
  />

  <small className="text-muted">
    Recommended size: 500 × 700 px
  </small>

  {formData.imagePreview && (
    <div className="mt-3">

      <img
        src={formData.imagePreview}
        alt="Category Preview"
        style={{
          width: "140px",
          height: "180px",
          objectFit: "cover",
          borderRadius: "6px",
          border: "1px solid #ddd",
        }}
      />

    </div>
  )}

</div>

                  {/* STATUS - ONLY EDIT */}

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

                {/* MODAL FOOTER */}

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
                          ? "Update Category"
                          : "Save Category"}
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

export default Categories;