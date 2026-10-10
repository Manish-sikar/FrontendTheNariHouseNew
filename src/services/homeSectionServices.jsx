import router from "./apiService";


// =====================================================
// GET ACTIVE HOME SECTIONS
// Frontend Home Page
// GET /home-sections
// =====================================================

async function GetHomeSections() {
  try {

    const response = await router.get(
      "/home-sections"
    );

    return response.data;

  } catch (error) {

    console.error(
      "Error fetching home sections:",
      error
    );

    throw error;
  }
}


// =====================================================
// GET ALL HOME SECTIONS
// Admin Panel
// GET /home-sections/all
// =====================================================

async function GetAllHomeSections() {
  try {

    const response = await router.get(
      "/home-sections/all"
    );

    return response.data;

  } catch (error) {

    console.error(
      "Error fetching all home sections:",
      error
    );

    throw error;
  }
}


// =====================================================
// GET SINGLE HOME SECTION
// GET /home-sections/:id
// =====================================================

async function GetHomeSectionById(id) {
  try {

    const response = await router.get(
      `/home-sections/${id}`
    );

    return response.data;

  } catch (error) {

    console.error(
      "Error fetching home section:",
      error
    );

    throw error;
  }
}


// =====================================================
// ADD HOME SECTION
// POST /home-sections
// multipart/form-data
// =====================================================

async function AddHomeSection(formData) {
  try {

    const response = await router.post(
      "/home-sections",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response;

  } catch (error) {

    console.error(
      "Error adding home section:",
      error
    );

    throw error;
  }
}


// =====================================================
// UPDATE HOME SECTION
// PUT /home-sections
// multipart/form-data
// =====================================================

async function UpdateHomeSection(id, formData) {
  try {
 
        const response = await router.post(
      `/home-sections/${id}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response;
  } catch (error) {
    console.error("Error updating home section:", error);
    throw error;
  }
}


// =====================================================
// DELETE HOME SECTION
// DELETE /home-sections/:id
// =====================================================

async function DeleteHomeSection(id) {
  try {

    const response = await router.delete(
      `/home-sections/${id}`
    );

    return response;

  } catch (error) {

    console.error(
      "Error deleting home section:",
      error
    );

    throw error;
  }
}


// =====================================================
// CHANGE STATUS
// PUT /home-sections/change-status
// =====================================================

async function ChangeHomeSectionStatus(id) {
  try {

    const response = await router.put(
      "/home-sections/change-status",
      {
        _id: id,
      }
    );

    return response;

  } catch (error) {

    console.error(
      "Error changing home section status:",
      error
    );

    throw error;
  }
}


// =====================================================
// EXPORT
// =====================================================

 
export {
  GetHomeSections,
  GetAllHomeSections,
  GetHomeSectionById,
  AddHomeSection,
  UpdateHomeSection,
  DeleteHomeSection,
  ChangeHomeSectionStatus,
};