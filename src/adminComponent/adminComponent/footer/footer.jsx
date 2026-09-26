import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import {
  GetFooterDetailsData,
  updateFooterDetailsData,
} from "../../../services/footerService";

const ContactData = () => {
  const [formData, setFormData] = useState({
    _id: "",
    footer_title: "",
    footer_desc: "",
    footer_social_details: [],
    footer_our_services: [],
    footer_banking_services: [],
    footer_other_services: [],
    footer_address1: "",
    footer_address2: "",
    footer_email: "",
  });

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      const response = await GetFooterDetailsData();
      const data = response.footer_Data[0];

      setFormData({
        _id: data._id,
        footer_title: data.footer_title || "",
        footer_desc: data.footer_desc || "",
        footer_social_details: data.footer_social_details || [],
        footer_our_services: data.footer_our_services || [],
        footer_banking_services: data.footer_banking_services || [],
        footer_other_services: data.footer_other_services || [],
        footer_address1: data.footer_address1 || "",
        footer_address2: data.footer_address2 || "",
        footer_email: data.footer_email || "",
      });
    } catch (error) {
      console.error("Error fetching footer details: ", error);
      Swal.fire({
        title: "Error!",
        text: "Unable to fetch footer details. Please try again later.",
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

  const handleSocialChange = (index, e) => {
    const updatedSocialDetails = [...formData.footer_social_details];
    updatedSocialDetails[index][e.target.name] = e.target.value;
    setFormData((prevData) => ({
      ...prevData,
      footer_social_details: updatedSocialDetails,
    }));
  };

  const handleServiceChange = (index, e, serviceType) => {
    const updatedServices = [...formData[serviceType]];
    updatedServices[index][e.target.name] = e.target.value;
    setFormData((prevData) => ({
      ...prevData,
      [serviceType]: updatedServices,
    }));
  };

  const addSocialDetail = () => {
    setFormData((prevData) => ({
      ...prevData,
      footer_social_details: [
        ...prevData.footer_social_details,
        { icon_name: "", icon_url: "", icon_class: "" },
      ],
    }));
  };

  const removeSocialDetail = (index) => {
    const updatedSocialDetails = formData.footer_social_details.filter((_, i) => i !== index);
    setFormData((prevData) => ({
      ...prevData,
      footer_social_details: updatedSocialDetails,
    }));
  };

  const addService = (serviceType) => {
    setFormData((prevData) => ({
      ...prevData,
      [serviceType]: [
        ...prevData[serviceType],
        { service_name: "" },
      ],
    }));
  };

  const removeService = (index, serviceType) => {
    const updatedServices = formData[serviceType].filter((_, i) => i !== index);
    setFormData((prevData) => ({
      ...prevData,
      [serviceType]: updatedServices,
    }));
  };

  const fetchData = async (e) => {
    e.preventDefault();
    try {
      const response = await updateFooterDetailsData(formData);
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
        <h3 className="fw-bold mb-3">Footer Setting</h3>
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
            <a href="#">Footer</a>
          </li>
        </ul>
      </div>
      <div className="row">
        <div className="col-md-12 mt-2">
          <div className="card">
            <div className="card-header">
              <div className="card-title">Footer Elements</div>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6">
                  <div className="form-group">
                    <label>Footer Title</label>
                    <input
                      type="text"
                      className="form-control"
                      name="footer_title"
                      value={formData.footer_title}
                      onChange={handleChange}
                      placeholder="Enter Footer Title"
                    />
                  </div>
                  <div className="form-group">
                    <label>Footer Description</label>
                    <input
                      type="text"
                      className="form-control"
                      name="footer_desc"
                      value={formData.footer_desc}
                      onChange={handleChange}
                      placeholder="Enter Footer Description"
                    />
                  </div>
                  <div className="form-group">
                    <label>Footer Address 1</label>
                    <input
                      type="text"
                      className="form-control"
                      name="footer_address1"
                      value={formData.footer_address1}
                      onChange={handleChange}
                      placeholder="Enter Footer Address 1"
                    />
                  </div>
                  <div className="form-group">
                    <label>Footer Address 2</label>
                    <input
                      type="text"
                      className="form-control"
                      name="footer_address2"
                      value={formData.footer_address2}
                      onChange={handleChange}
                      placeholder="Enter Footer Address 2"
                    />
                  </div>
                  <div className="form-group">
                    <label>Footer Email</label>
                    <input
                      type="email"
                      className="form-control"
                      name="footer_email"
                      value={formData.footer_email}
                      onChange={handleChange}
                      placeholder="Enter Footer Email"
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <label>Footer Social Details</label>
                    {formData.footer_social_details.map((social, index) => (
                      <div key={index} className="d-flex mb-2">
                        <input
                          type="text"
                          className="form-control me-2"
                          name="icon_name"
                          value={social.icon_name}
                          onChange={(e) => handleSocialChange(index, e)}
                          placeholder="Social Icon Name"
                        />
                        <input
                          type="text"
                          className="form-control me-2"
                          name="icon_url"
                          value={social.icon_url}
                          onChange={(e) => handleSocialChange(index, e)}
                          placeholder="Social Icon URL"
                        />
                        <input
                          type="text"
                          className="form-control me-2"
                          name="icon_class"
                          value={social.icon_class}
                          onChange={(e) => handleSocialChange(index, e)}
                          placeholder="fab fa-instagram"
                        />
                        <button className="btn btn-danger" onClick={() => removeSocialDetail(index)}>
                          Remove
                        </button>
                      </div>
                    ))}
                    <button className="btn btn-primary mt-2" onClick={addSocialDetail}>
                      Add Social Detail
                    </button>
                  </div>

                  {/* Footer Our Services */}
                  <div className="form-group">
                    <label>Footer Our Services</label>
                    {formData.footer_our_services.map((service, index) => (
                      <div key={index} className="d-flex mb-2">
                        <input
                          type="text"
                          className="form-control me-2"
                          name="service_name"
                          value={service.service_name}
                          onChange={(e) => handleServiceChange(index, e, "footer_our_services")}
                          placeholder="Service Name"
                        />
                        <button className="btn btn-danger" onClick={() => removeService(index, "footer_our_services")}>
                          Remove
                        </button>
                      </div>
                    ))}
                    <button className="btn btn-primary mt-2" onClick={() => addService("footer_our_services")}>
                      Add Service
                    </button>
                  </div>

                  {/* Footer Banking Services */}
                  <div className="form-group">
                    <label>Footer Banking Services</label>
                    {formData.footer_banking_services.map((service, index) => (
                      <div key={index} className="d-flex mb-2">
                        <input
                          type="text"
                          className="form-control me-2"
                          name="service_name"
                          value={service.service_name}
                          onChange={(e) => handleServiceChange(index, e, "footer_banking_services")}
                          placeholder="Service Name"
                        />
                        <button className="btn btn-danger" onClick={() => removeService(index, "footer_banking_services")}>
                          Remove
                        </button>
                      </div>
                    ))}
                    <button className="btn btn-primary mt-2" onClick={() => addService("footer_banking_services")}>
                      Add Banking Service
                    </button>
                  </div>

                  {/* Footer Other Services */}
                  <div className="form-group">
                    <label>Footer Other Services</label>
                    {formData.footer_other_services.map((service, index) => (
                      <div key={index} className="d-flex mb-2">
                        <input
                          type="text"
                          className="form-control me-2"
                          name="service_name"
                          value={service.service_name}
                          onChange={(e) => handleServiceChange(index, e, "footer_other_services")}
                          placeholder="Service Name"
                        />
                        <button className="btn btn-danger" onClick={() => removeService(index, "footer_other_services")}>
                          Remove
                        </button>
                      </div>
                    ))}
                    <button className="btn btn-primary mt-2" onClick={() => addService("footer_other_services")}>
                      Add Other Service
                    </button>
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
                    footer_title: "",
                    footer_desc: "",
                    footer_social_details: [],
                    footer_our_services: [],
                    footer_banking_services: [],
                    footer_other_services: [],
                    footer_address1: "",
                    footer_address2: "",
                    footer_email: "",
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
