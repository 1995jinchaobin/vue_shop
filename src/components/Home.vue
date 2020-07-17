<template>
  <div class="home">
    <el-container class="all">
      <!-- 头部 -->
      <el-header>
        <div>
          <img src="../assets/heima.png" alt="">
          <span>电商后台管理系统</span>
        </div>
        <el-button type="info" @click="logout">退出</el-button>
      </el-header>
      <!-- 内容 -->
      <el-container class="ce">
        <!-- 侧边栏 -->
        <el-aside :width="togCollapse? '64px':'200px'">
          <div @click="tog">III</div> 
          <!-- 菜单栏 -->
          <el-menu background-color="#333744" text-color="#fff" active-text-color="#409bff" unique-opened :collapse='togCollapse' :collapse-transition="false" :router="true" :default-active="activePath">
            <!-- 一级菜单 -->
            <el-submenu :index="item.id + ''" v-for="item in menuList" :key="item.id">
              <template slot="title">
                <i :class="iconsObj[item.id]"></i>
                <span>{{item.authName}}</span>
              </template>
              <!-- 二级菜单 -->
              <el-menu-item v-for="items in item.children" :key="items.id" :index="'/' + items.path" @click="saveNavState('/' + items.path)">
                <i class="el-icon-menu"></i>
                <span>{{items.authName}}</span>
              </el-menu-item>
            </el-submenu>
          </el-menu>
        </el-aside>
        <el-main>
          <router-view/>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  data () {
    return {
      menuList: [],
      iconsObj: {
        '125': 'el-icon-user-solid',
        '103': 'el-icon-s-grid',
        '101': 'el-icon-s-shop',
        '102': 'el-icon-s-claim',
        '145': 'el-icon-s-marketing'
      },
      togCollapse: false,
      activePath: ''
    }
  },
  created () {
    this.getMenuList()
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  methods: {
    logout () {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    async getMenuList () {
    const {data: res} = await this.$http.get('menus')
    // console.log(res)
    if (res.meta.status !== 200) return this.$message.console.error(res.meta.msg)
    this.menuList = res.data
    // console.log(this.menuList)
    },
    tog () {
      this.togCollapse = !this.togCollapse
    },
    saveNavState (activePath) {
      window.sessionStorage.setItem('activePath',activePath)
      this.activePath = activePath
    }
  }
}
</script>

<style lang="less" scoped>
.all{
  height: 100%;
}
.home{
  height: 100%;
  .el-header{
    background-color: #373C40;
    display: flex;
    padding-left: 0;
    justify-content: space-between;
    align-items: center;
    div{
      display: flex;
      span {
      color: #fff;
      font-size: 1.8rem;
      display: flex;
      align-items: center;
      }
    }
  }
  .ce{
    height: calc(100% - 60px);
    .el-aside{
      background-color: #333644;
      width: 200px;
      height: 100%;
      div{
        width: 100%;
        background-color: #495064;
        display: flex;
        justify-content: center;
        color: #fff;
        cursor: pointer;
      }
      .el-menu{
        border: none;
      }
    }
    .el-main{
      background-color: #eee;
    }
  }
}
</style>