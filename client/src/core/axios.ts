import axios from 'axios';

axios.create({
  baseURL: process.env.REACT_APP_SERVICE_REQUEST_URL || "http://localhost:3001",
  withCredentials: true
});

export { axios };