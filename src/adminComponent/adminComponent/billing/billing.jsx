import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import {
  GetBillingDetailsData,
  updateBillingDetailsData,
} from "../../../services/billingService";
import { baseURL } from "../../../services/apiService";

const BillingData = () => {
  const [formData, setFormData] = useState({
    _id: "",
    bank_name: "",
    acccount_holder: "",
    account_number: "",
    ifsc_code: "",
    branch_name: "",
    qrcode: null,
  });

  const [originalQrCode, setOriginalQrCode] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    setLoading(true);
    try {
      const response = await GetBillingDetailsData();
      const data = response.billing_Data[0];

      // Set original QR code URL correctly
      setFormData({
        _id: data._id,
        bank_name: data.bank_name || "",
        acccount_holder: data.acccount_holder || "",
        account_number: data.account_number || "",
        ifsc_code: data.ifsc_code || "",
        branch_name: data.branch_name || "",
        qrcode: data.qrcode || null,
      });

      if (data.qrcode) {
        setOriginalQrCode(`${baseURL}/${data.qrcode}`); // Set the original QR code URL
      }
    } catch (error) {
      console.error("Error fetching billing details: ", error);
      Swal.fire({
        title: "Error!",
        text: "Unable to fetch billing details. Please try again later.",
        icon: "error",
        confirmButtonText: "OK",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleQrCodeChange = (e) => {
    const { files } = e.target;
    const file = files[0];

    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setOriginalQrCode(imageUrl); // Set temporary URL for preview
      setFormData((prevData) => ({
        ...prevData,
        qrcode: file, // Store the file object for uploading
      }));
    }
  };

  const fetchData = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const form = new FormData();
      for (const key in formData) {
        form.append(key, formData[key]);
      }

      const response = await updateBillingDetailsData(form);
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
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>

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
        <a href="#">Billing Management</a>
      </li>
    </ul>
  </div>
      <div className="row">
        <div className="col-md-12 mt-2">
          <div className="card">
            <div className="card-header">
              <div className="card-title">Billing Details</div>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6">
                  {[
                    { label: "Bank Name", name: "bank_name" },
                    { label: "Account Holder", name: "acccount_holder" },
                    { label: "Account Number", name: "account_number" },
                    { label: "IFSC Code", name: "ifsc_code" },
                    { label: "Branch Name", name: "branch_name" },
                  ].map(({ label, name }) => (
                    <div className="form-group" key={name}>
                      <label>{label}</label>
                      <input
                        type="text"
                        className="form-control"
                        name={name}
                        value={formData[name]}
                        onChange={handleChange}
                        placeholder={`Enter ${label}`}
                      />
                    </div>
                  ))}
                  <div className="form-group">
                    <label>QR Code</label>
                    <input
                      type="file"
                      className="form-control"
                      accept="image/*"
                      onChange={handleQrCodeChange}
                    />
                    {originalQrCode && (
                      <img
                        src={originalQrCode}
                        alt="QR Code"
                        style={{ maxWidth: "100px", marginBottom: "10px" }}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="card-action">
              <button
                className="btn btn-success btn-lg ms-5"
                onClick={fetchData}
                disabled={loading}
              >
                {loading ? "Submitting..." : "Submit"}
              </button>
              <button
                className="btn btn-danger btn-lg ms-5"
                onClick={() => {
                  setFormData({
                    _id: "",
                    bank_name: "",
                    acccount_holder: "",
                    account_number: "",
                    ifsc_code: "",
                    branch_name: "",
                    qrcode: null,
                  });
                  setOriginalQrCode(null);
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillingData;
