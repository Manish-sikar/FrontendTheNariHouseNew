import router from "./apiService";

async function AddnewUserApplyForm(formdata) {
  try {
    const response = await router.post("/user_apply_form", formdata, {
      headers: {
        "Content-Type": "multipart/form-data", // Ensure correct content type for file uploads
      },
    });
    return response;
  } catch (error) {
    console.error("Error in adding status:", error);
    throw error;
  }
}

async function GetnewUserApplyForm(partnerEmail) {
  console.log(partnerEmail);
  try {
    const url = partnerEmail
      ? `/user_apply_form?create_id=${partnerEmail}`
      : "/user_apply_form";
    const response = await router.get(url);
    return response.data;
  } catch (error) {
    // Handle error, e.g., log it or throw a custom error
    console.error("Error in getting status:", error);
    throw error;
  }
}

async function UpdateUserApplyForm(id, formdata) {
  try {
    const response = await router.post(`/user_apply_form/${id}`, formdata, {
      headers: {
        "Content-Type": "multipart/form-data", // Ensure correct content type for file uploads
      },
    });

    return response;
  } catch (error) {
    // Handle error, e.g., log it or throw a custom error
    console.error("Error in getting status:", error);
    throw error;
  }
}

async function deleteUserApplyForm(id) {
  try {
    const response = await router.delete(`/user_apply_form/${id}`);
    return response.data;
  } catch (error) {
    // Handle error, e.g., log it or throw a custom error
    console.error("Error in getting status:", error);
    throw error;
  }
}

// parther data

// async function GetnewpartnerData(status=null) {
//   try {
//     const url = status ? `/User-reg?status=${status}?delar-id` : "/User-reg";
//     const response = await router.get(url);
//     return response.data;
//   } catch (error) {
//     console.error("Error in getting partner data:", error);
//     throw error;
//   }
// }

async function GetnewpartnerData(params = null) {
  try {
    let url = "/User-reg";

    if (params) {
      if (typeof params === "object" && params !== null) {
        // Build query string from object
        const queryString = Object.entries(params)
          .map(
            ([key, value]) =>
              `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
          )
          .join("&");
        url += `?${queryString}`;
      } else {
        // Assume it's a single status number
        url += `?status=${encodeURIComponent(params)}`;
      }
    }

    const response = await router.get(url);
    return response.data;
  } catch (error) {
    console.error("Error in getting partner data:", error);
    throw error;
  }
}

async function ParthnerChangepass(data) {
  try {
    const response = await router.post("/change-pass-User-reg", data);
    return response.data;
  } catch (error) {
    // Handle error, e.g., log it or throw a custom error
    console.error("Error in getting status:", error);
    throw error;
  }
}
async function deletePartner(id) {
  try {
    const response = await router.post(`/delete-User-reg/${id}`);
    return response.data;
  } catch (error) {
    // Handle error, e.g., log it or throw a custom error
    console.error("Error in getting status:", error);
    throw error;
  }
}
async function updatePartnerData(formDataToSubmit) {
  try {
    const response = await router.put(`/update-User-reg`, formDataToSubmit, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response;
  } catch (error) {
    console.error("Error in updating partner data:", error);
    throw error;
  }
}

async function GetSpecialpartnerData(JN_Id) {
  try {
    const response = await router.post(`/getSpeacialParthner`, { JN_Id });
    return response.data;
  } catch (error) {
    // Handle error, e.g., log it or throw a custom error
    console.error("Error in getting status:", error);
    throw error;
  }
}

async function ChangeStatusConfirmOrder(formData) {
  try {
    const response = await router.post(
      "/user_apply_form-change-status",
      formData
    );
    return response;
  } catch (error) {
    // Handle error, e.g., log it or throw a custom error
    console.error("Error in getting status:", error);
    throw error;
  }
}

async function ChangeStatusCloseOrder(formData) {
  try {
    const response = await router.post("/user_apply_form-status", formData);
    return response;
  } catch (error) {
    // Handle error, e.g., log it or throw a custom error
    console.error("Error in getting status:", error);
    throw error;
  }
}

async function GetReportData(partnerEmail) {
  try {
    const response = await router.post(`/reportStatus`, {
      partnerEmail: partnerEmail,
    });
    return response.data;
  } catch (error) {
    // Handle error, e.g., log it or throw a custom error
    console.error("Error in getting status:", error);
    throw error;
  }
}

async function GetTransHistroyData(id) {
  try {
    const response = await router.get(`/get-transition-data/${id}`);
    return response.data;
  } catch (error) {
    // Handle error, e.g., log it or throw a custom error
    console.error("Error in getting status:", error);
    throw error;
  }
}

export {
  AddnewUserApplyForm,
  GetnewUserApplyForm,
  GetnewpartnerData,
  deletePartner,
  ParthnerChangepass,
  updatePartnerData,
  UpdateUserApplyForm,
  deleteUserApplyForm,
  GetSpecialpartnerData,
  ChangeStatusConfirmOrder,
  ChangeStatusCloseOrder,
  GetReportData,
  GetTransHistroyData,
};
