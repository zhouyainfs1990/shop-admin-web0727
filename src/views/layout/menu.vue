<template>
    <div>
        <!--  separator：分割符-->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>菜单管理</el-breadcrumb-item>
        </el-breadcrumb>
        <el-button type="primary" @click="addFn">添加</el-button>
        <v-table :tableData="tableData" @edit="edit" @del="deleteFn"></v-table>
        <v-dialog ref="dialog" :info="info" @getTableData="getTableData" ></v-dialog>
    </div>
</template>
<script>
import VTable from "./menu/table"
import VDialog from "./menu/dialog"
import axios from "axios"
export default {
    data(){
        return{
            // 表格数据，给 table 子组件props 使用
            tableData:[],
            // dialog 相关的信息
            info:{
                isShow:false,//对话框是否显示
                isAdd:true, //当前进行添加还是修改 true：添加 false :修改
            }
        }
    },
    methods:{
        deleteFn(data){
            this.tableData = data;
        },
        // 获取树形数据的方法
        async getTableData(){
            let res = await axios.get("/api/menulist",{params:{
                istree:true
            }});
            // console.log(res)
            if(res.code==200){
                this.tableData = res.list;
            }else{
               this.$message.error(res.msg);
            }

        },
        // 点击添加按钮
        addFn(){
            this.info.isShow = true;
        },
        // 响应table 组件 编辑按钮事件
        async edit(id){
            /* this.info.isShow = true;
            this.info.isAdd = false; */
            this.info = {
                isShow:true,
                isAdd:false
            }
            // console.log(id)
            let res = await axios.get("/api/menuinfo",{params:{id}});
            // console.log(res)
            if(res.list){
                // 将当前的 返回的这条数据信息 直接赋值给data 表单

                // 添加修改需要的id
                // 修改status 为boolean
                this.$refs.dialog.form = {id,...res.list,status:res.list.status===1?true:false}
            }
        }
    },
    created(){
        this.getTableData()
    },
    components:{
        VTable,
        VDialog
    }
}
</script>