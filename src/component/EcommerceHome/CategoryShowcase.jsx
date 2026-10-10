import React from "react";
import { Link } from "react-router-dom";

const getCategoryImage = (category) => {
  return (
    category?.image ||
    category?.categoryImage ||
    category?.imageUrl ||
    "/img/category-default.jpg"
  );
};

const CategoryShowcase = ({ categories = [] }) => {
  return (
    <section className="category-showcase">

      <div className="home-container">

        {/* ================= HEADING ================= */}

        <div className="section-heading center">

          <span>EXPLORE OUR CATEGORY</span>

          <h2>Discover Your Style</h2>

          <p>
            Find your favorite styles and everyday essentials.
          </p>

        </div>


        {/* ================= CATEGORY GRID ================= */}

        <div className="category-grid">

          {categories.map((category) => (

            <Link
              key={category._id}
              to={`/products?category=${category._id}`}
              className="category-card"
            >

              {/* IMAGE ONLY */}

              <div className="category-image">

                <img
                  src={getCategoryImage(category)}
                  alt={category?.name || "Category"}
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.src =
                      "/img/category-default.jpg";
                  }}
                />

              </div>


              {/* CATEGORY NAME */}

              {/* <div className="category-name">
                {category?.name}
              </div> */}

            </Link>

          ))}

        </div>

      </div>

    </section>
  );
};

export default CategoryShowcase;