export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  picture?: string;
  provider?: "local" | "google" | "facebook";
  role: "user" | "admin" | "moderator";
  emailVerified: boolean;
  createdAt: string;
  lastLogin?: string;
}
