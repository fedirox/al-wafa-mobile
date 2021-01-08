import axios from "axios";
import { API_URL } from "react-native-dotenv";

const apiUserBase = `${API_URL}/users`;

const apiUser = axios.create({
  baseURL: apiUserBase,
});

export async function sendNumber({ phoneNumber }) {
  const response = await apiUser.post(`/number`, { phoneNumber });
  return response;
}
export async function verifyCode({ mobile_number, verificationCode }) {
  const response = await apiUser.post(`/code`, {
    mobile_number,
    verificationCode,
  });
  return response.data;
}
