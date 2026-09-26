import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import {
  GetContactDetailsData,
  updateContactDetailsData,
} from "../../../services/contactService";

const ContactData = () => {
  const [formData, setFormData] = useState({
    _id: "",
    address_name: "",
    address_link: "",
    mob_no: "",
    email: "",
    iframe_link: "",
  });

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      const response = await GetContactDetailsData();
      const data = response.contact_Data[0];

      setFormData({
        _id: data._id,
        address_name: data.address_name || "",
        address_link: data.address_link || "",
        mob_no: data.mob_no || "",
        email: data.email || "",
        iframe_link: data.iframe_link || "",
      });
    } catch (error) {
      console.error("Error fetching contact details settings: ", error);
      Swal.fire({
        title: "Error!",
        text: "Unable to fetch contact details. Please try again later.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const fetchData = async (e) => {
    e.preventDefault();
    const form = new FormData();
    for (const key in formData) {
      form.append(key, formData[key]);
    }

    try {

      const response = await updateContactDetailsData(formData);
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
            <a href="#">CMS</a>
          </li>
          <li className="separator">
            <i className="icon-arrow-right"></i>
          </li>
          <li className="nav-item">
            <a href="#">Contact Data Management</a>
          </li>
        </ul>
      </div>
      <div className="row">
        <div className="col-md-12 mt-2">
          <div className="card">
            <div className="card-header">
              <div className="card-title">Contact Elements</div>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6">
                  <div className="form-group">
                    <label>Mobile Number</label>
                    <input
                      type="text"
                      className="form-control"
                      name="mob_no"
                      value={formData.mob_no}
                      onChange={handleChange}
                      placeholder="Enter Mobile No."
                    />
                  </div>
                  <div className="form-group">
                    <label>Email</label>
                    <input
                      type="email"
                      className="form-control"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter Email"
                    />
                  </div>
                  <div className="form-group">
                    <label>Address Name</label>
                    <input
                      type="text"
                      className="form-control"
                      name="address_name"
                      value={formData.address_name}
                      onChange={handleChange}
                      placeholder="Enter Address Name"
                    />
                  </div>
                  <div className="form-group">
                    <label>Address Link</label>
                    <input
                      type="text"
                      className="form-control"
                      name="address_link"
                      value={formData.address_link}
                      onChange={handleChange}
                      placeholder="Enter Address Link"
                    />
                  </div>
                  <div className="form-group">
                    <label>Iframe Link</label>
                    <input
                      type="text"
                      className="form-control"
                      name="iframe_link"
                      value={formData.iframe_link}
                      onChange={handleChange}
                      placeholder="Enter Iframe Link"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="card-action">
              <button className="btn btn-success btn-lg ms-5" onClick={fetchData}>
                Submit
              </button>
              <button
                className="btn btn-danger btn-lg ms-5"
                onClick={() =>
                  setFormData({
                    address_name: "",
                    address_link: "",
                    mob_no: "",
                    email: "",
                    iframe_link: "",
                  })
                }
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ContactData;
