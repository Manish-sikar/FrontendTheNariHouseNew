import router from "./apiService";


// GET ALL
export const GetDiscounts = async () => {
  const response = await router.get(
    "/discounts"
  );

  return response.data;
};


// GET BY ID
export const GetDiscountById = async (
  id
) => {
  const response = await router.get(
    `/discounts/${id}`
  );

  return response.data;
};


// ADD
export const AddDiscount = async (
  data
) => {
  const response = await router.post(
    "/discounts",
    data
  );

  return response.data;
};


// UPDATE
export const UpdateDiscount = async (
  id,
  data
) => {
  const response = await router.put(
    `/discounts/${id}`,
    data
  );

  return response.data;
};


// DELETE
export const DeleteDiscount = async (
  id
) => {
  const response = await router.delete(
    `/discounts/${id}`
  );

  return response.data;
};