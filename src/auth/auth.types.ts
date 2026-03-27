export type User = {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;
};
