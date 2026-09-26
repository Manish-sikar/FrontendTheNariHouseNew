import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
// import "../../public/css/ecommerce.css";
import "../ecommerce.css";

import { GetProducts } from "../services/productServices";
import { getCategories } from "../services/categoryService";
import {
  GetWishlist,
  AddToWishlist,
  RemoveFromWishlist,
} from "../services/wishlistServices";
import Swal from "sweetalert2";

const Products = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(true);
  const [categoryLoading, setCategoryLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("default");

  // URL category
  const queryParams = new URLSearchParams(location.search);
  const categoryId = queryParams.get("category");
  const [wishlistIds, setWishlistIds] = useState(new Set());
  // =====================================================
  // GET PRODUCTS
  // =====================================================

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);

      const response = await GetProducts();

      console.log("PRODUCT RESPONSE:", response);

      const productData =
        response?.product_Data || response?.products || response?.data || [];

      setProducts(Array.isArray(productData) ? productData : []);
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // GET CATEGORIES
  // =====================================================

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setCategoryLoading(true);

      const response = await getCategories();

      console.log("CATEGORY RESPONSE:", response);

      const categoryData =
        response?.category_Data ||
        response?.categories ||
        response?.data?.data ||
        [];

      setCategories(Array.isArray(categoryData) ? categoryData : []);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setCategories([]);
    } finally {
      setCategoryLoading(false);
    }
  };
  useEffect(() => {
    const fetchWishlist = async () => {
      const token = localStorage.getItem("authTokenUser");

      if (!token) {
        setWishlistIds(new Set());
        return;
      }

      try {
        const response = await GetWishlist();

        const products = response?.data?.products || [];

        const ids = new Set(
          products.map((item) =>
            String(typeof item === "object" ? item?._id : item),
          ),
        );

        setWishlistIds(ids);
      } catch (error) {
        console.error("Get Wishlist Error:", error);
        setWishlistIds(new Set());
      }
    };

    fetchWishlist();
  }, []);

  // =====================================================
  // GET CATEGORY NAME
  // =====================================================

  const selectedCategory = useMemo(() => {
    if (!categoryId) return null;

    return categories.find(
      (category) => String(category?._id) === String(categoryId),
    );
  }, [categories, categoryId]);

  // =====================================================
  // IMAGE
  // =====================================================

  const getProductImage = (product) => {
    let image = null;

    if (Array.isArray(product?.images) && product.images.length > 0) {
      image = product.images[0];
    }

    if (!image && Array.isArray(product?.productImages)) {
      image = product.productImages[0];
    }

    if (!image && product?.image) {
      image = product.image;
    }

    if (!image && product?.thumbnail) {
      image = product.thumbnail;
    }

    if (!image) {
      return "/img/product-default.jpg";
    }

    if (typeof image === "object" && image !== null) {
      image = image.url || image.path || image.location || image.image || "";
    }

    if (!image) {
      return "/img/product-default.jpg";
    }

    if (image.startsWith("http://") || image.startsWith("https://")) {
      return image;
    }

    // If your backend returns /uploads/...
    const backendUrl = process.env.REACT_APP_API_URL || "";

    return image.startsWith("/")
      ? `${backendUrl}${image}`
      : `${backendUrl}/${image}`;
  };

  // =====================================================
  // CATEGORY ID
  // =====================================================

  const getCategoryId = (product) => {
    if (!product?.category) return "";

    if (typeof product.category === "object") {
      return product.category?._id || "";
    }

    return product.category;
  };

  // =====================================================
  // CATEGORY NAME
  // =====================================================

  const getCategoryName = (product) => {
    if (!product?.category) {
      return "";
    }

    if (typeof product.category === "object") {
      return product.category?.name || "";
    }

    const category = categories.find(
      (item) => String(item?._id) === String(product.category),
    );

    return category?.name || "";
  };

  // =====================================================
  // FILTER + SEARCH + SORT
  // =====================================================

  const filteredProducts = useMemo(() => {
    let result = [...products];

    // CATEGORY
    if (categoryId) {
      result = result.filter((product) => {
        const productCategoryId = getCategoryId(product);

        return String(productCategoryId) === String(categoryId);
      });
    }

    // SEARCH
    if (search.trim()) {
      const searchValue = search.toLowerCase();

      result = result.filter((product) => {
        const name = product?.productName || product?.name || "";

        const sku = product?.sku || "";

        const categoryName = getCategoryName(product);

        return (
          name.toLowerCase().includes(searchValue) ||
          sku.toLowerCase().includes(searchValue) ||
          categoryName.toLowerCase().includes(searchValue)
        );
      });
    }

    // SORT
    if (sortBy === "price-low") {
      result.sort(
        (a, b) =>
          Number(a?.salePrice ?? a?.price ?? 0) -
          Number(b?.salePrice ?? b?.price ?? 0),
      );
    }

    if (sortBy === "price-high") {
      result.sort(
        (a, b) =>
          Number(b?.salePrice ?? b?.price ?? 0) -
          Number(a?.salePrice ?? a?.price ?? 0),
      );
    }

    if (sortBy === "name") {
      result.sort((a, b) => {
        const nameA = a?.productName || a?.name || "";

        const nameB = b?.productName || b?.name || "";

        return nameA.localeCompare(nameB);
      });
    }

    return result;
  }, [products, categoryId, search, sortBy, categories]);

  // =====================================================
  // PRICE
  // =====================================================

  const getSalePrice = (product) => {
    return Number(product?.salePrice ?? product?.price ?? 0);
  };

  const getOriginalPrice = (product) => {
    return Number(product?.price ?? 0);
  };

  const hasDiscount = (product) => {
    return getOriginalPrice(product) > getSalePrice(product);
  };

  // =====================================================
  // DISCOUNT %
  // =====================================================

  const getDiscount = (product) => {
    const price = getOriginalPrice(product);
    const salePrice = getSalePrice(product);

    if (!price || salePrice >= price) {
      return 0;
    }

    return Math.round(((price - salePrice) / price) * 100);
  };

  // =====================================================
  // CATEGORY CLICK
  // =====================================================

  const handleCategoryClick = (id) => {
    navigate(`/products?category=${id}`);
  };

  const clearCategory = () => {
    navigate("/products");
  };

  // =====================================================
  // PRODUCT CARD
  // =====================================================

  const ProductCard = ({ product }) => {
    const isWishlisted = wishlistIds.has(String(product?._id));
    const handleWishlist = async () => {
      const token = localStorage.getItem("authTokenUser");

      if (!token) {
        const result = await Swal.fire({
          icon: "warning",
          title: "Login Required",
          text: "Please login to use wishlist.",
          showCancelButton: true,
          confirmButtonText: "Login",
          cancelButtonText: "Continue Shopping",
        });

        if (result.isConfirmed) {
          navigate("/login-User");
        }

        return;
      }

      try {
        if (isWishlisted) {
          const response = await RemoveFromWishlist(product._id);

          if (response?.success) {
            setWishlistIds((prev) => {
              const next = new Set(prev);
              next.delete(String(product._id));
              return next;
            });

            window.dispatchEvent(new Event("wishlistUpdated"));
          }

          return;
        }

        const response = await AddToWishlist(product._id);

        if (response?.success) {
          setWishlistIds((prev) => {
            const next = new Set(prev);
            next.add(String(product._id));
            return next;
          });

          window.dispatchEvent(new Event("wishlistUpdated"));

          Swal.fire({
            icon: "success",
            title: "Added to Wishlist",
            text: "Product added to wishlist.",
            timer: 1200,
            showConfirmButton: false,
          });
        }
      } catch (error) {
        console.error("Wishlist Error:", error?.response?.data || error);

        Swal.fire({
          icon: "error",
          title: "Wishlist Error",
          text: error?.response?.data?.message || "Something went wrong.",
        });
      }
    };

    const productId = product?._id;

    const productName = product?.productName || product?.name || "Product";

    const salePrice = getSalePrice(product);
    const originalPrice = getOriginalPrice(product);

    const discount = getDiscount(product);

    const stock = Number(product?.stock ?? 0);

    return (
      <div className="naari-product-card">
        {/* IMAGE */}
        <div className="naari-product-image">
          <Link to={`/product/${productId}`}>
            <img
              src={getProductImage(product)}
              alt={productName}
              onError={(e) => {
                e.currentTarget.src = "/img/product-default.jpg";
              }}
            />
          </Link>

          {/* NEW */}
          {product?.isNew && (
            <span className="naari-product-badge new">NEW</span>
          )}

          {/* SALE */}
          {hasDiscount(product) && (
            <span className="naari-product-badge sale">SALE</span>
          )}

          {/* DISCOUNT */}
          {discount > 0 && (
            <span className="naari-discount-badge">-{discount}%</span>
          )}

          {/* WISHLIST */}
          <button
            type="button"
            className={`naari-wishlist-btn ${isWishlisted ? "active" : ""}`}
            onClick={handleWishlist}
            title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
          >
            <i className={isWishlisted ? "fas fa-heart" : "far fa-heart"}></i>
          </button>

          {/* QUICK ACTION */}
          <div className="naari-product-overlay">
            <Link to={`/product/${productId}`} className="naari-quick-view">
              QUICK VIEW
            </Link>
          </div>
        </div>

        {/* DETAILS */}
        <div className="naari-product-info">
          <span className="naari-product-category">
            {getCategoryName(product)}
          </span>

          <Link to={`/product/${productId}`} className="naari-product-name">
            {productName}
          </Link>

          {/* RATING */}
          <div className="naari-product-rating">
            <span className="stars">
              <i className="fas fa-star"></i>
              <i className="fas fa-star"></i>
              <i className="fas fa-star"></i>
              <i className="fas fa-star"></i>
              <i className="far fa-star"></i>
            </span>

            <span className="rating-count">(0)</span>
          </div>

          {/* PRICE */}
          <div className="naari-product-price">
            <span className="sale-price">
              ₹{salePrice.toLocaleString("en-IN")}
            </span>

            {hasDiscount(product) && (
              <del>₹{originalPrice.toLocaleString("en-IN")}</del>
            )}
          </div>

          {/* STOCK */}
          {stock <= 0 && <span className="naari-out-stock">Out of Stock</span>}
        </div>
      </div>
    );
  };

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="naari-products-page">
      {/* ================================================
          PAGE HEADER
      ================================================ */}

      <section className="naari-shop-banner">
        <div className="container">
          <div className="naari-shop-breadcrumb">
            <Link to="/">Home</Link>

            <span>/</span>

            <span>Shop</span>

            {selectedCategory && (
              <>
                <span>/</span>
                <span>{selectedCategory?.name}</span>
              </>
            )}
          </div>

          <h1>{selectedCategory?.name || "Shop All"}</h1>

          <p>Discover our latest collection crafted for your everyday style.</p>
        </div>
      </section>

      {/* ================================================
          SHOP CONTENT
      ================================================ */}

      <section className="naari-shop-content">
        <div className="container">
          <div className="row">
            {/* ==========================================
                SIDEBAR
            ========================================== */}

            <div className="col-lg-3">
              <aside className="naari-filter-sidebar">
                <div className="naari-filter-heading">
                  <h3>Filters</h3>

                  {categoryId && (
                    <button type="button" onClick={clearCategory}>
                      Clear All
                    </button>
                  )}
                </div>

                {/* CATEGORY */}
                <div className="naari-filter-section">
                  <h4>CATEGORY</h4>

                  {categoryLoading ? (
                    <p className="naari-filter-loading">Loading...</p>
                  ) : categories.length === 0 ? (
                    <p className="naari-filter-empty">No categories</p>
                  ) : (
                    <div className="naari-category-list">
                      <button
                        type="button"
                        className={!categoryId ? "active" : ""}
                        onClick={clearCategory}
                      >
                        All Products
                      </button>

                      {categories.map((category) => (
                        <button
                          key={category?._id}
                          type="button"
                          className={
                            String(category?._id) === String(categoryId)
                              ? "active"
                              : ""
                          }
                          onClick={() => handleCategoryClick(category?._id)}
                        >
                          <span>{category?.name}</span>

                          <small>
                            {
                              products.filter(
                                (product) =>
                                  String(getCategoryId(product)) ===
                                  String(category?._id),
                              ).length
                            }
                          </small>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* PRICE */}
                <div className="naari-filter-section">
                  <h4>PRICE</h4>

                  <div className="naari-price-filter">
                    <label>
                      <input
                        type="radio"
                        name="price"
                        onChange={() => setSortBy("price-low")}
                      />
                      Low to High
                    </label>

                    <label>
                      <input
                        type="radio"
                        name="price"
                        onChange={() => setSortBy("price-high")}
                      />
                      High to Low
                    </label>
                  </div>
                </div>

                {/* AVAILABILITY */}
                <div className="naari-filter-section">
                  <h4>AVAILABILITY</h4>

                  <label className="naari-check-filter">
                    <input type="checkbox" />
                    <span>In Stock</span>
                  </label>

                  <label className="naari-check-filter">
                    <input type="checkbox" />
                    <span>Out of Stock</span>
                  </label>
                </div>
              </aside>
            </div>

            {/* ==========================================
                PRODUCTS
            ========================================== */}

            <div className="col-lg-9">
              {/* TOOLBAR */}

              <div className="naari-shop-toolbar">
                <div className="naari-result-count">
                  {loading
                    ? "Loading products..."
                    : `${filteredProducts.length} Products`}
                </div>

                <div className="naari-toolbar-right">
                  {/* SEARCH */}

                  <div className="naari-product-search">
                    <i className="fas fa-search"></i>

                    <input
                      type="text"
                      placeholder="Search products..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </div>

                  {/* SORT */}

                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option value="default">Sort By</option>

                    <option value="name">Name</option>

                    <option value="price-low">Price: Low to High</option>

                    <option value="price-high">Price: High to Low</option>
                  </select>
                </div>
              </div>

              {/* PRODUCTS */}

              {loading ? (
                <div className="naari-products-loading">
                  <div className="naari-loader"></div>

                  <p>Loading products...</p>
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="naari-no-products">
                  <i className="fas fa-box-open"></i>

                  <h3>No Products Found</h3>

                  <p>We couldn't find any products matching your selection.</p>

                  <button
                    type="button"
                    onClick={() => {
                      setSearch("");
                      clearCategory();
                    }}
                  >
                    VIEW ALL PRODUCTS
                  </button>
                </div>
              ) : (
                <div className="naari-product-grid">
                  {filteredProducts.map((product) => (
                    <ProductCard key={product?._id} product={product} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Products;
