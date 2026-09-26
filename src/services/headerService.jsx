import router from "./apiService";

// Get Header Settings
export const GetHeaderSettings = async () => {
  try {
    const response = await router.get("/header-settings");
    return response.data;
  } catch (error) {
    console.error("Get Header Settings Error:", error);
    throw error;
  }
};

// Update Header Settings
export const UpdateHeaderSettings = async (data) => {
  try {
    const response = await router.put(
      "/header-settings",
      data
    );

    return response.data;
  } catch (error) {
    console.error("Update Header Settings Error:", error);
    throw error;
  }
};