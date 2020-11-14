<template>
  <div class="login_bg">
    <div class="login-wrapper">
        <h3>登录</h3>
      <el-form  label-width="0" :model="info" :rules="rules" ref="ruleForm">
          <!-- porp：指定验证规则名称 -->
        <el-form-item prop="username">
          <el-input v-model="info.username"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input type="password" v-model="info.password"></el-input>
        </el-form-item>
        <el-button type="primary" @click="loginFn">登录</el-button>
      </el-form>
    </div>
  </div>
</template>
<script>
import {mapActions} from "vuex"
export default {
    data(){
        return {
            info:{
                username:"",
                password:""
            },
            rules:{
                // key: el-form-item prop
                username:[{
                    required:true,//必填
                    message:"请输入账户名",//提示信息
                    trigger:"blur"//触发条件
                },{
                    max:6,
                    min:4,
                    message:"请输入4-6个字母",
                    trigger:"blur"
                }],
                password:[{
                    required:true,//必填
                    message:"请输入密码",//提示信息
                    trigger:"blur"//触发条件
                },{
                    pattern:/^\d{4,6}$/,//正则
                    message:"请输入4-6个数字",
                    trigger:"blur"
                }]
            }
        }
    },
    methods:{
        ...mapActions(["login"]),
        /* login(formdata){
            this.$store.dispatch("login",formdata)
        }, */
        loginFn(){
            // validate:对表单数据进行验证的方法
            // 验证结束后执行回调函数 ，该函数的参数就是验证结构
            this.$refs.ruleForm.validate((value)=>{
                // console.log(value)
                //  验证通过
                if(value){
                    // console.log(this.login)
                    this.login(this.info);
                }
            })
        }
    }
};
</script>
<style lang="stylus">
.login_bg {
  height: 100%;
  background: -webkit-linear-gradient(left, #563443, #413a53, #2f3d60);

  .login-wrapper {
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    width: 300px;
    height: 300px;
    h3{
        margin 20px auto 
        color #fff
        text-align center
    }   
    .el-button--primary {
        width 100%
    }

  }
}
</style>