import api from "./codingcloud";

export const getTestimonials = async () => {
  const res = await api.get("/testimonials/");
  return res.data.data || [];
};

export const createTestimonial = async (data) => {
  return await api.post("/testimonials/", data, {
    headers: { "Content-Type": "multipart/form-data" }
  });
};

export const updateTestimonial = async (id, data) => {
  return await api.patch(`/testimonials/${id}/`, data, {
    headers: { "Content-Type": "multipart/form-data" }
  });
};

export const deleteTestimonial = async (id) => {
  return await api.delete(`/testimonials/${id}/`);
};
