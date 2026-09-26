import router from "./apiService";

async function GetProjectData() {
  try {
    const response = await router.get("/projects_details");
    return response.data;
  } catch (error) {
    // Handle error, e.g., log it or throw a custom error
    console.error("Error in adding status:", error);
    throw error;
  }
}

async function AddNewProject(formdata) {
  try {
    const response = await router.post("/projects_details" ,
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

async function deleteProjectData(_id) {
    try {
      const response = await router.delete( `/projects_details/${_id}`
          
      );
      return response;
    } catch (error) {
      // Handle error, e.g., log it or throw a custom error
      console.error("Error in adding status:", error);
      throw error;
    }
  }

  async function updateProjectData(formdata) {
    try {
      const response = await router.put( '/projects_details',
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


  async function changeStatusProject(_id) {
    try {
      const response = await router.put('/projects_details/chanege_status',
        {_id}
         
          
      );
      return response;
    } catch (error) {
      // Handle error, e.g., log it or throw a custom error
      console.error("Error in adding status:", error);
      throw error;
    }
  }

export { GetProjectData,
    AddNewProject  , 
    deleteProjectData ,
    updateProjectData ,
    changeStatusProject
    
    };
