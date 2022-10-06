/**
 * axios setup to use mock service
 */

import axios from 'axios';

const axiosServices = axios.create({
    baseURL: process.env.REACT_APP_API_URL
});

// interceptor for http
axiosServices.interceptors.response.use(
    (response) => response,
    (error) => Promise.reject((error.response && error.response.data) || 'Wrong Services')
);

axiosServices.interceptors.request.use((config) => {
    const token = localStorage.getItem('accessToken');
    config.headers.Authorization = token ? `Bearer ${token}` : '';
    return config;
});

export default axiosServices;
