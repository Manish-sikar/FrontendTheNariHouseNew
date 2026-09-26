import router from "./apiService";

export const GetCoupons = async () => {
  try {
    const response = await router.get("/coupons");

    return response.data;
  } catch (error) {
    console.error("Get Coupons Error:", error);
    throw error;
  }
};

export const GetCouponById = async (id) => {
  try {
    const response = await router.get(
      `/coupons/${id}`
    );

    return response.data;
  } catch (error) {
    console.error("Get Coupon Error:", error);
    throw error;
  }
};

export const AddCoupon = async (data) => {
  try {
    const response = await router.post(
      "/coupons",
      data
    );

    return response.data;
  } catch (error) {
    console.error("Add Coupon Error:", error);
    throw error;
  }
};

export const UpdateCoupon = async (id, data) => {
  try {
    const response = await router.put(
      `/coupons/${id}`,
      data
    );

    return response.data;
  } catch (error) {
    console.error(
      "Update Coupon Error:",
      error
    );

    throw error;
  }
};

export const DeleteCoupon = async (id) => {
  try {
    const response = await router.delete(
      `/coupons/${id}`
    );

    return response.data;
  } catch (error) {
    console.error(
      "Delete Coupon Error:",
      error
    );

    throw error;
  }
};

export const ApplyCoupon = async (data) => {
  try {
    const response = await router.post(
      "/coupons/apply",
      data
    );

    return response.data;
  } catch (error) {
    console.error(
      "Apply Coupon Error:",
      error
    );

    throw error;
  }
};

// const response = await ApplyCoupon({
//   code: "ELECTRONICS20",

//   cartTotal: 5000,

//   products: [
//     {
//       product: "PRODUCT_ID",
//       category: "CATEGORY_ID",
//       quantity: 1,
//     },
//   ],
// });