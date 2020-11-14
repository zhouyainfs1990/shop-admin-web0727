import Vue from "vue"
import Vuex from "vuex"
import axios from "axios"
import router from "@/router"
import {Message} from "element-ui"
Vue.use(Vuex)

let store = new Vuex.Store({
    state:{
        // 保存在vuex 中用户数据
        userinfo:localStorage.getItem("userinfo")?JSON.parse(localStorage.getItem("userinfo")):{}
    },
    getters:{
        // 用户名
        username(state){
            return state.userinfo.username;
        },
        // 用户可访问的菜单
        menus(state){
            return state.userinfo.menus;
        }
    },
    mutations:{
        // 保存登录信息
        setinfo(state,info){
            state.userinfo = info;
        },
        logout(state){
            // 清空localStorage 中登陆信息
            localStorage.clear();
            // 清除state 中的数据
            state.userinfo = {};
            // 跳转到登陆页
            router.replace("/login")
        }
    },
    actions:{
        // 登录
        // formdata:登录提交的参数
        login(context,formdata){
            axios.post("/api/userlogin",formdata).then((res)=>{
                console.log(res.data)
                // 登录成功
                if(res.data.code==200){
                    // 储存登录信息
                    localStorage.setItem("userinfo",JSON.stringify(res.data.list))
                    context.commit("setinfo",res.data.list)
                    router.replace("/")
                }else{
                    Message({
                        message:res.data.msg,
                        type:"error"
                    })
                }
            })
        }
    }

})


export default store