import router from "./apiService";

async function LoginApi(formData) {
  try {
    const response = await router.post("/login", formData);
    return response.data;
  } catch (error) {
    // Handle error, e.g., log it or throw a custom error
    console.error("Error in adding status:", error);
    throw error;
  }
}

async function UserLoginApi(formData) {
  try {
    const response = await router.post("/User-login", formData);
    return response.data;
  } catch (error) {
    // Handle error, e.g., log it or throw a custom error
    console.error("Error in adding status:", error);
    throw error;
  }
}

async function UserRegApi(formData) {
  try {
    const response = await router.post("/User-reg", formData);
    return response;
  } catch (error) {
    // Handle error, e.g., log it or throw a custom error
    console.error("Error in adding status:", error);
    throw error;
  }
}


async function ForgotPasswordApi(formData) {
  try {
    const response = await router.post("/changePassSendOtp", formData);
    return response;
  } catch (error) {
    // Handle error, e.g., log it or throw a custom error
    console.error("Error in adding status:", error);
    throw error;
  }
}



async function VerifyOtpApi(formData) {
  try {
    const response = await router.post("/verifyOtp", formData);
    return response;
  } catch (error) {
    // Handle error, e.g., log it or throw a custom error
    console.error("Error in adding status:", error);
    throw error;
  }
}



async function ResetPasswordApi(formData) {
  try {
    const response = await router.post("/resetPassword", formData);
    return response;
  } catch (error) {
    // Handle error, e.g., log it or throw a custom error
    console.error("Error in adding status:", error);
    throw error;
  }
}



 

export {
  UserRegApi,
  LoginApi ,
  UserLoginApi , 
  ForgotPasswordApi, VerifyOtpApi, ResetPasswordApi

} ;
