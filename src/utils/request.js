import axios from "axios";
import { profileStore } from "../store/Pfile_store";
import { config } from "./config";

export const request = (url = "", method = "get", data = {}) => {
  let headers = {
    "Content-Type": "application/json",
  };

  if (data instanceof FormData) {
    headers = {
      "Content-Type": "multipart/form-data",
    };
  }

  const { access_token } = profileStore.getState();
  if (access_token) {
    headers.Authorization = `Bearer ${access_token}`;
  }

  return axios({
    url: config.base_url_api + url,
    method: method,
    data: data,
    headers: {
      // Always accept JSON response
      Accept: "application/json",
      ...headers,
    },
  })
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      console.error("API Request Failed:", error.response || error.message);
      throw error;
    });
};
