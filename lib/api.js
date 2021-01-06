import axios from "axios";
// import { API_URL } from "react-native-dotenv";

const apiUserBase = "http://192.168.2.12:8080/users";

const apiUser = axios.create({
  baseURL: apiUserBase,
});

export async function sendNumber({ phoneNumber }) {
  if (number.match(/^[0-9]{8}$/g)) {
    setErrorMessage("");
    let phoneNumber = code + number;
    const data = await api.sendNumber({phoneNumber})
    console.log(data);
  } else {
    setErrorMessage("Le numéro n'est pas valide");
  }
  try {
    await apiUser.post(`/number`, { phoneNumber });
  } catch (error) {
    throw error;
  }
}
