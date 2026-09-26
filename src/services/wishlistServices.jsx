import router from "./apiService";

// =====================================================
// GET WISHLIST
// =====================================================

export const GetWishlist = async () => {
  try {
    const response = await router.get("/wishlist");
    return response.data;
  } catch (error) {
    console.error("Get Wishlist Error:", error);
    throw error;
  }
};

// =====================================================
// ADD TO WISHLIST
// =====================================================

export const AddToWishlist = async (product) => {
  try {
    const response = await router.post("/wishlist", {
      product,
    });

    return response.data;
  } catch (error) {
    console.error("Add Wishlist Error:", error);
    throw error;
  }
};

// =====================================================
// REMOVE FROM WISHLIST
// =====================================================

export const RemoveFromWishlist = async (productId) => {
  try {
    const response = await router.delete(
      `/wishlist/${productId}`
    );

    return response.data;
  } catch (error) {
    console.error("Remove Wishlist Error:", error);
    throw error;
  }
};

// =====================================================
// CLEAR WISHLIST
// =====================================================

export const ClearWishlist = async () => {
  try {
    const response = await router.delete("/wishlist");

    return response.data;
  } catch (error) {
    console.error("Clear Wishlist Error:", error);
    throw error;
  }
};

// =====================================================
// WISHLIST COUNT
// =====================================================

export const GetWishlistCount = async () => {
  try {
    const response = await router.get("/wishlist/count");

    return response.data;
  } catch (error) {
    console.error("Get Wishlist Count Error:", error);
    throw error;
  }
};