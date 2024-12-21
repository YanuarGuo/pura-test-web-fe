import encryptor from "encriptorjs";
import Cookies from "js-cookie"
const myKey = "siangaksa123"


const setToken = (token: Text) => {
  const encryptedText = encryptor.encrypt(token, myKey);
  return encryptedText;
};

const getToken = () => {
  let storedToken = null;
  let decryptedText = "";
  storedToken = Cookies.get('token');
  if (storedToken != null) {
    decryptedText = encryptor.decrypt(storedToken, myKey);
  }
  return decryptedText;
};

export default {
  setToken,
  getToken
}