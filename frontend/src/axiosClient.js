import axios from "axios";
import Cookies from "js-cookie";

const axiosClient = axios.create({
  baseURL: "http://localhost:4000/api",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${Cookies.get("ACCESS_TOKEN")}`,
  },
  // withCredentials: true
});
axiosClient.interceptors.request.use((config) => {
  const token = Cookies.get("ACCESS_TOKEN");
  config.headers.Authorization = `Bearer ${token}`;
  return config;
});

axiosClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    
      if (error.response.status === 401) {
        Cookies.remove("ACCESS_TOKEN");
        window.location.href = "/login";
      }
    
  }
);
export default axiosClient;
