import React, {
  useEffect,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";

import Swal from "sweetalert2";

import {
  GetHomeSections,
  DeleteHomeSection,
  ChangeHomeSectionStatus,
} from "../../../services/homeSectionServices";

import DataTableComponent from "../../../atoms/datatables/datatables";


const HomeSectionPage = () => {

  const navigate = useNavigate();

  const [sections, setSections] = useState([]);

  const [loading, setLoading] = useState(false);


  // =========================================
  // FETCH HOME SECTIONS
  // =========================================

  useEffect(() => {
    fetchSections();
  }, []);


  const fetchSections = async () => {

    try {

      setLoading(true);

      const response = await GetHomeSections();

      const data =
        response?.section_Data ||
        response?.data ||
        response?.sections ||
        [];

      setSections(
        Array.isArray(data)
          ? data
          : []
      );

    } catch (error) {

      console.error(
        "Fetch Home Sections Error:",
        error
      );

      Swal.fire(
        "Error!",
        error?.response?.data?.message ||
          "Failed to fetch home sections.",
        "error"
      );

    } finally {

      setLoading(false);

    }
  };


  // =========================================
  // DELETE
  // =========================================

  const handleDelete = async (id) => {

    const result = await Swal.fire({

      title: "Are you sure?",

      text: "You want to delete this home section?",

      icon: "warning",

      showCancelButton: true,

      confirmButtonColor: "#d33",

      cancelButtonColor: "#6c757d",

      confirmButtonText: "Yes, Delete",

      cancelButtonText: "Cancel",

    });


    if (!result.isConfirmed) {
      return;
    }


    try {

      await DeleteHomeSection(id);

      await Swal.fire(
        "Deleted!",
        "Home section deleted successfully.",
        "success"
      );

      fetchSections();

    } catch (error) {

      console.error(
        "Delete Home Section Error:",
        error
      );

      Swal.fire(
        "Error!",
        error?.response?.data?.message ||
          "Failed to delete section.",
        "error"
      );

    }

  };


  // =========================================
  // CHANGE STATUS
  // =========================================

  const handleStatus = async (item) => {

    try {

      await ChangeHomeSectionStatus(
        item._id
      );

      Swal.fire(
        "Success!",
        "Status changed successfully.",
        "success"
      );

      fetchSections();

    } catch (error) {

      console.error(
        "Change Home Section Status Error:",
        error
      );

      Swal.fire(
        "Error!",
        error?.response?.data?.message ||
          "Failed to change status.",
        "error"
      );

    }

  };


  // =========================================
  // TABLE COLUMNS
  // =========================================

  const columns = [

    // ---------------------------------------
    // ORDER
    // ---------------------------------------

    {
      name: "Order",

      selector: (row) =>
        Number(row.order || 0),

      sortable: true,

      width: "90px",
    },


    // ---------------------------------------
    // TYPE
    // ---------------------------------------

    {
      name: "Type",

      selector: (row) =>
        row.sectionType || "-",

      sortable: true,

      cell: (row) => {

        let badgeClass = "bg-secondary";

        if (row.sectionType === "PROMO") {
          badgeClass = "bg-primary";
        }

        if (row.sectionType === "WHY_CHOOSE") {
          badgeClass = "bg-success";
        }

        if (row.sectionType === "NEWSLETTER") {
          badgeClass = "bg-warning text-dark";
        }

        return (
          <span className={`badge ${badgeClass}`}>

            {row.sectionType || "-"}

          </span>
        );

      },
    },


    // ---------------------------------------
    // TITLE
    // ---------------------------------------

    {
      name: "Title",

      selector: (row) =>
        row.title || "-",

      sortable: true,

      cell: (row) => (

        <div>

          <strong>
            {row.title || "-"}
          </strong>

          {row.subtitle && (
            <div>
              <small className="text-muted">
                {row.subtitle}
              </small>
            </div>
          )}

        </div>

      ),
    },


    // ---------------------------------------
    // IMAGE
    // ---------------------------------------

    {
      name: "Image",

      cell: (row) => (

        row.image ? (

          <img
            src={row.image}
            alt={row.title || "Home Section"}
            style={{
              width: "70px",
              height: "50px",
              objectFit: "cover",
              borderRadius: "6px",
              border: "1px solid #ddd",
            }}
            onError={(e) => {
              e.currentTarget.src =
                "/img/category-default.jpg";
            }}
          />

        ) : (

          <img
            src="/img/category-default.jpg"
            alt="Default"
            style={{
              width: "70px",
              height: "50px",
              objectFit: "cover",
              borderRadius: "6px",
              border: "1px solid #ddd",
            }}
          />

        )

      ),
    },


    // ---------------------------------------
    // ITEMS
    // ---------------------------------------

    {
      name: "Items",

      cell: (row) => {

        const itemCount =
          Array.isArray(row.items)
            ? row.items.length
            : 0;

        if (row.sectionType !== "WHY_CHOOSE") {
          return "-";
        }

        return (
          <span className="badge bg-info">

            {itemCount} Item
            {itemCount !== 1 ? "s" : ""}

          </span>
        );

      },
    },


    // ---------------------------------------
    // STATUS
    // ---------------------------------------

    {
      name: "Status",

      cell: (row) => {

        const isActive =
          Number(row.status) === 1;

        return (

          <button
            type="button"
            className={`btn btn-sm ${
              isActive
                ? "btn-success"
                : "btn-danger"
            }`}
            onClick={() =>
              handleStatus(row)
            }
          >

            {isActive
              ? "Active"
              : "Inactive"}

          </button>

        );

      },
    },


    // ---------------------------------------
    // ACTION
    // ---------------------------------------

    {
      name: "Action",

      cell: (row) => (

        <div className="d-flex gap-2">

          {/* EDIT */}

          <button
            type="button"
            className="btn btn-sm btn-primary"
            onClick={() =>
              navigate(
                "/admin/cms/home-sections/edit",
                {
                  state: {
                    item: row,
                  },
                }
              )
            }
          >

            <i className="fa fa-edit me-1"></i>

            Edit

          </button>


          {/* DELETE */}

          <button
            type="button"
            className="btn btn-sm btn-danger"
            onClick={() =>
              handleDelete(row._id)
            }
          >

            <i className="fa fa-trash me-1"></i>

            Delete

          </button>

        </div>

      ),
    },

  ];


  // =========================================
  // JSX
  // =========================================

  return (

    <div className="container mt-4">

      <div className="card shadow-sm">

        {/* ===================================
            HEADER
        =================================== */}

        <div className="card-header d-flex justify-content-between align-items-center">

          <h4 className="mb-0">
            Home Sections
          </h4>


          <button
            type="button"
            className="btn btn-primary"
            onClick={() =>
              navigate(
                "/admin/cms/home-sections/add"
              )
            }
          >

            <i className="fa fa-plus me-1"></i>

            Add Section

          </button>

        </div>


        {/* ===================================
            BODY
        =================================== */}

        <div className="card-body">

          {loading ? (

            <div className="text-center py-5">

              <div
                className="spinner-border text-primary"
                role="status"
              />

              <div className="mt-2">
                Loading home sections...
              </div>

            </div>

          ) : (

            <DataTableComponent
              columns={columns}
              data={sections}
            />

          )}

        </div>

      </div>

    </div>

  );

};


export default HomeSectionPage;