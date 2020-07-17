<!-- 商品参数 -->
<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片内容 -->
    <el-card>
      <!-- 提示信息 -->
      <el-alert type="warning" description="注意:只允许为第三极分类设置相关参数" show-icon>
      </el-alert>
      <!-- 选择商品分类 -->
      <el-row>
        <el-col :span="5">
          <span>选择商品分类:</span>
        </el-col>
        <!-- 商品分类的选择框 -->
        <el-col :span="10">
          <el-cascader v-model="valueKeys" :options="shangpinFenlei" :props="optionsValue" @change="shangpinFenleiChange" :show-all-levels="false"></el-cascader>
        </el-col>
      </el-row>
      <!-- tab页签区域 -->
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <!-- 动态参数 -->
        <el-tab-pane label="动态参数" name="many">
          <el-button type="primary" :disabled='showBtn' @click="addParamsDialogVisible = true">添加参数</el-button>
          <el-table :data="dynamicTableData" style="width: 100%" border> 
            <!-- 表格展开 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <!-- 动态参数展开项的标签 -->
                <el-tag v-for="(item,index) in scope.row.attr_vals" :key="index" closable @close="handleClose(scope.row,index)">
                  {{ item }}
                </el-tag>
                <!-- 动态按钮展开项的添加标签 -->
                <el-input class="input-new-tag" v-if="scope.row.inputVisible" v-model="scope.row.inputValue" ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm(scope.row)" @blur="handleInputConfirm(scope.row)">
                </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index">
            </el-table-column>
            <el-table-column prop="attr_name" label="参数名称" width="280">
            </el-table-column>
            <el-table-column label="操作" >
              <template slot-scope="scope">
                <el-button type="primary" icon="el-icon-edit" size="mini" @click="modifyParamsDialogBtn(scope.row)">编辑</el-button>
                <el-button type="warning" icon="el-icon-delete" size="mini" @click="delParams(scope.row.attr_id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!-- 静态参数 -->
        <el-tab-pane label="静态参数" name="only">
          <el-button type="primary" :disabled='showBtn' @click="addParamsDialogVisible = true">添加属性</el-button>
          <el-table :data="dynamicTableData" style="width: 100%" border=""> 
            <el-table-column type="index">
            </el-table-column>
            <el-table-column prop="attr_name" label="参数名称" width="280">
            </el-table-column>
            <el-table-column label="操作" >
              <template slot-scope="scope">
                <el-button type="primary" icon="el-icon-edit" size="mini" @click="modifyParamsDialogBtn(scope.row)">编辑</el-button>
                <el-button type="warning" icon="el-icon-delete" size="mini" @click="delParams(scope.row.attr_id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
      <!-- 添加参数的弹出对话框 -->
      <el-dialog :title="'添加'+addParamsName" :visible.sync="addParamsDialogVisible" width="50%" @close='closeAddParamsForm'>
        <!-- 对话框里的表单 -->
        <el-form :model="addParamsForm" :rules="addParamsrules" ref="addParamsForm" label-width="100px" >
          <el-form-item :label="addParamsName" prop="attr_name">
            <el-input v-model="addParamsForm.attr_name"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addParamsDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addParamsDialogVisibleBtn">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 修改参数的弹出对话框 -->
      <el-dialog :title="'修改'+addParamsName" :visible.sync="modifyParamsDialogVisible" width="50%" @close='closeModifyParamsForm'>
        <!-- 对话框里的表单 -->
        <el-form :model="modifyParamsForm" :rules="modifyParamsrules" ref="modifyParamsForm" label-width="100px" >
          <el-form-item :label="addParamsName" prop="attr_name">
            <el-input v-model="modifyParamsForm.attr_name"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="modifyParamsDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="modifyParamsDialogVisibleBtn">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 所有商品分类列表
      shangpinFenlei:[],
      // 商品分类的选择框里的数值
      valueKeys:[],
      // 选择框的配制对象对象
      optionsValue:{
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      // tabs页签默认激活的选项
      activeName: 'many',
      // 添加参数按钮禁用
      // 动态参数数值
      dynamicTableData: [],
      // 添加参数的对话框显示状态
      addParamsDialogVisible : false,
      // 添加参数的弹出对话框的表单内容
      addParamsForm: {
        attr_name: ''
      },
      // 表单验证规则
      addParamsrules: {
        attr_name:[
          { required: true, message: '请输入参数 名称', trigger: 'blur' }]
      },
      // 修改参数的对话框显示状态
      modifyParamsDialogVisible : false,
      // 修改参数的弹出对话框的表单内容
      modifyParamsForm: {
        attr_name: '',
        attr_id: 0
      },
      modifyParamsrules: {
        attr_name:[
          { required: true, message: '请输入参数 名称', trigger: 'blur' }]
      },
      // 动态按钮展开项的添加标签
    }
  },
  created () {
    this.getShangpinFenlei()
  },
  methods: {
    // 获取所有商品分类列表
    async getShangpinFenlei () {
      const { data:res } = await this.$http.get(`categories`)
      if (res.meta.status !== 200) {
        return this.$message.error('获取所有商品分类列表失败')
      }
      this.shangpinFenlei = res.data
      console.log(res.data)
    },
    // 获取选择框内数值长度,内容,id
    async shangpinFenleiChange () {
      if (this.valueKeys.length !== 3) {
        this.valueKeys = []
        this.dynamicTableData = []
        return
      }
      // this.showBtn = false
      console.log(this.valueKeys)
      // 获取选择框的id
      this.optionsValue.value = this.valueKeys[2]
      console.log(this.optionsValue.value)
      // 获取选择框中的值
      const {data:a} =await this.$http.get(`categories/${this.optionsValue.value}`)
      if (a.meta.status !== 200) {
        return this.$message.error('获取选择框的数值失败')
      }
        this.optionsValue.label = a.data.cat_name
        console.log(this.optionsValue) 
        this.getParamsSel()
    },
    // tab页签点击
    handleClick () {
      // console.log(this.activeName)
      // console.log(this.showBtn)
      if (this.valueKeys.length !== 3) {
        this.valueKeys = []
        this.dynamicTableData = []
        return
      }
      this.getParamsSel()
    },
    // get请求获取参数列表
    async getParamsSel () {
      const {data:res}= await this.$http.get(`categories/${this.optionsValue.value}/attributes`,{params:{sel:this.activeName}})
      if (res.meta.status !==200) {
        return this.$message.error('获取参数列表失败,请先选择商品分类')
      }
      // 展开项的标签
      res.data.forEach(item => {
        item.attr_vals = item.attr_vals?item.attr_vals.split(','):[]
        // 控制文本框的显示隐藏
        item.inputVisible = false
        // 文本框的内容
        item.inputValue = ''
      })
      this.dynamicTableData = res.data
      console.log(this.dynamicTableData)
    },
    // 关闭表单close事件
    closeAddParamsForm () {
      this.$refs.addParamsForm.resetFields()
    },
    // 关闭修改按钮对话框close事件
    closeModifyParamsForm () {
      this.$refs.modifyParamsForm.resetFields()
    },
    // 添加参数的对话框的确定按钮post
     addParamsDialogVisibleBtn () {
      this.$refs.addParamsForm.validate(async ref => {
        if (!ref) {
          return
        }
        const {data:a} = await this.$http.post(`categories/${this.optionsValue.value}/attributes`,{attr_name: this.addParamsForm.attr_name,attr_sel:this.activeName})
        console.log(a)
        if (a.meta.status !== 201 ) {
          return this.$message.error('添加参数失败')
        }
        this.$message.success('添加参数成功')
        this.getParamsSel()
        this.addParamsDialogVisible = false
      })
    },
    // 修改参数的编辑按钮,打开对话框时获取表单内容的name和id
    modifyParamsDialogBtn (row) {
      this.modifyParamsDialogVisible = true
      this.modifyParamsForm.attr_name = row.attr_name
      this.modifyParamsForm.attr_id = row.attr_id
      console.log(this.modifyParamsForm)
    },
    // 修改参数的对话框的确定按钮,发送put请求
    modifyParamsDialogVisibleBtn () {
      console.log(this.modifyParamsForm)
      this.$refs.modifyParamsForm.validate(async value => {
        if (!value) return
        const {data:res} =await this.$http.put(`categories/${this.optionsValue.value}/attributes/${this.modifyParamsForm.attr_id}`,{attr_name:this.modifyParamsForm.attr_name,attr_sel:this.activeName})
        console.log(res)
        if (res.meta.status !== 200) {
          return this.$message.error('修改参数失败')
        }
        this.$message.success('修改参数成功')
        this.getParamsSel()
        this.modifyParamsDialogVisible = false
      })
    },
    // 删除按钮
    async delParams(id){
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
      const {data: res} = await this.$http.delete(`categories/${this.optionsValue.value}/attributes/`+id)
      if (res.meta.status !==200 ) return this.$message.error('删除用户信息失败')
      this.$message.success('删除用户信息成功')
      this.getParamsSel()
    },
    // 动态按钮展开项的添加标签
    handleInputConfirm (row) {
      // trim()去掉头尾空字符
      if (row.inputValue.trim().length === 0) {
        row.inputVisible = false
        row.inputValue = ''
        return
      }
      row.attr_vals.push(row.inputValue.trim())
      this.putTag(row)
      row.inputValue = ''
      row.inputVisible = false
      // console.log(row)
      // console.log(res)
    },
    // put请求改变展开项的标签
    async putTag (row) {
      const {data:res} = await this.$http.put(`categories/${this.optionsValue.value}/attributes/${row.attr_id}`,{attr_name:row.attr_name,attr_sel:row.attr_sel,attr_vals: row.attr_vals.join(',')})
      if (res.meta.status !== 200) {
        return this.$message.error('添加参数标签失败')
      }
      this.$message.success('添加参数标签成功')
    },
    showInput (row) {
      row.inputVisible = true
      // 文本框自动获取焦点
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
        console.log(_)
        })
    },
    // 删除动态参数展开项的标签
    handleClose(row,index) {
      // console.log(row)
      // console.log(index)
      row.attr_vals.splice(index, 1)
      this.putTag(row)
      console.log(row)
    }
  },
  computed: {
    // 添加参数按钮禁用状态
    showBtn () {
      if (this.valueKeys.length !== 3) {
        return true
      }
      return false
    },
    // 添加参数的名字
    addParamsName () {
      if (this.activeName === 'many') {
        return '动态参数'
      }
      return '静态参数'
    }
  }
}
</script>

<style lang="less" scoped>
.el-row{
  display: flex;
  align-items: center;
}
.input-new-tag {
  width: 100px;
}
</style>
