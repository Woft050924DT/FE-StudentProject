export interface User {
  id: number;
  email: string;
  username: string;
  fullName?: string;
  firstName?: string;
  lastName?: string;
  picture?: string;
  provider?: "local" | "google" | "facebook";
  roles: string[]; // API trả về mảng roles thay vì role đơn
  emailVerified?: boolean;
  createdAt?: string;
  lastLogin?: string;
}
