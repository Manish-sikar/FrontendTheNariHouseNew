import router from "./apiService";


// ==========================================
// GET PRODUCTS
// ==========================================

async function GetProducts() {
  try {

    const response = await router.get("/products");

    return response.data;

  } catch (error) {

    console.error(
      "Error fetching products:",
      error
    );

    throw error;
  }
}


// ==========================================
// GET SINGLE PRODUCT
// ==========================================

async function GetProductById(id) {
  try {

    const response =
      await router.get(`/products/${id}`);

    return response.data;

  } catch (error) {

    console.error(
      "Error fetching product:",
      error
    );

    throw error;
  }
}


// ==========================================
// ADD PRODUCT
// ==========================================

async function AddProductService(formData) {
  try {

    const response =
      await router.post(
        "/products",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

    return response;

  } catch (error) {

    console.error(
      "Error adding product:",
      error
    );

    throw error;
  }
}


// ==========================================
// UPDATE PRODUCT
// ==========================================

async function UpdateProduct(formData) {
  try {

    const response =
      await router.put(
        "/products",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

    return response;

  } catch (error) {

    console.error(
      "Error updating product:",
      error
    );

    throw error;
  }
}


// ==========================================
// DELETE PRODUCT
// ==========================================

async function DeleteProduct(id) {
  try {

    const response =
      await router.delete(
        `/products/${id}`
      );

    return response;

  } catch (error) {

    console.error(
      "Error deleting product:",
      error
    );

    throw error;
  }
}


// ==========================================
// CHANGE STATUS
// ==========================================

async function ChangeProductStatus(id) {
  try {

    const response =
      await router.put(
        "/products/change-status",
        {
          _id: id,
        }
      );

    return response;

  } catch (error) {

    console.error(
      "Error changing product status:",
      error
    );

    throw error;
  }
}


export {
  GetProducts,
  GetProductById,
  AddProductService,
  UpdateProduct,
  DeleteProduct,
  ChangeProductStatus,
};