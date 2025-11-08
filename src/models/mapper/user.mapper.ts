import { User, Feedback } from '../user.model';

export const fromJsonToUser = (json: any): User => {
  return {
    User_Id: json.User_Id ?? 0,
    Fullname: json.Fullname ?? '',
    Brithday: json.Brithday ?? '',
    PhoneNumber: json.PhoneNumber ?? '',
    Email: json.Email ?? '',
    Address: json.Address ?? '',
    Role: json.Role ?? 'Customer',
  };
};


export const toJsonFromUser = (user: User): any => {
  // Loại bỏ các trường không cần gửi đi nếu có
  const { ...jsonData } = user;
  return jsonData;
};

export const fromJsonToFeedback = (json: any): Feedback => {
  return {
    Feedback_Id: json.Feedback_Id ?? 0,
    Rating: json.Rating ?? 0,
    Comments: json.Comments ?? '',
    User_Id: json.User_Id ?? 0,
    Product_Id: json.Product_Id ?? 0,
  };
};