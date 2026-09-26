import React, { useEffect, useState } from "react";

import { Link } from "react-router-dom";

import { getSiteData } from "../../services/siteService";
import { getCategories } from "../../services/categoryService";
import { GetHeaderSettings } from "../../services/headerService";

import "../../ecommerce.css";
import { GetCartCount } from "../../services/cartServices";
import { GetWishlistCount } from "../../services/wishlistServices";

const Header = () => {
  const [formData, setFormData] = useState({});
  const [menuOpen, setMenuOpen] = useState(false);

  const [categories, setCategories] = useState([]);

  const [headerSettings, setHeaderSettings] = useState({});

  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);

  const [loading, setLoading] = useState(true);

  // Fetch All Header Data
  useEffect(() => {
    fetchHeaderData();

    const handleCartUpdate = () => {
      fetchCartCount();
    };

    const handleWishlistUpdate = () => {
      fetchWishlistCount();
    };

    window.addEventListener("cartUpdated", handleCartUpdate);
    window.addEventListener("wishlistUpdated", handleWishlistUpdate);

    return () => {
      window.removeEventListener("cartUpdated", handleCartUpdate);
      window.removeEventListener("wishlistUpdated", handleWishlistUpdate);
    };
  }, []);

  const fetchHeaderData = async () => {
    setLoading(true);

    await Promise.allSettled([
      fetchSiteData(),
      fetchCategories(),
      fetchHeaderSettings(),
      fetchCartCount(),
      fetchWishlistCount(),
    ]);

    setLoading(false);
  };

  // Site Data
  const fetchSiteData = async () => {
    try {
      const response = await getSiteData();

      setFormData(response.site_Data || {});
    } catch (error) {
      console.error("Site Data Error:", error);
    }
  };

  // Dynamic Categories
  const fetchCategories = async () => {
    try {
      const response = await getCategories();

      const data = response.data || [];

      setCategories(
        data.filter((item) => Number(item.status) === 1 || item.status === "1"),
      );
    } catch (error) {
      console.error("Category Error:", error);
    }
  };

  // Dynamic Announcement
  const fetchHeaderSettings = async () => {
    try {
      const response = await GetHeaderSettings();

      setHeaderSettings(response.data || {});
    } catch (error) {
      console.error("Header Settings Error:", error);
    }
  };

  // Cart Count
  const fetchCartCount = async () => {
    const token = localStorage.getItem("authTokenUser");

    if (!token) {
      setCartCount(0);
      return;
    }

    try {
      const response = await GetCartCount();

      setCartCount(Number(response.count || 0));
    } catch (error) {
      console.error("Cart Count Error:", error);
    }
  };

  // Wishlist Count
  const fetchWishlistCount = async () => {
    const token = localStorage.getItem("authTokenUser");

    if (!token) {
      setWishlistCount(0);
      return;
    }

    try {
      const response = await GetWishlistCount();

      setWishlistCount(Number(response.count || 0));
    } catch (error) {
      console.error("Wishlist Count Error:", error);
    }
  };

  // Close Mobile Menu
  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <header className="shop-header">
      {/* Announcement Bar */}
      <div className="announcement-bar">
        {headerSettings.shippingEnabled && (
          <div>🚀 {headerSettings.shippingText}</div>
        )}

        {headerSettings.couponEnabled && <div>{headerSettings.couponText}</div>}

        {headerSettings.returnEnabled && <div>{headerSettings.returnText}</div>}
      </div>

      {/* Main Header */}
      <div className="main-header">
        <div className="header-container">
          {/* Mobile Menu */}
          <button
            className="mobile-menu-btn"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            ☰
          </button>

          {/* Logo */}
          <Link to="/" className="shop-logo">
            <img
              src={formData?.site_logo || "/img/Jasnathlogopdf_1.JPG"}
              alt={formData?.site_name || "Website Logo"}
            />

            <div className="logo-text">
              <span>{formData?.site_name || "THE NARI HOUSE"}</span>
            </div>
          </Link>

          {/* Dynamic Navigation */}
          <nav className={`shop-navigation ${menuOpen ? "open" : ""}`}>
            <Link to="/" onClick={closeMenu}>
              New Arrivals
            </Link>

            {categories.map((category) => (
              <Link
                key={category._id}
                to={`/products?category=${category._id}`}
                onClick={closeMenu}
              >
                {category.name}
              </Link>
            ))}

            <Link to="/sale" className="sale-link" onClick={closeMenu}>
              Sale
            </Link>
          </nav>

          {/* Header Actions */}
          <div className="header-actions">
            <button className="header-icon" aria-label="Search">
              <i className="bi bi-search"></i>
            </button>

            <Link to="/login-User" className="header-icon" aria-label="Account">
              <i className="bi bi-person"></i>
            </Link>

            {/* Wishlist */}
            <Link
              to="/wishlist"
              className="header-icon header-count-wrapper"
              aria-label="Wishlist"
            >
              <i className="bi bi-heart"></i>

              {wishlistCount > 0 && (
                <span className="header-count">{wishlistCount}</span>
              )}
            </Link>

            {/* Cart */}
            <Link to="/cart" className="cart-button">
              <i className="bi bi-bag"></i>

              <span>Cart</span>

              {cartCount > 0 && <small>{cartCount}</small>}
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {menuOpen && (
        <div className="mobile-navigation">
          <Link to="/" onClick={closeMenu}>
            New Arrivals
          </Link>

          {categories.map((category) => (
            <Link
              key={category._id}
              to={`/products?category=${category._id}`}
              onClick={closeMenu}
            >
              {category.name}
            </Link>
          ))}

          <Link to="/sale" onClick={closeMenu}>
            Sale
          </Link>
        </div>
      )}
    </header>
  );
};

export default Header;
