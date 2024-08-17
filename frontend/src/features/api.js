import axios from 'axios';

axios.defaults.withCredentials = true;

const api = axios.create({
    baseURL: `${import.meta.env.VITE_BACKEND_URL}`,
});

api.interceptors.response.use(
    response => response,
    async error => {
        const originalRequest = error.config;

        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshTokenResponse = await api.post('/refresh/');

                if (refreshTokenResponse.status === 200) {
                    return api(originalRequest);
                }
            } catch (refreshError) {
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default api;
