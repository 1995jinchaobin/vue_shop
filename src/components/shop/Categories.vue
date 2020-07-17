<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 商品分类内容 -->
    <el-card class="box-card">
      <!-- 添加商品的按钮 -->
      <el-row>
        <el-button type="primary" @click="addShangpinBtn">添加分类</el-button>
      </el-row>
      <!-- 商品分类信息表格    第一列-->
      <tree-table :data='catelist' :columns='columns' border :selection-type='false' :expand-type='false' index-text="#" show-index :show-row-hover='false'>
        <!-- slot:模板插槽的名字,是否有效  第二列 -->
        <template slot="isok" slot-scope="scope">
          <i class="el-icon-success" v-if="scope.row.cat_deleted === false" style="color:green"></i>
          <i class="el-icon-error" v-else style="color:red"></i>
          {{scope.row.cat_deleted}}
        </template>
        <!-- 第三列排序 -->
        <template slot="order" slot-scope="scope">
          <el-tag v-if="scope.row.cat_level === 0 ">一级</el-tag>
          <el-tag type="success" v-else-if="scope.row.cat_level === 1 ">二级</el-tag>
          <el-tag type="info" v-else>三级</el-tag>
        </template>
        <!-- 第四列 操作 -->
        <template slot="opt" slot-scope="scope">
          <el-button size="mini" icon="el-icon-edit" type="primary" @click="shangpinFenleiBianjiBtn(scope.row)">编辑</el-button>
          <el-button size="mini" icon="el-icon-delete" type="danger" @click="delShangpinFenleiBtn(scope.row.cat_id)">删除</el-button>
        </template>
      </tree-table> 
        <!-- 底部分页 -->
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="querInfo.pagenum" :page-sizes="[1, 2, 5, 10]" :page-size="querInfo.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
      <!-- 添加商品的弹出对话框 -->
      <el-dialog title="提示" :visible.sync="addShangpinDialogVisible" width="50%" @close="addShangpinDialogVisibleClose">
        <el-form :model="addShangpinForm" :rules="addShangpinrules" ref="addShangpinruleForm" label-width="100px">
          <el-form-item label="分类名称" prop="cat_name">
            <el-input v-model="addShangpinForm.cat_name"></el-input>
          </el-form-item>
          <el-form-item label="父级分类">
            <el-cascader clearable change-on-select expand-trigger="hover"  v-model="selectedKeys" :options="parentCateList" :props="cascaderProps" @change="getParentCateChanged"></el-cascader>
          </el-form-item>
        </el-form>
        <span slot="footer">
          <el-button @click="addShangpinDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addShangpinDeterBtn">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 商品分类的编辑按钮的对话框 -->
      <el-dialog title="编辑" :visible.sync="shangpinFenleiBianjidialogVisible" width="30%">
        <el-form ref="shangpinFenleiBianjiFormRef" :model="shangpinFenleiBianjiForm" label-width="80px" :rules="addShangpinrules">
          <el-form-item label="商品分类" prop="cat_name">
            <el-input v-model="shangpinFenleiBianjiForm.cat_name"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer">
          <el-button @click="shangpinFenleiBianjidialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="shangpinFenleiBianjidialogVisibleBtn">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 请求参数:商品分类信息
      querInfo:{
        // 渲染的层数,表示渲染到3级
        type:3,
        // 当前页面
        pagenum:1,
        // 分页显示的条数
        pagesize:5
      },
      // 商品分类数组,默认为空
      catelist:[],
      // 总数据条数
      total:0,
      // 绑定的每一列的内容
      columns: [
        // 第一列渲染的内容
        {
          // 第一列表格表头名
          label: '分类名称',
          // 第一列表格渲染的内容,商品分类名称
          prop: 'cat_name'
        },
        {
          // 第二列表格表头名
          label: '是否有效',
          type: 'template',
          template: 'isok'
        },
        // 第三列表格:排序  order
        {
          label: '排序',
          type: 'template',
          template: 'order'
        },
        // 第四列表格:操作  opt
        {
          label: '操作',
          type: 'template',
          template: 'opt'
        }
      ],
      addShangpinDialogVisible:false,
      // 添加商品表单
      addShangpinForm:{
        cat_pid:'0',
        cat_name:'',
        cat_level:'0'
      },
      // 添加商品表单的验证规则
      addShangpinrules:{
        cat_name:[
            { required: true, message: '请输入添加商品名称', trigger: 'blur' },
        ]
      },
      // 添加商品的父级分类选项数据
      parentCateList:[],
      // 选择框展示的label内容
      cascaderProps:{
        value: 'cat_id',
        label: 'cat_name',
        children:'children'
      },
      selectedKeys:[],
      shangpinFenleiBianjidialogVisible:false,
      // 商品分类编辑表单
      shangpinFenleiBianjiForm: {
        cat_id:'',
        cat_name:''
      }
    }
  },
  created () {
    this.getQuerInfo()
    // this.postAddShangpinInfo()
    // this.getParentCateList()
  },
  methods: {
    // 从数据库get到商品分类的全部数据
    async getQuerInfo () {
      const {data:res} =await this.$http.get('categories',{
        params:this.querInfo})
      console.log(res)
      // 没有获取到商品分类数据的错误提示
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品分类失败')
      }
      // 将从数据库get到商品分类的全部数据赋值给商品分类数组
      this.catelist = res.data.result
      this.total = res.data.total
    },
    // 监听pagesize,每页条数
    handleSizeChange (newSize) {
      console.log(newSize)
      this.querInfo.pagesize = newSize
      this.getQuerInfo()
    },
    // 监听pagenum,当前页数
    handleCurrentChange (newPage) {
      this.querInfo.pagenum = newPage
      this.getQuerInfo()
    },
    // 添加商品按钮
    addShangpinBtn () {
      this.getParentCateList ()
      this.addShangpinDialogVisible = true
    },
    // 获取父级分类的数据列表
    async getParentCateList () {
      const {data:res} = await this.$http.get('categories',{
        params:{type:2}
      })
      // console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error('获取父级分类数据失败')
      }
      this.parentCateList = res.data
    },
    // 父级分类的选项框发生改变时
    getParentCateChanged () {
      console.log(this.selectedKeys)
      if (this.selectedKeys.length > 0) {
        // 给当前选项的父类id赋值
        this.addShangpinForm.cat_pid = this.selectedKeys[this.selectedKeys.length - 1]
        // 给当前选项的等级赋值
        this.addShangpinForm.cat_level = this.selectedKeys.length
        console.log(this.addShangpinForm)
        return
      }
      else {
        this.addShangpinForm.cat_pid = this.addShangpinForm.cat_level = 0
      }
      console.log(this.addShangpinForm)
    },
    // 添加商品的对话框里的确定按钮,用post获取添加分类的数据
       addShangpinDeterBtn () {
      this.$refs.addShangpinruleForm.validate(async res1 => {
        if (!res1) return
        const {data:res} = await this.$http.post('categories',this.addShangpinForm)
        console.log(res)
        if (res.meta.status !==201) {
          return this.$message.error('添加商品分类失败')
        }
        this.$message.success('添加商品分类成功')
        this.getQuerInfo()
        this.addShangpinDialogVisible = false
      })
    },
    // 关闭添加商品对话框
    addShangpinDialogVisibleClose () {
      this.$refs.addShangpinruleForm.resetFields()
      this.selectedKeys=[]
      this.addShangpinForm.cat_pid = this.addShangpinForm.cat_level = 0
    },
    // 商品分类的编辑按钮
    shangpinFenleiBianjiBtn (row) {
      console.log(row.cat_id)
      console.log(row.cat_name)
      this.shangpinFenleiBianjidialogVisible = true
      this.shangpinFenleiBianjiForm.cat_name = row.cat_name
      this.shangpinFenleiBianjiForm.cat_id = row.cat_id
    },
    // 商品分类编辑对话框的确定按钮
    shangpinFenleiBianjidialogVisibleBtn () {
      this.$refs.shangpinFenleiBianjiFormRef.validate(async res1 => {
        if (!res1) return
        // console.log(this.shangpinFenleiBianjiForm.cat_name)
        // console.log(this.shangpinFenleiBianjiForm.cat_id)
        const {data:res} = await this.$http.put(`categories/${this.shangpinFenleiBianjiForm.cat_id}`,this.shangpinFenleiBianjiForm)
        console.log(res)
        if (res.meta.status !==200) {
          return this.$message.error('编辑商品分类失败')
        }
        this.$message.success('编辑商品分类成功')
        this.getQuerInfo()
        this.shangpinFenleiBianjidialogVisible = false
      })
    },
    // 删除商品分类按钮
    async delShangpinFenleiBtn (id) {
      console.log(id)
      const confirmRes = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)
        console.log(confirmRes)
        // 点击确定输出为confirm,点击取消输出为cancel
        if (confirmRes !=='confirm') {
          return this.$message.info('已取消删除')
        }
        const {data: res} = await this.$http.delete('categories/'+id,id)
        if (res.meta.status !==200 ) return this.$message.error('删除用户信息失败')
        this.$message.success('删除商品分类成功')
        this.getQuerInfo()

    }
  }
}
</script>

<style lang="less" scoped>
.el-button--primary {
  margin-bottom: 20px;
}
</style>