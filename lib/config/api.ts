export const API_URL = "https://sentio-backend.onrender.com/api";
// export const API_URL = "http://127.0.0.1:8000/api";

export const apiEndpoint = (path: string) => {
  return `${API_URL}${path.startsWith("/") ? path : `/${path}`}`;
};