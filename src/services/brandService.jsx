import router from "./apiService";

// ========================================
// Get All Brands
// ========================================

async function getBrands() {
  try {
    const response = await router.get("/brands");

    return response;
  } catch (error) {
    console.error("Error in getting brands:", error);
    throw error;
  }
}

// ========================================
// Get Brand By ID
// ========================================

async function getBrandById(id) {
  try {
    const response = await router.get(
      `/brands/${id}`
    );

    return response;
  } catch (error) {
    console.error("Error in getting brand:", error);
    throw error;
  }
}

// ========================================
// Add Brand
// ========================================

async function addBrand(formdata) {
  try {
    const response = await router.post(
      "/brands",
      formdata
    );

    return response;
  } catch (error) {
    console.error("Error in adding brand:", error);
    throw error;
  }
}

// ========================================
// Update Brand
// ========================================

async function updateBrand(id, formdata) {
  try {
    const response = await router.put(
      `/brands/${id}`,
      formdata
    );

    return response;
  } catch (error) {
    console.error(
      "Error in updating brand:",
      error
    );

    throw error;
  }
}

// ========================================
// Delete Brand
// ========================================

async function deleteBrand(id) {
  try {
    const response = await router.delete(
      `/brands/${id}`
    );

    return response;
  } catch (error) {
    console.error(
      "Error in deleting brand:",
      error
    );

    throw error;
  }
}

export {
  getBrands,
  getBrandById,
  addBrand,
  updateBrand,
  deleteBrand,
};