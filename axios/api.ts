import axios from 'axios';
import { getSession, GetSessionParams } from 'next-auth/react';
import { config } from 'process';

export const url = process.env.NEXT_PUBLIC_BASE_URL_API;
export const apiAuth = axios.create({
  baseURL: url,

  withCredentials: true,
});
type SessionType = {
  user: {
    accessToken: string;
  };
};
apiAuth.interceptors.request.use(async (req) => {
  const session = await getSession();
  if (!req) {
    req = {};
  }
  if (!req.headers) {
    req.headers = {};
  }

  req.headers.Authorization = session?.user.accessToken as string;

  return req;
});
