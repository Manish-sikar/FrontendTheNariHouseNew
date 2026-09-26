import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { UpdateUserApplyForm } from "../../../services/applyNewUserForm";

const EditUserApplyForm = ({ user, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    panCard: "",
    state: "",
    district: "",
    fullAddress: "",
    document1: null,
    document2: null,
    document3: null,
  });

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || "",
        email: user.email || "",
        phone: user.phone || "",
        panCard: user.panCard || "",
        state: user.state || "",
        district: user.district || "",
        fullAddress: user.fullAddress || "",
        document1: user?.document1 || null,
        document2: user?.document2 || null,
        document3: user?.document3 || null,
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files.length > 0) {
      setFormData((prev) => ({
        ...prev,
        [name]: files[0],
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSubmit = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value) {
        formDataToSubmit.append(key, value);
      }
    });

    try {
      const response = await UpdateUserApplyForm(user._id, formDataToSubmit);
      if (response.status === 200) {
        Swal.fire("Success!", "User details updated successfully!", "success");
        onUpdate();
        onClose();
      } else {
        throw new Error("Failed to update user details.");
      }
    } catch (error) {
      Swal.fire("Error!", "Failed to update details. Try again.", "error");
    }
  };

  return (
    <div
      className="modal show"
      style={{ display: "block", background: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Edit User Details</h5>
            <button className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  className="form-control"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Phone</label>
                <input
                  type="text"
                  className="form-control"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">PAN Card</label>
                <input
                  type="text"
                  className="form-control"
                  name="panCard"
                  value={formData.panCard}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">State</label>
                <input
                  type="text"
                  className="form-control"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">District</label>
                <input
                  type="text"
                  className="form-control"
                  name="district"
                  value={formData.district}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Full Address</label>
                <textarea
                  className="form-control"
                  name="fullAddress"
                  value={formData.fullAddress}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Upload Document 1</label>
                {formData.document1 &&
                  typeof formData.document1 === "string" && (
                    <div>
                      <img
                        src={formData.document1}
                        alt="Document 1"
                        className="img-thumbnail"
                        width="100"
                      />
                    </div>
                  )}
                <input
                  type="file"
                  className="form-control"
                  name="document1"
                  onChange={handleFileChange}
                  accept="image/*,.pdf,.doc,.docx"
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Upload Document 2</label>
                {formData.document2 &&
                  typeof formData.document2 === "string" && (
                    <div>
                      <img
                        src={formData.document2}
                        alt="Document 2"
                        className="img-thumbnail"
                        width="100"
                      />
                    </div>
                  )}
                <input
                  type="file"
                  className="form-control"
                  name="document2"
                  onChange={handleFileChange}
                  accept="image/*,.pdf,.doc,.docx"
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Upload Document 3</label>
                {formData.document3 &&
                  typeof formData.document3 === "string" && (
                    <div>
                      <img
                        src={formData.document3}
                        alt="Document 3"
                        className="img-thumbnail"
                        width="100"
                      />
                    </div>
                  )}
                <input
                  type="file"
                  className="form-control"
                  name="document3"
                  onChange={handleFileChange}
                  accept="image/*,.pdf,.doc,.docx"
                />
              </div>

              <div className="modal-footer">
                <button type="submit" className="btn btn-success">
                  Update
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={onClose}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditUserApplyForm;
