<template>
  <el-row>
    <el-col :span="8" class="slide">
      <h2 style="text-align: center">热映电影</h2>
      <div style="height:91vh;overflow:auto">
        <el-card v-for="m in movies.list" :key="m.id" class="text item" style="text-align:center; margin-top: 10px">
          <div slot="header" class="clearfix">
            <label>{{ m.name }}</label>
          </div>
          <div class="text item">
            <el-col :span="12">
              <p>{{ m.info }}</p>
            </el-col>
            <el-col :span="12">
              <img :src="m.image" style="height: 150px">
            </el-col>
          </div>
        </el-card>
      </div>
    </el-col>
    <el-col :span="16">
      <div class="login-container" @keydown.enter="handleLogin">
        <!-- 展示表单属性 -->
        <!-- model收集表单数据 rules表单验证规则 -->
        <el-form ref="loginForm" status-icon :model="loginForm" :rules="loginRules" class="login-form" auto-complete="on" label-position="left">
          <!-- 标题 -->
          <div class="title-container">
            <h3 class="title">电影订票系统</h3>
          </div>

          <el-form-item prop="username">
            <span class="svg-container">
              <svg-icon icon-class="user" />
            </span>
            <el-input
              ref="username"
              v-model="loginForm.username"
              placeholder="Username"
              name="username"
              type="text"
              tabindex="1"
              auto-complete="on"
            />
          </el-form-item>

          <el-form-item prop="password">
            <span class="svg-container">
              <svg-icon icon-class="password" />
            </span>
            <el-input
              :key="passwordType"
              ref="password"
              v-model="loginForm.password"
              :type="passwordType"
              placeholder="Password"
              name="password"
              tabindex="2"
              auto-complete="on"
              @keyup.enter.native="handleLogin"
            />
            <span class="show-pwd" @click="showPwd">
              <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
            </span>
          </el-form-item>
          <img :src="image_code_url" style="float:right; height: 40px; width: 125px; margin-top: 5px; margin-left: 10px" @click="getConfirmCode">
          <el-form-item prop="code" style="width: 300px">
            <el-input
              v-model="loginForm.code"
              :maxlength="5"
              placeholder="验证码"
              type="text"
              size="mini"
            />
          </el-form-item>

          <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:30px;" @click.native.prevent="handleLogin">登录</el-button>

          <div class="tips">
            <el-switch
              v-model="loginForm.isAdmin"
              active-text="管理员登录"
              inactive-text="普通用户登录"
            />
            <el-button type="success" round size="mini" style="float: right; margin-top: -8px" @click.native.prevent="handleRegister">注册</el-button>
          </div>

        </el-form>
      </div>
    </el-col>
    <Register v-if="isRegister" :is-register="isRegister" />
  </el-row>
</template>

<script>
import Register from './register/index.vue'
export default {
  name: 'Login',
  components: {
    Register
  },
  data() {
    // 前端校验是否合法，在数据库中核实
    const validateUsername = (rule, value, callback) => {
      if (value.length > 50) {
        callback(new Error('用户名不得超过50'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length > 50) {
        callback(new Error('密码不得超过50'))
      } else {
        callback()
      }
    }
    const validateCode = (rule, value, callback) => {
      if (value.length < 5) {
        callback(new Error('验证码位数不够'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        username: 'wy',
        password: '123456',
        isAdmin: false,
        code_id: '',
        code: ''
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }],
        code: [{ required: true, trigger: 'blur', validator: validateCode }]

      },
      loading: false,
      passwordType: 'password',
      redirect: undefined,
      movies: {
        total: 0,
        list: []
      },
      image_code_url: '',
      isRegister: false
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  mounted() {
    this.getMovie()
    this.getConfirmCode()
    console.log(this)
    this.$bus.$on('changeIsRegister', this.handleRegister)
  },
  methods: {
    // 显示密码
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('user/login', this.loginForm).then(() => {
            // this.$router.push({ path: this.redirect || '/' })
            this.$router.push({ path: '/' })
            this.loading = false
          }).catch(() => {
            // 登陆失败
            this.loading = false
            this.getConfirmCode()
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    async getMovie() {
      const res = await this.$API.movieDetail.reqMovieList(1, 10)
      if (res.code === 200) {
        this.movies.total = res.data.count
        this.movies.list = res.data.rows
      } else {
        this.$message({ type: 'error', message: '获取电影信息失败' })
      }
    },
    async getConfirmCode() {
      const res = await this.$API.img.getConfirmCode()
      if (res.code === 200) {
        this.image_code_url = process.env.VUE_APP_BASE_API + res.data.url
        this.loginForm.code_id = res.data.code_id
      } else {
        this.$message({ type: 'error', message: '获取验证码失败' })
      }
    },
    handleRegister() {
      this.isRegister = !this.isRegister
    }
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg:#283443;
$light_gray:#fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;
$bg_img: url(~@/assets/login_bg/bgimg.jpg);

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  // background: $bg_img;
  background-size: 100% 100%;
  overflow: hidden;

  .login-form {
    height: 100vh;
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
  .slide {
    background-color: #889aa4;
  }
}
</style>
