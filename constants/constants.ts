import axios from "axios";

export const AsyncStorageKey = {
  IPAddress: "ipaddress",
  credit: "credit",
};

export const fetcher = (url: string) => axios.get(url).then((res) => res.data);
