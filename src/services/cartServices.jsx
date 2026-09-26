import router from "./apiService";

export const GetCart = async () => {
  const response = await router.get("/cart");
  return response.data;
};

export const AddToCart = async (data) => {
  const response = await router.post("/cart", data);
  return response.data;
};

export const UpdateCartItem = async (id, data) => {
  const response = await router.put(
    `/cart/${id}`,
    data
  );

  return response.data;
};

export const RemoveCartItem = async (id) => {
  const response = await router.delete(
    `/cart/${id}`
  );

  return response.data;
};

export const ClearCart = async () => {
  const response = await router.delete(
    "/cart"
  );

  return response.data;
};


export async function GetCartCount() {
  const response = await router.get("/cart/count");
  return response.data;
}

 