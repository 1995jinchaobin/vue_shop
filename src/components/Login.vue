<template>
  <div class="login">
    <div class="login_box">
      <div class="box_img">
        <img src=".././assets/logo.png" alt="">
      </div>
      <!-- 表单 -->
      <el-form :model="loginForm" :rules="loginFormRules" ref="loginFormRef">
        <!-- 2行表单输入框 -->
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" prefix-icon="el-icon-user-solid"></el-input>
        </el-form-item>
        <el-form-item prop="password"> 
          <el-input v-model="loginForm.password" type="password" prefix-icon="el-icon-lock"></el-input>
        </el-form-item>
        <!-- 按钮 -->
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登陆</el-button>
          <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      loginFormRules: {
        username: [
          { required: true, message: '请输入登陆账号', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在3-10个字符',trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入登陆密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在6-15个字符',trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 重置表单
    resetLoginForm () {
      this.$refs.loginFormRef.resetFields()
    },
    // 登陆表单
    login () {
      // validate的属性值为boolean值
      this.$refs.loginFormRef.validate( async valid => {
        if (!valid) return
        // axios请求
        const { data: result } = await this.$http.post('login',this.loginForm)
        // console.log(result)
        if (result.meta.status !== 200) return this.$message.error('登陆失败')
        this.$message.success('登陆成功')
        window.sessionStorage.setItem('token', result.data.token)
        this.$router.push('/home')
      })
    }
  }
}
</script>

<style lang="less" scoped>
.login {
  background-color: #2b4b6b;
  height: 100%;
  // 白色盒子
  .login_box{
    background-color: #fff;
    position: absolute;
    width: 430px;
    height: 280px;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);
    // 图标
    .box_img{
      width: 130px;
      height: 130px;
      background-color: #fff;
      position: absolute;
      // border:1px solid #ccc;
      left: 50%;
      transform: translate(-50%,-50%);
      padding: 10px;
      border-radius: 50%;
      box-shadow: 0 0 10px #ccc;
      img{
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background-color: #ddd;
      }
    }
    // 表单
    .el-form{
      position: absolute;
      width: calc(100% - 40px);
      bottom: 0;
      margin:auto 20px;
      height: 65%;
      // transform: translateX(-50%);
      .el-input__icon:after{
        background-color: #ccc;
      }
      .btns{
        display: flex;
        justify-content: flex-end;
      }
    }
  }
}
</style>>
