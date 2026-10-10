import React, { useEffect, useState } from "react";

import { useLocation, useNavigate } from "react-router-dom";

import Swal from "sweetalert2";

import {
  AddHomeSection,
  UpdateHomeSection,
} from "../../../services/homeSectionServices";

const ITEM_CONFIG = {
  WHY_CHOOSE: {
    heading: "Why Choose Items",
    hasImage: false,
    max: 8,
    fields: [
      { key: "icon", label: "Icon Class", placeholder: "fa fa-truck" },
      { key: "title", label: "Title", placeholder: "Fast Delivery" },
      {
        key: "description",
        label: "Description",
        placeholder: "Quick delivery at your doorstep.",
      },
    ],
  },
  PROMO: {
    heading: "Promo Images (max 4)",
    hasImage: true,
    max: 4,
    fields: [],
  },
  TESTIMONIAL: {
    heading: "Testimonials",
    hasImage: true,
    max: 6,
    fields: [
      { key: "title", label: "Customer Name", placeholder: "Priya Sharma" },
      { key: "location", label: "City", placeholder: "Jaipur" },
      {
        key: "rating",
        label: "Rating (1-5)",
        placeholder: "5",
        type: "number",
      },
      {
        key: "description",
        label: "Review",
        placeholder: "Write review...",
        textarea: true,
      },
    ],
  },
  STATS: {
    heading: "Stats",
    hasImage: false,
    max: 4,
    fields: [
      { key: "title", label: "Value", placeholder: "50,000+" },
      { key: "description", label: "Label", placeholder: "Happy Customers" },
    ],
  },
};
const HomeSectionAdd = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // =========================================
  // EDIT DATA
  // =========================================

  const editItem = location.state?.item;

  const isEditMode = Boolean(editItem?._id);

  // =========================================
  // FORM DATA
  // =========================================

  const [formData, setFormData] = useState({
    sectionType: "PROMO",

    title: "",

    subtitle: "",

    description: "",

    buttonText: "",

    buttonLink: "",

    order: 0,

    status: 1,
  });

  // =========================================
  // IMAGE
  // =========================================

  const [imageFile, setImageFile] = useState(null);

  const [existingImage, setExistingImage] = useState("");

  // =========================================
  // ITEMS
  // =========================================

  const [items, setItems] = useState([]);

  // =========================================
  // LOAD EDIT DATA
  // =========================================

  useEffect(() => {
    if (!editItem) {
      return;
    }

    setFormData({
      sectionType: editItem.sectionType || "PROMO",

      title: editItem.title || "",

      subtitle: editItem.subtitle || "",

      description: editItem.description || "",

      buttonText: editItem.buttonText || "",

      buttonLink: editItem.buttonLink || "",

      order: editItem.order ?? 0,

      status: editItem.status ?? 1,
    });

    setExistingImage(editItem.image || "");

    setItems(Array.isArray(editItem.items) ? editItem.items : []);
  }, [editItem]);

  // =========================================
  // HANDLE CHANGE
  // =========================================

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === "sectionType") setItems([]);
  };

  // =========================================
  // IMAGE CHANGE
  // =========================================

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    setImageFile(file);
  };

  // =========================================
  // ADD ITEM
  // =========================================

  const addItem = () => {
    if (itemConfig && items.length >= itemConfig.max) return;
    setItems((prev) => [
      ...prev,
      {
        title: "",
        description: "",
        icon: "",
        location: "",
        rating: 5,
        image: "",
        _file: null,
      },
    ]);
  };

  // =========================================
  // UPDATE ITEM
  // =========================================

  const updateItem = (index, field, value) => {
    setItems((prev) => {
      const updated = [...prev];

      updated[index] = {
        ...updated[index],

        [field]: value,
      };

      return updated;
    });
  };

  // =========================================
  // REMOVE ITEM
  // =========================================

  const removeItem = (index) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  // =========================================
  // SUBMIT
  // =========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = new FormData();

      payload.append("sectionType", formData.sectionType);

      payload.append("title", formData.title);

      payload.append("subtitle", formData.subtitle);

      payload.append("description", formData.description);

      payload.append("buttonText", formData.buttonText);

      payload.append("buttonLink", formData.buttonLink);

      payload.append("order", Number(formData.order));

      payload.append("status", Number(formData.status));

      const cleanItems = itemConfig
        ? items.map(({ _file, ...rest }) => rest)
        : [];
      payload.append("items", JSON.stringify(cleanItems));

      if (itemConfig) {
        items.forEach((item, i) => {
          if (item._file) payload.append(`itemImage_${i}`, item._file);
        });
      }

      // =====================================
      // NEW IMAGE
      // =====================================

      if (imageFile) {
        payload.append("image", imageFile);
      }

      // =====================================
      // UPDATE
      // =====================================

      if (isEditMode) {
        await UpdateHomeSection(editItem._id, payload);

        await Swal.fire(
          "Updated!",
          "Home section updated successfully.",
          "success",
        );
      }

      // =====================================
      // ADD
      // =====================================
      else {
        await AddHomeSection(payload);

        await Swal.fire(
          "Success!",
          "Home section added successfully.",
          "success",
        );
      }

      navigate("/admin/cms/home-sections");
    } catch (error) {
      console.error("Home Section Submit Error:", error);

      Swal.fire(
        "Error!",

        error?.response?.data?.message ||
          `Failed to ${isEditMode ? "update" : "add"} home section.`,

        "error",
      );
    }
  };

  // =========================================
  // CANCEL
  // =========================================

  const handleCancel = () => {
    navigate("/admin/home-sections");
  };

  // =========================================
  // JSX
  // =========================================
  const itemConfig = ITEM_CONFIG[formData.sectionType];
  return (
    <div className="container mt-4">
      <div className="card shadow-sm">
        <div className="card-header">
          <h4 className="mb-0">
            {isEditMode ? "Edit Home Section" : "Add Home Section"}
          </h4>
        </div>

        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="row">
              {/* SECTION TYPE */}

              <div className="col-md-4 mb-3">
                <label className="form-label">Section Type</label>

                <select
                  name="sectionType"
                  className="form-control"
                  value={formData.sectionType}
                  onChange={handleChange}
                >
                  <option value="PROMO">Promo</option>

                  <option value="WHY_CHOOSE">Why Choose Us</option>

                  <option value="NEWSLETTER">Newsletter</option>
                  <option value="TESTIMONIAL">Testimonials</option>
                  <option value="STATS">Stats Strip</option>
                </select>
              </div>

              {/* ORDER */}

              <div className="col-md-4 mb-3">
                <label className="form-label">Display Order</label>

                <input
                  type="number"
                  name="order"
                  className="form-control"
                  value={formData.order}
                  onChange={handleChange}
                />
              </div>

              {/* STATUS */}

              <div className="col-md-4 mb-3">
                <label className="form-label">Status</label>

                <select
                  name="status"
                  className="form-control"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="1">Active</option>

                  <option value="0">Inactive</option>
                </select>
              </div>

              {/* TITLE */}

              <div className="col-md-6 mb-3">
                <label className="form-label">Title</label>

                <input
                  type="text"
                  name="title"
                  className="form-control"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter title"
                />
              </div>

              {/* SUBTITLE */}

              <div className="col-md-6 mb-3">
                <label className="form-label">Subtitle</label>

                <input
                  type="text"
                  name="subtitle"
                  className="form-control"
                  value={formData.subtitle}
                  onChange={handleChange}
                  placeholder="Enter subtitle"
                />
              </div>

              {/* DESCRIPTION */}

              <div className="col-md-12 mb-3">
                <label className="form-label">Description</label>

                <textarea
                  name="description"
                  className="form-control"
                  rows="4"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Enter description"
                />
              </div>

              {/* BUTTON TEXT */}

              <div className="col-md-6 mb-3">
                <label className="form-label">Button Text</label>

                <input
                  type="text"
                  name="buttonText"
                  className="form-control"
                  value={formData.buttonText}
                  onChange={handleChange}
                  placeholder="SHOP NOW"
                />
              </div>

              {/* BUTTON LINK */}

              <div className="col-md-6 mb-3">
                <label className="form-label">Button Link</label>

                <input
                  type="text"
                  name="buttonLink"
                  className="form-control"
                  value={formData.buttonLink}
                  onChange={handleChange}
                  placeholder="/products"
                />
              </div>

              {/* IMAGE */}

              <div className="col-md-12 mb-3">
                <label className="form-label">Section Image</label>

                <input
                  type="file"
                  name="image"
                  className="form-control"
                  accept="image/*"
                  onChange={handleImageChange}
                />

                {/* EXISTING IMAGE */}

                {isEditMode && existingImage && !imageFile && (
                  <div className="mt-3">
                    <p className="mb-2">Current Image:</p>

                    <img
                      src={existingImage}
                      alt="Current"
                      style={{
                        width: "180px",
                        height: "100px",
                        objectFit: "cover",
                        borderRadius: "8px",
                        border: "1px solid #ddd",
                      }}
                      onError={(e) => {
                        e.currentTarget.src = "/img/category-default.jpg";
                      }}
                    />
                  </div>
                )}

                {/* NEW IMAGE */}

                {imageFile && (
                  <div className="mt-2">
                    <small className="text-success">
                      New image selected: {imageFile.name}
                    </small>
                  </div>
                )}
              </div>
            </div>

            {/* ===================================
                WHY CHOOSE ITEMS
            =================================== */}

            {itemConfig && (
              <div className="mt-3">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5>{itemConfig.heading}</h5>
                  <button
                    type="button"
                    className="btn btn-sm btn-success"
                    onClick={addItem}
                    disabled={items.length >= itemConfig.max}
                  >
                    + Add
                  </button>
                </div>

                {items.map((item, index) => (
                  <div className="card mb-3" key={index}>
                    <div className="card-body">
                      <div className="row">
                        {itemConfig.fields.map((f) => (
                          <div
                            className={
                              f.textarea ? "col-md-12 mb-2" : "col-md-4 mb-2"
                            }
                            key={f.key}
                          >
                            <label>{f.label}</label>
                            {f.textarea ? (
                              <textarea
                                className="form-control"
                                rows="3"
                                value={item[f.key] || ""}
                                placeholder={f.placeholder}
                                onChange={(e) =>
                                  updateItem(index, f.key, e.target.value)
                                }
                              />
                            ) : (
                              <input
                                type={f.type || "text"}
                                className="form-control"
                                value={item[f.key] ?? ""}
                                placeholder={f.placeholder}
                                min={f.type === "number" ? 1 : undefined}
                                max={f.type === "number" ? 5 : undefined}
                                onChange={(e) =>
                                  updateItem(index, f.key, e.target.value)
                                }
                              />
                            )}
                          </div>
                        ))}

                        {itemConfig.hasImage && (
                          <div className="col-md-4 mb-2">
                            <label>Image</label>
                            <input
                              type="file"
                              accept="image/*"
                              className="form-control"
                              onChange={(e) =>
                                updateItem(
                                  index,
                                  "_file",
                                  e.target.files?.[0] || null,
                                )
                              }
                            />
                            {item._file ? (
                              <small className="text-success">
                                {item._file.name}
                              </small>
                            ) : item.image ? (
                              <img
                                src={item.image}
                                alt=""
                                className="mt-2"
                                style={{
                                  width: 70,
                                  height: 70,
                                  objectFit: "cover",
                                  borderRadius: 6,
                                }}
                              />
                            ) : null}
                          </div>
                        )}
                      </div>

                      <button
                        type="button"
                        className="btn btn-sm btn-danger mt-2"
                        onClick={() => removeItem(index)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* BUTTONS */}

            <div className="mt-4">
              <button type="submit" className="btn btn-primary me-2">
                <i className="fa fa-save me-1"></i>

                {isEditMode ? "Update Section" : "Save Section"}
              </button>

              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleCancel}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default HomeSectionAdd;
