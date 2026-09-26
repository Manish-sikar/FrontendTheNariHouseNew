import router from "./apiService";

// Customer Register
export const CustomerRegisterApi = async (data) => {
  const response = await router.post(
    "/customer/register",
    data
  );

  return response.data;
};

// Customer Login
export const CustomerLoginApi = async (data) => {
  const response = await router.post(
    "/customer/login",
    data
  );

  return response.data;
};