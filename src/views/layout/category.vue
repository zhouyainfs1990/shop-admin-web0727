<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>分类管理</el-breadcrumb-item>
    </el-breadcrumb>
    <el-button type="primary" @click="addFn">添加</el-button>
    <!--
        data:表格数据
        row-key: 每一行唯一标识 （指定数据对象的id 作为标识）
        :tree-props: 树形数据的配置
            children: 子数据的字段名称
            hasChildren：是否包含子数据
    -->
    <el-table
      :data="tableData"
      style="width: 100%;margin-bottom: 20px;"
      row-key="id"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
    >
      <!-- 每一列 
        prop:这一列数据关联的字段名称
        label:这一列 标题
      -->
      <el-table-column prop="catename" label="分类名称"></el-table-column>
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
      :title="info.isAdd?'新增管理员':'编辑管理员'"
      :visible.sync="info.isShow"
    >
      <el-form :model="form" ref="ruleForm" :rules="rules" label-width="100px">
        <el-form-item label="菜单名称">
          <el-select v-model="form.pid">
            <el-option label="顶级分类" :value="0"></el-option>
            <el-option
              v-for="(item,index) in topCate"
              :key="index"
              :label="item.catename"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="分类名称">
          <el-input v-model="form.catename"></el-input>
        </el-form-item>
        <el-form-item label="分类图片">
          <!-- 
            el-upload:上传组件
            action: 自动上传地址
              
            on-preview:出现预览按钮，响应点击预览事件
            on-change: 文件状态改变时的钩子，添加文件、上传成功和上传失败时都会被调用
           -->
          <el-upload
            ref="file"
            action="#"
            list-type="picture-card"
            :auto-upload="false"
            :on-preview="handlePreview"
            :on-change ="picChange"
            :file-list="info.fileList"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
          <!--显示上传图片预览的对话框 
            append-to-body 嵌套内部对话框设置该属性才能正常显示
           -->
          <el-dialog :visible.sync="info.dialogVisible" append-to-body>
            <img width="100%" :src="info.dialogImageUrl" alt />
          </el-dialog>
          <!-- <input type="file"  ref="file" /> -->
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
import axios from "axios";
let defaultForm = {
  pid: 0,
  img: "",
  status: true,
  catename: ""
};
export default {
  data() {
    return {
      // 顶级分类
      topCate: [],
      tableData: [],
      info: {
        isShow: false,
        isAdd: true,
        dialogVisible:false,//预览图显示状态
        dialogImageUrl:"",//预览图地址
        fileList:[],//上传文件列表
      },
      form: {
        ...defaultForm
      },
      rules: {
        catename: [
          {
            required: true,
            message: "请输入管理员名称",
            trigger: "blur"
          }
        ]
      }
    };
  },
  created() {
    this.getTableData();
  },
  methods: {
    // 添加上传图片触发的钩子
    // file:被上传的文件信息
    // fileList:被上传的文件信息列表
    picChange(file,fileList){
      // console.log(file,fileList)
      // 设置表单的上传文件 img
      this.form.img = file.raw;
      // 设置预览图的图片地址
      this.info.dialogImageUrl = file.url;
    },
    // 预览钩子
    handlePreview(){
      console.log("在预览")
      this.info.dialogVisible = true;
    },
    // 获取顶级分类
    async getTopCate() {
      let res = await this.$http.get("/api/catelist", { pid: 0 });
      if (res.code == 200) {
        console.log(res);
        this.topCate = res.list;
      }
    },
    // 
    async getTableData() {
      let res = await this.$http.get("/api/catelist", { istree: true });
      if (res.code == 200) {
        // console.log(res);
        this.tableData = res.list;
      }
    },
    openFn() {
      this.getTopCate();
    },
    resetFn() {
      console.log(this.$refs.file);
      // 清除上传文件列表
      this.$refs.file.clearFiles();
      this.info.isAdd = true;
      this.info.dialogVisible = false;
      this.info.dialogImageUrl = "";
      this.form = {
        ...defaultForm
      }
    },
    async editFn(id) {
        console.log(id);
        this.info.isShow = true;
        this.info.isAdd = false;

        let res = await this.$http.get("/api/cateinfo",{id});
        
        console.log(res);
        if(res.code==200){
            this.form.id = id;
            this.form.pid = res.list.pid;
            this.form.status = res.list.status==1?true:false;
            this.form.catename = res.list.catename;
            if(res.list.img){
              this.form.img = res.list.img
            }
            /* 设置上传文件列表 */
            // this.info.fileList = [{name:"",url:"https://imgm.gmw.cn/attachement/jpg/site215/20201113/5114833073091398003.jpg"}];
            //  图片地址是相对于后台服务器的localhost:3000相对地址，需要转化为绝对地址
            this.info.fileList = [{name:"",url:this.$domain+res.list.img}]     
        }
    },
    async deleteFn(id) {
        try{
            await this.$confirm('此操作将永久删除该分类, 是否继续?', '', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
            let res = await this.$http.post("/api/catedelete",{id})
            console.log(res)
            if(res.code==200){
              this.getTableData();
            }
        }catch(error){
            
        }  
    },
    addFn() {
      this.info.isShow = true;
    },
    // 提交
    async submitFn() {
      // 
      this.form.status = this.form.status ? 1 : 2;
      let url = this.info.isAdd ? "/api/cateadd" : "/api/cateedit";
      console.log(this.form);
      let res = await this.$http.upload(url, this.form);
      if (res.code == 200) {
        this.getTableData();
        this.$message.success(res.msg);
      }

      this.info.isShow = false;
    }
  }
};
</script>