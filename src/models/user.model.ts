export interface User {
  User_Id: number;
  Fullname: string;
  Brithday: string;
  PhoneNumber: string;
  Email: string;
  Password?: string;
  Address: string;
  Role: 'admin' | 'customer';
}

export interface Feedback {
  Feedback_Id: number;
  Rating: number;
  Comments: string;
  User_Id: number;
  Product_Id: number;
}

export interface LoginPayload {
  email: string;
  password: string;
}