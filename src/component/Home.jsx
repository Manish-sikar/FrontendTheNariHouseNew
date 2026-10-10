
// import React, { useEffect, useState } from "react";

 

// import {
//   getHomeCategories,
//   getHomeProducts,
//   getHomeHeaderSettings,
// } from "../services/homeService";

// import "./EcommerceHome/Home.css";
// import HeroSlider from "./herobanner";
// import BenefitsStrip from "./EcommerceHome/BenefitsStrip";
// import CategoryShowcase from "./EcommerceHome/CategoryShowcase";
// import ProductSection from "./EcommerceHome/ProductSection";

// const Home = () => {
//   const [categories, setCategories] = useState([]);
//   const [products, setProducts] = useState([]);
//   const [settings, setSettings] = useState({});

//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetchHomeData();
//   }, []);

//   const fetchHomeData = async () => {
//     setLoading(true);

//     try {
//       const [
//         categoryResponse,
//         productResponse,
//         headerResponse,
//       ] = await Promise.all([
//         getHomeCategories(),
//         getHomeProducts(),
//         getHomeHeaderSettings(),
//       ]);

//       const categoryData =
//         categoryResponse.data ||
//         categoryResponse.category_Data ||
//         [];

//       const productData =
//         productResponse.product_Data ||
//         productResponse.data ||
//         [];

//       setCategories(
//         categoryData.filter(
//           (item) => Number(item.status) === 1
//         )
//       );

//       setProducts(
//         productData.filter(
//           (item) => Number(item.status) === 1
//         )
//       );

//       setSettings(headerResponse.data || {});
//     } catch (error) {
//       console.error("Home Data Error:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="home-loader">
//         Loading Homepage...
//       </div>
//     );
//   }

//   return (
//     <main className="ecommerce-home">

//       {/* 1. Hero */}
//       <HeroSlider />

//       {/* 2. Benefits */}
//       <BenefitsStrip settings={settings} />

//       {/* 3. Categories */}
//       <CategoryShowcase categories={categories} />

//       {/* 4. New Arrivals */}
//       <ProductSection
//         title="New Arrivals"
//         subtitle="JUST DROPPED"
//         products={products.slice(0, 8)}
//       />

//       {/* 5. All Products / Featured */}
//       <ProductSection
//         title="Discover More"
//         subtitle="OUR COLLECTION"
//         products={products.slice(8, 16)}
//       />

//     </main>
//   );
// };

// export default Home;

import React, { useEffect, useState } from "react";

import {
  getHomeCategories,
  getHomeProducts,
  getHomeHeaderSettings,
} from "../services/homeService";

import "./EcommerceHome/Home.css";
import {
  GetHomeSections,
} from "../services/homeSectionServices";
import HeroSlider from "./herobanner";
import BenefitsStrip from "./EcommerceHome/BenefitsStrip";
import CategoryShowcase from "./EcommerceHome/CategoryShowcase";
import ProductSection from "./EcommerceHome/ProductSection";
import PromoSection from "./EcommerceHome/PromoSection";
import WhyChooseUs from "./EcommerceHome/WhyChooseUs";
import NewsletterSection from "./EcommerceHome/NewsletterSection";
import StatsStrip from "./EcommerceHome/StatsStrip";
import TestimonialSection from "./EcommerceHome/TestimonialSection";
const Home = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [homeSections, setHomeSections] =
    useState([]);
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
            sectionResponse,
      ] = await Promise.all([
        getHomeCategories(),
        getHomeProducts(),
        getHomeHeaderSettings(),
            GetHomeSections(),
      ]);

      const categoryData =
        categoryResponse?.data ||
        categoryResponse?.category_Data ||
        [];

      const productData =
        productResponse?.product_Data ||
        productResponse?.data ||
        [];

      setCategories(
        Array.isArray(categoryData)
          ? categoryData.filter(
              (item) => Number(item.status) === 1
            )
          : []
      );

      setProducts(
        Array.isArray(productData)
          ? productData.filter(
              (item) => Number(item.status) === 1
            )
          : []
      );

      setSettings(
        headerResponse?.data ||
        headerResponse ||
        {}
      );

      const sectionData =
        sectionResponse?.section_Data ||
        [];


      setHomeSections(

        Array.isArray(sectionData)

          ? sectionData

          : []

      );


      console.log(
        "HOME CMS SECTIONS:",
        sectionData
      );


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

      {/* HERO */}
      <HeroSlider />

      {/* BENEFITS */}
      <BenefitsStrip settings={settings} />

      {/* CATEGORIES */}
      <CategoryShowcase categories={categories} />

      {/* NEW ARRIVALS */}
      <ProductSection
        title="New Arrivals"
        subtitle="JUST DROPPED"
        products={products.slice(0, 8)}
      />

  

 

      {/* BEST SELLERS */}
      <ProductSection
        title="Best Sellers"
        subtitle="MOST LOVED"
        products={products.slice(8, 16)}
      />

      {/* DISCOVER MORE */}
      <ProductSection
        title="Discover More"
        subtitle="OUR COLLECTION"
        products={products.slice(16, 24)}
      />

   
      {/* =================================================
          DYNAMIC CMS SECTIONS
      ================================================= */}

 {[...homeSections]
  .filter((s) => Number(s.status) === 1)
  .sort((a, b) => Number(a.order) - Number(b.order))
  .map((section) => {
    switch (section.sectionType) {
      case "TESTIMONIAL":
        return <TestimonialSection key={section._id} section={section} />;
      case "PROMO":
        return <PromoSection key={section._id} section={section} />;
      case "STATS":
        return <StatsStrip key={section._id} section={section} />;
      case "WHY_CHOOSE":
        return <WhyChooseUs key={section._id} section={section} />;
      case "NEWSLETTER":
        return <NewsletterSection key={section._id} section={section} />;
      default:
        return null;
    }
  })}


    </main>
  );
};

export default Home;