import axios, { AxiosRequestConfig } from "axios";
import { ServerResponse } from "../types";

const api = axios.create({
  baseURL: process.env.REACT_APP_SERVICE_REQUEST_URL,
  withCredentials: true
});

export const makeRequest = <T>(url: string, options?: AxiosRequestConfig): Promise<ServerResponse<T>> => {
  return api(url, options)
    .then(res => res.data)
    .catch(error => Promise.reject(error?.response?.data?.message || 'Custom error message that must be rewrite'));
}