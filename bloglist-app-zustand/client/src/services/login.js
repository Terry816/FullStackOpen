import axios from "axios";
const baseUrl = "/api/login";

let token = null;
const setToken = (newToken) => {
  token = `Bearer ${newToken}`;
};

const login = async (credentials) => {
  const response = await axios.post(baseUrl, credentials);
  console.log("this is the response", response)
  return response.data;
};

export default { login, setToken};
