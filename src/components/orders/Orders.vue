<!-- 订单列表 -->
<template>
  <div>
    <!-- 导航栏 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item >订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 搜索框 -->
      <el-row>
        <el-col :span="10">
          <el-input placeholder="请输入内容" v-model="getOrders.query" clearable @clear = 'getOrdersList'>
            <el-button slot="append" icon="el-icon-search" @click = 'getOrdersList'></el-button>
          </el-input>
        </el-col>
      </el-row>
      <!-- 订单列表数据 -->
      <el-table :data="ordersList" style="width: 100%" stripe border>
        <el-table-column type="index" width="50">
        </el-table-column>
        <el-table-column prop="order_number" label="订单编号">
        </el-table-column>
        <el-table-column prop="order_price" label="订单价格">
        </el-table-column>
        <el-table-column prop="pay_status" label="是否付款">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.pay_status === '0'">未付款</el-tag>
            <el-tag v-else>已付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="is_send" label="是否发货">
        </el-table-column>
        <el-table-column prop="update_time" label="下单时间">
          <template slot-scope="scope">
            {{scope.row.update_time | dateFormat}}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template>
            <el-button type="primary" icon="el-icon-edit" size="mini" @click='putInpoBtn'>
            </el-button>
            <el-button type="success" icon="el-icon-location-outline" size="mini" @click="showWuliuBtn">
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页页脚 -->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="getOrders.pagenum" :page-sizes="[5,10, 20, 50, 100]" :page-size="10" layout="total, sizes, prev, pager, next, jumper" :total="total">
    </el-pagination>
    </el-card>
    <!-- 编辑按钮修改信息对话框 -->
    <el-dialog title="修改地址" :visible.sync="putInpfDialogVisible" width="50%" @close='qingkongInfo'>
      <el-form :model="putOrderInfo" :rules="putOrderInfoRules" ref="putOrderInfoRef" label-width="100px" >
        <el-form-item label="省市区/县" prop="ress1">
          <el-cascader :options="citydata" v-model="putOrderInfo.ress1">
          </el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="ress2">
          <el-input v-model="putOrderInfo.ress2"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="putInpfDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="putInpfDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 物流信息对话框 -->
    <el-dialog title="物流信息" :visible.sync="wuliuInfoDialogVisible" width="50%">
      <el-timeline>
        <el-timeline-item v-for="(item, index) in wuliuInfo" :key="index" :timestamp="item.time">
          {{item.context}}
        </el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>
 
<script>
// 导入城市地址
import citydata from './citydata.js'
export default {
  data () {
    return {
      // 获取订单数据列表get请求的参数
      getOrders: {
        query: '',
        pagenum: 1,
        pagesize: 5
      },
      // 总订单数据条数
      total: 0,
      // 订单列表数据
      ordersList: [],
      putInpfDialogVisible:false,
      // 修改地址信息
      putOrderInfo: {
        ress1: [],
        ress2: ''
      },
      // 地址验证规则
      putOrderInfoRules: {
        ress1:[
          { required: true, message: '请选择省市区/县', trigger: 'blur' }
        ],
        ress2:[
          { required: true, message: '请输入详细地址', trigger: 'blur' }
        ]
      },
      // 使用城市地址
      citydata,
      wuliuInfoDialogVisible: false,
      // get到的物流信息
      wuliuInfo: []
    }
  },
  methods: {
    // 获取订单数据列表 get请求
    async getOrdersList () {
      const {data:res} = await this.$http.get('orders',{params:this.getOrders})
      console.log(res)
      if (res.meta.status !==200) {
        return this.$message.error('获取订单列表数据失败')
      }
      this.ordersList = res.data.goods
      this.total = res.data.total
    },
    // 每页条数
    handleSizeChange (newSize) {
      this.getOrders.pagesize = newSize
      this.getOrdersList()
    },
    // 当前页数
    handleCurrentChange (newNum) {
      this.getOrders.pagenum = newNum
      this.getOrdersList()
    },
    // 编辑按钮修改信息
    putInpoBtn () {
      this.putInpfDialogVisible = true
    },
    // 关闭表单清空地址信息
    qingkongInfo () {
      this.$refs.putOrderInfoRef.resetFields()
    },
    // 物流信息按钮
    async showWuliuBtn () {
      const {data:res} = await this.$http.get('/kuaidi/1106975712662')
      console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error('获取物流信息失败')
      }
      this.wuliuInfo = res.data
      this.wuliuInfoDialogVisible = true
    }
  },
  created () {
    this.getOrdersList() 
  }
}
</script>

<style lang="less" scoped>

</style>
