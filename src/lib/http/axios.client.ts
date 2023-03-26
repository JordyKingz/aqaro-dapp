import axios from "axios";

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_SERVICE_URL,
});

const axiosAuthInstance = axios.create({
    baseURL: import.meta.env.VITE_SERVICE_URL,
    headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
    }
});

export default {axiosInstance, axiosAuthInstance};
