import axios, { AxiosRequestConfig } from 'axios';

// 无感刷新 token 等待队列（阻断多余的 refreshToken 操作）
interface PendingTask {
  config: AxiosRequestConfig;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  resolve: (value: any) => void;
}
let isRefreshing = false;
const queue: PendingTask[] = [];

const axiosInstance = axios.create({
  baseURL: '/api/',
});

axiosInstance.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem('accessToken');

  if (accessToken) {
    config.headers.Authorization = 'Bearer ' + accessToken;
  }

  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { data, config } = error.response;

    // 正在刷新 token 时，拦截其他请求，等待刷新完后在重放
    if (isRefreshing) {
      return new Promise((resolve) => {
        queue.push({
          config,
          resolve,
        });
      });
    }

    // token 过期且非调用 refresh 接口时
    if (data.statusCode === 401 && !config.url.includes('/refresh')) {
      isRefreshing = true;

      // 无感刷新 token
      const { data, status } = await refreshToken(
        localStorage.getItem('refreshToken') || '',
      );

      if (status === 200) {
        isRefreshing = false;
        // 重放 refresh 期间的其他请求
        queue.forEach(({ config, resolve }) => {
          resolve(axiosInstance(config));
        });
        queue.splice(0, queue.length);

        // 重新调用原接口并返回
        return await axiosInstance(config);
      } else {
        alert(data || '登录过期，请重新登录');
      }
    } else {
      return error.response;
    }
  },
);

export async function userLogin(data: { username: string; password: string }) {
  return (await axiosInstance.post('/login', data)).data;
}

export async function refreshToken(token: string) {
  const res = await axiosInstance.get('/refresh', { params: { token } });

  localStorage.setItem('accessToken', res.data.accessToken);
  localStorage.setItem('refreshToken', res.data.refreshToken);
  return res;
}

export async function getInfo() {
  return (await axiosInstance.get('/getInfo')).data;
}
