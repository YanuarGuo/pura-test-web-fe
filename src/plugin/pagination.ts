import apiClientPromise from "./axios";
import crypto from "./crypto";

let currentPage = 1;
let totalPageData = 1;
let data: any[] = [];
let urlData = "";

const token = crypto.getToken();

const getData = async () => {
  try {
    const axios = await apiClientPromise;
    data = [];
    while (currentPage <= totalPageData) {
      const response = await axios.get(`/${urlData}&page=${currentPage}`, {
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      data = data.concat(response.data.data.data);
      currentPage++;
    }
    currentPage = 1;
    return data;
  } catch (error) {
    ;
  }
};

const setData = async (url: string, totalPage: number) => {
  totalPageData = totalPage;
  urlData = url;
};

const pagination = {
  setData,
  getData,
}

export default pagination;