import axios from "axios"



/* 
*所有axios的响应都会被该拦截器的拦截  
*定义响应拦截器
*res :响应正常接受的数据
*
*
*/

axios.interceptors.response.use(res => {
    // console.log(res)
    // return 用户使用的数据
    // Do something before request is sent
    return res.data;
}, error => {
    // Do something with request error
    return Promise.reject(error);
});
/**
 * get :发送get 请求的方法
 * @url：请求路径
 * @params:参数
 * : 返回axios promise 对象
 */
function get(url, params = {}) {
    return new Promise((res, rej) => {
        axios({
            method: "get",
            url,
            params,
        }).then(data => {
            res(data)
        }).catch(err => {
            rej(err)
        })
    })
}

function post(url, data = {}) {
    return new Promise((res, rej) => {
        axios({
            method: "post",
            url,
            data,
        }).then(data => {
            res(data)
        }).catch(err => {
            rej(err)
        })
    })
}


function upload(url, data = {}) {
    return new Promise((res, rej) => {
        //1. 实例化FormData，文件上传的容器 (为了实现文件上传)
        let formdata = new FormData();
        //2. 将表单数据转移到 formdata实例中
        for (var key in data) {
            // append：向formdata实例中添加数据
            // @key: 被添加数据名称 
            // @this.form[key]:被添加数据值
            formdata.append(key, data[key]);
        }
        axios({
            method: "post",
            url,
            data: formdata,
            headers: {
                "Content-Type": "multipart/form-data"
            }
        }).then(data => {
            res(data)
        }).catch(err => {
            rej(err)
        })
    })
}


export default {
    get,
    post,
    upload
}