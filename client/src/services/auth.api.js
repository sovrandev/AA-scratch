import axios from 'axios';
import config from './config';

const API = axios.create({
  baseURL: `${config.site.backend.url}/api`,
  headers: {
    'Content-Type': 'application/json'
  }
});

API.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['x-auth-token'] = `${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

class AuthApi {
  async me() {
    try {
      const response = await API.get('/auth/me');
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async register(username, email, password, captcha) {
    try {
      const response = await API.post('/auth/credentials/register', { username, email, password, captcha });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async login(email, password, captcha) {
    try {
      const response = await API.post('/auth/credentials', { email, password, captcha });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

}

export default new AuthApi(); 