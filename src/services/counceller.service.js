import api from "./councellers";

export const getCounsellors = async () => {
  const res = await api.get("/counsellors/");
  return res.data.data || [];
};

export const createCounsellor = async (data) => {
  return await api.post("/counsellors/", data);
};

export const updateCounsellor = async (id, data) => {
  return await api.patch(`/counsellors/${id}/`, data);
};

export const deleteCounsellor = async (id) => {
  return await api.delete(`/counsellors/${id}/`);
};
