import router from "./apiService";

async function GetFooterDetailsData() {
  try {
    const response = await router.get("/footer_data");
    return response.data;
  } catch (error) {
    // Handle error, e.g., log it or throw a custom error
    console.error("Error in adding status:", error);
    throw error;
  }
}

async function updateFooterDetailsData(formdata) {
  try {

    const response = await router.put("/footer_data", formdata );
    return response;
  } catch (error) {
    // Handle error, e.g., log it or throw a custom error
    console.error("Error in adding status:", error);
    throw error;
  }
}

export { GetFooterDetailsData, updateFooterDetailsData };
