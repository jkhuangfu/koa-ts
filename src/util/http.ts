import axios from 'axios';
const http = axios.create({ timeout: 5000 });

// 添加响应拦截器
http.interceptors.response.use(
  (response: any) => {
    return response.data;
  },
  (error: any) => {
    LOG4.http.error('TCL: error', error);
    return Promise.reject(error);
  }
);
export default http;
