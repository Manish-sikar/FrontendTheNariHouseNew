import router from "./apiService";

 









async function AddnewUserApplyForm1(formdata) {
  try {
    const response = await router.post("/linkWithHttpData", formdata);
    return response;
  } catch (error) {
    console.error("Error in adding status:", error);
    throw error;
  }
}


async function GetlinkWithHttpData() {
  try {
    const response = await router.get("/linkWithHttpData");
    return response;
  } catch (error) {
    console.error("Error in adding status:", error);
    throw error;
  }
}


async function DeleteLinkWithHttpData(id) {
  try {
    const response = await router.delete(`/linkWithHttpData/${id}`);
    return response;
  } catch (error) {
    console.error("Error in adding status:", error);
    throw error;
  }
}



export {  AddnewUserApplyForm1 , GetlinkWithHttpData , DeleteLinkWithHttpData
  };