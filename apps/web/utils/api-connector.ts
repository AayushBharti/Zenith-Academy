import axios from "axios"

export const axiosInstance = axios.create({})

export const apiConnector = (
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH",
  url: string,
  bodyData?: any,
  headers?: any,
  params?: any
) => {
  return axiosInstance({
    method: method,
    url: url,
    data: bodyData ? bodyData : null,
    headers: headers ? headers : null,
    params: params ? params : null,
  })
}
