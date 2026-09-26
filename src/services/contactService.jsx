
import router from "./apiService";

async function GetContactDetailsData() {
  try {
    const response = await router.get("/contact_data");
    return response.data;
  } catch (error) {
    // Handle error, e.g., log it or throw a custom error
    console.error("Error in adding status:", error);
    throw error;
  }
}

async function updateContactDetailsData(formdata) {
  try {

    const response = await router.put("/contact_data", formdata );
    return response;
  } catch (error) {
    // Handle error, e.g., log it or throw a custom error
    console.error("Error in adding status:", error);
    throw error;
  }
}

export { GetContactDetailsData, updateContactDetailsData };
