
import router from "./apiService";

// Banner
export async function getHomeBanners() {
  const response = await router.get("/banner_details");
  return response.data;
}

// Categories
export async function getHomeCategories() {
  const response = await router.get("/categories");
  return response.data;
}

// Products
export async function getHomeProducts() {
  const response = await router.get("/products");
  return response.data;
}

// Header Settings
export async function getHomeHeaderSettings() {
  const response = await router.get("/header-settings");
  return response.data;
}

// Footer
export async function getHomeFooter() {
  const response = await router.get("/footer_data");
  return response.data;
}