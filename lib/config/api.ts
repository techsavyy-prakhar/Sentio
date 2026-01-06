export const API_URL = "https://sentio-backend.onrender.com/api";

export const apiEndpoint = (path: string) => {
  return `${API_URL}${path.startsWith("/") ? path : `/${path}`}`;
};