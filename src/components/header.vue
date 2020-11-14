<template>
    <div class="layout_header">
        <el-dropdown @command="commandFn">
            <!-- 用户看到的部分 -->
            <span class="el-dropdown-link">
                {{username}} <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <!--  -->
            <el-dropdown-menu slot="dropdown">
                <el-dropdown-item >登出</el-dropdown-item>
            </el-dropdown-menu>
        </el-dropdown>
    </div>
</template>
<script>
import {mapGetters,mapMutations} from "vuex"
export default {
    computed:{
        ...mapGetters(["username"])
    },
    methods:{
        // vuex 登出的mutation
        ...mapMutations(["logout"]),
        commandFn(){
            this.logout()
        }
    }
}
</script>
<style lang="stylus">
    .layout_header{
        height 60px
        line-height 60px
        text-align right
        
    }
</style>