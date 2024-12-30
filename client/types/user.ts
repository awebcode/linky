export interface UserSessionResponse {
  id: string;
  role: string;
  name: string;
  email: string;
  image?: string; // Optional field
  status: string;
}
