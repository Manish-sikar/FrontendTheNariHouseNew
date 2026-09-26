import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import {
  GetWishlist,
  RemoveFromWishlist,
  ClearWishlist,
} from "../../services/wishlistServices";

import {
  AddToCart,
} from "../../services/cartServices";

import "./WishlistPage.css";

const WishlistPage = () => {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [removingId, setRemovingId] = useState(null);
  const [addingCartId, setAddingCartId] = useState(null);
  const [clearing, setClearing] = useState(false);

  // =====================================================
  // GET WISHLIST
  // =====================================================

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    const token = localStorage.getItem("authTokenUser");

    if (!token) {
      setLoading(false);

      navigate("/login-User", {
        state: {
          from: "/wishlist",
        },
      });

      return;
    }

    try {
      setLoading(true);

      const response = await GetWishlist();

      if (response?.success) {
        setProducts(
          response?.data?.products || []
        );
      } else {
        setProducts([]);
      }
    } catch (error) {
      console.error("Wishlist Page Error:", error);

      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // IMAGE
  // =====================================================

  const getProductImage = (product) => {
    if (!product) {
      return "/img/category-default.jpg";
    }

    let image = null;

    if (Array.isArray(product.images)) {
      image = product.images[0];
    }

    image =
      image ||
      product.productImage ||
      product.image ||
      product.imageUrl ||
      product.product_img;

    if (!image) {
      return "/img/category-default.jpg";
    }

    // If backend already gives full URL
    if (
      image.startsWith("http://") ||
      image.startsWith("https://")
    ) {
      return image;
    }

    // If image starts with /
    if (image.startsWith("/")) {
      return image;
    }

    // Backend uploads
    return `/uploads/${image}`;
  };

  // =====================================================
  // PRICE
  // =====================================================

  const getPrice = (product) => {
    const price = Number(product?.price || 0);
    const salePrice = Number(product?.salePrice || 0);

    if (
      salePrice > 0 &&
      salePrice < price
    ) {
      return salePrice;
    }

    return price;
  };

  const getOriginalPrice = (product) => {
    const price = Number(product?.price || 0);
    const salePrice = Number(product?.salePrice || 0);

    if (
      salePrice > 0 &&
      salePrice < price
    ) {
      return price;
    }

    return null;
  };

  // =====================================================
  // REMOVE
  // =====================================================

  const handleRemove = async (productId) => {
    try {
      setRemovingId(productId);

      const response =
        await RemoveFromWishlist(productId);

      if (response?.success) {
        setProducts((prev) =>
          prev.filter(
            (item) =>
              String(item?._id) !==
              String(productId)
          )
        );

        window.dispatchEvent(
          new Event("wishlistUpdated")
        );

        Swal.fire({
          icon: "success",
          title: "Removed",
          text: "Product removed from wishlist.",
          timer: 1500,
          showConfirmButton: false,
        });
      }
    } catch (error) {
      console.error(
        "Remove Wishlist Error:",
        error
      );

      Swal.fire({
        icon: "error",
        title: "Oops!",
        text:
          error?.response?.data?.message ||
          "Unable to remove product.",
      });
    } finally {
      setRemovingId(null);
    }
  };

  // =====================================================
  // CLEAR WISHLIST
  // =====================================================

  const handleClearWishlist = async () => {
    if (!products.length) {
      return;
    }

    const result = await Swal.fire({
      icon: "warning",
      title: "Clear Wishlist?",
      text: "All products will be removed from your wishlist.",
      showCancelButton: true,
      confirmButtonText: "Yes, Clear",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) {
      return;
    }

    try {
      setClearing(true);

      const response =
        await ClearWishlist();

      if (response?.success) {
        setProducts([]);

        window.dispatchEvent(
          new Event("wishlistUpdated")
        );

        Swal.fire({
          icon: "success",
          title: "Wishlist Cleared",
          text: "Your wishlist is now empty.",
          timer: 1500,
          showConfirmButton: false,
        });
      }
    } catch (error) {
      console.error(
        "Clear Wishlist Error:",
        error
      );

      Swal.fire({
        icon: "error",
        title: "Oops!",
        text:
          error?.response?.data?.message ||
          "Unable to clear wishlist.",
      });
    } finally {
      setClearing(false);
    }
  };

  // =====================================================
  // ADD TO CART
  // =====================================================

  const handleAddToCart = async (product) => {
    if (!product?._id) {
      return;
    }

    try {
      setAddingCartId(product._id);

      const response = await AddToCart({
        product: product._id,
        quantity: 1,
      });

      if (response?.success) {
        window.dispatchEvent(
          new Event("cartUpdated")
        );

        Swal.fire({
          icon: "success",
          title: "Added to Cart",
          text: "Product added to your cart.",
          timer: 1500,
          showConfirmButton: false,
        });
      }
    } catch (error) {
      console.error(
        "Add To Cart Error:",
        error
      );

      Swal.fire({
        icon: "error",
        title: "Unable to Add",
        text:
          error?.response?.data?.message ||
          "Something went wrong while adding the product.",
      });
    } finally {
      setAddingCartId(null);
    }
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="wishlist-page">
        <div className="wishlist-container">
          <div className="wishlist-loading">
            <div className="wishlist-spinner"></div>
            <p>Loading your wishlist...</p>
          </div>
        </div>
      </div>
    );
  }

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <div className="wishlist-page">

      {/* Breadcrumb */}
      <div className="wishlist-breadcrumb">
        <div className="wishlist-container">

          <Link to="/">
            Home
          </Link>

          <span>/</span>

          <span>Wishlist</span>

        </div>
      </div>

      <div className="wishlist-container">

        {/* Header */}
        <div className="wishlist-heading">

          <div>
            <span className="wishlist-small-title">
              YOUR FAVOURITES
            </span>

            <h1>
              My Wishlist
            </h1>

            <p>
              Save your favourite products
              and shop them whenever you want.
            </p>
          </div>

          {products.length > 0 && (
            <button
              type="button"
              className="wishlist-clear-btn"
              onClick={handleClearWishlist}
              disabled={clearing}
            >
              <i className="bi bi-trash3"></i>

              {clearing
                ? "Clearing..."
                : "Clear Wishlist"}
            </button>
          )}

        </div>

        {/* Product Count */}
        {products.length > 0 && (
          <div className="wishlist-summary">
            <span>
              {products.length}{" "}
              {products.length === 1
                ? "Product"
                : "Products"}
            </span>
          </div>
        )}

        {/* Empty Wishlist */}
        {products.length === 0 ? (
          <div className="wishlist-empty">

            <div className="wishlist-empty-icon">
              <i className="bi bi-heart"></i>
            </div>

            <h2>
              Your wishlist is empty
            </h2>

            <p>
              Looks like you haven't added
              anything to your wishlist yet.
            </p>

            <Link
              to="/products"
              className="wishlist-shop-btn"
            >
              <i className="bi bi-bag"></i>
              Continue Shopping
            </Link>

          </div>
        ) : (
          <div className="wishlist-grid">

            {products.map((product) => {

              const productId =
                product?._id;

              const salePrice =
                getPrice(product);

              const originalPrice =
                getOriginalPrice(product);

              return (
                <div
                  className="wishlist-card"
                  key={productId}
                >

                  {/* Image */}
                  <div className="wishlist-image-wrapper">

                    <Link
                      to={`/product/${productId}`}
                    >
                      <img
                        src={getProductImage(
                          product
                        )}
                        alt={
                          product?.productName ||
                          "Product"
                        }
                        className="wishlist-product-image"
                        onError={(e) => {
                          e.currentTarget.src =
                            "/img/category-default.jpg";
                        }}
                      />
                    </Link>

                    {/* Remove */}
                    <button
                      type="button"
                      className="wishlist-remove-btn"
                      onClick={() =>
                        handleRemove(productId)
                      }
                      disabled={
                        removingId === productId
                      }
                      title="Remove from wishlist"
                    >
                      {removingId ===
                      productId ? (
                        <i className="bi bi-arrow-repeat"></i>
                      ) : (
                        <i className="bi bi-x-lg"></i>
                      )}
                    </button>

                    {/* Sale Badge */}
                    {originalPrice && (
                      <span className="wishlist-sale-badge">
                        Sale
                      </span>
                    )}

                  </div>

                  {/* Content */}
                  <div className="wishlist-card-content">

                    <div className="wishlist-product-category">

                      {product?.category?.name ||
                        "Collection"}

                    </div>

                    <Link
                      to={`/product/${productId}`}
                      className="wishlist-product-name"
                    >
                      {product?.productName ||
                        "Product Name"}
                    </Link>

                    {product?.brand?.name && (
                      <div className="wishlist-product-brand">
                        {product.brand.name}
                      </div>
                    )}

                    {/* Price */}
                    <div className="wishlist-price">

                      <span className="wishlist-sale-price">
                        ₹{salePrice.toLocaleString(
                          "en-IN"
                        )}
                      </span>

                      {originalPrice && (
                        <span className="wishlist-original-price">
                          ₹{originalPrice.toLocaleString(
                            "en-IN"
                          )}
                        </span>
                      )}

                    </div>

                    {/* Actions */}
                    <div className="wishlist-actions">

                      <button
                        type="button"
                        className="wishlist-cart-btn"
                        onClick={() =>
                          handleAddToCart(
                            product
                          )
                        }
                        disabled={
                          addingCartId ===
                          productId
                        }
                      >
                        {addingCartId ===
                        productId ? (
                          <>
                            <i className="bi bi-arrow-repeat"></i>
                            Adding...
                          </>
                        ) : (
                          <>
                            <i className="bi bi-bag"></i>
                            Add to Cart
                          </>
                        )}
                      </button>

                      <Link
                        to={`/product/${productId}`}
                        className="wishlist-view-btn"
                      >
                        <i className="bi bi-eye"></i>
                      </Link>

                    </div>

                  </div>

                </div>
              );
            })}

          </div>
        )}

      </div>

    </div>
  );
};

export default WishlistPage;