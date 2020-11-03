import axios from 'axios';

const Api = axios.create({baseURL: 'http://192.168.47.22:3001/api/v1'});

export default Api;