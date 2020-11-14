import Vue from 'vue'
import Router from 'vue-router'


const layout = ()=> import("@/views/layout")
Vue.use(Router)

let router = new Router({
  routes: [
    {
      path:"/login",
      component:()=> import("@/views/login")
    },
    {
      path: '/',
      component: layout,
      children:[{
        path:"index",
        component:()=> import("@/views/layout/index")
      },{
        path:"menu",
        component:()=> import("@/views/layout/menu")
      },{
        path:"role",
        component:()=> import("@/views/layout/role")
      },{
        path:"user",
        component:()=> import("@/views/layout/user")
      },{
        path:"category",
        component:()=> import("@/views/layout/category")
      },{
        path:"*",
        redirect:"/index"
      }]
    }
  ]
})
// 思路分析：是否已登录

/* 
* 是否登录的标志 localStorage 是否存在userinfo
* 没有的登录只能访问 登陆页
* 已登录，可以正常访问其他页面
*/ 

router.beforeEach((to,from,next)=>{
  //已登录 
  if(localStorage.getItem("userinfo")){
    // 访问登录进行阻止
    if(to.path=="/login"){
      next(false);
    }else{
      next();
    }
  }else{
    // console.log("没登录")
    // next("/login")

    // 没登录访问login 正常访问
    if(to.path=="/login"){
      next();
    }else{
       // 没登录其他路由访问login 跳转到 login
      next("/login")
    }
  }
})
export default router
