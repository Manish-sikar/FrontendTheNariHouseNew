import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import { GetMyOrdersData } from "../../services/orderServices";

import "./MyOrders.css";

const MyOrders = () => {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("All");

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

  const getStatusClass = (status) => {
    return String(status || "Pending")
      .toLowerCase()
      .replace(/\s+/g, "-");
  };

  const fetchOrders = async () => {
    try {
      setLoading(true);

      const response = await GetMyOrdersData();

      if (response?.success) {
        setOrders(response.data || []);
      } else {
        throw new Error(
          response?.message || "Unable to fetch orders"
        );
      }
    } catch (error) {
      console.error("Orders error:", error);

      Swal.fire(
        "Error",
        error?.response?.data?.message ||
          error.message ||
          "Unable to load orders",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Order Statistics
  const statistics = useMemo(() => {
    const total = orders.length;

    const placed = orders.filter((order) =>
      ["Pending", "Processing", "Shipped", "Delivered"].includes(
        order.status
      )
    ).length;

    const processing = orders.filter(
      (order) => order.status === "Processing"
    ).length;

    const shipped = orders.filter(
      (order) => order.status === "Shipped"
    ).length;

    const delivered = orders.filter(
      (order) => order.status === "Delivered"
    ).length;

    const cancelled = orders.filter(
      (order) => order.status === "Cancelled"
    ).length;

    const totalAmount = orders.reduce(
      (sum, order) => sum + Number(order.totalAmount || 0),
      0
    );

    return {
      total,
      placed,
      processing,
      shipped,
      delivered,
      cancelled,
      totalAmount,
    };
  }, [orders]);

  const filteredOrders = useMemo(() => {
    if (activeFilter === "All") {
      return orders;
    }

    if (activeFilter === "Placed") {
      return orders.filter((order) =>
        ["Pending", "Processing", "Shipped", "Delivered"].includes(
          order.status
        )
      );
    }

    return orders.filter(
      (order) => order.status === activeFilter
    );
  }, [orders, activeFilter]);

  if (loading) {
    return (
      <div className="orders-loading">
        <div className="orders-spinner"></div>
        <p>Loading your orders...</p>
      </div>
    );
  }

  return (
    <div className="my-orders-page">

      {/* Breadcrumb */}
      <div className="orders-breadcrumb">
        <Link to="/">Home</Link>
        <span>›</span>
        <span>My Orders</span>
      </div>

      {/* Header */}
      <div className="orders-header">
        <div>
          <h1>My Orders</h1>
          <p>Track and manage all your orders</p>
        </div>

        <Link to="/" className="continue-shopping-btn">
          Continue Shopping
        </Link>
      </div>

      {/* Statistics */}
      <div className="order-stats-grid">

        <div className="order-stat-card">
          <div className="stat-icon">📦</div>
          <div>
            <p>Total Orders</p>
            <h2>{statistics.total}</h2>
          </div>
        </div>

        <div className="order-stat-card">
          <div className="stat-icon">🛍️</div>
          <div>
            <p>Orders Placed</p>
            <h2>{statistics.placed}</h2>
          </div>
        </div>

        <div className="order-stat-card">
          <div className="stat-icon">🚚</div>
          <div>
            <p>Processing</p>
            <h2>{statistics.processing}</h2>
          </div>
        </div>

        <div className="order-stat-card">
          <div className="stat-icon">✅</div>
          <div>
            <p>Delivered</p>
            <h2>{statistics.delivered}</h2>
          </div>
        </div>

        <div className="order-stat-card">
          <div className="stat-icon">💰</div>
          <div>
            <p>Total Spent</p>
            <h2>{formatPrice(statistics.totalAmount)}</h2>
          </div>
        </div>

      </div>

      {/* Order Status Overview */}
      <div className="order-status-overview">

        <h2>Order Status</h2>

        <div className="status-overview-grid">

          <div>
            <span>Pending</span>
            <strong>
              {orders.filter(
                (order) => order.status === "Pending"
              ).length}
            </strong>
          </div>

          <div>
            <span>Processing</span>
            <strong>{statistics.processing}</strong>
          </div>

          <div>
            <span>Shipped</span>
            <strong>{statistics.shipped}</strong>
          </div>

          <div>
            <span>Delivered</span>
            <strong>{statistics.delivered}</strong>
          </div>

          <div>
            <span>Cancelled</span>
            <strong>{statistics.cancelled}</strong>
          </div>

        </div>

      </div>

      {/* Orders Section */}
      <div className="orders-list-section">

        <div className="orders-list-header">
          <h2>Your Orders</h2>

          <select
            value={activeFilter}
            onChange={(e) => setActiveFilter(e.target.value)}
          >
            <option value="All">All Orders</option>
            <option value="Placed">Placed Orders</option>
            <option value="Pending">Pending</option>
            <option value="Processing">Processing</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

        {filteredOrders.length === 0 ? (
          <div className="empty-orders">
            <div>📦</div>
            <h3>No Orders Found</h3>
            <p>You haven't placed any orders yet.</p>

            <Link to="/" className="shop-now-btn">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="orders-cards">

            {filteredOrders.map((order) => (

              <div className="order-card" key={order._id}>

                {/* Order Header */}
                <div className="order-card-header">

                  <div>
                    <span>Order Number</span>
                    <h3>
                      {order.orderNumber || order._id}
                    </h3>
                  </div>

                  <span
                    className={`order-status ${getStatusClass(
                      order.status
                    )}`}
                  >
                    {order.status || "Pending"}
                  </span>

                </div>

                {/* Order Details */}
                <div className="order-card-info">

                  <div>
                    <span>Order Date</span>
                    <strong>
                      {formatDate(order.createdAt)}
                    </strong>
                  </div>

                  <div>
                    <span>Items</span>
                    <strong>
                      {order.items?.reduce(
                        (sum, item) =>
                          sum + Number(item.quantity || 1),
                        0
                      ) || 0}{" "}
                      Items
                    </strong>
                  </div>

                  <div>
                    <span>Total Amount</span>
                    <strong className="order-amount">
                      {formatPrice(order.totalAmount)}
                    </strong>
                  </div>

                  <div>
                    <span>Payment</span>
                    <strong>
                      {order.paymentStatus || "Pending"}
                    </strong>
                  </div>

                </div>

                {/* Product Preview */}
                <div className="order-products-preview">

                  {order.items?.slice(0, 3).map((item, index) => (

                    <div
                      className="order-product-item"
                      key={item._id || index}
                    >

                      <img
                        src={
                          item.image ||
                          item.product?.images?.[0] ||
                          "/img/category-default.jpg"
                        }
                        alt={item.productName || "Product"}
                        onError={(e) => {
                          e.currentTarget.src =
                            "/img/category-default.jpg";
                        }}
                      />

                      <div>
                        <h4>
                          {item.productName ||
                            item.product?.productName ||
                            "Product"}
                        </h4>

                        <p>
                          Qty: {item.quantity || 1}
                        </p>

                        <strong>
                          {formatPrice(
                            item.total ||
                              item.price * item.quantity
                          )}
                        </strong>
                      </div>

                    </div>

                  ))}

                </div>

                {/* Footer */}
                <div className="order-card-footer">

                  <span>
                    {order.status === "Delivered"
                      ? "Your order has been delivered"
                      : order.status === "Cancelled"
                      ? "This order has been cancelled"
                      : "Track your order status"}
                  </span>

                  <button
                    onClick={() =>
                      navigate(`/orders/my-orders/${order._id}`)
                    }
                  >
                    View Details →
                  </button>

                </div>

              </div>

            ))}

          </div>
        )}

      </div>

    </div>
  );
};

export default MyOrders;