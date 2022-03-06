import Cookies from "js-cookie";
import website from "@/config/website";

const Authorization = website.AuthorizationKey;
export function getToken() {
  return Cookies.get(Authorization);
}

export function setToken(token) {
  return Cookies.set(Authorization, token);
}

export function removeToken() {
  return Cookies.remove(Authorization);
}
