<!-- 商品列表 -->
<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <!-- 商品列表搜索行 -->
      <el-row :gutter="20">
        <el-col :span="10">
           <el-input placeholder="请输入内容" v-model="getTableList.query" class="input-with-select" clearable @clear="getTableListFun">
            <el-button slot="append" icon="el-icon-search" @click="getTableListFun"></el-button>
          </el-input>
        </el-col>
        <el-col :span="5">
          <el-button type="primary" @click="goAddPage">
            添加商品
          </el-button>
        </el-col>
      </el-row>
      <!-- 商品列表的表格 -->
      <el-table :data="tableList" style="width: 100%" border stripe index-text="#">
        <el-table-column type="index">
        </el-table-column>
        <el-table-column prop="goods_name" label="商品名称" min-width="300">
        </el-table-column>
        <el-table-column prop="goods_price" label="商品价格(元)" width="110">
        </el-table-column>
        <el-table-column prop="goods_weight" label="商品重量" width="90">
        </el-table-column>
        <el-table-column prop="add_time" label="创建时间" width="120">
          <template slot-scope="scope">
            {{scope.row.add_time | dateFormat}}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="delListRow(scope.row.goods_id)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域  @size-change页面条数发生变化时 @current-change页数发生变化时 :current-page绑定当前页数 :page-sizes每页显示条数选择  :page-size当地当前页面的条数    layout 显示的内容   :total 绑定总条数-->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="getTableList.pagenum" :page-sizes="[10, 20, 30, 40]" :page-size="getTableList.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      input3:'',
      // 商品列表数据
      tableList:[],
      // 获取商品列表数据的参数
      getTableList: {
        query: '',
        // 当前页数
        pagenum: 1,
        // 页面显示条数
        pagesize: 10
      },
      // 总条数
      total:0
    }
  },
  methods: {
    // 获取商品列表数据 get请求
    async getTableListFun () {
      const {data:res} = await this.$http.get('goods',{params:this.getTableList})
      console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品列表数据失败')
      }
      // this.$message.success('获取商品列表数据成功')
      this.tableList = res.data.goods
      this.total = res.data.total
    },
    // 页面条数发生变化时
    handleSizeChange (newSize) {
      this.getTableList.pagesize = newSize
      this.getTableListFun()
    },
    // 页面页数发生变化
    handleCurrentChange (newPage) {
      this.getTableList.pagenum = newPage
      this.getTableListFun()
    },
    // 商品列表中的删除按钮
    async delListRow(id){
      console.log(id)
      const confirmRes =await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      console.log(confirmRes)
      // 点击确定输出为confirm,点击取消输出为cancel
      if (confirmRes !=='confirm') {
        return this.$message.info('已取消删除')
      }
      const {data: res} = await this.$http.delete(`goods/`+id)
      if (res.meta.status !==200 ) return this.$message.error('删除用户信息失败')
      this.$message.success('删除用户信息成功')
      this.getTableListFun()
    },
    // 点击添加商品按钮跳转路由
    goAddPage () {
      this.$router.push('/goods/add')
    }
  },
  created () {
    // 使用获取商品列表数据 get请求函数 
    this.getTableListFun()
  }
}
</script>

<style>

</style>