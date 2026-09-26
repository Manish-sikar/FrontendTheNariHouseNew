import router from "./apiService";

async function GetLoanData() {
  try {
    const response = await router.get("/loan_details");
    return response.data;
  } catch (error) {
    // Handle error, e.g., log it or throw a custom error
    console.error("Error in adding status:", error);
    throw error;
  }
}

async function AddNewLoanData(formdata) {
  try {
    const response = await router.post("/loan_details" ,
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

async function deleteLoanData(_id) {
    try {
      const response = await router.delete( `/loan_details/${_id}`
          
      );
      return response;
    } catch (error) {
      // Handle error, e.g., log it or throw a custom error
      console.error("Error in adding status:", error);
      throw error;
    }
  }

  async function updateLoanData(formdata) {
    try {
      const response = await router.put( '/loan_details',
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


  async function changeStatusLoan(_id) {
    try {
      const response = await router.put('/loan_details/chanege_status',
        {_id}
         
          
      );
      return response;
    } catch (error) {
      // Handle error, e.g., log it or throw a custom error
      console.error("Error in adding status:", error);
      throw error;
    }
  }

export {  
    AddNewLoanData,
    changeStatusLoan,
    deleteLoanData,
    GetLoanData,
    updateLoanData

    };
