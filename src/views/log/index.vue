<template>
  <div>
    <el-table :data="tableConfig.data" border style="width: 100%; margin-top: 20px">
      <el-table-column
        v-for="(item, index) in tableConfig.fields"
        :ref="item.value"
        :key="index"
        header-align="center"
        align="center"
        :prop="item.value"
        :label="item.label"
      />
    </el-table>

    <el-pagination
      background
      style="margin-top: 20px; text-align: center"
      :current-page="pageConfig.page"
      :page-size="pageConfig.pageSize"
      :layout="pageConfig.layout"
      :total="pageConfig.total"
      :page-sizes="pageConfig.pageSizes"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script>
export default {
  name: 'Order',
  filters: {
    numFilter(value) {
      let realVal = ''
      if (!isNaN(value) && value !== '') {
        // 截取当前数据到小数点后两位,改变toFixed的值即可截取你想要的数值
        realVal = parseFloat(value).toFixed(2)
      } else {
        realVal = '--'
      }
      return realVal
    }
  },
  data() {
    return {
      tableConfig: {
        fields: [
          {
            label: '日志编号',
            value: 'id'
          },
          {
            label: '操作',
            value: 'operation'
          },
          {
            label: '详细信息',
            value: 'detail'
          },
          {
            label: '操作时间',
            value: 'time'
          }
        ],
        data: []
      },
      pageConfig: {
        pageSizes: [5, 10, 20, 50],
        total: 0,
        layout: 'total, sizes, prev, pager, next, jumper',
        pageSize: 10,
        page: 1
      }
    }
  },
  mounted() {
    this.getPageList(1, this.pageConfig.pageSize)
  },
  methods: {
    // 获取分页数据
    async getPageList(p, size) {
      this.pageConfig.page = p
      this.pageConfig.pageSize = size
      const { page, pageSize } = this.pageConfig
      // 获取品牌列表接口
      console.log(this.pageConfig.page, this.pageConfig.pageSize)
      const result = await this.$API.log.get_log(page, pageSize)
      if (result.code === 200) {
        this.tableConfig.data = result.data.rows
        this.pageConfig.total = result.data.count
      } else {
        this.$message.error('加载数据失败')
      }
    },
    handleSizeChange(limit) {
      console.log('@changeSize', limit)
      this.getPageList(this.page, limit, this.searchConfig.vague, this.searchConfig.searchParams)
    },
    // 处理分页
    handleCurrentChange(pager) {
      this.getPageList(pager, this.limit, this.searchConfig.vague, this.searchConfig.searchParams)
    }
  }
}
</script>
