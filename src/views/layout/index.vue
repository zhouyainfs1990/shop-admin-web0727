<template>
  <div class="main">
    <el-row :gutter="20">
      <el-col :span="10" :offset="2">
        <div class="data_col">
          <h3 class="data_title">商品总览</h3>
          <el-row>
            <el-col :span="6">
              <div>100</div>
              <div>已下架</div>
            </el-col>
            <el-col :span="6" >
              <div>100</div>
              <div>已下架</div>
            </el-col>
            <el-col :span="6">
              <div>100</div>
              <div>已下架</div>
            </el-col>
            <el-col :span="6">
              <div>100</div>
              <div>已下架</div>
            </el-col>
          </el-row>
        </div>
      </el-col>
      <el-col :span="10">
        <div class="data_col">
          <h3>用户总览</h3>
          <el-row>
            <el-col :span="6">
              <div >100</div>
              <div>已下架</div>
            </el-col>
            <el-col :span="6">
              <div>100</div>
              <div>已下架</div>
            </el-col>
            <el-col :span="6">
              <div>100</div>
              <div>已下架</div>
            </el-col>
            <el-col :span="6">
              <div>100</div>
              <div>已下架</div>
            </el-col>
          </el-row>
        </div>
      </el-col>
    </el-row>
    <div id="main" class="echart">

    </div>
  </div>
</template>
<script>
import echarts from "echarts"
export default {
    // 最早可以进行DOM操作的地方
    mounted(){
        // 实例化 图标对象
        // 参数：容器元素
        let mycharts = echarts.init(document.getElementById("main"));

        // 定义配置项
        let option = {
            title:{
                text:"仓储数据图",
                left:"30%"
            },
            // 图例
            legend: {
                // 图例 关联name 值
                data:['销量',"进货量"]
            },
            // 鼠标悬浮时信息提示框
            tooltip:{

            },
            // x轴设置
            xAxis: {
                // x轴上的每一项
                data: ["Mon","Tues","Wen","Thur","Fri","Sat","Sun"],
                boundaryGap:false
            },
            // y 轴设置
            yAxis: {
                max:60,
                min:0
            },
            toolbox:{
                feature:{
                    saveAsImage:{

                    }
                }
            },

            // 图标使用的数据
            series: [{
                name: '销量',//数据名称
                type: 'line',//折线图
                data: [5, 20, 36, 10, 15, 20,30]//数据值
            }
            /* ,{
                name: '进货量',
                type: 'bar',//柱状体
                data: [10, 10, 26, 15, 20, 50]
            } */
            ]
        }

        // 设置配置项 并进行绘制
        mycharts.setOption(option)
    }
}
</script>
<style lang="stylus">
.main {
  .data_col {
    height: 150px;
    border: 1px solid #000;
    
    .data_title{
        margin 20px auto
        padding 0 20px
        
    }
    .el-col{
        text-align center
    }
  }
  .echart{
      width 1000px
      height 600px
      margin-left 200px
  }
}
</style>