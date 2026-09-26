import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { GetHeaderSettings ,UpdateHeaderSettings} from "../../../services/headerService";

 

const HeaderSettings = () => {
  const [formData, setFormData] = useState({
    shippingText: "",
    couponText: "",
    returnText: "",

    shippingEnabled: true,
    couponEnabled: true,
    returnEnabled: true,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // =========================
  // GET DATA
  // =========================

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      setLoading(true);

      const response = await GetHeaderSettings();

      if (response?.success && response?.data) {
        const data = response.data;

        setFormData({
          shippingText: data.shippingText || "",
          couponText: data.couponText || "",
          returnText: data.returnText || "",

          shippingEnabled:
            data.shippingEnabled !== undefined
              ? data.shippingEnabled
              : true,

          couponEnabled:
            data.couponEnabled !== undefined
              ? data.couponEnabled
              : true,

          returnEnabled:
            data.returnEnabled !== undefined
              ? data.returnEnabled
              : true,
        });
      }
    } catch (error) {
      console.error("Header Settings Fetch Error:", error);

      Swal.fire({
        title: "Error!",
        text: "Unable to fetch header settings.",
        icon: "error",
        confirmButtonText: "OK",
      });
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // HANDLE INPUT
  // =========================

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // =========================
  // SUBMIT
  // =========================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      formData.shippingEnabled &&
      !formData.shippingText.trim()
    ) {
      Swal.fire({
        title: "Validation Error",
        text: "Please enter shipping announcement text.",
        icon: "warning",
      });

      return;
    }

    if (
      formData.couponEnabled &&
      !formData.couponText.trim()
    ) {
      Swal.fire({
        title: "Validation Error",
        text: "Please enter coupon announcement text.",
        icon: "warning",
      });

      return;
    }

    if (
      formData.returnEnabled &&
      !formData.returnText.trim()
    ) {
      Swal.fire({
        title: "Validation Error",
        text: "Please enter return announcement text.",
        icon: "warning",
      });

      return;
    }

    try {
      setSaving(true);

      const response = await UpdateHeaderSettings(formData);

      if (response?.success) {
        Swal.fire({
          title: "Success!",
          text: "Header settings updated successfully.",
          icon: "success",
          confirmButtonText: "Done",
        });
      } else {
        Swal.fire({
          title: "Error!",
          text:
            response?.message ||
            "Unable to update header settings.",
          icon: "error",
        });
      }
    } catch (error) {
      console.error("Update Header Settings Error:", error);

      Swal.fire({
        title: "Error!",
        text: "Something went wrong while updating header settings.",
        icon: "error",
        confirmButtonText: "OK",
      });
    } finally {
      setSaving(false);
    }
  };

  // =========================
  // RESET
  // =========================

  const handleReset = () => {
    getData();
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div
          className="spinner-border"
          role="status"
        >
          <span className="visually-hidden">
            Loading...
          </span>
        </div>

        <p className="mt-2">
          Loading header settings...
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Page Heading */}

      <div>
        <h3 className="fw-bold mb-3">
          Header Settings
        </h3>

        <ul className="breadcrumbs mb-3">
          <li className="nav-home">
            <a href="#">
              <i className="icon-home"></i>
            </a>
          </li>

          <li className="separator">
            <i className="icon-arrow-right"></i>
          </li>

          <li className="nav-item">
            <a href="#">
              CMS
            </a>
          </li>

          <li className="separator">
            <i className="icon-arrow-right"></i>
          </li>

          <li className="nav-item">
            <a href="#">
              Header
            </a>
          </li>
        </ul>
      </div>

      {/* Card */}

      <div className="row">
        <div className="col-md-12 mt-2">

          <div className="card">

            <div className="card-header">
              <div className="card-title">
                Header Announcement Settings
              </div>
            </div>

            <form onSubmit={handleSubmit}>

              <div className="card-body">

                {/* SHIPPING */}

                <div className="row mb-4">

                  <div className="col-md-8">

                    <div className="form-group">

                      <label>
                        Shipping Announcement
                      </label>

                      <input
                        type="text"
                        className="form-control"
                        name="shippingText"
                        value={formData.shippingText}
                        onChange={handleChange}
                        placeholder="Free Shipping on Orders Above ₹999"
                        disabled={!formData.shippingEnabled}
                      />

                    </div>

                  </div>

                  <div className="col-md-4">

                    <div className="form-group">

                      <label>
                        Status
                      </label>

                      <div className="form-check form-switch mt-2">

                        <input
                          className="form-check-input"
                          type="checkbox"
                          name="shippingEnabled"
                          checked={formData.shippingEnabled}
                          onChange={handleChange}
                          id="shippingEnabled"
                        />

                        <label
                          className="form-check-label"
                          htmlFor="shippingEnabled"
                        >
                          {formData.shippingEnabled
                            ? "Enabled"
                            : "Disabled"}
                        </label>

                      </div>

                    </div>

                  </div>

                </div>

                {/* COUPON */}

                <div className="row mb-4">

                  <div className="col-md-8">

                    <div className="form-group">

                      <label>
                        Coupon Announcement
                      </label>

                      <input
                        type="text"
                        className="form-control"
                        name="couponText"
                        value={formData.couponText}
                        onChange={handleChange}
                        placeholder="Use Code NAARI10 for 10% Off"
                        disabled={!formData.couponEnabled}
                      />

                    </div>

                  </div>

                  <div className="col-md-4">

                    <div className="form-group">

                      <label>
                        Status
                      </label>

                      <div className="form-check form-switch mt-2">

                        <input
                          className="form-check-input"
                          type="checkbox"
                          name="couponEnabled"
                          checked={formData.couponEnabled}
                          onChange={handleChange}
                          id="couponEnabled"
                        />

                        <label
                          className="form-check-label"
                          htmlFor="couponEnabled"
                        >
                          {formData.couponEnabled
                            ? "Enabled"
                            : "Disabled"}
                        </label>

                      </div>

                    </div>

                  </div>

                </div>

                {/* RETURN */}

                <div className="row mb-4">

                  <div className="col-md-8">

                    <div className="form-group">

                      <label>
                        Return Announcement
                      </label>

                      <input
                        type="text"
                        className="form-control"
                        name="returnText"
                        value={formData.returnText}
                        onChange={handleChange}
                        placeholder="Easy 15-Day Returns"
                        disabled={!formData.returnEnabled}
                      />

                    </div>

                  </div>

                  <div className="col-md-4">

                    <div className="form-group">

                      <label>
                        Status
                      </label>

                      <div className="form-check form-switch mt-2">

                        <input
                          className="form-check-input"
                          type="checkbox"
                          name="returnEnabled"
                          checked={formData.returnEnabled}
                          onChange={handleChange}
                          id="returnEnabled"
                        />

                        <label
                          className="form-check-label"
                          htmlFor="returnEnabled"
                        >
                          {formData.returnEnabled
                            ? "Enabled"
                            : "Disabled"}
                        </label>

                      </div>

                    </div>

                  </div>

                </div>

                {/* PREVIEW */}

                <div className="mt-4">

                  <label className="fw-bold mb-2">
                    Announcement Preview
                  </label>

                  <div
                    className="p-3 border rounded"
                    style={{
                      background: "#f8f9fa",
                    }}
                  >

                    <div className="d-flex flex-wrap gap-4">

                      {formData.shippingEnabled && (
                        <span>
                          🚀 {formData.shippingText}
                        </span>
                      )}

                      {formData.couponEnabled && (
                        <span>
                          {formData.couponText}
                        </span>
                      )}

                      {formData.returnEnabled && (
                        <span>
                          {formData.returnText}
                        </span>
                      )}

                    </div>

                  </div>

                </div>

              </div>

              {/* ACTIONS */}

              <div className="card-action">

                <button
                  type="submit"
                  className="btn btn-success btn-lg ms-5"
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                      ></span>

                      Saving...
                    </>
                  ) : (
                    "Submit"
                  )}
                </button>

                <button
                  type="button"
                  className="btn btn-danger btn-lg ms-5"
                  onClick={handleReset}
                  disabled={saving}
                >
                  Cancel
                </button>

              </div>

            </form>

          </div>

        </div>
      </div>
    </>
  );
};

export default HeaderSettings;