import axios from 'axios';
import LOG4 from './log4js';

const http = axios.create();

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
