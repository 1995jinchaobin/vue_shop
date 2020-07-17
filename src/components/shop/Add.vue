<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item >商品管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/goods' }">商品列表</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 添加商品信息的消息提示 -->
      <el-alert title="添加商品信息" type="info" show-icon center :closable='false'></el-alert>
      <!-- 步骤条 -->
      <el-steps :space='200' finish-status="success" align-center :active="activeIndex - 0">
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px" label-position="top">
        <!-- 标签页 -->
        <el-tabs :tab-position="'left'" v-model="activeIndex" :before-leave='beforeTabLeave' @tab-click='tabClick'>
          <!-- 基本信息表单 -->
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <!-- :options 全部信息  :props 对传入的信息删选,选择框显示数据 -->
              <el-cascader expand-trigger="hover" :options="shangpinFenlei" :props="optionsValue" v-model="addForm.goods_cat" @change="handleChange" clearable></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <!-- 商品参数 -->
          <el-tab-pane label="商品参数" name="1">
            <!-- 渲染表单的item项 -->
            <el-form-item :label="item.attr_name" v-for="item in goodsParams" :key="item.attr_id">
              <!-- 商品参数复选框 -->
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox border :label="vals" v-for="(vals,index) in item.attr_vals" :key="index"></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <!-- 商品属性 -->
          <el-tab-pane label="商品属性" name="2">
            <el-form-item :label="item.attr_name" v-for="item in goodsValue" :key="item.attr_id">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <!-- 商品图片 -->
          <el-tab-pane label="商品图片" name="3">
            <!-- action 图片上传的数据库地址   on-preview 图片预览   on-remove 图片移除  list-type 图片显示效果  headers 设置上传的请求头部   on-success 文件上传成功的钩子函数-->
            <el-upload action="http://127.0.0.1:8888/api/private/v1/upload" :on-preview="handlePreview" :on-remove="handleRemove" list-type="picture" :headers='headerAuthorization' :on-success='headerSuccess'>
              <el-button size="small" type="primary">点击上传</el-button>
              <!-- <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div> -->
            </el-upload>
          </el-tab-pane>
          <!-- 商品内容 -->
          <el-tab-pane label="商品内容" name="4">
            <!-- 富文本编辑器组件 -->
            <quill-editor v-model="addForm.goods_introduce"></quill-editor>
            <!-- 添加商品按钮 -->
            <el-button type="primary" @click="add">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
      
    </el-card>
    <!-- 图片预览对话框 -->
    <el-dialog :visible.sync="imgDialogVisible" width="50%">
      <span class="font">图片预览</span>
      <img :src="imgUrl" alt="#" class="imgShow">
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      activeIndex: '0',
      addForm:{
        goods_name: '',
        goods_cat: [],
        goods_price: '',
        goods_number: '',
        goods_weight: '',
        // 图片的数组
        pics: [],
        goods_introduce: '',
        attrs: []
      },
      addFormRules:{
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' }
        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' }
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' }
        ],
        goods_cat: [
          { required: true, message: '请输入商品分类', trigger: 'blur' }
        ]
      },
      // 商品分类列表
      shangpinFenlei: [],
      // 选择框的配制对象
      optionsValue: {
        // 绑定的值
        value: 'cat_id',
        // 显示的内容
        label: 'cat_name',
        // 下个选择的内容参数
        children: 'children'
      },
      // 商品参数,动态many
      goodsParams: [],
      // 商品属性,静态only
      goodsValue: [],
      // 设置上传的请求头部
      headerAuthorization: {
        // 给图片的上传路径添加保存在sessionStorage的token
        Authorization: window.sessionStorage.getItem('token')
      },
      // 图片预览url地址
      imgUrl: '',
      // 图片预览对话框显示隐藏切换,默认隐藏
      imgDialogVisible:false,
      arr: {}
    }
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
    // 级联选择器的变化,设置数组长度不等于3时为空
    handleChange () {
      console.log(this.addForm.goods_cat)
      if (this.addForm.goods_cat.length !== 3) {
        this.addForm.goods_cat = []
      }
    },
    // 标签页的页数发生变化时
    beforeTabLeave (before,after) {
      console.log('进入'+ before)
      console.log('离开'+ after) 
      // console.log(before - after) 
      if (after === '0' && this.addForm.goods_cat.length !== 3) {
        this.$message.error('请先选择商品分类')
        return false
      }
      else if (this.addForm.goods_name==='' || this.addForm.goods_price==='' ||this.addForm.goods_weight==='' || this.addForm.goods_number==='') {
        this.$message.error('请先输入商品信息')
        return false
      }
      let tiao = before - after
      if (tiao > 1) {
        this.$message.error('请逐步填写信息')
        return false
      }
      // else if (after-before )
    },
    // tab 被选中时触发
    async tabClick () {
      console.log(this.activeIndex)
      // 获取商品参数 get请求 动态(many)
      if (this.activeIndex === '1') {
        const {data:res} = await this.$http.get(`categories/${this.getAddFormGoodsCat}/attributes`,{params:{sel:'many'}})
        if (res.meta.status !== 200) {
          return this.$message.error('获取商品参数失败')
        }
        res.data.forEach(item => {
          // 判断,防止出现空数组
          item.attr_vals = item.attr_vals.length === 0 ?[] : item.attr_vals.split(',')
        })
        console.log(res.data)
        this.goodsParams = res.data
      } 
      // 获取商品属性 get,静态(only)
      else if (this.activeIndex === '2') {
        const {data:res} = await this.$http.get(`categories/${this.getAddFormGoodsCat}/attributes`,{params:{sel:'only'}})
        if (res.meta.status !== 200) {
          return this.$message.error('获取商品参数失败')
        }
        console.log(res.data)
        this.goodsValue = res.data
      }
    },
    // 图片预览点击函数
    handlePreview (file) {
      console.log(file)
      this.imgUrl = file.response.data.url
      this.imgDialogVisible = true
    },
    // 图片移除点击函数
    handleRemove (file) {
      console.log(file)
      // 1.获取将要删除的图片的临时路径
      const filePath = file.response.data.tmp_path
      // 2.从pics数组中,找到这个图片的对应的索引值
      const i = this.addForm.pics.findIndex( a =>
        a.pic === filePath
      )
      console.log(filePath)
      console.log(i)
      // 3.调用数组的splice方法,把图片信息对象,从pics数组中移除
      this.addForm.pics.splice(i,1)
      console.log(this.addForm)
    },
    // 文件上传成功的钩子函数
    headerSuccess (response) {
      console.log(response)
      // 1.拼接得到一个图片信息对象
      const picInfo = { pic: response.data.tmp_path }
      // 2.将图片拼接后的信息对象push到addForm.pics数组中
      this.addForm.pics.push(picInfo)
      console.log(this.addForm)
    },
    // 添加商品按钮
    add () {
      this.$refs.addFormRef.validate(async value => {
        if (!value) {
          return this.$message.error('请填写必要信息')
        }
        // 深拷贝
        let obj={};  
        obj=JSON.parse(JSON.stringify(this.addForm))
         //this.templateData是父组件传递的对象  
        obj.goods_cat = obj.goods_cat.join(',')
        // console.log(this.addForm)
        // console.log(obj)
        // console.log(this.goodsParams)
        // console.log(this.goodsValue)
        // 处理商品参数动态参数为数组形式
        this.goodsParams.forEach(item => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value:item.attr_vals.join(' ')
          }
          obj.attrs.push(newInfo)
          // console.log(obj)
          // console.log(obj.attrs)
        })
        // 处理商品属性静态属性
        this.goodsValue.forEach(item => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value:item.attr_vals
          }
          obj.attrs.push(newInfo)
          // console.log(obj)
          // console.log(obj.attrs)
        })
        console.log(obj)
        console.log(this.addForm)
        const {data:res} =await this.$http.post('goods',obj)
        console.log(res)
        if (res.meta.status !== 201) {
          return this.$message.error('添加商品失败')
        }
        this.$message.success('添加商品成功')
        this.$router.push('/goods')
      })
    }
  },
  computed: {
    // 获取商品分类选择框的id
    getAddFormGoodsCat () {
      if (this.addForm.goods_cat.length === 3) {
        return this.addForm.goods_cat[2]
      }
      return null
    }
  },
  created () {
    this.getShangpinFenlei()
  }
}
</script>

<style lang="less" scoped>
.el-steps {
  margin: 15px;
}
.el-checkbox {
  margin: 0 5px !important;
}
.imgShow{
  width: 100%;
}
.font{
  font-size: 2rem;
}
.ql-editor {
  height: 250px !important;
}
</style>