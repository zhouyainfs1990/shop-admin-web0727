<template>
  <!-- 
    open: 打开对话框的事件 -》 获取顶级菜单的数据
    close: 关闭对话框的事件（info.isShow = false） ->重置对话框状态和表单信息 
   -->
  <el-dialog @open="openFn" @close="resetFn" :title="info.isAdd?'新增菜单':'编辑菜单'" :visible.sync="info.isShow">
    <el-form :model="form" label-width="100px" :rules="rules" ref="ruleForm">
      <!-- 
            选择上级菜单的id 作为自己新增菜单的pid
      -->
      <el-form-item label="菜单名称">
        <el-select v-model="form.pid" @change="changeMenu">
          <el-option label="顶级菜单" :value="0"></el-option>
          <!-- 动态生成option
                label:选项文本
                value: v-model 关联的数据
          -->
          <el-option
            v-for="(item,index) in topMenus"
            :key="index"
            :label="item.title"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="菜单名称" prop="title">
        <el-input v-model="form.title"></el-input>
      </el-form-item>
      <el-form-item v-if="form.type==1" label="目录图标">
        <el-input v-model="form.icon"></el-input>
      </el-form-item>
      <el-form-item v-if="form.type==2" label="菜单地址">
        <el-input v-model="form.url"></el-input>
      </el-form-item>
      <el-form-item label="类型">
        <el-radio v-model="form.type" :disabled="form.type==2" :label="1">目录</el-radio>
        <el-radio v-model="form.type" :disabled="form.type==1" :label="2">菜单</el-radio>
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
</template>
<script>
import axios from "axios";
// 表单的初始数据
let defaultForm = {
    pid: 0,
    title: "",
    type: 1,
    icon: "",
    url: "",
    status: true
}
export default {
  methods: {
    // 关闭对话框触发事件
    resetFn(){
       // 重置表单
        this.form = {
            ...defaultForm
        }
        // 重置对话框状态
        this.info.isAdd = true;
        console.log("resetFn")
    },

    // 提交操作 （1.添加  2.编辑）
     submitFn(){
        this.$refs.ruleForm.validate(async (value)=>{
            if(value){
                // console.log(value)
                // 利用 isAdd 判断 提交的接口地址
                let url = this.info.isAdd? "/api/menuadd":'/api/menuedit';
                console.log(this.form)
                this.form.status = this.form.status?1:2;
                let res = await axios.post(url,this.form);

                if(res.code==200){
                    // 通知父组件更新table 的属性数据
                    this.$emit("getTableData")
                }else{
                    this.$message.error(res.msg)
                }
                // console.log(res);
                this.info.isShow = false;
                
            }
        })
    },

    // 切换菜单的事件函数
    // @value:选中的option的value
    changeMenu(value) {
      console.log(value);
      // 根据value 来判断 type 类型
      // 1: 顶级菜单（目录） 2：普通菜单（二级菜单）
      this.form.type = value === 0 ? 1 : 2;
    },
    //  对话框弹出事件函数
    openFn() {
      this.getTop();
    },
    // 获取顶级菜单列表
    async getTop() {
      let res = await axios.get("/api/menulist", {
        params: {
          pid: 0
        }
      });
      console.log(res);
      if (res.code == 200) {
        this.topMenus = res.list ? res.list : [];
      } else {
        this.$message.error(res.msg);
      }
    }
  },
  data() {
    return {
      // 顶级菜单列表
      topMenus: [],
      form: {
        ...defaultForm
      },
      // 验证规格
      rules:{
        title:[{
            required:true,//必填
            message:"请输入菜单名称",//提示信息
            trigger:"blur"//触发条件      
        }]
      }
    };
  },
  props: ["info"]
};
</script>