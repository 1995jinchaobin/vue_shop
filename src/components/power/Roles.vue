<template>
  <div>
     <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-button type="primary" @click="addRolesdialogVisible = true">添加角色</el-button>
      <!-- 角色表单 -->
      <el-table stripe border style="width: 100%" :data="rolesList">
        <!-- expand可设置展开 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
              <el-row v-for="(item1,index) in scope.row.children" :key="item1.id" :class="['border_bottom',index === 0? 'border_top':'']">
                <!-- 一级权限列表所占宽度 -->
                <el-col :span="5" class="col1">
                  <el-tag closable @close = 'showMessageBox(scope.row,item1.id)'>{{ item1.authName }}</el-tag>
                  <i class="el-icon-caret-right"></i>
                </el-col>
                <!-- 二级,三级级权限列表所占宽度 -->
                <el-col :span="19" >
                  <el-row v-for="(item2,index2) in item1.children" :key="item2.id" :class="[index2 === 0? '':'border_top']">
                    <!-- 二级权限 -->
                    <el-col :span="6" class="col2">
                      <el-tag type="success" closable @close = 'showMessageBox(scope.row,item2.id)'>{{ item2.authName }}</el-tag>
                      <i class="el-icon-caret-right"></i>
                      </el-col>
                    <!-- 三级权限 -->
                    <el-col :span="18" class="col3">
                      <el-tag type="warning" v-for="item3 in item2.children" :key="item3.id" closable @close = 'showMessageBox(scope.row,item3.id)'>{{ item3.authName }}</el-tag>
                    </el-col>
                  </el-row>
                </el-col>    
              </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index" label="#"></el-table-column>
        <!-- label:表头   prop:获取数据对象的子对象 -->
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" >
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini" width="50" @click="editRolesInfo(scope.row)">编辑</el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="delRolesInfo(scope.row)">删除</el-button>
            <el-button type="warning" icon="el-icon-star-off" size="mini" @click="showFenpeiRoles(scope.row)">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 分配权限的弹出对话框 -->
    <el-dialog title="分配权限" :visible.sync="fenpeiRolesVisible" width="50%" @close='closeLeafKeys'>
      <el-tree :data="rightList" :props="defaultProps" show-checkbox node-key="id" default-expand-all  :default-checked-keys= 'defKeys' ref="treeRef"></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="fenpeiRolesVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 添加角色的弹出对话框 -->
    <el-dialog title="添加角色" :visible.sync="addRolesdialogVisible" width="50%">
      <el-form ref="addRolesRef" :model="rolesInfo" label-width="80px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="rolesInfo.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="rolesInfo.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addRolesdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRoles">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 操作里编辑按钮弹出的对话框 -->
    <el-dialog title="编辑角色信息" :visible.sync="editRolesdialogVisible" width="50%" @close = 'closeRolesInfo'>
      <el-form ref="editRolesRef" :model="rolesInfo" label-width="80px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="rolesInfo.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="rolesInfo.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editRolesdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRolesSuccess">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      rolesList:[],
      // 分配权限消息框
      fenpeiRolesVisible:false,
      // 权限列表
      rightList:[],
      defaultProps: {
          children: 'children',
          label: 'authName'
        },
      defKeys:[],
      roleId:[],
      // 添加角色对话框默认隐藏
      addRolesdialogVisible:false,
      // 角色的信息,名称,描述
      rolesInfo:{
        roleName: '',
        roleDesc: ''
      },
      rolesInfoId: '',
      // 编辑
      editRolesdialogVisible:false
    }
  },
  created () {
    this.getRolesList()
  },
  methods: {
    async getRolesList () {
     const {data:res} = await this.$http.get('roles')
    //  console.log(res)
     if (res.meta.status !== 200) return this.$message.error('获取角色列表失败')
     this.rolesList = res.data
    },
    // 权限删除消息盒子提示
    async showMessageBox(role,right) {
      const a =await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err
      ) 
      if (a !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      const b = await this.$http.delete(`roles/${role.id}/rights/${right}`)
      console.log(b.data.meta.status)
      if (b.data.meta.status !== 200) {
        return this.$message.error('删除权限失败')
      }
      role.children = b.data.data
      // console.log(a)
    },
    // 分配权限按钮
    async showFenpeiRoles (node) {
      const {data:a} = await this.$http.get('rights/tree')
      console.log(a)
      if (a.meta.status !==200) {
        return this.$message.error('获取分配权限失败')
      }
      this.rightList = a.data
      this.getLeafKeys(node,this.defKeys)
      this.roleId = node.id
      this.fenpeiRolesVisible = true
    },
    getLeafKeys(node,arr) {
      if (!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach(element => {
        this.getLeafKeys(element,arr)
      });
    },
    closeLeafKeys(){
      this.defKeys = []
    },
    async allotRights() {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      // console.log(keys)
      const idStr = keys.join(',')
      const {data:res} = await this.$http.post(`roles/${this.roleId}/rights`,{rids:idStr})
      console.log(res)
      if (res.meta.status !==200) {
        return this.$message.error('分配权限失败')
      }
      this.$message.success('分配权限成功')
      this.getRolesList()
      this.fenpeiRolesVisible=false
    },
    // 添加角色按钮
    async addRoles(){
      // this.addRolesdialogVisible = false
      const {data:res} = await this.$http.post('roles',this.rolesInfo)
      // console.log(res)
      if (res.meta.status !== 201) {
        return this.$message.error('添加角色失败')
      }
      this.$message.success('添加角色成功')
      this.getRolesList()
      this.rolesInfo = {}
      this.addRolesdialogVisible = false
    },
    // 操作里删除角色的按钮  根据角色id进行删除
    async delRolesInfo(rolesInfo){
      // console.log(rolesInfo.id)
      this.rolesInfoId = rolesInfo.id
      const {data:res} = await this.$http.delete(`roles/${this.rolesInfoId}`)
      if (res.meta.status!==200){
        return this.$message.error('删除角色失败')
      }
      this.$message.success('删除角色成功')
      this.rolesInfoId = []
      this.getRolesList()
    },
    // 操作里编辑按钮 
    editRolesInfo(rolesInfo){
      // console.log(rolesInfo)
      this.editRolesdialogVisible = true
      this.rolesInfo.roleName = rolesInfo.roleName
      this.rolesInfo.roleDesc = rolesInfo.roleDesc
      this.rolesInfoId = rolesInfo.id
    },
    // 编辑按钮对话框确定按钮,根据角色id进行put
    async editRolesSuccess(){
      if (this.rolesInfo.roleName ==''){
        return this.$message.error('角色名称不能为空')
      }
      const {data:res} = await this.$http.put(`roles/${this.rolesInfoId}`,this.rolesInfo)
      this.editRolesdialogVisible = false
      if (res.meta.status !== 200) {
        return this.$message.error('编辑角色失败')
      }
      this.$message.success('编辑角色成功')
      this.getRolesList()
      // console.log(this.rolesInfo.roleName)
    },
    // 关闭编辑对话框时清空角色保存的信息
    closeRolesInfo(){
      this.rolesInfo.roleName = ''
      this.rolesInfo.roleDesc = ''
      this.rolesInfoId = ''
    }
  }
}
</script>

<style lang="less" scoped>
  .el-button--mini{
    padding: 8px 4px;
  }
  .el-tag {
    margin: 10px auto 10px 10px;
  }
  .el-row {
    display: flex;
    align-items: center;
  }
  .border_bottom{
    border-bottom: 1px solid #ccc;
  }
  .border_top {
    border-top: 1px solid #ccc;
  }
</style>
  
