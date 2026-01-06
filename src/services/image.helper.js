import { BASE_URL } from "./codingcloud";

export const buildImageUrl = (path) =>
  path?.startsWith("http")
    ? path
    : `${BASE_URL}${path}`;
