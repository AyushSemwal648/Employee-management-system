export type UserType = {
   _id: string; // Add this - your backend sends _id
  name: string;
  email: string;
  password?: string; // Make optional since frontend usually doesn't need password
  role: "admin" | "employee";
  profileImage?: string;
  createdAt: Date;
  updatedAt: Date;
}