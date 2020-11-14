<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>角色管理</el-breadcrumb-item>
    </el-breadcrumb>
    <el-button type="primary" @click="addFn">添加</el-button>
    <el-table :data="tableData" row-key="id" label-width="180px">
      <el-table-column label="角色名称" prop="rolename"></el-table-column>
      <el-table-column label="状态">
        <template slot-scope="scope">
          <el-tag effect="dark" type="success" v-if="scope.row.status==1">启用</el-tag>
          <el-tag type="danger" effect="dark" v-else>禁用</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button @click="editFn(scope.row.id)">编辑</el-button>
          <el-button type="danger" @click="deleteFn(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      @open="openFn"
      @close="resetFn"
      :title="info.isAdd?'新增菜单':'编辑菜单'"
      :visible.sync="info.isShow"
    >
      <el-form :model="form" ref="ruleForm" :rules="rules" label-width="100px">
        <el-form-item label="角色名称" prop="rolename">
          <el-input v-model="form.rolename"></el-input>
        </el-form-item>
        <el-form-item label="角色权限">
          <!-- 
                  data: 树形组件的数据
                  props: 设置项 
                        label: 数据文本字段名称
                        children: 子数据的字段名称
                  show-checkbox: 是否显示选择框
                  node-key:每一个节点对应 key值 的字段
                  check-strictly :父子是否不关联
          -->
          <el-tree
            ref="tree"
            :data="menusList"
            :props="{
                    label: 'title',
                    children: 'children'
                }"
            show-checkbox
            node-key="id"
            check-strictly
            :default-checked-keys="defaultKeys"
          ></el-tree>
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
  rolename: "",
  menus: "",
  status: true
};
export default {
  data() {
    return {
      defaultKeys: [],
      // 权限菜单列表
      menusList: [],
      tableData: [],
      info: {
        isShow: false,
        isAdd: true
      },
      form: {
        ...defaultForm
      },
      rules: {
        rolename: [
          {
            required: true,
            message: "请输入角色名称",
            trigger: "blur"
          }
        ]
      }
    };
  },
  methods: {
    async submitFn() {
      //获取 被选中项 node-key 组成的数组
      //   console.log(this.$refs.tree.getCheckedKeys());
      //   记得进行表单验证
      //
      let url = this.info.isAdd ? "/api/roleadd" : "/api/roleedit";
      // 转换数组为字符串
      this.form.menus = this.$refs.tree.getCheckedKeys().join(",");
      this.form.status = this.form.status ? 1 : 2;
      console.log(this.form);
      let res = await this.$http.post(url, this.form);
      if (res.code == 200) {
        this.getTableData();
        // console.log(res);
        this.$message.success(res.msg);
      } else {
        this.$message.error(res.msg);
      }
      this.info.isShow = false;
    },

    //   获取菜单权限列表
    async getMenus() {
      let res = await this.$http.get("/api/menulist", { istree: true });
      // console.log(res)
      this.menusList = res.list ? res.list : [];
    },
    resetFn() {
      this.form = {
        ...defaultForm
      };
      // 重置对话框状态
      this.info.isAdd = true;
      //   重置默认选择的树状 组件的数据
      this.defaultKeys = [];
    },
    openFn() {
      this.getMenus();
    },
    // 获取表格数据
    async getTableData() {
      //   console.log(this.$http.get);
      let res = await this.$http.get("/api/rolelist");
      // console.log(res)
      if (res.code === 200) {
        this.tableData = res.list;
      }
    },
    // 添加按钮
    addFn() {
      this.info.isShow = true;
    },
    // 点击编辑
    async editFn(id) {
      // 切换对话框状态
      this.info.isShow = true;
      this.info.isAdd = false;
      //   请求数据
      let res = await this.$http.get("/api/roleinfo", { id });
      console.log(res);
      this.form.rolename = res.list.rolename;
      this.form.status = res.list.status === 1 ? true : false;
      this.form.id = id;
      //   设置默认勾选项
      this.defaultKeys = res.list.menus.split(",");
    },
    deleteFn(id) {
      // console.log(id)
      this.$confirm("此操作将永久删除该角色, 是否继续?", "", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          console.log(id);
          // 点击确定
          let res = await this.$http.post("/api/roledelete", { id });
          console.log(res);
          if (res.code == 200) {
            this.$message.success("删除成功");
            // 触发自定义事件，后台服务器返回的删除成功后的数据传递个父组件，更新tableData
            // this.$emit("del", res.list);
            this.tableData = res.list ? res.list : [];
          }
        })
        .catch(() => {
          //点击取消
        });
    }
  },

  created() {
    this.getTableData();
  }
};
</script>