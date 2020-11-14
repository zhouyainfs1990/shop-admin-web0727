<template>
    <div class="layout_bg">
        <el-container class="layout_container">
            <el-aside width="250px">
                <v-aside></v-aside>
            </el-aside>
            <el-container>
                <el-header class="header">
                    <v-header></v-header>
                </el-header>
                <el-main class="main-wrapper"><router-view></router-view></el-main>
            </el-container>
        </el-container>
    </div>
</template>
<script>
import VAside from "@/components/aside"
import VHeader from "@/components/header"
export default {
    components:{
        VAside,
        VHeader
    }
}
</script>
<style lang="stylus">
    .layout_bg{
        height 100%;
        .layout_container{
            height 100%
            .header{
                background #e3e3e3
            }
            .main-wrapper{
                background #f3f3f3
            }
        }
    }
</style>