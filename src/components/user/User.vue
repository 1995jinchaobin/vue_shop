<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" @keyup.enter.native="getUserList" clearable @clear="getUserList">
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="dialogVisible = true">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 用户列表 -->
      <el-table :data="userList" stripe	border>
        <el-table-column type="index" label="序号"></el-table-column>
        <el-table-column prop="username" label="姓名"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="mobile" label="手机号"></el-table-column>
        <el-table-column prop="role_name" label="角色"></el-table-column>
        <el-table-column prop="mg_state" label="状态">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.mg_state" @change="userStateChange(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200px">
          <template slot-scope="scope">
              <!-- 修改用户信息按钮 -->
            <el-button type="primary" size="mini" icon="el-icon-edit" @click="reviseUserInfo(scope.row.id)"></el-button>
            <!-- 删除用户信息按钮 -->
            <el-button type="danger" size="mini" icon="el-icon-delete" @click="userInfoDel(scope.row.id)"></el-button>
            <el-tooltip class="item" effect="dark" content="分配角色" placement="top" :enterable="false">
              <!-- 分配角色的按钮 -->
              <el-button type="warning" size="mini" icon="el-icon-setting" @click="fenpeiRolesBtn(scope.row)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 底部分页 -->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryInfo.pagenum" :page-sizes="[1, 2, 5, 10]" :page-size="queryInfo.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </el-card>
    <!-- 添加用户时弹出的对话框框 -->
    <el-dialog title="添加用户" :visible.sync="dialogVisible" width="50%" @close='addDialogClose'>
      <el-form ref="addFormRef" :model="addForm" label-width="80px" :rules="addFormRules">
        <el-form-item label="用户名称" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改用户信息的对话框 -->
    <el-dialog title="修改用户信息" :visible.sync="userInfoVisible" width="50%" @close="userInfoClose">
      <el-form ref="userInfoRef" :model="userInfo" label-width="80px" :rules="addFormRules">
        <el-form-item label="用户名称">
          <el-input v-model="userInfo.username" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="userInfo.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="userInfo.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="userInfoVisible = false">取 消</el-button>
        <el-button type="primary" @click="userInfoChange">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配角色弹出的对话框 -->
    <el-dialog title="分配角色" :visible.sync="fenpeiRolesdialogVisible" width="50%" @close='rolesClose'>
      <p>
        <span>当前的用户:</span>
        <span>{{userInfo.username}}</span>
      </p>
      <p>
        <span>当前的角色:</span>
        <span>{{userInfo.mobile}}</span>
      </p>
      <p>
        <span>分配的角色</span>
        <el-select v-model="rolesOption" placeholder="请选择">
          <el-option
            v-for="item in rolesOptions"
            :key="item.id"
            :label="item.roleName"
            :value="item.id">
          </el-option>
        </el-select>
      </p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="fenpeiRolesdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="fenpeiRoles">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    let checkEmail = (rule, value, callback) => {
      const regEmail = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/
      if (regEmail.test(value)){
        return callback()
      }
      callback( new Error('请输入正确的邮箱'))
    }
    let checkMobile = (rule,value, callback) => {
      const regMobile = /^[1][3,4,5,7,8][0-9]{9}$/
      if (regMobile.test(value)) {
        return callback()
      }
      callback(new Error('请输入正确的手机号码'))
    }
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 5
      },
      userList: [],
      total: 0,
      dialogVisible: false,
      userInfoVisible: false,
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      addFormRules:{
        username: [
          { required: true, message: '请输入登陆账号', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在3-10个字符',trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入登陆密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在6-15个字符',trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail,trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          { validator: checkMobile,trigger: 'blur' }
        ]
      } ,
      // 每行用户信息
      userInfo: {
        id:'',
        username: '',
        email: '',
        mobile: ''
      },
      // 分配角色对话框默认隐藏
      fenpeiRolesdialogVisible:false,
      rolesOption:'',
      // 分配的权限数组
      rolesOptions:[]
    }
  },
  created () {
    this.getUserList()
  },
  methods: {
    async getUserList () {
    const {data: res} = await this.$http.get('users',{ params: this.queryInfo })
    if (res.meta.status !== 200) {
      return this.$message.error('获取用户列表失败')}
      this.userList = res.data.users
      this.total = res.data.total
      console.log(res)
    },
    handleSizeChange (newSize) {
      console.log(newSize)
      this.queryInfo.pagesize = newSize
      this.getUserList()
    },
    handleCurrentChange (newPage) {
      this.queryInfo.pagenum = newPage
      this.getUserList()
    },
    async userStateChange (userInfo) {
      console.log(userInfo)
      const {data: res} =await this.$http.put(`users/${userInfo.id}/state/${userInfo.mg_state}`)
      console.log(res)
      if (res.meta.status !== 200) {
        userInfo.mg_state = !userInfo.mg_state
        return this.$message.error('更新用户状态失败')
      }
      return this.$message.success('更新用户状态成功')
    },
    addDialogClose () {
      this.$refs.addFormRef.resetFields()
    },
    addUser () {
      // this.dialogVisible = false
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        const {data:res} =await this.$http.post('users',this.addForm)
        console.log(res)
        if (res.meta.status !== 201) {
          this.$message.error('添加用户失败')
        }
        this.$message.success('添加用户成功')
        this.dialogVisible = false
        this.getUserList()
      }
      )
    },
    // 修改用户信息(先查询)
    async reviseUserInfo (id) {
      // console.log(id)
      const {data:res} =await this.$http.get('users/' + id,id)
      // console.log(res.data)
      if (res.meta.status !== 200) return this.$message.error('获取用户信息失败')
      this.userInfo = res.data
      console.log(this.userInfo)
      this.userInfoVisible = true
    },
    userInfoClose () {
      this.$refs.userInfoRef.resetFields()
    },
    // 修改用户信息的确定按钮
    userInfoChange() {
      this.$refs.userInfoRef.validate(async value => {
        console.log(value)
        if (!value) return
        const {data:res} =await this.$http.put('users/'+this.userInfo.id,{email:this.userInfo.email,mobile:this.userInfo.mobile})
        console.log(res)
        console.log(this.userInfo)
        if (res.meta.status !== 200) {
          return this.$message.error('修改用户信息失败')
        }
        this.getUserList()
        this.$message.success('修改用户信息成功')
        this.userInfoVisible = false
      })
      
    },
    async userInfoDel(id){
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
        const {data: res} = await this.$http.delete('users/'+id,id)
        if (res.meta.status !==200 ) return this.$message.error('删除用户信息失败')
        this.$message.success('删除用户信息成功')
        this.getUserList()
    },
    // 分配角色的按钮
    async fenpeiRolesBtn(userInfo){
      this.fenpeiRolesdialogVisible = true
      this.userInfo = userInfo
      console.log(this.userInfo.id)
      //  const {data:res} = await this.$http.put(`users/${userInfo.id}/role`)
      // console.log(res)
      const {data: res} = await this.$http.get('roles')
      this.rolesOptions = res.data
    },
    // 分配角色对话框的确定按钮
    async fenpeiRoles(){
      const id = this.rolesOption
      const {data:res}= await this.$http.put(`users/${this.userInfo.id}/role`,{rid:id})
      // console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error('分配用户角色失败')
      }
      this.$message.success('分配用户角色成功')
      // console.log(id)
      this.getUserList()
      this.fenpeiRolesdialogVisible = false
    },
    // 关闭对话框时清空保存的值
    rolesClose(){
      this.rolesOptions = []
      this.rolesOption=''
    }
  }
}
</script>

<style>

</style>