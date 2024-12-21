import axios from "axios";
import router from "@/router";
import configPromise from "@/config";
import { swalWithCustomStyles } from "@/plugin/swal"; // Assuming you are using custom SweetAlert

declare module 'axios' {
  export interface AxiosRequestConfig {
    skipLoader?: boolean; // Add custom property
  }
}

async function setup() {
  const config = await configPromise;
  const apiClient = axios.create({
    baseURL: config.default_url, // Replace with your backend URL
    headers: {
      "gateway-key": config.gateway_key,
      unixtime: config.unixtime,
    },
  });

  const sleep = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  // Request interceptor to show the loading popup
  apiClient.interceptors.request.use((request) => {
    // Check if the request config has a `skipLoader` flag
    if (!request.skipLoader) {
      // Show loading popup
      swalWithCustomStyles.fire({
        title: "Loading...",
        text: "Please wait",
        allowOutsideClick: false,
        showConfirmButton: false,
        willOpen: () => {
          swalWithCustomStyles.showLoading();
        },
      });
    }
    return request;
  });

  // Response interceptor to close the loading popup and handle responses
  apiClient.interceptors.response.use(
    (response) => {
      if (!response.config.skipLoader) {
        swalWithCustomStyles.close();
      }
      return response;
    },
    async (error) => {
      // Close the loading popup on error
      if (!error.config?.skipLoader) {
        swalWithCustomStyles.close();
      }

      const { config, response } = error;
      if (response && response.status === 429) {
        let retries = config.__retries || 0;
        const maxRetries = 5;
        let delay = config.__retryDelay || 10; // initial delay in milliseconds

        if (retries < maxRetries) {
          retries++;
          config.__retries = retries;
          config.__retryDelay = delay * 2; // increase delay exponentially

          await sleep(delay);
          return apiClient(config); // retry the request
        } else {
          // Handle case when maximum retries are exceeded
        }
      }

      if (response && response.status === 403) {
        const currentRoute = router.currentRoute.value;
        if (currentRoute.path !== "/login" && currentRoute.path !== "/") {
          router.push("/forbidden-page");
        }
      }

      return Promise.reject(error);
    }
  );

  return apiClient;
}

const apiClientPromise = setup();

export default apiClientPromise;
