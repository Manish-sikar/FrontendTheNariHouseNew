// src/components/Loading.jsx
import React from "react";
import "./App.css"; // custom styles

const Loading = () => {
  return (
    <div className="loading-overlay">
      <div className="loading-content">
        <div className="jf-logo">JF</div>
        <div className="spinner" />
      </div>
    </div>
  );
};

export default Loading;
