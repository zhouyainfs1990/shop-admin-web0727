<template>
  <div class="navs">
    <el-menu unique-opened background-color="#545c64" text-color="#fff" active-text-color="#ffd04b">
      <h2>后台管理系统</h2>
      <el-menu-item>
        <router-link to="/index" index="/index">
          <i class="el-icon-s-home"></i>
          <span>首页</span>
        </router-link>
      </el-menu-item>
      <!-- 定义包含子菜单的导航栏 -->
      <el-submenu v-for="(submenu,index) in menus" :key="index" :index="(index+1).toString()">
        <template slot="title">
          <!-- 一级导航的标题 -->
          <i :class="submenu.icon"></i>
          <span>{{submenu.title}}</span>
        </template>
        <el-menu-item v-for="(item,index) in submenu.children" :key="index" :index="item.url">
          <router-link :to="item.url" >
            <i :class="item.icon"></i>
            <span>{{item.title}}</span>
          </router-link>
        </el-menu-item>
      </el-submenu>
    </el-menu>
  </div>
</template>
<script>
import {mapGetters} from "vuex"
export default {
  computed:{
    // menus：vuex 中 ，后台返回的访问 导航信息
    ...mapGetters(["menus"])
  }
}
</script>
<style lang="stylus">
.navs {
  background #545c64
  height 100%
  h2 {
    color: #fff;
    margin: 20px auto;
    text-align: center;
  }

  .el-menu-item {
    .router-link-active {
      color: #ffd04b;
      i {
        color: #ffd04b;
      }
    }

    a {
      color: #fff;
      text-decoration: none;
    }
  }
}
</style>