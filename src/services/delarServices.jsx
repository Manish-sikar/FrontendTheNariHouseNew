import router from "./apiService";

  async function GetnewDelarData() {
    try {
      const response = await router.get("/getAllDelar" );
      return response.data;
    } catch (error) {
      // Handle error, e.g., log it or throw a custom error
      console.error("Error in getting status:", error);
      throw error;
    }
  }

async function addDelar(formData) {
  try {
    const response = await router.post("/addDelar", formData);
    return response;
  } catch (error) {
    // Handle error, e.g., log it or throw a custom error
    console.error("Error in adding status:", error);
    throw error;
  }
}

  async function deleteDelar(id) {
    try {
      const response = await router.post(`/deleteDelar/${id}` );
      return response.data;
    } catch (error) {
      // Handle error, e.g., log it or throw a custom error
      console.error("Error in getting status:", error);
      throw error;
    }
  }


    async function DelarChangepass(data) {
    try {
      const response = await router.post("/changePassDelarRegister" , data );
      return response.data;
    } catch (error) {
      // Handle error, e.g., log it or throw a custom error
      console.error("Error in getting status:", error);
      throw error;
    }
  }

export { GetnewDelarData, addDelar , deleteDelar  , DelarChangepass};
