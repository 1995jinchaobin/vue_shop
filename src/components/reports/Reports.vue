<!-- 数据报表 -->
<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item >数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 为 ECharts 准备一个具备大小（宽高）的 DOM -->
      <div id="main" style="width: 700px;height:400px;"></div>
    </el-card>
  </div>
</template>

<script>
// 1导入 echarts
import echarts from 'echarts'
import _ from 'lodash'
export default {
  data () {
    return {
      //2 需要和并的数据
      options: {
          title: {
            text: '用户来源'
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross',
              label: {
                backgroundColor: '#E9EEF3'
              }
            }
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: [
            {
              boundaryGap: false
            }
          ],
          yAxis: [
            {
              type: 'value'
            }
          ]
        }
    }
  },
  async mounted () {
    // 3基于准备好的dom，初始化echarts实例
    let myChart = echarts.init(document.getElementById('main'))
    // 4指定图表的配置项和数据
    const {data:res} = await this.$http.get('reports/type/1')
    if (res.meta.status !== 200) {
      return this.$message.error('获取报表失败')
    }
    const result = _.merge(res.data,this.options)
    // 5使用刚指定的配置项和数据显示图表。
    myChart.setOption(result)
    console.log(res.data)
  }
}
</script>

<style>

</style>