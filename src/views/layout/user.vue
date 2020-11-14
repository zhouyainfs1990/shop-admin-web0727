<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>管理员管理管理</el-breadcrumb-item>
    </el-breadcrumb>
    <el-button type="primary" @click="addFn">添加</el-button>
    <el-table :data="tableData" row-key="id" label-width="180px">
      <el-table-column label="用户编号" prop="uid"></el-table-column>
      <el-table-column label="角色名称" prop="rolename"></el-table-column>
      <el-table-column label="用户名" prop="username"></el-table-column>
      <el-table-column label="状态">
        <template slot-scope="scope">
          <el-tag effect="dark" type="success" v-if="scope.row.status==1">启用</el-tag>
          <el-tag type="danger" effect="dark" v-else>禁用</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button @click="editFn(scope.row.uid)">编辑</el-button>
          <el-button type="danger" @click="deleteFn(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器
        background :带背景颜色
        layout ：分页器结构，prev后退, pager 点击翻页, next前进
        page-size:每页条数
        current-page：当前页数
        total:总条数
    -->
    <el-pagination
      background
      :page-size="size"
      :current-page.sync="page"
      layout="prev, pager, next"
      :total="total"
      @current-change="pageChange"
    ></el-pagination>

    <!--  -->
    <el-dialog
      @open="openFn"
      @close="resetFn"
      :title="info.isAdd?'新增管理员':'编辑管理员'"
      :visible.sync="info.isShow"
    >
      <el-form :model="form" ref="ruleForm" :rules="rules" label-width="100px">
        <el-form-item label="角色">
          <el-select v-model="form.roleid">
            <el-option v-for="(item,index) in roleList" :key="index"  :label="item.rolename" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input type="password" v-model="form.password"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-switch v-model="form.status"></el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="info.isShow=false">取 消</el-button>
        <el-button type="primary" @click="submitFn">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
let defaultForm = {
  roleid: "",
  username: "",
  password: "",
  status: true
};
import axios from "axios";
export default {
  data() {
    return {
        // 角色列表数据（对话框使用）
      roleList: [],
      tableData: [],
    //   分页器
      page: 1,
      size: 2,
      total: 0,
      info: {
        isShow: false,
        isAdd: true
      },
      form: {
        ...defaultForm
      },
      rules: {
        username: [
          {
            required: true,
            message: "请输入管理员名称",
            trigger: "blur"
          }
        ]
      }
    };
  },
  methods: {
    //  请求表格数据的axios promise对象
    getList() {
      return this.$http.get("/api/userlist", {
        page: this.page,
        size: this.size
      });
    },
    // 请求总条数的axios promise对象
    getTotal() {
      return this.$http.get("/api/usercount");
    },
    getTableData() {
      // all 接受 axios promise对象组成的数组作为参数
      axios.all([this.getList(), this.getTotal()]).then(
        axios.spread((tableData, total) => {
          // 两个请求现在都执行完成
          // console.log(tableData, total)
          if (tableData.code === 200 && total.code == 200) {
            this.tableData = tableData.list?tableData.list:[];
            this.total = total.list?total.list[0].total:0;
          }
        })
      );
    },
    // 页码发生变化执行的函数
    pageChange(current){
        // console.log(current)
        this.page = current;
        // 根据当前的页数来获取当前页面的数据重新渲染
        this.getTableData();
    },
    // 获取角色列表
    async getRoleList() {
      let res = await this.$http.get("/api/rolelist");
      if (res.code == 200) {
        console.log(res.list);
        this.roleList = res.list;
      }
    },
    addFn() {
      this.info.isShow = true;
    },
    openFn() {
      this.getRoleList();
    },
    resetFn() {
        this.info.isAdd = true;
        this.form= {
            ...defaultForm
        }
    },
    async submitFn() {
        //   记得进行表单验证
        console.log(this.form)
        let url = this.info.isAdd?"/api/useradd":"/api/useredit";
        this.form.status = this.form.status?1:2;
        let res = await this.$http.post(url,this.form);
        console.log(res);
        if(res.code==200){
            this.$message.success(res.msg)
            this.getTableData();
        }else{
            this.$message.error(res.msg)
        }
        this.info.isShow = false;

    },
    /* async getTableData() {
      let res = await this.$http.get("/api/userlist", {
        page: this.page,
        size: this.size
      });
      let res1 = await this.$http.get("/api/usercount")
      console.log(res,res1)
      if (res.code === 200&&res1.code==200) {
        this.tableData = res.list;
        this.total = res1.list[0].total;

      }
    }, */
    async editFn(uid) {
        console.log(uid);
        this.info.isShow = true;
        this.info.isAdd = false;

        let res = await this.$http.get("/api/userinfo",{uid});
        
        console.log(res);
        if(res.code==200){
            this.form.uid = res.list.uid;
            this.form.status = res.list.status==1?true:false;
            this.form.username = res.list.username;
            this.form.roleid = res.list.roleid;
            // 密码 提交空字符串就是不修改
        }
    },
    async deleteFn(id) {
        try{
            await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
            let res = await this.$http.post("/api/userdelete",{id})
            console.log(res)
            if(res.code==200){
                // 删除后退回第一页
                this.page = 1;
                this.getTableData();
            }
        }catch(error){
            
        }
        
    }
  },

  created() {
    this.getTableData();
  }
};
</script>