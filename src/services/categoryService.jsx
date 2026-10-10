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

const addCategory = async (formData) => {
  return await router.post(
    "/categories",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
};

const updateCategory = async (
  id,
  formData
) => {
  return await router.put(
    `/categories/${id}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
};

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