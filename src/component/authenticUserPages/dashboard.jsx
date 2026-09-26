
import { useEffect, useState } from "react";
import AuthUserHeader from "./headerUser";
import SubHeaderUser from "./subHeader";
import LoanProductList from "./loanProduct";
import { GetLoanData } from "../../services/loanDataServices";
import ReportPage from "./reportPage";
import SupportPage from "./supportPage";

const Dashboard = () => {
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const fetchProductsByCategory = async (category) => {
    if (category === "report") {
      setSelectedCategory("report");
      return;
    }
    const response = await GetLoanData();
    const productsData = response?.loan_Data || [];
    console.log(productsData  , "productsData")
    const filteredData = productsData.filter((product) => product.category === category);
//        const filteredData = productsData.filter(
//   (product) => product.category === category && product.status === 1
// );
    setFilteredProducts(filteredData);
    setSelectedCategory(category);
  };

  useEffect(() => {
    if (selectedCategory && selectedCategory !== "report") {
      fetchProductsByCategory(selectedCategory);
    }
  }, [selectedCategory]);


  return (
    <>
<AuthUserHeader />
<SubHeaderUser onCategorySelect={fetchProductsByCategory} />
<div className="container mt-4">
  {selectedCategory === "report" ? (
    <ReportPage />
  ) : selectedCategory === "support" ? (
    <SupportPage />
  ) : (
    <LoanProductList products={filteredProducts} />
  )}
</div>
    </>
  );
};

export default Dashboard;

