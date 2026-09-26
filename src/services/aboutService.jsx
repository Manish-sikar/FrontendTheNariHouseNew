import router from "./apiService";

async function GetAboutData() {
  try {
    const response = await router.get("/about_details");
    return response.data;
  } catch (error) {
    // Handle error, e.g., log it or throw a custom error
    console.error("Error in adding status:", error);
    throw error;
  }
}

async function AddNewAboutData(formdata) {
  try {
    const response = await router.post("/about_details" ,
    formdata,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
    );
    return response;
  } catch (error) {
    // Handle error, e.g., log it or throw a custom error
    console.error("Error in adding status:", error);
    throw error;
  }
}

async function deleteAboutData(_id) {
    try {
      const response = await router.delete( `/about_details/${_id}`
          
      );
      return response;
    } catch (error) {
      // Handle error, e.g., log it or throw a custom error
      console.error("Error in adding status:", error);
      throw error;
    }
  }

  async function updateAboutData(formdata) {
    try {
      const response = await router.put( '/about_details',
        formdata,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          
      );
      return response;
    } catch (error) {
      // Handle error, e.g., log it or throw a custom error
      console.error("Error in adding status:", error);
      throw error;
    }
  }


  async function changeStatusAbout(_id) {
    try {
      const response = await router.put('/about_details/chanege_status',
        {_id}
         
          
      );
      return response;
    } catch (error) {
      // Handle error, e.g., log it or throw a custom error
      console.error("Error in adding status:", error);
      throw error;
    }
  }

export { GetAboutData,
    changeStatusAbout ,
    updateAboutData,
    deleteAboutData ,
    AddNewAboutData
    };
