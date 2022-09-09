<template>
  <div>
    <div class="top">
      <label>筛选电影名称：</label>
      <el-select v-model="filterKeys.movie_id" clearable placeholder="请选择电影" style="margin-right: 10px">
        <el-option
          v-for="item in otherData.movie"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <!-- <label style="margin-left: 20px; margin-right: 10px">模糊搜索</label> -->
      <!-- <el-switch
        v-model="searchConfig.vague"
        active-color="#13ce66"
        inactive-color="#ff4949"
        style="margin-right: 10px"
      /> -->
      <el-button type="primary" icon="el-icon-search" @click="handlesearch">筛选</el-button>
      <el-radio-group v-model="searchConfig.sort" size="medium" style="margin-left: 20px">
        <el-radio-button label="asc">评分升序</el-radio-button>
        <el-radio-button label="desc">评分降序</el-radio-button>
      </el-radio-group>
      <el-button type="primary" class="right-content" style="margin-left: 10px" @click="handleExportSettings">
        <i class="el-icon-download" />
        导出
      </el-button>
      <!-- <el-checkbox v-model="search.vague" class="right-content">模糊搜索</el-checkbox> -->
    </div>
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
      <el-table-column
        label="操作"
        header-align="center"
        align="center"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>

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
    <!-- 导出文件的对话框 -->
    <el-dialog title="导出设置" :visible.sync="exportConfig.dialogExportVisible">
      <el-form ref="exportForm" :model="exportConfig.form" :rules="exportConfig.form.formRules">
        <el-form-item prop="filename" label="文件名" :label-width="exportConfig.formLabelWidth">
          <el-input v-model="exportConfig.form.filename" autocomplete="off" />
        </el-form-item>
        <el-form-item label="保存类型" :label-width="exportConfig.formLabelWidth">
          <el-select v-model="exportConfig.form.bookType" placeholder="请选择保存文件类型">
            <el-option label=".csv" value="csv" />
            <el-option label=".pdf" value="pdf" />
            <el-option label=".txt" value="txt" />
          </el-select>
        </el-form-item>
        <el-form-item label="选择数据" :label-width="exportConfig.formLabelWidth">
          <el-select v-model="exportConfig.form.dataSource" placeholder="请选择数据来源">
            <el-option label="所有数据" value="all" />
            <el-option label="选中数据" value="selected" />
          </el-select>
        </el-form-item>
        <el-form-item prop="fields" label="选择字段" :label-width="exportConfig.formLabelWidth">
          <el-select v-model="exportConfig.form.fields" multiple placeholder="请选择字段">
            <el-option
              v-for="item in tableConfig.fields"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="sumitAndValidate">导出</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import * as XLSX from 'xlsx'
export default {
  name: 'Comment',
  data() {
    const validateExportFilename = (rule, value, callback) => {
      if (value.length > 50) {
        callback(new Error('长度不超过50'))
      } else {
        callback()
      }
    }

    return {
      searchConfig: {
        key: '',
        searchParams: '[{ "key": "name", "value": "" }]',
        sort: ''
      },
      tableConfig: {
        fields: [
          {
            label: '评论编号',
            value: 'id'
          },
          {
            label: '电影编号',
            value: 'movie_id'
          },
          {
            label: '电影名称',
            value: 'movieName'
          },
          {
            label: '评分',
            value: 'score'
          },
          {
            label: '评论',
            value: 'comments'
          },
          {
            label: '来自用户编号',
            value: 'user_id'
          },
          {
            label: '来自用户名',
            value: 'userName'
          },
          {
            label: '创建时间',
            value: 'create_time'
          }
        ],
        labels: ['评论编号', '评分', '评论', '来自用户编号', '创建时间'],
        values: ['id', 'score', 'comments', 'from_user_id', 'create_time'],
        data: []
      },
      pageConfig: {
        pageSizes: [5, 10, 20, 50],
        total: 0,
        layout: 'total, sizes, prev, pager, next, jumper',
        pageSize: 10,
        page: 1
      },
      // export config
      exportConfig: {
        dialogExportVisible: false,
        formLabelWidth: '',
        form: {
          filename: '',
          bookType: '.csv',
          dataSource: 'all',
          fields: [],
          formRules: {
            filename: [
              { required: true, trigger: 'blur' },
              { validator: validateExportFilename, trigger: 'change' }
            ],
            fields: [
              { required: true, trigger: 'blur' }
              // { validator: validateExportFields, trigger: 'change' }
            ]
          }
        },
        data: [],
        tableName: 'Comment'
      },
      otherData: {
        movie: []
      },
      filterKeys: {
        movie_id: ''
      }
    }
  },
  computed: {
    filterConfig() {
      const { filterKeys } = this
      const res = []
      Object.keys(filterKeys).forEach((key) => {
        res.unshift({
          key,
          value: filterKeys[key]
        })
      })
      return JSON.stringify(res)
    }
  },
  mounted() {
    // 挂载后获取电影列表
    this.getPageList(1, this.limit)
    this.reqAllMovie()
  },
  methods: {
    // 获取分页数据
    async getPageList(p, size, params = '[{ "key": "name", "value": "" }]', sort = '') {
      this.page = p
      this.limit = size
      this.searchConfig.searchParams = params
      const { page, limit } = this
      const { searchParams } = this.searchConfig
      // 获取品牌列表接口
      const result = await this.$API.comment.reqComment(page, limit, searchParams, sort)
      if (result.code === 200) {
        this.tableConfig.data = result.data.rows
        this.pageConfig.total = result.data.count
      } else {
        this.$message.error('加载数据失败')
      }
    },
    async deleteRow(id) {
      const res = await this.$API.comment.deleteComment(id)
      const { page, limit } = this.pageConfig
      const { searchParams } = this.searchConfig
      if (res.code === 200) {
        this.$message({ message: '删除成功', type: 'success' })
        this.getPageList(this.tableConfig.data.length === 1 ? page - 1 : page, limit, searchParams, this.searchConfig.sort)
      } else {
        this.$message({ message: '删除失败', type: 'error' })
      }
    },
    async handleExport() {
      const { exportConfig } = this
      const res = await this.$API.reqExport.reqTableExport(exportConfig.tableName, exportConfig.form)
      if (res.code === 200) {
        exportConfig.data = res.data
        if (exportConfig.form.fields === []) {
          this.$message({ message: '请至少选择一个字段', type: 'error' })
          return
        }
        // 自定义下载的header，注意是数组中的数组哦
        const Header = [exportConfig.form.fields]
        const data = exportConfig.data
        // 将JS数据数组转换为工作表。
        const headerWs = XLSX.utils.aoa_to_sheet(Header)
        const ws = XLSX.utils.sheet_add_json(headerWs, data, { skipHeader: true, origin: 'A2' })
        /* 新建空的工作表 */
        const wb = XLSX.utils.book_new()
        // 可以自定义下载之后的sheetname
        XLSX.utils.book_append_sheet(wb, ws, 'sheetName')

        /* 生成xlsx文件 */
        XLSX.writeFile(wb, exportConfig.form.filename + '.xlsx')
        exportConfig.dialogExportVisible = false
      } else {
        this.$message({ message: '获取文件失败', type: 'error' })
      }
    },
    async reqAllMovie() {
      const res = await this.$API.movieDetail.reqMovieAll()
      if (res.code === 200) {
        this.otherData.movie = res.data
      }
    },
    // 删除电影
    handleDelete($index, row) {
      const id = row.id
      this.deleteRow(id)
    },
    // 分页器相关
    handleSizeChange(limit) {
      this.pageConfig.pageSize = limit
      this.getPageList(this.page, limit, this.searchConfig.searchParams, this.searchConfig.sort)
    },
    // 处理分页
    handleCurrentChange(pager) {
      this.getPageList(pager, this.limit, this.searchConfig.searchParams, this.searchConfig.sort)
    },
    // 重置表单
    resetForm(formName) {
      if (this.$refs[formName] !== undefined) this.$refs[formName].resetFields()
    },
    // 搜索关键字
    handlesearch() {
      // console.log(this.filterConfig)
      console.log(this.searchConfig.sort)
      this.getPageList(1, this.pageConfig.pageSize, this.filterConfig, this.searchConfig.sort)
    },
    // 重置搜索关键字
    resetSearch() {
      this.searchConfig.key = ''
      this.getPageList(1, this.limit)
    },
    // 导出设置
    handleExportSettings() {
      this.exportConfig.dialogExportVisible = true
    },
    // 验证导出表单
    sumitAndValidate() {
      this.$refs['exportForm'].validate((valid) => {
        if (valid) {
          this.handleExport()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style>
  .searchInput {
    width: 20%;
    float: right;
  }
  .top {
    margin-top: 10px;
  }
  .right-content {
    float: right
  }
  .top .cbox {
    margin-right: 10px;
  }
  .text {
    font-size: 14px;
  }

  .item {
    margin-bottom: 18px;
  }
</style>
