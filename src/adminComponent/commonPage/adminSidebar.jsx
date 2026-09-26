import React, { useState } from "react";
import { NavLink } from "react-router-dom";

const EcommerceSideBar = () => {
  const [collapseStates, setCollapseStates] = useState({
    catalog: false,
    orders: false,
    customers: false,
    inventory: false,
    promotions: false,
    payments: false,
    reports: false,
    cms: false,
    settings: false,
  });

  const toggleCollapse = (section) => {
    setCollapseStates((prevState) => ({
      ...prevState,
      [section]: !prevState[section],
    }));
  };

  return (
    <>
      <div className="sidebar" data-background-color="dark">
        {/* ================= LOGO ================= */}
        <div className="sidebar-logo">
          <div className="logo-header" data-background-color="dark">
            <NavLink to="/admin" className="logo">
              <img
                src="/assets/img/kaiadmin/logo_light.svg"
                alt="E-Commerce"
                className="navbar-brand"
                height="20"
              />
            </NavLink>

            <div className="nav-toggle">
              <button className="btn btn-toggle toggle-sidebar" type="button">
                <i className="gg-menu-right"></i>
              </button>

              <button className="btn btn-toggle sidenav-toggler" type="button">
                <i className="gg-menu-left"></i>
              </button>
            </div>

            <button className="topbar-toggler more" type="button">
              <i className="gg-more-vertical-alt"></i>
            </button>
          </div>
        </div>

        {/* ================= SIDEBAR WRAPPER ================= */}
        <div className="sidebar-wrapper scrollbar scrollbar-inner">
          <div className="sidebar-content">
            <ul className="nav nav-secondary">
              {/* ================= DASHBOARD ================= */}

              <li className="nav-item">
                <NavLink to="/admin/dashboard" className="nav-link">
                  <i className="fas fa-home"></i>

                  <p>Dashboard</p>
                </NavLink>
              </li>

              {/* ================= E-COMMERCE ================= */}

              <li className="nav-section">
                <span className="sidebar-mini-icon">
                  <i className="fa fa-ellipsis-h"></i>
                </span>

                <h4 className="text-section">E-Commerce</h4>
              </li>

              {/* ================= CATALOG ================= */}

              <li className="nav-item">
                <a
                  href="#catalog"
                  onClick={(e) => {
                    e.preventDefault();
                    toggleCollapse("catalog");
                  }}
                  aria-expanded={collapseStates.catalog}
                  className={collapseStates.catalog ? "" : "collapsed"}
                >
                  <i className="fas fa-box"></i>

                  <p>Catalog</p>

                  <span className="caret"></span>
                </a>

                <div
                  className={`collapse ${collapseStates.catalog ? "show" : ""}`}
                >
                  <ul className="nav nav-collapse">
                    <li>
                      <NavLink to="/admin/products">
                        <span className="sub-item">Products</span>
                      </NavLink>
                    </li>

                    <li>
                      <NavLink to="/admin/products/add">
                        <span className="sub-item">Add Product</span>
                      </NavLink>
                    </li>

                    <li>
                      <NavLink to="/admin/categories">
                        <span className="sub-item">Categories</span>
                      </NavLink>
                    </li>

                    <li>
                      <NavLink to="/admin/subcategories">
                        <span className="sub-item">Sub Categories</span>
                      </NavLink>
                    </li>

                    <li>
                      <NavLink to="/admin/brands">
                        <span className="sub-item">Brands</span>
                      </NavLink>
                    </li>
                  </ul>
                </div>
              </li>

              {/* ================= ORDERS ================= */}

              <li className="nav-item">
                <a
                  href="#orders"
                  onClick={(e) => {
                    e.preventDefault();
                    toggleCollapse("orders");
                  }}
                  aria-expanded={collapseStates.orders}
                  className={collapseStates.orders ? "" : "collapsed"}
                >
                  <i className="fas fa-shopping-cart"></i>

                  <p>Orders</p>

                  <span className="caret"></span>
                </a>

                <div
                  className={`collapse ${collapseStates.orders ? "show" : ""}`}
                >
                  <ul className="nav nav-collapse">
                    <li>
                      <NavLink to="/admin/orders">
                        <span className="sub-item">All Orders</span>
                      </NavLink>
                    </li>

                    <li>
                      <NavLink to="/admin/orders/pending">
                        <span className="sub-item">Pending Orders</span>
                      </NavLink>
                    </li>

                    <li>
                      <NavLink to="/admin/orders/processing">
                        <span className="sub-item">Processing Orders</span>
                      </NavLink>
                    </li>

                    <li>
                      <NavLink to="/admin/orders/shipped">
                        <span className="sub-item">Shipped Orders</span>
                      </NavLink>
                    </li>

                    <li>
                      <NavLink to="/admin/orders/delivered">
                        <span className="sub-item">Delivered Orders</span>
                      </NavLink>
                    </li>

                    <li>
                      <NavLink to="/admin/orders/cancelled">
                        <span className="sub-item">Cancelled Orders</span>
                      </NavLink>
                    </li>
                  </ul>
                </div>
              </li>

              {/* ================= CUSTOMERS ================= */}

              <li className="nav-item">
                <a
                  href="#customers"
                  onClick={(e) => {
                    e.preventDefault();
                    toggleCollapse("customers");
                  }}
                  aria-expanded={collapseStates.customers}
                  className={collapseStates.customers ? "" : "collapsed"}
                >
                  <i className="fas fa-users"></i>

                  <p>Customers</p>

                  <span className="caret"></span>
                </a>

                <div
                  className={`collapse ${
                    collapseStates.customers ? "show" : ""
                  }`}
                >
                  <ul className="nav nav-collapse">
                    <li>
                      <NavLink to="/admin/customers">
                        <span className="sub-item">Customer List</span>
                      </NavLink>
                    </li>

                    <li>
                      <NavLink to="/admin/customer-reviews">
                        <span className="sub-item">Customer Reviews</span>
                      </NavLink>
                    </li>
                  </ul>
                </div>
              </li>

              {/* ================= INVENTORY ================= */}

              <li className="nav-item">
                <a
                  href="#inventory"
                  onClick={(e) => {
                    e.preventDefault();
                    toggleCollapse("inventory");
                  }}
                  aria-expanded={collapseStates.inventory}
                  className={collapseStates.inventory ? "" : "collapsed"}
                >
                  <i className="fas fa-warehouse"></i>

                  <p>Inventory</p>

                  <span className="caret"></span>
                </a>

                <div
                  className={`collapse ${
                    collapseStates.inventory ? "show" : ""
                  }`}
                >
                  <ul className="nav nav-collapse">
                    <li>
                      <NavLink to="/admin/inventory">
                        <span className="sub-item">Stock Management</span>
                      </NavLink>
                    </li>

                    <li>
                      <NavLink to="/admin/inventory/low-stock">
                        <span className="sub-item">Low Stock Products</span>
                      </NavLink>
                    </li>
                  </ul>
                </div>
              </li>

              {/* ================= PROMOTIONS ================= */}

              <li className="nav-item">
                <a
                  href="#promotions"
                  onClick={(e) => {
                    e.preventDefault();
                    toggleCollapse("promotions");
                  }}
                  aria-expanded={collapseStates.promotions}
                  className={collapseStates.promotions ? "" : "collapsed"}
                >
                  <i className="fas fa-tags"></i>

                  <p>Promotions</p>

                  <span className="caret"></span>
                </a>

                <div
                  className={`collapse ${
                    collapseStates.promotions ? "show" : ""
                  }`}
                >
                  <ul className="nav nav-collapse">
                    <li>
                      <NavLink to="/admin/coupons">
                        <span className="sub-item">Coupons</span>
                      </NavLink>
                    </li>

                    <li>
                      <NavLink to="/admin/discounts">
                        <span className="sub-item">Discounts</span>
                      </NavLink>
                    </li>

                    <li>
                      <NavLink to="/admin/banners">
                        <span className="sub-item">Banners</span>
                      </NavLink>
                    </li>
                  </ul>
                </div>
              </li>

              {/* ================= PAYMENTS ================= */}

              <li className="nav-item">
                <a
                  href="#payments"
                  onClick={(e) => {
                    e.preventDefault();
                    toggleCollapse("payments");
                  }}
                  aria-expanded={collapseStates.payments}
                  className={collapseStates.payments ? "" : "collapsed"}
                >
                  <i className="fas fa-credit-card"></i>

                  <p>Payments</p>

                  <span className="caret"></span>
                </a>

                <div
                  className={`collapse ${
                    collapseStates.payments ? "show" : ""
                  }`}
                >
                  <ul className="nav nav-collapse">
                    <li>
                      <NavLink to="/admin/payments">
                        <span className="sub-item">Transactions</span>
                      </NavLink>
                    </li>

                    <li>
                      <NavLink to="/admin/payment-requests">
                        <span className="sub-item">Payment Requests</span>
                      </NavLink>
                    </li>

                    <li>
                      <NavLink to="/admin/refunds">
                        <span className="sub-item">Refunds</span>
                      </NavLink>
                    </li>
                  </ul>
                </div>
              </li>

              {/* ================= REPORTS ================= */}

              <li className="nav-item">
                <a
                  href="#reports"
                  onClick={(e) => {
                    e.preventDefault();
                    toggleCollapse("reports");
                  }}
                  aria-expanded={collapseStates.reports}
                  className={collapseStates.reports ? "" : "collapsed"}
                >
                  <i className="fas fa-chart-bar"></i>

                  <p>Reports</p>

                  <span className="caret"></span>
                </a>

                <div
                  className={`collapse ${collapseStates.reports ? "show" : ""}`}
                >
                  <ul className="nav nav-collapse">
                    <li>
                      <NavLink to="/admin/reports/sales">
                        <span className="sub-item">Sales Report</span>
                      </NavLink>
                    </li>

                    <li>
                      <NavLink to="/admin/reports/products">
                        <span className="sub-item">Product Report</span>
                      </NavLink>
                    </li>

                    <li>
                      <NavLink to="/admin/reports/customers">
                        <span className="sub-item">Customer Report</span>
                      </NavLink>
                    </li>
                  </ul>
                </div>
              </li>

              {/* ================= CMS ================= */}

              <li className="nav-item">
                <a
                  href="#cms"
                  onClick={(e) => {
                    e.preventDefault();
                    toggleCollapse("cms");
                  }}
                  aria-expanded={collapseStates.cms}
                  className={collapseStates.cms ? "" : "collapsed"}
                >
                  <i className="fas fa-file-alt"></i>

                  <p>CMS</p>

                  <span className="caret"></span>
                </a>

                <div className={`collapse ${collapseStates.cms ? "show" : ""}`}>
                  <ul className="nav nav-collapse">
                    <li>
                      <NavLink to="/admin/cms/home">
                        <span className="sub-item">Home Page</span>
                      </NavLink>
                    </li>

                    <li>
                      <NavLink to="/admin/cms/about">
                        <span className="sub-item">About Us</span>
                      </NavLink>
                    </li>

                    <li>
                      <NavLink to="/admin/cms/contact">
                        <span className="sub-item">Contact</span>
                      </NavLink>
                    </li>

                    <li>
                      <NavLink to="/admin/cms/faq">
                        <span className="sub-item">FAQ</span>
                      </NavLink>
                    </li>

                    <li>
                      <NavLink to="/admin/cms/footer">
                        <span className="sub-item">Footer</span>
                      </NavLink>
                    </li>
                  </ul>
                </div>
              </li>

              {/* ================= SYSTEM ================= */}

              <li className="nav-section">
                <span className="sidebar-mini-icon">
                  <i className="fa fa-ellipsis-h"></i>
                </span>

                <h4 className="text-section">System</h4>
              </li>

              {/* ================= SETTINGS ================= */}

              <li className="nav-item">
                <a
                  href="#settings"
                  onClick={(e) => {
                    e.preventDefault();
                    toggleCollapse("settings");
                  }}
                  aria-expanded={collapseStates.settings}
                  className={collapseStates.settings ? "" : "collapsed"}
                >
                  <i className="fas fa-cogs"></i>

                  <p>Settings</p>

                  <span className="caret"></span>
                </a>

                <div
                  className={`collapse ${
                    collapseStates.settings ? "show" : ""
                  }`}
                >
                  <ul className="nav nav-collapse">
                    <li>
                      <NavLink to="/admin/setting/site">
                        <span className="sub-item">Site Settings</span>
                      </NavLink>
                    </li>

                    <li>
                      <NavLink to="/admin/setting/social_media">
                        <span className="sub-item">Social Media</span>
                      </NavLink>
                    </li>
                    <li>
                      <NavLink to="/admin/setting/footer">
                        <span className="sub-item">footer Setting</span>
                      </NavLink>
                    </li>
                       <li>
                      <NavLink to="/admin/HeaderSettings">
                        <span className="sub-item">Header Setting</span>
                      </NavLink>
                    </li>
                    <li>
                      <NavLink to="/admin/setting/banner">
                        <span className="sub-item">Banner Setting</span>
                      </NavLink>
                    </li>
                    <li>
                      <NavLink to="/admin/settings/admin-profile">
                        <span className="sub-item">Admin Profile</span>
                      </NavLink>
                    </li>
                  </ul>
                </div>
              </li>

              {/* ================= SUPPORT ================= */}

              <li className="nav-item">
                <NavLink to="/admin/support" className="nav-link">
                  <i className="fas fa-headset"></i>

                  <p>Support</p>
                </NavLink>
              </li>

              {/* ================= LOGOUT ================= */}

              <li className="nav-item">
                <NavLink to="/logout" className="nav-link">
                  <i className="fas fa-sign-out-alt"></i>

                  <p>Logout</p>
                </NavLink>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default EcommerceSideBar;
