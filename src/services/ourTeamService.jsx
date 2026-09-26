import router from "./apiService";

async function GetOurTeamData() {
  try {
    const response = await router.get("/team_details");
    return response.data;
  } catch (error) {
    // Handle error, e.g., log it or throw a custom error
    console.error("Error in adding status:", error);
    throw error;
  }
}

async function AddNewOurTeam(formdata) {
  try {
    const response = await router.post("/team_details" ,
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

async function deleteOurTeamData(_id) {
    try {
      const response = await router.delete( `/team_details/${_id}`
          
      );
      return response;
    } catch (error) {
      // Handle error, e.g., log it or throw a custom error
      console.error("Error in adding status:", error);
      throw error;
    }
  }

  async function updateOurTeamData(formdata) {
    try {
      const response = await router.put( '/team_details',
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


  async function changeStatusOurTeam(_id) {
    try {
      const response = await router.put('/team_details/chanege_status',
        {_id}
         
          
      );
      return response;
    } catch (error) {
      // Handle error, e.g., log it or throw a custom error
      console.error("Error in adding status:", error);
      throw error;
    }
  }

export { GetOurTeamData,
    AddNewOurTeam  , 
    deleteOurTeamData ,
    updateOurTeamData ,
    changeStatusOurTeam
    
    };
