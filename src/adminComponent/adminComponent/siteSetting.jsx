import { useState, useEffect } from "react";
import { getSiteData, PutSiteData } from "../../services/siteService";
import Swal from "sweetalert2";
import { baseURL } from "../../services/apiService";

const SiteSetting = () => {
  const [selectedFavicon, setSelectedFavicon] = useState(null);
  const [selectedSiteLogo, setSelectedSiteLogo] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    site_name: "",
    site_logo: null,
    favicon: null,
    email: "",
    mobile_no: "",
    Address: "",
  });

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      const response = await getSiteData();
      const data = response.site_Data;
      setFormData({
        ...formData,
        _id: data._id,
        title: data.title || "",
        site_name: data.site_name || "",
        email: data.email || "",
        mobile_no: data.mobile_no || "",
        Address: data.Address || "",
        site_logo: data.site_logo || "",
        favicon: data.favicon || "",
      });
    } catch (error) {
      console.error("Error fetching site settings: ", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    const file = files[0];
    if (name === "favicon") {
      const imageUrl = URL.createObjectURL(file);
      setSelectedFavicon(imageUrl);
    }
    if (name === "site_logo") {
      const imageUrl = URL.createObjectURL(file);
      setSelectedSiteLogo(imageUrl);
    }
    setFormData((prevData) => ({
      ...prevData,
      [name]: file,
    }));
  };

  const fetchData = async (e) => {
    e.preventDefault();
    const form = new FormData();

    if (formData.favicon) {
      form.append("favicon", formData.favicon);
    }
    if (formData.site_logo) {
      form.append("site_logo", formData.site_logo);
    }
    for (const key in formData) {
      if (key !== "favicon" && key !== "site_logo") {
        form.append(key, formData[key]);
      }
    }

    try {
      const response = await PutSiteData(form);
      if (response?.status === 200) {
        Swal.fire({
          title: "Success!",
          text: "Your data has been updated successfully!",
          icon: "success",
          confirmButtonText: "Done",
        });
      } else {
        Swal.fire({
          title: "Error!",
          text: "Something went wrong. Please try again.",
          icon: "error",
          confirmButtonText: "Retry",
        });
      }
    } catch (error) {
      console.error("Error submitting data:", error);
      Swal.fire({
        title: "Error!",
        text: "An error occurred while submitting the data. Please try again later.",
        icon: "error",
        confirmButtonText: "Retry",
      });
    }
  };

  return (
    <>
      <div>
        <h3 className="fw-bold mb-3">Setting</h3>
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
            <a href="#">Setting</a>
          </li>
          <li className="separator">
            <i className="icon-arrow-right"></i>
          </li>
          <li className="nav-item">
            <a href="#">Site</a>
          </li>
        </ul>
      </div>
      <div className="row">
        <div className="col-md-12 mt-2">
          <div className="card">
            <div className="card-header">
              <div className="card-title">Site Elements</div>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6">
                  <label>Site Logo:</label>
                  {selectedSiteLogo ? (
                    <img
                      src={selectedSiteLogo}
                      alt="Selected Site Logo"
                      style={{ maxWidth: "100px", marginBottom: "10px" }}
                    />
                  ) : (
                    formData?.site_logo && (
                      <img
                        src={formData?.site_logo}
                        alt="Site Logo"
                        style={{
                          maxWidth: "100px",
                          marginBottom: "10px",
                          height: "100px",
                        }}
                      />
                    )
                  )}
                  <input
                    type="file"
                    name="site_logo"
                    className="form-control"
                    onChange={handleFileChange}
                  />
                  <div className="form-group">
                    <label>Site Name</label>
                    <input
                      type="text"
                      className="form-control"
                      name="site_name"
                      value={formData.site_name}
                      onChange={handleChange}
                      placeholder="Enter Site Name"
                    />
                  </div>
                  <div className="form-group">
                    <label>Site Title</label>
                    <input
                      type="text"
                      className="form-control"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      placeholder="Enter Site Title Name"
                    />
                  </div>
                  <div className="form-group">
                    <label>Email Address</label>
                    <input
                      type="email"
                      className="form-control"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter Email"
                    />
                  </div>
                </div>

                <div className="col-md-6">
                  <label>Site Favicon:</label>
                  {selectedFavicon ? (
                    <img
                      src={selectedFavicon}
                      alt="Selected Favicon"
                      style={{ maxWidth: "100px", marginBottom: "10px" }}
                    />
                  ) : (
                    formData?.favicon && (
                      <img
                        src={formData?.favicon}
                        alt="Site Favicon"
                        style={{
                          maxWidth: "100px",
                          marginBottom: "10px",
                        }}
                      />
                    )
                  )}
                  <input
                    type="file"
                    name="favicon"
                    className="form-control"
                    onChange={handleFileChange}
                  />
                  <div className="form-group">
                    <label>Mobile Number</label>
                    <input
                      type="text"
                      className="form-control"
                      name="mobile_no"
                      value={formData.mobile_no}
                      onChange={handleChange}
                      placeholder="Enter Mobile No."
                    />
                  </div>
                  {/* <div className="form-group">
                    <label>Address</label>
                    <textarea
                      className="form-control"
                      name="address"
                      value={formData.Address}
                      onChange={handleChange}
                      placeholder="Enter Address"
                    />
                  </div> */}
                  <div className="form-group">
                    <label>Address</label>
                    <textarea
                      className="form-control"
                      name="Address" // Change this to match the state key
                      value={formData.Address}
                      onChange={handleChange}
                      placeholder="Enter Address"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="card-action">
              <button
                className="btn btn-success btn-lg ms-5"
                onClick={fetchData}
              >
                Submit
              </button>
              <button className="btn btn-danger  btn-lg ms-5 ">Cancel</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SiteSetting;
