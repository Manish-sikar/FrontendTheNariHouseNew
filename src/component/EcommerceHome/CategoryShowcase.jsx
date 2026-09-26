
import React from "react";
import { Link } from "react-router-dom";

const getCategoryImage = (category) => {
  return (
    category.image ||
    category.categoryImage ||
    category.imageUrl ||
    "/img/category-default.jpg"
  );
};

const CategoryShowcase = ({ categories = [] }) => {
  return (
    <section className="category-showcase">

      <div className="home-container">

        <div className="section-heading center">

          <span>EXPLORE OUR CATEGORY</span>

          <h2>
            Discover Your Style
          </h2>

          <p>
            Find your favorite styles and everyday essentials.
          </p>

        </div>

        <div className="category-grid">

          {categories.map((category) => (

            <Link
              to={`/products?category=${category._id}`}
              className="category-card"
              key={category._id}
            >

              <div className="category-image">

                <img
                  src={getCategoryImage(category)}
                  alt={category.name}
                />

              </div>

              <h4>{category.name}</h4>

            </Link>

          ))}

        </div>

      </div>

    </section>
  );
};

export default CategoryShowcase;