<template>
  <div>
    <h2 style="text-align: center">订单查询</h2>
    <div class="order">
      <el-card v-for="o in order.list" :key="o.id" style="margin-bottom: 10px">
        <div slot="header" class="clearfix">
          <label>{{ o.movieName }}</label>
          <el-tag v-if="o.status === '未完成'" type="primary" class="right">未完成</el-tag>
          <el-tag v-else-if="o.status === '已完成'" type="success" class="right">已完成</el-tag>
          <el-tag v-else type="primary" class="right">已退票</el-tag>
          <el-button v-if="o.status === '已完成'" type="primary" size="small" class="right" style="margin-right: 10px" @click="openRemark(o.id, o.movie_id, o.user_id)">评论</el-button>
          <el-button v-if="o.status === '未完成'" type="danger" size="small" class="right" style="margin-right: 10px" @click="handleRefund(o.id)">退款</el-button>
        </div>
        <div class="blank">
          <label>订单编号: </label>
          <span>{{ o.id }}</span>
        </div>
        <div class="blank">
          <label>下单时间: </label>
          <span>{{ o.create_time }}</span>
        </div>
        <div class="blank">
          <label>单价: </label>
          <el-tag type="info">{{ o.price }} 元</el-tag>
        </div>
        <div class="blank">
          <label>座位: </label>
          <div class="seat_info">
            <el-tag>{{ o.choose_seat }}</el-tag>
          </div>
        </div>
        <div class="blank">
          <label>总金额: </label>
          <el-tag type="success">{{ o.total_price }} 元</el-tag>
        </div>
      </el-card>
    </div>
    <el-dialog title="评价" :visible.sync="remark.dialogVisible">
      <el-form ref="remarkForm" :model="remark.form" :rules="remark.rules">
        <el-form-item label="评分" :label-width="remark.formLabelWidth" prop="score">
          <el-rate
            v-model="remark.form.score"
            show-score
            text-color="#ff9900"
            score-template="{value}"
            :max="10"
          />
        </el-form-item>
        <el-form-item label="评论" :label-width="remark.formLabelWidth" prop="text">
          <el-input
            v-model="remark.form.text"
            type="textarea"
            placeholder="请输入内容"
            maxlength="100"
            show-word-limit
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="remark.dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleSubmitRemark">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'CheckOrder',
  data() {
    const validateText = (rule, value, callback) => {
      if (value.length > 100) {
        callback(new Error('输入长度超限'))
      } else {
        callback()
      }
    }
    return {
      order: {
        list: [],
        total: 0
      },
      remark: {
        dialogVisible: false,
        form: {
          score: 0.0,
          text: '',
          order_id: '',
          user_id: '',
          movie_id: ''
        },
        formLabelWidth: '100',
        rules: {
          score: [
            { required: true, trigger: 'blur' }
          ],
          text: [
            { required: true, trigger: 'blur' },
            { validator: validateText, trigger: 'change' }
          ]
        }
      }
    }
  },
  mounted() {
    this.getOrder(this.$store.state.user.id)
  },
  methods: {
    async getOrder(user_id = '') {
      const res = await this.$API.order.getOrder(user_id)
      if (res.code === 200) {
        this.order.list = res.data
        this.order.total = res.data.length
      } else {
        this.$message({ type: 'error', message: '获取订单信息失败' })
      }
    },
    async handleRefund(order_id = '') {
      const res = await this.$API.order.refundOrder(order_id)
      if (res.code === 200) {
        this.$message({ type: 'success', message: '退票成功' })
        this.getOrder(this.$store.state.user.id)
      } else {
        this.$message({ type: 'error', message: '退票失败' })
      }
    },
    openRemark(order_id, movie_id, user_id) {
      this.remark.form.order_id = order_id
      this.remark.form.movie_id = movie_id
      this.remark.form.user_id = user_id
      this.remark.dialogVisible = true
    },
    handleSubmitRemark() {
      this.$refs['remarkForm'].validate((valid) => {
        if (valid) {
          this.remark.dialogVisible = false
          this.submitRemarkForm()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    async submitRemarkForm() {
      const res = await this.$API.order.remark(this.remark.form)
      this.$message({ type: res.code === 200 ? 'success' : 'info', message: res.message })
    }
  }
}
</script>

<style scoped>
.blank {
  margin-bottom: 10px;
}
.order {
  width: 50vw;
  margin-left: 15vw;
}
.right {
  float: right;
}
.seat_info {
  overflow: auto;
}
</style>
