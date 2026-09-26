import router  from "./apiService";


async function PaytmPaynow(data) {
    try {
      const response = await router.post('/paytm/paynow',
       data   
      );
      return response;
    } catch (error) {
      // Handle error, e.g., log it or throw a custom error
      console.error("Error in adding status:", error);
      throw error;
    }
  }


  export  {
    PaytmPaynow
  }
