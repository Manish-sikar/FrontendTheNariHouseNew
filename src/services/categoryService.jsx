import router from "./apiService";

// ========================================
// Get All Categories
// ========================================

async function getCategories() {
  try {
    const response = await router.get("/categories");
    return response;
  } catch (error) {
    console.error("Error in getting categories:", error);
    throw error;
  }
}

// ========================================
// Get Category By ID
// ========================================

async function getCategoryById(id) {
  try {
    const response = await router.get(`/categories/${id}`);
    return response;
  } catch (error) {
    console.error("Error in getting category:", error);
    throw error;
  }
}

// ========================================
// Add Category
// ========================================

async function addCategory(formdata) {
  try {
    const response = await router.post(
      "/categories",
      formdata
    );

    return response;
  } catch (error) {
    console.error("Error in adding category:", error);
    throw error;
  }
}

// ========================================
// Update Category
// ========================================

async function updateCategory(id, formdata) {
  try {
    const response = await router.put(
      `/categories/${id}`,
      formdata
    );

    return response;
  } catch (error) {
    console.error("Error in updating category:", error);
    throw error;
  }
}

// ========================================
// Delete Category
// ========================================

async function deleteCategory(id) {
  try {
    const response = await router.delete(
      `/categories/${id}`
    );

    return response;
  } catch (error) {
    console.error("Error in deleting category:", error);
    throw error;
  }
}

export {
  getCategories,
  getCategoryById,
  addCategory,
  updateCategory,
  deleteCategory,
};