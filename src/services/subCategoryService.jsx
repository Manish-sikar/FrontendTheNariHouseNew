import router from "./apiService";

// ========================================
// Get All Sub Categories
// ========================================

async function getSubCategories() {
  try {
    const response = await router.get(
      "/subcategories"
    );

    return response;
  } catch (error) {
    console.error(
      "Error in getting sub categories:",
      error
    );

    throw error;
  }
}

// ========================================
// Get Sub Categories By Category
// ========================================

async function getSubCategoriesByCategory(categoryId) {
  try {
    const response = await router.get(
      `/subcategories/category/${categoryId}`
    );

    return response;
  } catch (error) {
    console.error(
      "Error in getting sub categories by category:",
      error
    );

    throw error;
  }
}

// ========================================
// Add Sub Category
// ========================================

async function addSubCategory(formdata) {
  try {
    const response = await router.post(
      "/subcategories",
      formdata
    );

    return response;
  } catch (error) {
    console.error(
      "Error in adding sub category:",
      error
    );

    throw error;
  }
}

// ========================================
// Update Sub Category
// ========================================

async function updateSubCategory(id, formdata) {
  try {
    const response = await router.put(
      `/subcategories/${id}`,
      formdata
    );

    return response;
  } catch (error) {
    console.error(
      "Error in updating sub category:",
      error
    );

    throw error;
  }
}

// ========================================
// Delete Sub Category
// ========================================

async function deleteSubCategory(id) {
  try {
    const response = await router.delete(
      `/subcategories/${id}`
    );

    return response;
  } catch (error) {
    console.error(
      "Error in deleting sub category:",
      error
    );

    throw error;
  }
}

export {
  getSubCategories,
  getSubCategoriesByCategory,
  addSubCategory,
  updateSubCategory,
  deleteSubCategory,
};