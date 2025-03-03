import axios from "axios";
const axiosClient = axios.create({
  baseURL: "http://localhost:4000/api",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("ACCESS_TOKEN");
  config.headers.Authorization = `Bearer ${token}`;
  return config;
});

axiosClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    try {
      if (error.response.status === 401) {
        localStorage.removeItem("ACCESS_TOKEN");
        window.location.href = "/login";
      }
    } catch (error) {
      console.log(error);
    }
    throw error;
  }
);
export default axiosClient;
