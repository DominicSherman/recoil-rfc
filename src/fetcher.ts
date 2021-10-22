import axios from 'axios';

export const axiosInstance = axios.create({
  baseURL: 'https://rickandmortyapi.com/api',
})

export const fetcher = async (endpoint: string) => {
  const {data} = await axiosInstance.get(endpoint);

  return data;
}