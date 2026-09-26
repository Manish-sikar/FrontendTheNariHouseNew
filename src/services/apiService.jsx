// import axios from "axios";


// let authToken = null;

// // Function to set the authentication token
// export function setAuthToken(token) {
//   authToken = token;
// }


// // helpers.js
// // export  const baseURL = "https://jagannathnode.onrender.com/api/admin";
// export  const baseURL = "http://localhost:5656/api/admin";
//     // Use the same base URL as your axios instance


// // Axios instance with default configuration
// const router = axios.create({
//   baseURL: baseURL, // Paths like '/api' will be forwarded to http://localhost:5000/api
// });

 
// router.interceptors.request.use(
//   (config) => {
//     if (authToken) {
//       config.headers["x-access-token"] = authToken;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );


  

// export default router;

import axios from "axios";

export const baseURL = "http://localhost:5656/api/admin";

const router = axios.create({
  baseURL,
});

router.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authTokenUser");

    if (token) {
      config.headers["x-access-token"] = token;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default router;
