import { AxiosRequestConfig } from "axios";
import { axios } from "../core/axios";


export const makeRequest = (url: string, options?: AxiosRequestConfig): Promise<void> => {
  return axios(url, options)
    .then(res => res.data)
    .catch(error => Promise.reject(error?.response?.data?.messagev || 'Custom error message that must be rewrite'));
}