
import React from "react";
import { Link } from "react-router-dom";

const getProductImage = (product) => {
  const images = product.images || [];

  const firstImage =
    typeof images[0] === "string"
      ? images[0]
      : images[0]?.url ||
        images[0]?.imageUrl ||
        images[0]?.Location;

  return (
    firstImage ||
    product.image ||
    "/img/category-default.jpg"
  );
};

const ProductSection = ({
  title = "New Arrivals",
  subtitle = "JUST DROPPED",
  products = [],
  viewAllLink = "/products",
}) => {
  return (
    <section className="product-section">

      <div className="home-container">

        <div className="product-heading">

          <div>
            <span>{subtitle}</span>
            <h2>{title}</h2>
          </div>

          <Link to={viewAllLink}>
            View All →
          </Link>

        </div>

        <div className="product-grid">

          {products.map((product) => (

            <Link
              to={`/product/${product._id}`}
              className="product-card"
              key={product._id}
            >

              <div className="product-image">

                <img
                  src={getProductImage(product)}
                  alt={product.productName}
                />

                {Number(product.salePrice) > 0 &&
                  Number(product.salePrice) <
                    Number(product.price) && (
                    <span className="sale-badge">
                      SALE
                    </span>
                  )}

              </div>

              <div className="product-info">

                <h3>{product.productName}</h3>

                <div className="product-price">

                  <strong>
                    ₹{product.salePrice || product.price}
                  </strong>

                  {Number(product.salePrice) > 0 &&
                    Number(product.salePrice) <
                      Number(product.price) && (
                      <del>
                        ₹{product.price}
                      </del>
                    )}

                </div>

              </div>

            </Link>

          ))}

        </div>

      </div>

    </section>
  );
};

export default ProductSection;