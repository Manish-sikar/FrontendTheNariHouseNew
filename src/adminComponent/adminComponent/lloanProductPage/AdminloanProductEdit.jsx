import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { updateLoanData } from "../../../services/loanDataServices";

const LoanDataEdit = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { item } = location.state || {};
  const [selectedIconPic, setSelectedIconPic] = useState(null);

  const [formData, setFormData] = useState({
    _id: item?._id,
    category_name: item?.category_name || "",
    sub_category_name: item?.sub_category_name || "",
    category: item?.category || "",
        amount: item?.amount || "",
        DelarAmount: item?.DelarAmount || "",
    link: item?.link || "",
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleEditSubmit = async () => {
    const formDataToSubmit = new FormData();

    Object.keys(formData).forEach((key) => {
      if (key !== "icon_pic") {
        formDataToSubmit.append(key, formData[key]);
      }
    });

    if (selectedIconPic) {
      formDataToSubmit.append("loanimg", formData.icon_pic);
    }

    try {
      const response = await updateLoanData(formDataToSubmit);
      if (response.status === 200) {
        Swal.fire({
          title: "Success!",
          text: "Data updated successfully!",
          icon: "success",
          confirmButtonText: "OK",
        });
        navigate("/admin/loanProduct");
      } else {
        throw new Error("Failed to update data");
      }
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: "An error occurred while updating data. Please try again.",
        icon: "error",
        confirmButtonText: "Retry",
      });
    }
  };

  const handleFileChange = (e) => {
    const { files } = e.target;
    if (files.length > 0) {
      const file = files[0];
      const imageUrl = URL.createObjectURL(file);
      setSelectedIconPic(imageUrl);
      setFormData((prevData) => ({
        ...prevData,
        icon_pic: file,
      }));
    }
  };

  return (
    <div className="container">
      <h3>Edit Loan Data</h3>
      <form>
        <div className="form-group">
          <label>Category Name</label>
          <input
            id="category_name"
            type="text"
            className="form-control"
            placeholder="Category Name"
            value={formData.category_name}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Sub Category Name</label>
          <input
            id="sub_category_name"
            type="text"
            className="form-control"
            placeholder="Sub Category Name"
            value={formData.sub_category_name}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Category</label>
          <input
            id="category"
            type="text"
            className="form-control"
            placeholder="Category"
            value={formData.category}
            onChange={handleChange}
          />
        </div>
           <div className="form-group">
          <label>Amount</label>
          <input
            id="amount"
            type="text"
            className="form-control"
            placeholder="Amount"
            value={formData.amount}
            onChange={handleChange}
          />
        </div>
          <div className="form-group">
          <label>Delar Amount</label>
          <input
            id="DelarAmount"
            type="text"
            className="form-control"
            placeholder="Delar Amount"
            value={formData.DelarAmount}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Link</label>
          <input
            id="link"
            type="text"
            className="form-control"
            placeholder="Link"
            value={formData.link}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Icon Picture</label>
          <input
            id="icon_pic"
            type="file"
            className="form-control"
            name="icon_pic"
            onChange={handleFileChange}
          />
          {selectedIconPic ? (
            <img
              src={selectedIconPic}
              alt="Selected Icon"
              className="w-25 pt-2"
            />
          ) : (
            item.icon_pic && (
              <img
                src={item.icon_pic}
                alt="Current Icon"
                className="w-25 pt-2 img-fluid"
              />
            )
          )}
        </div>
        <button
          type="button"
          className="btn btn-primary"
          onClick={handleEditSubmit}
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default LoanDataEdit;
