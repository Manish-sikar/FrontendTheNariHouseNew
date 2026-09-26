
import React, { useEffect, useState } from "react";

 

import {
  getHomeCategories,
  getHomeProducts,
  getHomeHeaderSettings,
} from "../services/homeService";

import "./EcommerceHome/Home.css";
import HeroSlider from "./herobanner";
import BenefitsStrip from "./EcommerceHome/BenefitsStrip";
import CategoryShowcase from "./EcommerceHome/CategoryShowcase";
import ProductSection from "./EcommerceHome/ProductSection";

const Home = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [settings, setSettings] = useState({});

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHomeData();
  }, []);

  const fetchHomeData = async () => {
    setLoading(true);

    try {
      const [
        categoryResponse,
        productResponse,
        headerResponse,
      ] = await Promise.all([
        getHomeCategories(),
        getHomeProducts(),
        getHomeHeaderSettings(),
      ]);

      const categoryData =
        categoryResponse.data ||
        categoryResponse.category_Data ||
        [];

      const productData =
        productResponse.product_Data ||
        productResponse.data ||
        [];

      setCategories(
        categoryData.filter(
          (item) => Number(item.status) === 1
        )
      );

      setProducts(
        productData.filter(
          (item) => Number(item.status) === 1
        )
      );

      setSettings(headerResponse.data || {});
    } catch (error) {
      console.error("Home Data Error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="home-loader">
        Loading Homepage...
      </div>
    );
  }

  return (
    <main className="ecommerce-home">

      {/* 1. Hero */}
      <HeroSlider />

      {/* 2. Benefits */}
      <BenefitsStrip settings={settings} />

      {/* 3. Categories */}
      <CategoryShowcase categories={categories} />

      {/* 4. New Arrivals */}
      <ProductSection
        title="New Arrivals"
        subtitle="JUST DROPPED"
        products={products.slice(0, 8)}
      />

      {/* 5. All Products / Featured */}
      <ProductSection
        title="Discover More"
        subtitle="OUR COLLECTION"
        products={products.slice(8, 16)}
      />

    </main>
  );
};

export default Home;