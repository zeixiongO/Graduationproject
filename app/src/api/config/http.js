import axios from "axios";
const baseURL = import.meta.env.VITE_API_DOMAIN;
import { ElMessage } from "element-plus";
import router from "@/router";

const service = axios.create({
    baseURL,
    timeout: 5000,
    headers: {
        'Access-Control-Allow-Origin': '*'
    }
});

//axios请求拦截器
service.interceptors.request.use(
    (config) => {
        if (sessionStorage.getItem("token") || localStorage.getItem("token")) {
            config.headers.Authorization = window.sessionStorage.getItem("token") || localStorage.getItem("token");
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

//axios响应拦截器
service.interceptors.response.use(
    (res) => {
        if (res.data.code == 401) {
            ElMessage.error(res.data.message)
            router.push('/login')
        }
        return res.data
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default service;
