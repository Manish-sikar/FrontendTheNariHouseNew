import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import {
  GetCart,
  UpdateCartItem,
  RemoveCartItem,
} from "../../services/cartServices";

import "./CartPage.css";
import { ApplyCoupon } from "../../services/couponServices";

const CartPage = () => {
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);
  const [couponCode, setCouponCode] = useState("");
  const [couponData, setCouponData] = useState(null); // { discount, finalAmount, code }
  const [applyingCoupon, setApplyingCoupon] = useState(false);

const handleApplyCoupon = async () => {
  if (!couponCode.trim()) return;

  try {
    setApplyingCoupon(true);

    const productsPayload = cartItems.map((item) => {
      const product = getProduct(item);
      return {
        product: product._id,
        category: product.category,
      };
    });

    const response = await ApplyCoupon({
      code: couponCode.trim(),
      cartTotal: subtotal,
      products: productsPayload,
    });

    setCouponData(response.data);   // 👈 neeche note dekho

    Swal.fire("Success", "Coupon applied!", "success");
  } catch (error) {
    const message = error?.response?.data?.message || "Invalid coupon";
    Swal.fire("Error", message, "error");
    setCouponData(null);
  } finally {
    setApplyingCoupon(false);
  }
};
  // Fetch cart from API
  const fetchCart = async () => {
    try {
      setLoading(true);

      const response = await GetCart();

      const items = response?.data?.items || [];

      setCartItems(items);
    } catch (error) {
      console.error("Cart fetch error:", error);

      const status = error?.response?.status;
      const message = error?.response?.data?.message;

      if (status === 401) {
        Swal.fire({
          icon: "warning",
          title: "Login Required",
          text: message || "Please login first",
          confirmButtonText: "Login",
        }).then((result) => {
          if (result.isConfirmed) {
            navigate("/login-User");
          }
        });

        return;
      }

      Swal.fire("Error", message || "Unable to load cart", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // Get product from populated cart item
  const getProduct = (item) => {
    return item.product || item.productId || item;
  };

  // Get cart item ID
  const getItemId = (item) => {
    return item.cartItemId || item._id || item.id;
  };

  // Product image
  const getImage = (product) => {
    const images = product.images || product.productImages;

    if (Array.isArray(images) && images.length > 0) {
      const image = images[0];

      if (typeof image === "object") {
        return image.url || image.Location || image.path;
      }

      return image;
    }

    return "/img/category-default.jpg";
  };

  // Product price
  const getPrice = (product) => {
    return Number(product.salePrice ?? product.price ?? 0);
  };

  // Quantity
  const getQuantity = (item) => {
    return Math.max(1, Number(item.quantity || item.qty || 1));
  };

  // Update quantity
  const updateQuantity = async (item, quantity) => {
    if (quantity < 1) return;

    const itemId = getItemId(item);

    try {
      setUpdating(itemId);

      await UpdateCartItem(itemId, {
        quantity: quantity,
      });

      setCartItems((previous) =>
        previous.map((cartItem) =>
          getItemId(cartItem) === itemId ? { ...cartItem, quantity } : cartItem,
        ),
      );
    } catch (error) {
      console.error("Quantity update error:", error);

      Swal.fire("Error", "Unable to update quantity", "error");
    } finally {
      setUpdating(null);
    }
  };

  // Remove item
  const removeItem = async (item) => {
    const itemId = getItemId(item);

    try {
      await RemoveCartItem(itemId);

      setCartItems((previous) =>
        previous.filter((cartItem) => getItemId(cartItem) !== itemId),
      );

      Swal.fire({
        icon: "success",
        title: "Removed",
        text: "Product removed from cart",
        timer: 1200,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Remove cart error:", error);

      Swal.fire("Error", "Unable to remove product", "error");
    }
  };

  // Subtotal
  const subtotal = cartItems.reduce((total, item) => {
    const product = getProduct(item);
    const price = getPrice(product);
    const quantity = getQuantity(item);

    return total + price * quantity;
  }, 0);

  const shipping = subtotal > 0 ? 0 : 0;

  const discountAmount = couponData?.discount || 0;
  const totalAmount = subtotal + shipping - discountAmount;

  const formatPrice = (amount) => `₹${Number(amount).toLocaleString("en-IN")}`;

  if (loading) {
    return <div className="cart-loading">Loading your shopping bag...</div>;
  }

  return (
    <div className="cart-page">
      {/* Breadcrumb */}
      <div className="cart-breadcrumb">
        <Link to="/">Home</Link>
        <span>›</span>
        <span>Shopping Bag</span>
      </div>

      <h1 className="cart-title">Shopping Bag ({cartItems.length})</h1>

      {cartItems.length === 0 ? (
        <div className="empty-cart">
          <h3>Your Shopping Bag is Empty</h3>
          <p>Discover our products and add your favorites to the cart.</p>

          <Link to="/products" className="cart-shop-btn">
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="cart-layout">
          {/* Cart Products */}
          <div className="cart-products">
            {cartItems.map((item) => {
              const product = getProduct(item);
              const itemId = getItemId(item);
              const quantity = getQuantity(item);
              const price = getPrice(product);

              return (
                <div className="cart-product" key={itemId}>
                  <div className="cart-product-image">
                    <img
                      src={getImage(product)}
                      alt={product.productName || "Product"}
                      onError={(e) => {
                        e.currentTarget.src = "/img/category-default.jpg";
                      }}
                    />
                  </div>

                  <div className="cart-product-info">
                    <span className="cart-product-label">Product</span>

                    <h3>{product.productName || product.name || "Product"}</h3>

                    <p className="cart-product-size">
                      SKU: {product.sku || "N/A"}
                    </p>

                    <div className="cart-quantity">
                      <button
                        disabled={updating === itemId || quantity <= 1}
                        onClick={() => updateQuantity(item, quantity - 1)}
                      >
                        −
                      </button>

                      <span>{quantity}</span>

                      <button
                        disabled={updating === itemId}
                        onClick={() => updateQuantity(item, quantity + 1)}
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="cart-product-price">
                    <button
                      className="cart-remove"
                      onClick={() => removeItem(item)}
                      aria-label="Remove product"
                    >
                      ×
                    </button>

                    <strong>{formatPrice(price * quantity)}</strong>

                    <small>{formatPrice(price)} each</small>
                  </div>
                </div>
              );
            })}

            <Link to="/products" className="continue-shopping">
              ‹ Continue Shopping
            </Link>
          </div>

          {/* Order Summary */}
          <div className="cart-summary">
            <h2>Order Summary</h2>

            <div className="coupon-area">
              <label>COUPON CODE</label>

              <div className="coupon-input">
                <input
                  type="text"
                  placeholder="e.g. NAARI10"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                />
                <button onClick={handleApplyCoupon} disabled={applyingCoupon}>
                  {applyingCoupon ? "Applying..." : "Apply"}
                </button>
              </div>
            </div>

            <div className="summary-row">
              <span>Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>

            <div className="summary-row">
              <span>Shipping</span>
              <span className="free-shipping">FREE</span>
            </div>

            <div className="summary-divider"></div>
            {couponData && (
              <div className="summary-row">
                <span>Coupon ({couponData.code})</span>
                <span>-{formatPrice(couponData.discount)}</span>
              </div>
            )}

            <div className="summary-total">
              <strong>Total Amount</strong>
              <strong>{formatPrice(totalAmount)}</strong>
            </div>

            <button
              className="checkout-btn"
              onClick={() =>
                navigate("/checkout", {
                  state: {
                    cartItems,
                    subtotal,
                    shipping,
                    totalAmount,
                  },
                })
              }
            >
              Proceed to Checkout
              <span>→</span>
            </button>

            <div className="summary-features">
              <span>◉ Secure Checkout</span>
              <span>↻ Easy Returns</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
