<template>
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
          <label>余额：</label>
          {{ balance }}
        </div>
        <div class="text item">
          <label>角色：</label>
          {{ role }}
        </div>
        <div class="text item">
          <label>性别：</label>
          {{ sex }}
        </div>
        <div class="text item">
          <label>电话号码：</label>
          {{ phone_number }}
        </div>
        <div class="text item">
          <el-button round size="mini" @click="editInfo">修改信息</el-button>
          <el-button type="success" round size="mini" @click="recharge">充值</el-button>
          <el-button type="primary" round size="mini" @click="changePass">修改密码</el-button>
        </div>
      </el-card>
    </el-col>
    <el-dialog title="修改密码" :visible.sync="passwordChangeForm.dialogVisible">
      <el-form ref="passwordChangeForm" :model="passwordChangeForm.form" status-icon :rules="passwordChangeForm.rules" label-width="100px" class="demo-ruleForm">
        <el-form-item label="密码" prop="pass">
          <el-input type="password" v-model="passwordChangeForm.form.pass" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPass">
          <el-input type="password" v-model="passwordChangeForm.form.checkPass" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('passwordChangeForm')">提交</el-button>
          <el-button @click="resetForm('passwordChangeForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog title="修改用户名" :visible.sync="editForm.dialogVisible">
      <el-form ref="editForm" :model="editForm.form" status-icon :rules="editForm.rules" label-width="100px" class="demo-ruleForm">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="editForm.form.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="性别">
          <el-select v-model="editForm.form.sex" placeholder="请输入性别">
            <el-option label="男" value="男"></el-option>
            <el-option label="女" value="女"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="电话号码">
          <el-input v-model.number="editForm.form.phone_number"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('editForm')">提交</el-button>
          <el-button @click="resetForm('editForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog title="充值" :visible.sync="rechargeForm.dialogVisible">
      <el-form ref="rechargeForm" :model="rechargeForm.form" status-icon :rules="rechargeForm.rules" label-width="100px" class="demo-ruleForm">
        <el-form-item label="充值金额" prop="plus">
          <el-input v-model="rechargeForm.form.plus" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('rechargeForm')">确认充值</el-button>
          <el-button @click="resetForm('rechargeForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </el-row>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'UserInfo',
  data() {
    const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        if (this.passwordChangeForm.form.checkPass !== '') {
          this.$refs.passwordChangeForm.validateField('checkPass')
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
    const validateFloat = (rule, value, callback) => {
      let cnt = 0
      for (let i = 0; i < value.length; i++) {
        if (value[i] === '.') cnt++
        if ((value[i] < '0' || value[i] > '9') && value[i] !== '.') {
          callback(new Error('输入格式有误'))
        }
      }
      if (cnt > 1) {
        callback(new Error('输入格式有误'))
      }
      const c = parseFloat(value)
      if (isNaN(c)) {
        callback(new Error('输入格式有误'))
      }
      callback()
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
      editForm: {
        dialogVisible: false,
        form: {
          id: '',
          username: '',
          sex: '',
          phone_number: ''
        },
        rules: {
          username: [
            { validator: validateUsername, trigger: 'blur' }
          ]
        }
      },
      rechargeForm: {
        dialogVisible: false,
        form: {
          id: '',
          plus: ''
        },
        rules: {
          plus: [
            { validator: validateFloat, trigger: 'blur' }
          ]
        }
      }
    }
  },
  computed: {
    ...mapState('user', ['id', 'name', 'role', 'balance', 'sex', 'phone_number'])
  },
  methods: {
    changePass() {
      this.resetForm('passwordChangeForm')
      this.passwordChangeForm.dialogVisible = true
    },
    async validateUsername(name) {
      const res = await this.$API.user.validateUsername(name)
      return res.code
    },
    async handleChangePass(id, pass) {
      const res = await this.$API.user.changePass(this.id, this.passwordChangeForm.form.pass)
      if (res.code === 200) {
        this.$message({ type: 'success', message: '修改成功' })
      } else {
        this.$message({ type: 'error', message: '修改失败' })
      }
      this.passwordChangeForm.dialogVisible = false
    },
    async handleEditForm() {
      const res = await this.$API.user.editInfo(this.editForm.form)
      if (res.code === 200) {
        this.$message({ type: 'success', message: '修改成功' })
        this.$store.dispatch('user/getInfo').then(() => {
        }).catch(() => {
          this.$message({ type: 'error', message: '获取个人信息失败' })
        })
      } else if (res.code === 201) {
        this.$message({ type: 'error', message: '用户名已被占用' })
      } else {
        this.$message({ type: 'error', message: '修改失败' })
      }
      this.editForm.dialogVisible = false
    },
    async handelRecharge() {
      const res = await this.$API.order.recharge(this.id, this.rechargeForm.form.plus)
      if (res.code === 200) {
        this.$message({ type: 'success', message: '充值成功' })
        this.rechargeForm.dialogVisible = false
        this.$store.dispatch('user/getInfo').then(() => {
        }).catch(() => {
          this.$message({ type: 'error', message: '获取个人信息失败' })
        })
      } else {
        this.$message({ type: 'error', message: '充值失败' })
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (formName === 'passwordChangeForm') {
            this.handleChangePass(this.id, this.passwordChangeForm.form.pass)
          } else if (formName === 'editForm') {
            this.handleEditForm()
          } else {
            this.handelRecharge()
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
    },
    editInfo() {
      this.resetForm('editForm')
      this.editForm.form.id = this.id
      this.editForm.form.username = this.name
      this.editForm.form.sex = this.sex
      this.editForm.form.phone_number = this.phone_number
      this.editForm.dialogVisible = true
    },
    recharge() {
      this.resetForm('rechargeForm')
      this.rechargeForm.dialogVisible = true
      this.rechargeForm.form.id = this.id
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
