import crypto from "./crypto";
import Cookies from "js-cookie"
import apiClientPromise from "./axios";
import router from "@/router"
import { jwtDecode } from "jwt-decode";

let userAccessCache: any = null; // Variable to store user access data
let jwtToken = crypto.getToken();
let userProfileCache: any = null; // Changed to null to follow the same pattern

const setUserAccess = async () => {
  const token: any = crypto.getToken();
  let userAccess = null;
  if (token) {
    try {
      const axios = await apiClientPromise;
      const response = await axios.get('/user-access', {
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      userAccess = response.data;
      await initializeUserProfile(token); // Ensure user profile is initialized
    } catch (error) {
      //console.error("Error fetching user access:", error);
      Cookies.remove("token");
      router.push("/");
      location.reload();
    }
  }

  return userAccess;
};

const initializeUserAccess = async () => {
  userAccessCache = await setUserAccess();
};

const getUserAccess = async () => {
  if (userAccessCache == null) {
    await initializeUserAccess();
  }
  return userAccessCache;
};

const setUserProfile = async (token: any) => {
  const user: any = jwtDecode(token);
  let userProfile = null;
  try {
    const axios = await apiClientPromise;
    const response = await axios.get(
      '/user-profiles/' + user.userId,
      {
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    userProfile = response.data.data;
  } catch (error) {
    console.error("Error fetching user profile:", error);
  }
  return userProfile;
};

const initializeUserProfile = async (token: any) => {
  userProfileCache = await setUserProfile(token);
};

const getUserProfile = async () => {
  if (userProfileCache == null) {
    const token = crypto.getToken();
    await initializeUserProfile(token);
  }
  return userProfileCache;
};

export default {
  getUserAccess,
  setUserAccess,
  getUserProfile,
  jwtToken,
  userAccessCache,
  userProfileCache,
};
