import axios from 'axios';
const req = axios.create()
req.interceptors.request.use(
    function(config) {
        config.headers.token = localStorage.getItem("token")
            // 在发送请求之前进行操作
        return config;
    },
);
export  default req;