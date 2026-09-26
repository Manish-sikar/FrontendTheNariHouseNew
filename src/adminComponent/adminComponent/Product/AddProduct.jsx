import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import { AddProductService } from "../../../services/productServices";
import {
  GetCategoryData,
  GetSubCategoryData,
  GetBrandData,
} from "../../../services/catalogService";

const AddProduct = () => {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [formData, setFormData] = useState({
    productName: "",
    sku: "",
    category: "",
    subCategory: "",
    brand: "",
    description: "",
    price: "",
    salePrice: "",
    stock: "",
  });

  const [images, setImages] = useState([]);
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await GetCategoryData();

      setCategories(response?.data || response || []);
    } catch (error) {
      console.error(error);
    }
  };

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
  // IMAGE CHANGE
  // ==========================================

  const handleCategoryChange = async (e) => {
    const categoryId = e.target.value;

    setFormData((prev) => ({
      ...prev,
      category: categoryId,
      subCategory: "",
      brand: "",
    }));

    setSubCategories([]);
    setBrands([]);

    if (!categoryId) return;

    try {
      const [subCategoryResponse, brandResponse] = await Promise.all([
        GetSubCategoryData(categoryId),
        GetBrandData(categoryId),
      ]);

      setSubCategories(subCategoryResponse?.data || subCategoryResponse || []);

      setBrands(brandResponse?.data || brandResponse || []);
    } catch (error) {
      console.error(error);
    }
  };

  const handleImageChange = (e) => {
    setImages(Array.from(e.target.files));
  };

  // ==========================================
  // SUBMIT
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.productName ||
      !formData.sku ||
      !formData.category ||
      !formData.price
    ) {
      Swal.fire("Warning!", "Please fill all required fields.", "warning");

      return;
    }

    try {
      const data = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        data.append(key, value);
      });

      images.forEach((image) => {
        data.append("productImages", image);
      });

      await AddProductService(data);

      Swal.fire("Success!", "Product added successfully.", "success");

      navigate("/admin/products");
    } catch (error) {
      console.error(error);

      Swal.fire(
        "Error!",
        error?.response?.data?.error || "Failed to add product.",
        "error",
      );
    }
  };

  return (
    <div className="container mt-4">
      <div className="card">
        <div className="card-header">
          <h4 className="mb-0">Add Product</h4>
        </div>

        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="row">
              {/* PRODUCT NAME */}

              <div className="col-md-6 mb-3">
                <label className="form-label">
                  Product Name
                  <span className="text-danger">*</span>
                </label>

                <input
                  type="text"
                  name="productName"
                  className="form-control"
                  value={formData.productName}
                  onChange={handleChange}
                  placeholder="Enter product name"
                />
              </div>

              {/* SKU */}

              <div className="col-md-6 mb-3">
                <label className="form-label">
                  SKU
                  <span className="text-danger">*</span>
                </label>

                <input
                  type="text"
                  name="sku"
                  className="form-control"
                  value={formData.sku}
                  onChange={handleChange}
                  placeholder="Enter SKU"
                />
              </div>

              {/* CATEGORY */}

              <div className="col-md-4 mb-3">
                <label className="form-label">
                  Category
                  <span className="text-danger">*</span>
                </label>

                <select
                  name="category"
                  className="form-control"
                  value={formData.category}
                  onChange={handleCategoryChange}
                >
                  <option value="">Select Category</option>

                  {categories.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* SUB CATEGORY */}

              <div className="col-md-4 mb-3">
                <label className="form-label">Sub Category</label>

                <select
                  name="subCategory"
                  className="form-control"
                  value={formData.subCategory}
                  onChange={handleChange}
                  disabled={!formData.category}
                >
                  <option value="">Select Sub Category</option>

                  {subCategories.map((subCategory) => (
                    <option key={subCategory._id} value={subCategory._id}>
                      {subCategory.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* BRAND */}

              <div className="col-md-4 mb-3">
                <label className="form-label">Brand</label>

                <select
                  name="brand"
                  className="form-control"
                  value={formData.brand}
                  onChange={handleChange}
                  disabled={!formData.category}
                >
                  <option value="">Select Brand</option>

                  {brands.map((brand) => (
                    <option key={brand._id} value={brand._id}>
                      {brand.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* PRICE */}

              <div className="col-md-4 mb-3">
                <label className="form-label">
                  Price
                  <span className="text-danger">*</span>
                </label>

                <input
                  type="number"
                  name="price"
                  className="form-control"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="Enter price"
                  min="0"
                />
              </div>

              {/* SALE PRICE */}

              <div className="col-md-4 mb-3">
                <label className="form-label">Sale Price</label>

                <input
                  type="number"
                  name="salePrice"
                  className="form-control"
                  value={formData.salePrice}
                  onChange={handleChange}
                  placeholder="Enter sale price"
                  min="0"
                />
              </div>

              {/* STOCK */}

              <div className="col-md-4 mb-3">
                <label className="form-label">Stock</label>

                <input
                  type="number"
                  name="stock"
                  className="form-control"
                  value={formData.stock}
                  onChange={handleChange}
                  placeholder="Enter stock"
                  min="0"
                />
              </div>

              {/* DESCRIPTION */}

              <div className="col-md-12 mb-3">
                <label className="form-label">Description</label>

                <textarea
                  name="description"
                  className="form-control"
                  rows="5"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Enter product description"
                />
              </div>

              {/* IMAGES */}

              <div className="col-md-12 mb-3">
                <label className="form-label">Product Images</label>

                <input
                  type="file"
                  className="form-control"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                />

                <small className="text-muted">
                  You can select multiple images.
                </small>
              </div>

              {/* IMAGE PREVIEW */}

              {images.length > 0 && (
                <div className="col-md-12 mb-3">
                  <div className="d-flex gap-3 flex-wrap">
                    {images.map((image, index) => (
                      <img
                        key={index}
                        src={URL.createObjectURL(image)}
                        alt="preview"
                        style={{
                          width: "100px",
                          height: "100px",
                          objectFit: "cover",
                          borderRadius: "8px",
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* BUTTONS */}

            <div className="d-flex gap-2">
              <button type="submit" className="btn btn-primary">
                <i className="fa fa-save me-1"></i>
                Add Product
              </button>

              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => navigate("/admin/products")}
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

export default AddProduct;
