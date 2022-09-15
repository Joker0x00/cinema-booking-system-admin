<template>
  <div class="dashboard-container">
    <div>
      <el-row>
        <el-col :span="8">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <h2>个人信息</h2>
            </div>
            <div class="text item">
              <label>用户编号：</label>
              {{ id }}
            </div>
            <div class="text item">
              <label>用户名：</label>
              {{ name }}
            </div>
            <div class="text item">
              <label>身份：</label>
              {{ role }}
            </div>
            <div class="text item">
              <el-button type="success" round size="mini" @click="changeUsername">修改用户名</el-button>
              <el-button type="primary" round size="mini" @click="changePass">修改密码</el-button>
            </div>
          </el-card>
        </el-col>
        <!-- <el-col :span="16">
          <el-card class="box-card info" style="margin-left: 20px">
            <div slot="header" class="clearfix">
              <h2>通知面板</h2>
            </div>
            <div class="block">
              <el-timeline>
                <el-timeline-item timestamp="2018/4/12" placement="top">
                  <el-card>
                    <h4>更新 Github 模板</h4>
                    <p>王小虎 提交于 2018/4/12 20:46</p>
                  </el-card>
                </el-timeline-item>
                <el-timeline-item timestamp="2018/4/3" placement="top">
                  <el-card>
                    <h4>更新 Github 模板</h4>
                    <p>王小虎 提交于 2018/4/3 20:46</p>
                  </el-card>
                </el-timeline-item>
                <el-timeline-item timestamp="2018/4/2" placement="top">
                  <el-card>
                    <h4>更新 Github 模板</h4>
                    <p>王小虎 提交于 2018/4/2 20:46</p>
                  </el-card>
                </el-timeline-item>
              </el-timeline>
            </div>
          </el-card>
        </el-col> -->
      </el-row>
    </div>
    <el-dialog title="修改密码" :visible.sync="passwordChangeForm.dialogVisible">
      <el-form ref="form" :model="passwordChangeForm.form" status-icon :rules="passwordChangeForm.rules" label-width="100px" class="demo-ruleForm">
        <el-form-item label="密码" prop="pass">
          <el-input type="password" v-model="passwordChangeForm.form.pass" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPass">
          <el-input type="password" v-model="passwordChangeForm.form.checkPass" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('form')">提交</el-button>
          <el-button @click="resetForm('form')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog title="修改用户名" :visible.sync="usernameChangeForm.dialogVisible">
      <el-form ref="usernameForm" :model="usernameChangeForm.form" status-icon :rules="usernameChangeForm.rules" label-width="100px" class="demo-ruleForm">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="usernameChangeForm.form.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('usernameForm')">提交</el-button>
          <el-button @click="resetForm('usernameForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'Dashboard',
  data() {
    const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        if (this.passwordChangeForm.form.checkPass !== '') {
          this.$refs.form.validateField('checkPass')
        }
        callback()
      }
    }
    const validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.passwordChangeForm.form.pass) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    const validateUsername = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入用户名'))
      } else if (value.length > 50) {
        callback(new Error('用户名不得超过50!'))
      } else {
        callback()
      }
    }
    return {
      passwordChangeForm: {
        dialogVisible: false,
        form: {
          pass: '',
          checkPass: ''
        },
        rules: {
          pass: [
            { validator: validatePass, trigger: 'blur' }
          ],
          checkPass: [
            { validator: validatePass2, trigger: 'blur' }
          ]
        }
      },
      usernameChangeForm: {
        dialogVisible: false,
        form: {
          username: ''
        },
        rules: {
          username: [
            { validator: validateUsername, trigger: 'blur' }
          ]
        }
      }
    }
  },
  computed: {
    ...mapState('user', ['id', 'name', 'role'])
  },
  methods: {
    changePass() {
      this.resetForm('form')
      this.passwordChangeForm.dialogVisible = true
    },
    changeUsername() {
      this.resetForm('usernameForm')
      this.usernameChangeForm.dialogVisible = true
    },
    async handleChangePass(id, pass) {
      const res = await this.$API.admin.changePass(this.id, this.passwordChangeForm.form.pass)
      if (res.code === 200) {
        this.$message({ type: 'success', message: '修改成功' })
      } else {
        this.$message({ type: 'error', message: '修改失败' })
      }
      this.passwordChangeForm.dialogVisible = false
    },
    async handleChangeUsername(id, username) {
      const res = await this.$API.admin.changeUsername(id, username)
      if (res.code === 200) {
        this.$message({ type: 'success', message: '修改成功' })
        this.$store.dispatch('user/getInfo').then(() => {
        }).catch(() => {
          this.$message({ type: 'error', message: '获取个人信息失败' })
        })
      } else {
        this.$message({ type: 'error', message: '修改失败' })
      }
      this.usernameChangeForm.dialogVisible = false
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (formName === 'form') {
            this.handleChangePass(this.id, this.passwordChangeForm.form.pass)
          } else {
            this.handleChangeUsername(this.id, this.usernameChangeForm.form.username)
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm(formName) {
      if (this.$refs[formName] === undefined) {
        return
      }
      this.$refs[formName].resetFields()
    }
  }
}
</script>

<style scoped>
.box-card {
  width: auto;
  height: auto;
}
.box-card .info {
  height: 100vh;
  overflow: auto;
}
.text {
    font-size: 18px;
  }

.item {
  margin-bottom: 18px;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both
}
</style>
