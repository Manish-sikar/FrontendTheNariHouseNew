
import React from "react";

const SubHeaderUser = ({ onCategorySelect }) => {
  const dropdownData = [
    { title: "Loan Products", category: "loan_product" },
    { title: "Our Services", category: "our_service" },
    { title: "Cards", category: "cards" },
    { title: "Account Opening", category: "account_opening" },
    { title: "Investment", category: "investment" },
    { title: "Insurance", category: "insurance" },
    { title: "E-Store", category: "e_store" },
    { title: "Report", category: "report" },
    { title: "Support", category: "support" },
    { title: "Instant Deal", category: "Instant_Deal" },
  ];

  return (
    <nav className="navbar py-2" style={{backgroundColor:"#3674b5"}} >
      <div className="container-fluid px-3">
        <div className="d-flex flex-nowrap w-100 gap-2 overflow-auto scroll-container justify-content-center">

          {dropdownData.map((dropdown, index) => (
            <div
              key={index}
              className="text-white px-1 py-1 category-item"
              onClick={() => onCategorySelect(dropdown.category)}
              style={{ cursor: "pointer", whiteSpace: "nowrap" }}
            >
              {dropdown.title}
            </div>
          ))}
        </div>
      </div>

      <style>
        {`
          .scroll-container::-webkit-scrollbar {
            display: none;
          }

          .category-item {
            font-size: 1rem;
          }

          @media (max-width: 768px) {
            .scroll-container {
              flex-wrap: nowrap !important;
            }

            .category-item {
              font-size: 0.85rem;
              padding: 0.4rem 0.6rem;
              font-weight:800px;
            }
          }

          @media (max-width: 480px) {
            .category-item {
              font-size: 0.75rem;
              padding: 0.3rem 0.5rem;
            }
          }

          .category-item:hover {
            color: #ffc107;
          }
        `}
      </style>
    </nav>
  );
};

export default SubHeaderUser;
