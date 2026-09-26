import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Swal from "sweetalert2";

import {
  GetMyOrderDetailsData,
} from "../../services/orderServices";

import "./OrderDetails.css";

const OrderDetails = () => {
  const { id } = useParams();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const formatPrice = (amount) => {
    return `₹${Number(amount || 0).toLocaleString("en-IN")}`;
  };

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatDateTime = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusClass = (status) => {
    return String(status || "Pending")
      .toLowerCase()
      .replace(/\s+/g, "-");
  };

  const getImage = (item) => {
    if (item.image) {
      return typeof item.image === "object"
        ? item.image.url ||
            item.image.Location ||
            item.image.path ||
            "/img/category-default.jpg"
        : item.image;
    }

    const images = item.product?.images;

    if (Array.isArray(images) && images.length > 0) {
      const image = images[0];

      return typeof image === "object"
        ? image.url ||
            image.Location ||
            image.path ||
            "/img/category-default.jpg"
        : image;
    }

    return "/img/category-default.jpg";
  };

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);

      const response = await GetMyOrderDetailsData(id);

      if (response?.success) {
        setOrder(response.data);
      } else {
        throw new Error(
          response?.message || "Order not found"
        );
      }
    } catch (error) {
      console.error("Order Details Error:", error);

      Swal.fire(
        "Error",
        error?.response?.data?.message ||
          error.message ||
          "Unable to load order details",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchOrderDetails();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="order-details-loading">
        <div className="order-details-spinner"></div>
        <p>Loading order details...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="order-not-found">
        <h2>Order Not Found</h2>
        <Link to="/orders">
          Back to My Orders
        </Link>
      </div>
    );
  }

  const status = order.status || "Pending";

  const steps = [
    {
      label: "Order Placed",
      description: "Your order has been placed",
      active: true,
    },
    {
      label: "Processing",
      description: "Your order is being prepared",
      active: [
        "Processing",
        "Shipped",
        "Delivered",
      ].includes(status),
    },
    {
      label: "Shipped",
      description: "Your order is on the way",
      active: [
        "Shipped",
        "Delivered",
      ].includes(status),
    },
    {
      label: "Delivered",
      description: "Your order has been delivered",
      active: status === "Delivered",
    },
  ];

  return (
    <div className="order-details-page">

      {/* Breadcrumb */}

      <div className="order-details-breadcrumb">
        <Link to="/">Home</Link>
        <span>›</span>

        <Link to="/orders">
          My Orders
        </Link>

        <span>›</span>
        <span>Order Details</span>
      </div>

      {/* Header */}

      <div className="order-details-header">

        <div>
          <h1>Order Details</h1>

          <p>
            Order #{order.orderNumber || order._id}
          </p>

          <span>
            Placed on {formatDate(order.createdAt)}
          </span>
        </div>

        <div className="order-header-actions">
          <Link
            to="/orders"
            className="back-orders-btn"
          >
            ← My Orders
          </Link>
        </div>

      </div>

      {/* Main Layout */}

      <div className="order-details-layout">

        <div className="order-details-main">

          {/* Current Status */}

          <div className="order-detail-card">

            <div className="detail-card-title">
              <h2>Order Status</h2>

              <span
                className={`order-detail-status ${getStatusClass(
                  status
                )}`}
              >
                {status}
              </span>
            </div>

            {status === "Cancelled" ? (
              <div className="cancelled-order-message">
                <h3>Order Cancelled</h3>

                <p>
                  This order has been cancelled.
                </p>

                {order.cancelReason && (
                  <p>
                    <strong>Reason:</strong>{" "}
                    {order.cancelReason}
                  </p>
                )}

                {order.cancelledAt && (
                  <p>
                    <strong>Cancelled on:</strong>{" "}
                    {formatDateTime(order.cancelledAt)}
                  </p>
                )}
              </div>
            ) : (
              <div className="order-timeline">

                {steps.map((step, index) => (
                  <div
                    className={`timeline-step ${
                      step.active ? "completed" : ""
                    }`}
                    key={step.label}
                  >

                    <div className="timeline-icon">
                      {step.active ? "✓" : index + 1}
                    </div>

                    <div className="timeline-content">

                      <h4>{step.label}</h4>

                      <p>{step.description}</p>

                    </div>

                  </div>
                ))}

              </div>
            )}

            {/* Courier Details */}

            {(order.trackingNumber ||
              order.courierName) && (
              <div className="tracking-details">

                <h3>Shipping Tracking</h3>

                {order.courierName && (
                  <p>
                    <strong>Courier:</strong>{" "}
                    {order.courierName}
                  </p>
                )}

                {order.trackingNumber && (
                  <p>
                    <strong>Tracking Number:</strong>{" "}
                    {order.trackingNumber}
                  </p>
                )}

              </div>
            )}

          </div>

          {/* Products */}

          <div className="order-detail-card">

            <h2>Ordered Items</h2>

            <div className="ordered-products">

              {order.items?.map((item, index) => {

                const productName =
                  item.productName ||
                  item.product?.productName ||
                  "Product";

                const price =
                  Number(item.salePrice) > 0
                    ? item.salePrice
                    : item.price;

                return (
                  <div
                    className="ordered-product"
                    key={item._id || index}
                  >

                    <img
                      src={getImage(item)}
                      alt={productName}
                      onError={(e) => {
                        e.currentTarget.src =
                          "/img/category-default.jpg";
                      }}
                    />

                    <div className="ordered-product-info">

                      <h3>{productName}</h3>

                      <p>
                        Quantity: {item.quantity}
                      </p>

                      <p>
                        Price: {formatPrice(price)}
                      </p>

                    </div>

                    <strong>
                      {formatPrice(
                        item.total ||
                          Number(price) *
                            Number(item.quantity || 1)
                      )}
                    </strong>

                  </div>
                );
              })}

            </div>

          </div>

          {/* Delivery Address */}

          <div className="order-detail-card">

            <h2>Delivery Address</h2>

            <div className="delivery-address">

              <h3>
                {order.shippingAddress?.name ||
                  order.customerName}
              </h3>

              <p>
                {order.shippingAddress?.address}
              </p>

              <p>
                {order.shippingAddress?.city},{" "}
                {order.shippingAddress?.state}
              </p>

              <p>
                PIN Code:{" "}
                {order.shippingAddress?.pincode}
              </p>

              <p>
                Phone:{" "}
                {order.shippingAddress?.phone ||
                  order.phone}
              </p>

            </div>

          </div>

        </div>

        {/* Right Sidebar */}

        <div className="order-details-sidebar">

          {/* Price Summary */}

          <div className="order-detail-card">

            <h2>Price Details</h2>

            <div className="price-summary-row">
              <span>Subtotal</span>

              <strong>
                {formatPrice(order.subtotal)}
              </strong>
            </div>

            <div className="price-summary-row">
              <span>Shipping</span>

              <strong>
                {Number(order.shippingCharge || 0) === 0
                  ? "FREE"
                  : formatPrice(order.shippingCharge)}
              </strong>
            </div>

            <div className="price-summary-row">
              <span>Discount</span>

              <strong>
                -{formatPrice(order.discount)}
              </strong>
            </div>

            <div className="price-summary-divider"></div>

            <div className="price-summary-total">
              <span>Total Amount</span>

              <strong>
                {formatPrice(order.totalAmount)}
              </strong>
            </div>

          </div>

          {/* Payment Details */}

          <div className="order-detail-card">

            <h2>Payment Details</h2>

            <div className="payment-detail-row">
              <span>Payment Method</span>

              <strong>
                {order.paymentMethod || "OTHER"}
              </strong>
            </div>

            <div className="payment-detail-row">
              <span>Payment Status</span>

              <strong
                className={`payment-status ${getStatusClass(
                  order.paymentStatus
                )}`}
              >
                {order.paymentStatus || "Pending"}
              </strong>
            </div>

          </div>

          {/* Customer Details */}

          <div className="order-detail-card">

            <h2>Customer Details</h2>

            <div className="customer-detail-row">
              <span>Name</span>

              <strong>
                {order.customerName}
              </strong>
            </div>

            <div className="customer-detail-row">
              <span>Email</span>

              <strong>
                {order.email || "-"}
              </strong>
            </div>

            <div className="customer-detail-row">
              <span>Phone</span>

              <strong>
                {order.phone || "-"}
              </strong>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default OrderDetails;