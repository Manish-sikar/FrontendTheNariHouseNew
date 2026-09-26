import router from "./apiService";

async function getSiteData() {
  try {
    const response = await router.get(
      "/site_setting"
    );

    return response.data;
  } catch (error) {
    // Handle error, e.g., log it or throw a custom error
    console.error("Error in adding status:", error);
    throw error;
  }
}


async function PutSiteData(form) {
    try {
      const response = await router.put(
        "/site_setting",
        form,
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

 

export {
    getSiteData,
    PutSiteData
  
  };
  