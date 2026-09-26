import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import Swal from "sweetalert2";

import {
  CreateCheckoutOrder,
  VerifyCheckoutPayment,
} from "../../services/checkoutServices";

import "./CheckoutPage.css";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const {
    cartItems = [],
    subtotal = 0,
    shipping = 0,
    totalAmount = 0,
  } = location.state || {};

  const [formData, setFormData] = useState({
    fullName: "",
    mobileNumber: "",
    email: "",
    fullAddress: "",
    city: "",
    state: "",
    pinCode: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const getProduct = (item) => {
    return item.product || item.productId || item;
  };

  const getImage = (product) => {
    const images = product.images || product.productImages;

    if (Array.isArray(images) && images.length > 0) {
      const image = images[0];

      if (typeof image === "object") {
        return (
          image.url ||
          image.Location ||
          image.path ||
          "/img/category-default.jpg"
        );
      }

      return image;
    }

    return "/img/category-default.jpg";
  };

  const getPrice = (item, product) => {
    return Number(item.price ?? product.salePrice ?? product.price ?? 0);
  };

  const formatPrice = (amount) => {
    return `₹${Number(amount).toLocaleString("en-IN")}`;
  };

  const handleCheckout = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const checkoutPayload = {
        ...formData,
        cartItems,
        subtotal,
        shipping,
        totalAmount,
      };

      const response = await CreateCheckoutOrder(checkoutPayload);

      if (!response?.success) {
        throw new Error(response?.message || "Unable to create order");
      }

      const checkoutData = response.data;

      if (!window.Razorpay) {
        throw new Error("Razorpay SDK is not loaded");
      }

      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID,

        amount: Math.round(checkoutData.amount * 100),

        currency: checkoutData.currency || "INR",

        name: "OurMicroLife",

        description: "Ecommerce Order",

        order_id: checkoutData.razorpayOrderId,

        prefill: {
          name: formData.fullName,
          email: formData.email,
          contact: formData.mobileNumber,
        },

        theme: {
          color: "#288e8a",
        },

        handler: async (paymentResponse) => {
          try {
            const verifyResponse = await VerifyCheckoutPayment({
              orderId: checkoutData.orderId,

              razorpay_order_id: paymentResponse.razorpay_order_id,

              razorpay_payment_id: paymentResponse.razorpay_payment_id,

              razorpay_signature: paymentResponse.razorpay_signature,
            });

            if (verifyResponse?.success) {
              await Swal.fire({
                icon: "success",
                title: "Order Confirmed",
                text: "Your payment was successful",
                confirmButtonText: "Continue",
              });

              navigate("/orders");
            }
          } catch (error) {
            Swal.fire(
              "Error",
              error?.response?.data?.message || "Payment verification failed",
              "error",
            );
          }
        },

        modal: {
          ondismiss: () => {
            setLoading(false);
          },
        },
      };

      const razorpay = new window.Razorpay(options);

      razorpay.on("payment.failed", () => {
        setLoading(false);

        Swal.fire("Payment Failed", "Please try again", "error");
      });

      razorpay.open();
    } catch (error) {
      console.error("Checkout error:", error);

      const status = error?.response?.status;

      const message =
        error?.response?.data?.message || error.message || "Unable to proceed";

      if (status === 401) {
        await Swal.fire({
          icon: "warning",
          title: "Login Required",
          text: "Please login first",
          confirmButtonText: "Login",
        });

        navigate("/login-User");
        return;
      }

      Swal.fire("Error", message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkout-page">
      <div className="checkout-breadcrumb">
        <Link to="/">Home</Link>
        <span>›</span>
        <span>Checkout</span>
      </div>

      <h1 className="checkout-title">Checkout</h1>

      <div className="checkout-steps">
        <span className="active-step">
          <b>1</b> Address
        </span>

        <span>›</span>

        <span>
          <b>2</b> Payment
        </span>
      </div>

      <div className="checkout-layout">
        {/* Address */}

        <form className="checkout-address" onSubmit={handleCheckout}>
          <h2>Delivery Address</h2>

          <div className="checkout-grid">
            <div className="checkout-field">
              <label>FULL NAME</label>

              <input
                type="text"
                name="fullName"
                placeholder="Full Name"
                value={formData.fullName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="checkout-field">
              <label>MOBILE NUMBER</label>

              <input
                type="tel"
                name="mobileNumber"
                placeholder="Mobile Number"
                value={formData.mobileNumber}
                onChange={handleChange}
                pattern="[0-9]{10}"
                maxLength={10}
                required
              />
            </div>
          </div>

          <div className="checkout-field">
            <label>EMAIL ADDRESS</label>

            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="checkout-field">
            <label>FULL ADDRESS</label>

            <input
              type="text"
              name="fullAddress"
              placeholder="Full Address"
              value={formData.fullAddress}
              onChange={handleChange}
              required
            />
          </div>

          <div className="checkout-grid">
            <div className="checkout-field">
              <label>CITY</label>

              <input
                type="text"
                name="city"
                placeholder="City"
                value={formData.city}
                onChange={handleChange}
                required
              />
            </div>

            <div className="checkout-field">
              <label>STATE</label>

              <input
                type="text"
                name="state"
                placeholder="State"
                value={formData.state}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="checkout-field pin-field">
            <label>PIN CODE</label>

            <input
              type="text"
              name="pinCode"
              placeholder="PIN Code"
              value={formData.pinCode}
              onChange={handleChange}
              pattern="[0-9]{6}"
              maxLength={6}
              required
            />
          </div>

          <button
            type="submit"
            className="continue-payment-btn"
            disabled={loading}
          >
            {loading ? "Processing..." : "Continue to Payment →"}
          </button>
        </form>

        {/* Order Summary */}

        <div className="checkout-summary">
          <h2>Order Summary</h2>

          {cartItems.map((item) => {
            const product = getProduct(item);

            const quantity = Number(item.quantity) || 1;

            const price = getPrice(item, product);

            return (
              <div
                className="checkout-product"
                key={item.cartItemId || item._id || item.id}
              >
                <img
                  src={getImage(product)}
                  alt={product.productName || "Product"}
                  onError={(e) => {
                    e.currentTarget.src = "/img/category-default.jpg";
                  }}
                />

                <div className="checkout-product-info">
                  <h4>{product.productName || product.name || "Product"}</h4>

                  <p>Qty: {quantity}</p>
                </div>

                <strong>{formatPrice(price * quantity)}</strong>
              </div>
            );
          })}

          <div className="checkout-summary-row">
            <span>Subtotal</span>
            <span>{formatPrice(subtotal)}</span>
          </div>

          <div className="checkout-summary-row">
            <span>Shipping</span>
            <span className="free-shipping">FREE</span>
          </div>

          <div className="checkout-divider"></div>

          <div className="checkout-total">
            <strong>Total</strong>

            <strong>{formatPrice(totalAmount)}</strong>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
