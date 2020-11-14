<template>
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
    <el-table-column prop="title" label="名称" width="180"></el-table-column>
    <el-table-column label="图标" width="180">
      <!-- scope.row ：当前行的数据对象  -->
      <!-- 使用作用域插槽 来 展示这一列的内容 -->
      <template slot-scope="scope">
        <i :class="scope.row.icon"></i>
      </template>
    </el-table-column>
    <el-table-column label="类型" width="200">
      <template slot-scope="scope">
        <el-tag v-if="scope.row.type==1">目录</el-tag>
        <el-tag v-else type="success">菜单</el-tag>
      </template>
    </el-table-column>
    <el-table-column prop="url" label="地址URL" width="180"></el-table-column>
    <el-table-column label="操作">
      <template slot-scope="scope">
        <el-button @click="editFn(scope.row.id)">编辑</el-button>
        <el-button type="danger" @click="deleteFn(scope.row.id)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>
<script>
import axios from "axios";
export default {
  props: {
    tableData: Array
  },
  methods: {
    //   点击编辑
    editFn(id) {
      this.$emit("edit", id);
    },
    // 点击删除
    deleteFn(id) {
      this.$confirm("此操作将永久删除该菜单, 是否继续?", "", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
            // 点击确定
            let res = await axios.post("/api/menudelete",{id});
            console.log(res)
            if(res.code==200){
                this.$message.success("删除成功");
                // 触发自定义事件，后台服务器返回的删除成功后的数据传递个父组件，更新tableData
                this.$emit("del",res.list);
            }
        })
        .catch(() => {
            //点击取消
        });
    }
  }
};
</script>