import React from "react";

const Banners = () => {
  return (
    <div className="container-fluid">
      <div className="page-inner">

        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h3 className="fw-bold">Banners</h3>
            <p className="text-muted mb-0">
              Manage website banners
            </p>
          </div>

          <button className="btn btn-primary">
            + Add Banner
          </button>
        </div>

        <div className="card">
          <div className="card-header">
            <h4 className="card-title mb-0">
              All Banners
            </h4>
          </div>

          <div className="card-body">
            Banner list will appear here.
          </div>
        </div>

      </div>
    </div>
  );
};

export default Banners;