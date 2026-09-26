import router from "./apiService";

// Categories
export const GetCategoryData = async () => {
  try {
    const response = await router.get("/categories");
    return response.data;
  } catch (error) {
    console.error("Category API Error:", error);
    throw error;
  }
};

// Sub Categories
export const GetSubCategoryData = async (categoryId) => {
  try {
    const response = await router.get(
      `/subcategories?categoryId=${categoryId}`
    );
    return response.data;
  } catch (error) {
    console.error("SubCategory API Error:", error);
    throw error;
  }
};

// Brands
export const GetBrandData = async (categoryId) => {
  try {
    const response = await router.get(
      `/brands?categoryId=${categoryId}`
    );
    return response.data;
  } catch (error) {
    console.error("Brand API Error:", error);
    throw error;
  }
};