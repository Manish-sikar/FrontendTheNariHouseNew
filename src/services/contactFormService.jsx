import router from "./apiService";

async function GetContactFormData() {
  try {
    const response = await router.get("/contact_form");
    return response.data;
  } catch (error) {
    // Handle error, e.g., log it or throw a custom error
    console.error("Error in adding status:", error);
    throw error;
  }
}

async function AddNewContactForm(formdata) {
  try {
    const response = await router.post("/contact_form", formdata );
    return response;
  } catch (error) {
    // Handle error, e.g., log it or throw a custom error
    console.error("Error in adding status:", error);
    throw error;
  }
}


async function deleteContactFormData(_id) {
    try {
      const response = await router.delete( `/contact_form/${_id}`
          
      );
      return response;
    } catch (error) {
      // Handle error, e.g., log it or throw a custom error
      console.error("Error in adding status:", error);
      throw error;
    }
  }



export { GetContactFormData, AddNewContactForm , deleteContactFormData };
 