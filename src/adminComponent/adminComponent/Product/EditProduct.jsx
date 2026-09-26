import React, { useEffect, useState } from "react";
import {
  useLocation,
  useNavigate,
} from "react-router-dom";

import Swal from "sweetalert2";

import {
  UpdateProduct,
} from "../../../services/productServices";

import {
  GetCategoryData,
  GetSubCategoryData,
  GetBrandData,
} from "../../../services/catalogService";


const EditProduct = () => {

  const location = useLocation();

  const navigate = useNavigate();

  const item = location.state?.item;


  // ==========================================
  // FORM DATA
  // ==========================================

  const [formData, setFormData] = useState({

    _id: "",

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


  // ==========================================
  // IMAGES
  // ==========================================

  const [images, setImages] = useState([]);


  // ==========================================
  // CATEGORY DATA
  // ==========================================

  const [categories, setCategories] = useState([]);

  const [subCategories, setSubCategories] = useState([]);

  const [brands, setBrands] = useState([]);


  // ==========================================
  // LOADING
  // ==========================================

  const [loading, setLoading] = useState(false);


  // ==========================================
  // FETCH CATEGORIES
  // ==========================================

  useEffect(() => {

    fetchCategories();

  }, []);


  const fetchCategories = async () => {

    try {

      const response = await GetCategoryData();

      setCategories(
        response?.data || []
      );

    } catch (error) {

      console.error(
        "Category Error:",
        error
      );

      setCategories([]);

    }
  };


  // ==========================================
  // LOAD SUB CATEGORY + BRAND
  // ==========================================

  const loadCategoryData = async (
    categoryId,
    selectedSubCategoryId = "",
    selectedBrandId = ""
  ) => {

    if (!categoryId) {

      setSubCategories([]);

      setBrands([]);

      return;

    }


    try {

      const [
        subCategoryResponse,
        brandResponse,
      ] = await Promise.all([

        GetSubCategoryData(
          categoryId
        ),

        GetBrandData(
          categoryId
        ),

      ]);


      const subCategoryData =
        subCategoryResponse?.data || [];

      const brandData =
        brandResponse?.data || [];


      setSubCategories(
        subCategoryData
      );

      setBrands(
        brandData
      );


      // =====================================
      // KEEP EXISTING SELECTED VALUES
      // =====================================

      setFormData((prev) => ({

        ...prev,

        subCategory:
          selectedSubCategoryId ||
          prev.subCategory ||
          "",

        brand:
          selectedBrandId ||
          prev.brand ||
          "",

      }));

    } catch (error) {

      console.error(
        "SubCategory / Brand Error:",
        error
      );

      setSubCategories([]);

      setBrands([]);

    }
  };


  // ==========================================
  // LOAD PRODUCT DATA
  // ==========================================

  useEffect(() => {

    if (!item) {

      navigate("/admin/products");

      return;

    }


    // ========================================
    // IMPORTANT
    // Populate ke baad category object hota hai
    // ========================================

    const categoryId =
      item.category?._id ||
      item.category ||
      "";


    const subCategoryId =
      item.subCategory?._id ||
      item.subCategory ||
      "";


    const brandId =
      item.brand?._id ||
      item.brand ||
      "";


    setFormData({

      _id:
        item._id || "",


      productName:
        item.productName || "",


      sku:
        item.sku || "",


      category:
        categoryId,


      subCategory:
        subCategoryId,


      brand:
        brandId,


      description:
        item.description || "",


      price:
        item.price ?? "",


      salePrice:
        item.salePrice ?? "",


      stock:
        item.stock ?? "",

    });


    // ========================================
    // Existing Category ke according
    // SubCategory + Brand fetch
    // ========================================

    if (categoryId) {

      loadCategoryData(
        categoryId,
        subCategoryId,
        brandId
      );

    }

  }, [item, navigate]);


  // ==========================================
  // HANDLE NORMAL INPUT CHANGE
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
  // CATEGORY CHANGE
  // ==========================================

  const handleCategoryChange = async (e) => {

    const categoryId =
      e.target.value;


    // ========================================
    // Category change hone par
    // old subcategory + brand reset
    // ========================================

    setFormData((prev) => ({

      ...prev,

      category:
        categoryId,

      subCategory:
        "",

      brand:
        "",

    }));


    setSubCategories([]);

    setBrands([]);


    if (!categoryId) {

      return;

    }


    try {

      const [
        subCategoryResponse,
        brandResponse,
      ] = await Promise.all([

        GetSubCategoryData(
          categoryId
        ),

        GetBrandData(
          categoryId
        ),

      ]);


      setSubCategories(

        subCategoryResponse?.data || []

      );


      setBrands(

        brandResponse?.data || []

      );

    } catch (error) {

      console.error(
        "Category Change Error:",
        error
      );

    }

  };


  // ==========================================
  // IMAGE CHANGE
  // ==========================================

  const handleImageChange = (e) => {

    setImages(
      Array.from(
        e.target.files || []
      )
    );

  };


  // ==========================================
  // SUBMIT
  // ==========================================

  const handleSubmit = async (e) => {

    e.preventDefault();


    if (!formData.productName) {

      Swal.fire(
        "Warning!",
        "Product name is required.",
        "warning"
      );

      return;

    }


    if (!formData.category) {

      Swal.fire(
        "Warning!",
        "Please select category.",
        "warning"
      );

      return;

    }


    try {

      setLoading(true);


      const data =
        new FormData();


      // ======================================
      // APPEND FORM DATA
      // ======================================

      Object.entries(
        formData
      ).forEach(
        ([key, value]) => {

          data.append(
            key,
            value ?? ""
          );

        }
      );


      // ======================================
      // APPEND NEW IMAGES
      // ======================================

      images.forEach((image) => {

        data.append(
          "productImages",
          image
        );

      });


      // ======================================
      // UPDATE API
      // ======================================

      await UpdateProduct(
        data
      );


      Swal.fire(
        "Success!",
        "Product updated successfully.",
        "success"
      );


      navigate(
        "/admin/products"
      );

    } catch (error) {

      console.error(
        "Update Product Error:",
        error
      );


      Swal.fire(
        "Error!",
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        "Failed to update product.",
        "error"
      );

    } finally {

      setLoading(false);

    }

  };


  // ==========================================
  // NO ITEM
  // ==========================================

  if (!item) {

    return null;

  }


  // ==========================================
  // UI
  // ==========================================

  return (

    <div className="container mt-4">

      <div className="card">

        {/* ===================================
            HEADER
        =================================== */}

        <div className="card-header">

          <h4 className="mb-0">

            Edit Product

          </h4>

        </div>


        {/* ===================================
            BODY
        =================================== */}

        <div className="card-body">

          <form
            onSubmit={
              handleSubmit
            }
          >

            <div className="row">


              {/* =================================
                  PRODUCT NAME
              ================================= */}

              <div className="col-md-6 mb-3">

                <label className="form-label">

                  Product Name

                  <span className="text-danger">
                    *
                  </span>

                </label>


                <input
                  type="text"
                  name="productName"
                  className="form-control"
                  value={
                    formData.productName
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="Enter product name"
                />

              </div>


              {/* =================================
                  SKU
              ================================= */}

              <div className="col-md-6 mb-3">

                <label className="form-label">

                  SKU

                </label>


                <input
                  type="text"
                  name="sku"
                  className="form-control"
                  value={
                    formData.sku
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="Enter SKU"
                />

              </div>


              {/* =================================
                  CATEGORY
              ================================= */}

              <div className="col-md-4 mb-3">

                <label className="form-label">

                  Category

                  <span className="text-danger">
                    *
                  </span>

                </label>


                <select
                  name="category"
                  className="form-control"
                  value={
                    formData.category
                  }
                  onChange={
                    handleCategoryChange
                  }
                >

                  <option value="">

                    Select Category

                  </option>


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

                        {
                          category.name
                        }

                      </option>

                    )
                  )}

                </select>

              </div>


              {/* =================================
                  SUB CATEGORY
              ================================= */}

              <div className="col-md-4 mb-3">

                <label className="form-label">

                  Sub Category

                </label>


                <select
                  name="subCategory"
                  className="form-control"
                  value={
                    formData.subCategory
                  }
                  onChange={
                    handleChange
                  }
                  disabled={
                    !formData.category
                  }
                >

                  <option value="">

                    Select Sub Category

                  </option>


                  {subCategories.map(
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
                  )}

                </select>

              </div>


              {/* =================================
                  BRAND
              ================================= */}

              <div className="col-md-4 mb-3">

                <label className="form-label">

                  Brand

                </label>


                <select
                  name="brand"
                  className="form-control"
                  value={
                    formData.brand
                  }
                  onChange={
                    handleChange
                  }
                  disabled={
                    !formData.category
                  }
                >

                  <option value="">

                    Select Brand

                  </option>


                  {brands.map(
                    (brand) => (

                      <option
                        key={
                          brand._id
                        }
                        value={
                          brand._id
                        }
                      >

                        {
                          brand.name
                        }

                      </option>

                    )
                  )}

                </select>

              </div>


              {/* =================================
                  PRICE
              ================================= */}

              <div className="col-md-4 mb-3">

                <label className="form-label">

                  Price

                </label>


                <input
                  type="number"
                  name="price"
                  className="form-control"
                  value={
                    formData.price
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="Enter price"
                  min="0"
                />

              </div>


              {/* =================================
                  SALE PRICE
              ================================= */}

              <div className="col-md-4 mb-3">

                <label className="form-label">

                  Sale Price

                </label>


                <input
                  type="number"
                  name="salePrice"
                  className="form-control"
                  value={
                    formData.salePrice
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="Enter sale price"
                  min="0"
                />

              </div>


              {/* =================================
                  STOCK
              ================================= */}

              <div className="col-md-4 mb-3">

                <label className="form-label">

                  Stock

                </label>


                <input
                  type="number"
                  name="stock"
                  className="form-control"
                  value={
                    formData.stock
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="Enter stock"
                  min="0"
                />

              </div>


              {/* =================================
                  DESCRIPTION
              ================================= */}

              <div className="col-md-12 mb-3">

                <label className="form-label">

                  Description

                </label>


                <textarea
                  name="description"
                  className="form-control"
                  rows="5"
                  value={
                    formData.description
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="Enter product description"
                />

              </div>


              {/* =================================
                  EXISTING IMAGES
              ================================= */}

              {item.images?.length > 0 && (

                <div className="col-md-12 mb-3">

                  <label className="form-label">

                    Existing Images

                  </label>


                  <div className="d-flex gap-3 flex-wrap">

                    {item.images.map(
                      (image, index) => (

                        <div
                          key={index}
                          className="position-relative"
                        >

                          <img
                            src={image}
                            alt={
                              `product-${index}`
                            }
                            style={{
                              width: "100px",
                              height: "100px",
                              objectFit: "cover",
                              borderRadius: "8px",
                              border:
                                "1px solid #ddd",
                            }}
                          />

                        </div>

                      )
                    )}

                  </div>

                </div>

              )}


              {/* =================================
                  NEW IMAGES
              ================================= */}

              <div className="col-md-12 mb-3">

                <label className="form-label">

                  Add New Images

                </label>


                <input
                  type="file"
                  className="form-control"
                  accept="image/*"
                  multiple
                  onChange={
                    handleImageChange
                  }
                />


                <small className="text-muted">

                  You can select multiple images.

                </small>

              </div>


              {/* =================================
                  NEW IMAGE PREVIEW
              ================================= */}

              {images.length > 0 && (

                <div className="col-md-12 mb-3">

                  <label className="form-label">

                    New Image Preview

                  </label>


                  <div className="d-flex gap-3 flex-wrap">

                    {images.map(
                      (image, index) => (

                        <img
                          key={index}
                          src={
                            URL.createObjectURL(
                              image
                            )
                          }
                          alt={
                            `new-${index}`
                          }
                          style={{
                            width: "100px",
                            height: "100px",
                            objectFit: "cover",
                            borderRadius: "8px",
                            border:
                              "1px solid #ddd",
                          }}
                        />

                      )
                    )}

                  </div>

                </div>

              )}

            </div>


            {/* =================================
                BUTTONS
            ================================= */}

            <div className="d-flex gap-2">

              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >

                {loading ? (

                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    />

                    Updating...

                  </>

                ) : (

                  "Update Product"

                )}

              </button>


              <button
                type="button"
                className="btn btn-secondary"
                disabled={loading}
                onClick={() =>
                  navigate(
                    "/admin/products"
                  )
                }
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


export default EditProduct;