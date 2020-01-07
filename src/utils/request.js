import axios from 'axios'
import config from "../../setting";
import {message} from "antd";

axios.defaults.timeout = config.API_TIME;
axios.defaults.baseURL = config.API_ROOT;
axios.defaults.headers.post['Content-Type'] = 'application/json';//'application/x-www-form-urlencoded;charset=UTF-8';

axios.interceptors.request.use(
  config=>{
    const configInfo = JSON.parse(sessionStorage.getItem('accountInfo')) || {};
    const token =configInfo.tokenId;
    token && (config.headers.token = token);
    return config
  },
  e =>{
    return Promise.error(e)
  }
);
axios.interceptors.response.use(
  response=>{
    if (response.data.code===-100) {
      message.warning('请重新登录');
      window.location.href = '/login';
      return Promise.reject(response)
    }
    return Promise.resolve(response);
  },
  e =>{
    const { response } = e;
    if (response) {
      switch (response.status) {
        // 404请求不存在
        case 404:
          message.error('网络请求不存在');
          break;
        case 500:
          message.error('服务器异常');
          break;
        default:
          message.error('未知异常')
      }
      return Promise.reject(e.response)
    } else {
      if (String(e).toLowerCase().indexOf('timeout')>-1) {
        message.error('请求超时，请稍后重试')
      }
      return Promise.reject(e)
    }
  }
);


export function get(url, params={}) {
  //console.log(url,params);
  return new Promise((resolve, reject) => {
    axios.get(url, {params}).then(res => {
      resolve(res.data)
    }).catch(e => {
      reject(e.data)
    })
  })
}

export function post(url, params={}) {
  return new Promise((resolve, reject) => {
    axios.post( url, params).then(res => {
      resolve(res.data)
    }).catch(e => {
      reject(e.data)
    })
  })
}

export function put(url, params={}) {
  return new Promise((resolve, reject) => {
    axios.put( url, params).then(res => {
      resolve(res.data)
    }).catch(e => {
      console.log(e,'---ee');
      reject(e.data)
    })
  })
}

export function rPost(url, methodName, data = []) {
  return new Promise((resolve, reject) => {
    data.unshift(config.API_CHAIN_ID);
    const params = {"jsonrpc": "2.0", "method": methodName, "params": data, "id": Math.floor(Math.random() * 1000)};
    axios.post(config.API_URL + url, params)
      .then(response => {
        resolve(response.data)
      }, err => {
        reject(err)
      })
  })
}
