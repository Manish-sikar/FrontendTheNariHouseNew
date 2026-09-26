import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import "../ecommerce.css";

import { GetProductById } from "../services/productServices";
import { AddToCart } from "../services/cartServices";
import {
  AddToWishlist,
} from "../services/wishlistServices";
import Swal from "sweetalert2";

const ProductDetails = () => {
  const { productId } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const [selectedImage, setSelectedImage] = useState("");

  const [quantity, setQuantity] = useState(1);

  // =====================================================
  // GET PRODUCT
  // =====================================================

  useEffect(() => {
    fetchProduct();
  }, [productId]);

  const fetchProduct = async () => {
    try {
      setLoading(true);

      const response = await GetProductById(productId);

      console.log("PRODUCT DETAILS:", response);

      const data =
        response?.product_Data || response?.product || response?.data;

      setProduct(data || null);

      if (data) {
        const images = getImages(data);

        if (images.length > 0) {
          setSelectedImage(images[0]);
        }
      }
    } catch (error) {
      console.error("Error fetching product:", error);

      setProduct(null);
    } finally {
      setLoading(false);
    }
  };

  const handleWishlist = async () => {
  const token = localStorage.getItem(
    "authTokenUser"
  );

  if (!token) {
    const result = await Swal.fire({
      icon: "warning",
      title: "Login Required",
      text: "Please login to add products to wishlist.",
      showCancelButton: true,
      confirmButtonText: "Login",
      cancelButtonText: "Continue Shopping",
    });

    if (result.isConfirmed) {
      navigate("/login-User");
    }

    return;
  }

  if (!product?._id) {
    Swal.fire(
      "Error",
      "Product ID not found",
      "error"
    );

    return;
  }

  try {

    console.log(
      "Adding to wishlist:",
      product._id
    );

    const response =
      await AddToWishlist(product._id);

    console.log(
      "Wishlist response:",
      response
    );

    if (response?.success) {

      window.dispatchEvent(
        new Event("wishlistUpdated")
      );

      await Swal.fire({
        icon: "success",
        title: "Added to Wishlist",
        text:
          response?.message ||
          "Product added to wishlist.",
        timer: 1500,
        showConfirmButton: false,
      });

    } else {

      Swal.fire(
        "Error",
        response?.message ||
          "Unable to add product",
        "error"
      );

    }

  } catch (error) {

    console.error(
      "Wishlist error:",
      error?.response?.data || error
    );

    Swal.fire(
      "Error",
      error?.response?.data?.message ||
        "Failed to add product to wishlist",
      "error"
    );
  }
};
  // =====================================================
  // IMAGES
  // =====================================================

  const getImages = (productData) => {
    let images = [];

    if (Array.isArray(productData?.images)) {
      images = productData.images;
    } else if (Array.isArray(productData?.productImages)) {
      images = productData.productImages;
    }

    return images
      .map((image) => {
        if (typeof image === "object" && image !== null) {
          return (
            image?.url || image?.path || image?.location || image?.image || ""
          );
        }

        return image;
      })
      .filter(Boolean);
  };

  const getImageUrl = (image) => {
    if (!image) {
      return "/img/product-default.jpg";
    }

    if (image.startsWith("http://") || image.startsWith("https://")) {
      return image;
    }

    const backendUrl = process.env.REACT_APP_API_URL || "";

    return image.startsWith("/")
      ? `${backendUrl}${image}`
      : `${backendUrl}/${image}`;
  };

  // =====================================================
  // PRICE
  // =====================================================

  const salePrice = Number(product?.salePrice ?? product?.price ?? 0);

  const originalPrice = Number(product?.price ?? 0);

  const hasDiscount = originalPrice > salePrice;

  const discount = hasDiscount
    ? Math.round(((originalPrice - salePrice) / originalPrice) * 100)
    : 0;

  // =====================================================
  // QUANTITY
  // =====================================================

  const increaseQuantity = () => {
    const stock = Number(product?.stock ?? 0);

    setQuantity((old) => {
      if (old >= stock) {
        return old;
      }

      return old + 1;
    });
  };

  const decreaseQuantity = () => {
    setQuantity((old) => (old > 1 ? old - 1 : 1));
  };

  // =====================================================
  // ADD TO CART
  // =====================================================

  const handleAddToCart = async () => {
    const token = localStorage.getItem("authTokenUser");

    // Login check
    if (!token) {
      const result = await Swal.fire({
        icon: "warning",
        title: "Login Required",
        text: "Please login to add products to cart.",
        showCancelButton: true,
        confirmButtonText: "Login",
        cancelButtonText: "Continue Shopping",
      });

      if (result.isConfirmed) {
        navigate("/login-User");
      }

      return;
    }

    if (!product?._id) {
      Swal.fire("Error", "Product ID not found", "error");

      return;
    }

    if (quantity < 1) {
      Swal.fire("Error", "Please select a valid quantity", "error");

      return;
    }

    try {
      const cartData = {
        productId: product._id,
        quantity: quantity,
      };

      console.log("Adding to cart:", cartData);

      const response = await AddToCart(cartData);

      console.log("Add cart response:", response);
      window.dispatchEvent(new Event("cartUpdated"));
      if (response?.success !== false) {
        await Swal.fire({
          icon: "success",
          title: "Added to Cart",
          text: "Product added successfully!",
          timer: 1500,
          showConfirmButton: false,
        });

        // Optional: cart page par bhejna
        // navigate("/cart");
      } else {
        Swal.fire(
          "Error",
          response?.message || "Unable to add product",
          "error",
        );
      }
    } catch (error) {
      console.error("Add to cart error:", error?.response?.data || error);

      Swal.fire(
        "Error",
        error?.response?.data?.message || "Failed to add product to cart",
        "error",
      );
    }
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="naari-product-detail-loading">
        <div className="naari-loader"></div>

        <p>Loading product...</p>
      </div>
    );
  }

  // =====================================================
  // NOT FOUND
  // =====================================================

  if (!product) {
    return (
      <div className="naari-product-not-found">
        <i className="fas fa-box-open"></i>

        <h2>Product Not Found</h2>

        <p>This product is no longer available.</p>

        <button type="button" onClick={() => navigate("/products")}>
          BACK TO SHOP
        </button>
      </div>
    );
  }

  // =====================================================
  // DATA
  // =====================================================

  const productName = product?.productName || product?.name || "Product";

  const images = getImages(product);

  const stock = Number(product?.stock ?? 0);

  const categoryName =
    typeof product?.category === "object" ? product?.category?.name : "";

  const brandName =
    typeof product?.brand === "object" ? product?.brand?.name : "";

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="naari-product-detail-page">
      {/* ===============================================
          BREADCRUMB
      =============================================== */}

      <div className="container">
        <div className="naari-detail-breadcrumb">
          <Link to="/">Home</Link>

          <span>/</span>

          <Link to="/products">Shop</Link>

          <span>/</span>

          <span>{productName}</span>
        </div>
      </div>

      {/* ===============================================
          PRODUCT DETAIL
      =============================================== */}

      <section className="naari-product-detail-section">
        <div className="container">
          <div className="row">
            {/* =========================================
                GALLERY
            ========================================= */}

            <div className="col-lg-6">
              <div className="naari-detail-gallery">
                {/* MAIN IMAGE */}

                <div className="naari-detail-main-image">
                  {hasDiscount && (
                    <span className="naari-detail-sale-badge">SALE</span>
                  )}

                 <button
  type="button"
  className="naari-detail-wishlist"
  onClick={handleWishlist}
  title="Add to Wishlist"
>
  <i className="far fa-heart"></i>
</button>

                  <img
                    src={getImageUrl(selectedImage || images[0])}
                    alt={productName}
                    onError={(e) => {
                      e.currentTarget.src = "/img/product-default.jpg";
                    }}
                  />
                </div>

                {/* THUMBNAILS */}

                {images.length > 1 && (
                  <div className="naari-detail-thumbnails">
                    {images.map((image, index) => (
                      <button
                        key={index}
                        type="button"
                        className={
                          getImageUrl(selectedImage) === getImageUrl(image)
                            ? "active"
                            : ""
                        }
                        onClick={() => setSelectedImage(image)}
                      >
                        <img
                          src={getImageUrl(image)}
                          alt={`${productName} ${index + 1}`}
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* =========================================
                INFORMATION
            ========================================= */}

            <div className="col-lg-6">
              <div className="naari-detail-info">
                {/* CATEGORY */}

                {categoryName && (
                  <span className="naari-detail-category">{categoryName}</span>
                )}

                {/* NAME */}

                <h1>{productName}</h1>

                {/* RATING */}

                <div className="naari-detail-rating">
                  <span>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="far fa-star"></i>
                  </span>

                  <small>0 Reviews</small>
                </div>

                {/* PRICE */}

                <div className="naari-detail-price">
                  <strong>₹{salePrice.toLocaleString("en-IN")}</strong>

                  {hasDiscount && (
                    <>
                      <del>₹{originalPrice.toLocaleString("en-IN")}</del>

                      <span>{discount}% OFF</span>
                    </>
                  )}
                </div>

                {/* DESCRIPTION */}

                <div className="naari-detail-description">
                  <p>
                    {product?.description ||
                      "Discover this beautiful product from our latest collection. Designed with quality and style in mind."}
                  </p>
                </div>

                {/* BRAND */}

                {brandName && (
                  <div className="naari-detail-meta">
                    <strong>Brand:</strong>

                    <span>{brandName}</span>
                  </div>
                )}

                {/* SKU */}

                {product?.sku && (
                  <div className="naari-detail-meta">
                    <strong>SKU:</strong>

                    <span>{product.sku}</span>
                  </div>
                )}

                {/* STOCK */}

                <div className="naari-detail-stock">
                  {stock > 0 ? (
                    <>
                      <i className="fas fa-check-circle"></i>

                      <span>In Stock</span>

                      <small>{stock} available</small>
                    </>
                  ) : (
                    <>
                      <i className="fas fa-times-circle"></i>

                      <span>Out of Stock</span>
                    </>
                  )}
                </div>

                {/* ACTIONS */}

                {stock > 0 && (
                  <>
                    <div className="naari-detail-actions">
                      {/* QUANTITY */}

                      <div className="naari-quantity">
                        <button type="button" onClick={decreaseQuantity}>
                          −
                        </button>

                        <span>{quantity}</span>

                        <button type="button" onClick={increaseQuantity}>
                          +
                        </button>
                      </div>

                      {/* CART */}

                      <button
                        type="button"
                        className="naari-add-cart-btn"
                        onClick={handleAddToCart}
                      >
                        ADD TO CART
                      </button>
                    </div>

                    {/* BUY */}

                    <button type="button" className="naari-buy-now-btn">
                      BUY IT NOW
                    </button>
                  </>
                )}

                {/* FEATURES */}

                <div className="naari-product-features">
                  <div>
                    <i className="fas fa-truck"></i>

                    <div>
                      <strong>Free Shipping</strong>

                      <span>On orders above ₹999</span>
                    </div>
                  </div>

                  <div>
                    <i className="fas fa-undo"></i>

                    <div>
                      <strong>Easy Returns</strong>

                      <span>7 days return policy</span>
                    </div>
                  </div>

                  <div>
                    <i className="fas fa-shield-alt"></i>

                    <div>
                      <strong>Secure Payment</strong>

                      <span>100% secure checkout</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProductDetails;
