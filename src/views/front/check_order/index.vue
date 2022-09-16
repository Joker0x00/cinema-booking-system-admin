<template>
  <div>
    <h2 style="text-align: center">订单查询</h2>
    <div class="order">
      <el-card v-for="o in order.list" :key="o.id" style="margin-bottom: 10px">
        <div slot="header" class="clearfix">
          <label>{{ o.movieName }}</label>
          <el-button v-if="o.status === '未完成'" type="primary" size="mini" class="right" @click="handleRefund(o.id)">退款</el-button>
          <el-tag v-else-if="o.status === '已完成'" type="success" class="right">已完成</el-tag>
          <el-tag v-else type="primary" class="right">已退票</el-tag>
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
          <el-tag>{{ o.choose_seat }}</el-tag>
        </div>
        <div class="blank">
          <label>总金额: </label>
          <el-tag type="success">{{ o.total_price }} 元</el-tag>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CheckOrder',
  data() {
    return {
      order: {
        list: [],
        total: 0
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
</style>
