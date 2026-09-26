import router from "./apiService";

async function getSocialData() {
  try {
    const response = await router.get(
      "/social_media"
    );

    return response.data;
  } catch (error) {
    // Handle error, e.g., log it or throw a custom error
    console.error("Error in adding status:", error);
    throw error;
  }
}


async function updateIconData(form) {
    try {
      const response = await router.put(
        "/social_media",
        form
      );
  
      return response;
    } catch (error) {
      // Handle error, e.g., log it or throw a custom error
      console.error("Error in adding status:", error);
      throw error;
    }
  }


  async function AddNewIconData(form) {
    try {
      const response = await router.post(
        "/social_media",
        form
        
      );
  
      return response;
    } catch (error) {
      // Handle error, e.g., log it or throw a custom error
      console.error("Error in adding status:", error);
      throw error;
    }
  }



  async function deleteSocialIcon(_id) {
    try {
      const response = await router.delete(
        `/social_media/${_id}`
         
      );
  
      return response;
    } catch (error) {
      // Handle error, e.g., log it or throw a custom error
      console.error("Error in Deleting status:", error);
      throw error;
    }
  }
  async function changeStatusIndb(_id) {
    try {
      const response = await router.put(`/social_media/chanege_status`, { _id });
  
      return response;
    } catch (error) {
      console.error("Error in changing status:", error);
      throw error;  // Handle or propagate the error
    }
  }
  

export {
    getSocialData,
    updateIconData ,
    AddNewIconData ,
    deleteSocialIcon ,
    changeStatusIndb
  
  };
  