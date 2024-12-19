export const BASE_API_URI =
  process.env.NODE_ENV === "development"
    ? "http://localhost:5000/api/v1"
    : process.env.NEXT_PUBLIC_API_URI;
export const BASE_NAME = process.env.NEXT_PUBLIC_BASE_NAME || "Linky";
