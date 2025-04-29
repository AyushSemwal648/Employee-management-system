export type UserType = {
  name: string;
  email: string;
  password: string;
  role: "admin" | "employee"
  profileImage?: string
  createdAt: Date
  updatedAt: Date
}