import router from "./apiService";

async function GetServiceData() {
  try {
    const response = await router.get("/services_details");
    return response.data;
  } catch (error) {
    // Handle error, e.g., log it or throw a custom error
    console.error("Error in adding status:", error);
    throw error;
  }
}

async function AddNewService(formdata) {
  try {
    const response = await router.post("/services_details" ,
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

async function deleteServiceData(_id) {
    try {
      const response = await router.delete( `/services_details/${_id}`
          
      );
      return response;
    } catch (error) {
      // Handle error, e.g., log it or throw a custom error
      console.error("Error in adding status:", error);
      throw error;
    }
  }

  async function updateServiceData(formdata) {
    try {
      const response = await router.put( '/services_details',
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


  async function changeStatusService(_id) {
    try {
      const response = await router.put('/services_details/chanege_status',
        {_id}
         
          
      );
      return response;
    } catch (error) {
      // Handle error, e.g., log it or throw a custom error
      console.error("Error in adding status:", error);
      throw error;
    }
  }

export { GetServiceData,
    AddNewService  , 
    deleteServiceData ,
    updateServiceData ,
    changeStatusService
    
    };
