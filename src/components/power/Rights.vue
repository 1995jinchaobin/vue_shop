<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-table stripe border style="width: 100%" :data="rightsList">
        <el-table-column type="index" label="#"></el-table-column>
        <!-- label:表头   prop:获取数据对象的子对象 -->
        <el-table-column label="权限名称" prop="authName"></el-table-column>
        <el-table-column label="路径" prop="path"></el-table-column>
        <el-table-column label="权限等级" prop="level">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.level==='0'">一级</el-tag>
            <el-tag type="success" v-else-if="scope.row.level==='1'">二级</el-tag>
            <el-tag type="info" v-else>三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      rightsList:[]
    }
  },
  created () {
    this.getRightsList()
  },
  methods: {
    async getRightsList () {
     const {data: res} = await this.$http.get('rights/list')
    //  console.log(res.data)
     this.rightsList = res.data
    }
  }
}
</script>

<style>

</style>