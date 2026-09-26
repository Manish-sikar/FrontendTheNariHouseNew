import router from "./apiService";

// Create checkout order
export const CreateCheckoutOrder = async (data) => {
  try {
    const response = await router.post(
      "/checkout/create",
      data
    );

    return response.data;
  } catch (error) {
    console.error(
      "Create checkout error:",
      error
    );

    throw error;
  }
};

// Verify Razorpay payment
export const VerifyCheckoutPayment = async (data) => {
  try {
    const response = await router.post(
      "/checkout/verify-payment",
      data
    );

    return response.data;
  } catch (error) {
    console.error(
      "Verify payment error:",
      error
    );

    throw error;
  }
};