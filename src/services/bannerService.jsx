import router from "./apiService";

async function GetBannerData() {
  try {
    const response = await router.get("/banner_details");
    return response.data;
  } catch (error) {
    // Handle error, e.g., log it or throw a custom error
    console.error("Error in adding status:", error);
    throw error;
  }
}

async function AddNewBanner(formdata) {
  try {
    const response = await router.post("/banner_details" ,
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

async function deleteBannerData(_id) {
    try {
      const response = await router.delete( `/banner_details/${_id}`
          
      );
      return response;
    } catch (error) {
      // Handle error, e.g., log it or throw a custom error
      console.error("Error in adding status:", error);
      throw error;
    }
  }

  async function updateBannerData(formdata) {
    try {
      const response = await router.put( '/banner_details',
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


  async function changeStatusBanner(_id) {
    try {
      const response = await router.put('/banner_details/chanege_status',
        {_id}
         
          
      );
      return response;
    } catch (error) {
      // Handle error, e.g., log it or throw a custom error
      console.error("Error in adding status:", error);
      throw error;
    }
  }

export { GetBannerData,
     AddNewBanner  , 
     deleteBannerData ,
     updateBannerData ,
     changeStatusBanner
    
    };
