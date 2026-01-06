import api, { BASE_URL } from "./codingcloud";

const API = "/banners/";

// Get all banners
export const getBanners = async () => {
  const res = await api.get(API);
  return res.data?.data || res.data || [];
};

// Create banner
export const createBanner = async (data) => {
  return await api.post(API, data, {
    headers: { "Content-Type": "multipart/form-data" }
  });
};

// Update banner
export const updateBanner = async (id, data) => {
  return await api.patch(`${API}${id}/`, data, {
    headers: { "Content-Type": "multipart/form-data" }
  });
};

// Delete banner
export const deleteBanner = async (id) => {
  return await api.delete(`${API}${id}/`);
};
