import api from "./codingcloud";

export const getCourses = async () => {
  const res = await api.get("/course/");
  return res.data.data || res.data || [];
};

export const createCourse = async (data) => {
  return await api.post("/course/", data, {
    headers: { "Content-Type": "multipart/form-data" }
  });
};

export const updateCourse = async (id, data) => {
  return await api.patch(`/course/${id}/`, data, {
    headers: { "Content-Type": "multipart/form-data" }
  });
};

export const deleteCourse = async (id) => {
  return await api.delete(`/course/${id}/`);
};
