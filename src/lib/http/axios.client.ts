import axios, { type AxiosInstance } from "axios";
import {useAuthStore} from "@/stores/auth.store";

const axiosInstance: AxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_SERVICE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

const axiosAuthInstance: AxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_SERVICE_URL,
    headers: {
        'Content-Type': 'application/json',
    }
});

axiosAuthInstance.interceptors.request.use(
    (config) => {
        const store = useAuthStore();
        const token = store.getToken;

        const bearerToken = localStorage.getItem("aqaro.auth.token");

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        } else if (bearerToken) {
            config.headers.Authorization = `Bearer ${bearerToken}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export {axiosInstance, axiosAuthInstance};
