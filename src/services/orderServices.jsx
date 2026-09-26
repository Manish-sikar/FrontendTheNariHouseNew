import router from "./apiService";

export const GetOrders = async (status = "") => {
  try {
    const url = status
      ? `/orders?status=${status}`
      : `/orders`;

    const response = await router.get(url);

    return response.data;
  } catch (error) {
    console.error("Get Orders Error:", error);
    throw error;
  }
};
 

// Get logged-in customer's orders
export async function GetMyOrdersData(status = "") {
  try {
    const response = await router.get("/orders/my-orders", {
      params: status ? { status } : {},
    });

    return response.data;
  } catch (error) {
    console.error("Get My Orders Error:", error);
    throw error;
  }
}

// Get single customer order
export async function GetMyOrderDetailsData(orderId) {
  try {
    const response = await router.get(
      `/orders/my-orders/${orderId}`
    );

    return response.data;
  } catch (error) {
    console.error("Get My Order Details Error:", error);
    throw error;
  }
}