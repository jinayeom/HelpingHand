import axios from "axios";
import "dotenv/config";

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  //   timeout: 4000,
});

// Add token to headers only if needed
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    // Only attach token if the request is not explicitly marked as public
    if (token && !config.headers.skipAuth) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default instance;
