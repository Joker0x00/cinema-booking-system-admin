<template>
  <el-dialog title="用户信息" :visible.sync="editOrAddDialogConfig.dialogVisible" modal width="50vw" @close="beforeClose">
    <el-form ref="editOrAddDialogForm" :model="editOrAddDialogConfig.form" status-icon style="width: 80%" :rules="editOrAddDialogConfig.formRules">
      <el-form-item prop="name" :label="editOrAddDialogConfig.keyValue.name[1]" :label-width="editOrAddDialogConfig.formLabelWidth">
        <el-input v-model="editOrAddDialogConfig.form.name" autocomplete="off" />
      </el-form-item>
      <el-form-item prop="password" :label="editOrAddDialogConfig.keyValue.password[1]" :label-width="editOrAddDialogConfig.formLabelWidth">
        <el-input v-model="editOrAddDialogConfig.form.password" type="password" autocomplete="off" />
      </el-form-item>
      <el-form-item prop="sex" :label="editOrAddDialogConfig.keyValue.sex[1]" :label-width="editOrAddDialogConfig.formLabelWidth">
        <el-select v-model="editOrAddDialogConfig.form.sex" placeholder="请选择性别" filterable>
          <el-option
            v-for="(item, index) in otherData.sexs"
            :key="index.value"
            :label="item.lable"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item prop="phone_number" :label="editOrAddDialogConfig.keyValue.phone_number[1]" :label-width="editOrAddDialogConfig.formLabelWidth">
        <el-input v-model="editOrAddDialogConfig.form.phone_number" autocomplete="off" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="editOrAddDialogConfig.dialogVisible = false">取 消</el-button>
      <el-button
        type="primary"
        @click="onSubmit"
      >
        确 定
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'Register',
  props: {
    'isRegister': Boolean
  },
  data() {
    const validateUsername = (rule, value, callback) => {
      if (value.length > 20) {
        callback(new Error('长度不超过20'))
      } else {
        callback()
      }
    }

    const validatePassword = (rule, value, callback) => {
      if (value.length > 50) {
        callback(new Error('长度不超过20'))
      } else if (value.length < 6) {
        callback(new Error('长度必须大于6'))
      } else {
        callback()
      }
    }

    const validatePhoneNumber = (rule, value, callback) => {
      if (value.length > 15) {
        callback(new Error('长度不超过15'))
      } else {
        callback()
      }
    }

    const validateBalance = (rule, value, callback) => {
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
      console.log(value)
      callback()
    }
    return {
      otherData: {
        sexs: [
          {
            'lable': '男',
            'value': '男'
          },
          {
            'lable': '女',
            'value': '女'
          }
        ]
      },
      editOrAddDialogConfig: {
        dialogVisible: false,
        formLabelWidth: '100',
        form: {
          id: '',
          name: '',
          password: '',
          sex: '',
          birthday: '',
          phone_number: '',
          balance: 0.0
        },
        formRules: {
          name: [
            { required: true },
            { validator: validateUsername }
          ],
          password: [
            { required: true },
            { validator: validatePassword }
          ],
          phone_number: [
            { validator: validatePhoneNumber }
          ],
          balance: [
            { required: true },
            { validator: validateBalance }
          ]
        },
        keyValue: {
          id: ['id', '用户编号'],
          name: ['name', '用户名'],
          password: ['password', '密码'],
          sex: ['sex', '性别'],
          birthday: ['birthday', '生日'],
          phone_number: ['phone_number', '电话号码'],
          balance: ['phone_number', '余额']
        }
      }
    }
  },
  mounted() {
    this.editOrAddDialogConfig.dialogVisible = this.isRegister
  },
  methods: {
    // 提交前验证表单
    onSubmit() {
      this.$refs['editOrAddDialogForm'].validate((valid) => {
        if (valid) {
          this.editOrAddDialogConfig.dialogVisible = false
          this.submitForm()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 提交表单函数
    async submitForm() {
      const { form } = this.editOrAddDialogConfig
      console.log(form)
      const res = await this.$API.user.addUser(form)
      if (res.code === 200) {
        this.$message({ message: '注册成功', type: 'success' })
      } else {
        this.$message({ message: '注册失败', type: 'error' })
      }
    },
    beforeClose() {
      this.$bus.$emit('changeIsRegister')
    }
  }
}
</script>

<style>

</style>
