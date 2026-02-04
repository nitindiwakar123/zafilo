import axios from "axios";
import { config } from "../config/config.js";

const apiClient = axios.create({
    baseURL: config.baseUrl,
    withCredentials: true
});

export default apiClient;