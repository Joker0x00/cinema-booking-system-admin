<template>
  <div>
    <div class="top">
      <el-button
        type="primary"
        icon="el-icon-plus"
        @click="handleAdd"
      >
        添加
      </el-button>
      <el-button type="primary" class="right-content" @click="handleExportSettings">
        <i class="el-icon-download" />
        导出
      </el-button>
      <el-button class="right-content" type="primary" @click="resetSearch">重置</el-button>
      <el-input
        v-model="searchConfig.key"
        class="searchInput"
        prefix-icon="el-icon-search"
        placeholder="请输入检索的放映电影名称"
        @change="serchMovieTypeByName"
      />
      <!-- <el-checkbox v-model="search.vague" class="right-content">模糊搜索</el-checkbox> -->
      <!-- <el-checkbox v-model="searchConfig.vague" label="模糊搜索" border class="right-content cbox" /> -->
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
          <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">
            编辑
          </el-button>
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

    <!-- <el-pagination
      background
      style="margin-top: 20px; text-align: center"
      :current-page="pageConfig.page"
      :page-size="pageConfig.pageSize"
      :layout="pageConfig.layout"
      :total="pageConfig.total"
      :page-sizes="pageConfig.pageSizes"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    /> -->

    <el-dialog title="电影类型信息" :visible.sync="editOrAddDialogConfig.dialogVisible" modal width="50vw">
      <el-form ref="editOrAddDialogForm" :model="editOrAddDialogConfig.form" status-icon style="width: 80%" :rules="editOrAddDialogConfig.formRules">
        <el-form-item prop="name" :label="editOrAddDialogConfig.keyValue.name[1]" :label-width="tableConfig.formLabelWidth">
          <el-input v-model="editOrAddDialogConfig.form.name" autocomplete="off" />
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

    导出文件的对话框
    <el-dialog title="导出设置" :visible.sync="exportConfig.dialogExportVisible">
      <el-form ref="exportForm" :model="exportConfig.form" :rules="exportConfig.form.formRules">
        <el-form-item prop="filename" label="文件名" :label-width="exportConfig.formLabelWidth">
          <el-input v-model="exportConfig.form.filename" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="保存类型" :label-width="exportConfig.formLabelWidth">
          <el-select v-model="exportConfig.form.bookType" placeholder="请选择保存文件类型">
            <el-option label=".csv" value="csv"></el-option>
            <el-option label=".pdf" value="pdf"></el-option>
            <el-option label=".txt" value="txt"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="选择数据" :label-width="exportConfig.formLabelWidth">
          <el-select v-model="exportConfig.form.dataSource" placeholder="请选择数据来源">
            <el-option label="所有数据" value="all"></el-option>
            <el-option label="选中数据" value="selected"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="fields" label="选择字段" :label-width="exportConfig.formLabelWidth">
          <el-select v-model="exportConfig.form.fields" multiple placeholder="请选择字段">
            <el-option
              v-for="item in tableConfig.fields"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
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
  name: 'MovieType',
  data() {
    const validateNmae = (rule, value, callback) => {
      if (value.length > 50) {
        callback(new Error('长度不超过50'))
      } else {
        callback()
      }
    }

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
        vague: false
      },
      tableConfig: {
        fields: [
          {
            label: '电影类型编号',
            value: 'id'
          },
          {
            label: '电影类型名称',
            value: 'name'
          }
        ],
        labels: ['电影类型编号', '电影类型名称'],
        values: ['id', 'name'],
        data: []
      },
      pageConfig: {
        pageSizes: [5, 10, 20, 50],
        total: 0,
        layout: 'total, sizes, prev, pager, next, jumper',
        pageSize: 10,
        page: 1
      },
      otherData: {
        movies: [],
        rooms: []
      },
      editOrAddDialogConfig: {
        dialogVisible: false,
        // 表格标题宽度
        formLabelWidth: '100',
        form: {
          id: '',
          name: ''
        },
        formRules: {
          id: [
            { required: true }
          ],
          name: [
            { required: true },
            { validator: validateNmae, trigger: 'blur' }
          ]
        },
        keyValue: {
          id: ['id', '电影类型编号'],
          name: ['name', '电影类型名称']
        },
        setSeat: {
          isShow: false,
          flag: false
        }
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
        tableName: 'MovieType'
      }
    }
  },
  mounted() {
    // 挂载后获取电影列表
    this.getPageList()
  },
  methods: {
    // 获取分页数据
    async getPageList(k = '') {
      this.searchConfig.key = k
      const { key } = this.searchConfig
      console.log(key)
      // 获取品牌列表接口
      const result = await this.$API.movieDetail.reqMovieType(k)
      if (result.code === 200) {
        this.tableConfig.data = result.data
      } else {
        this.$message.error('加载数据失败')
      }
    },
    async deleteMovieType(id) {
      const res = await this.$API.movieDetail.deleteMovieType(id)
      if (res.code === 200) {
        this.$message({ message: '删除成功', type: 'success' })
        this.getPageList()
      } else {
        this.$message({ message: '删除失败', type: 'error' })
      }
    },
    async addMovieType(form) {
      const res = await this.$API.movieDetail.addMovieType(form)
      if (res.code === 200) {
        this.$message({ message: '新增成功', type: 'success' })
        this.getPageList()
      } else {
        this.$message({ message: '新增失败', type: 'error' })
      }
    },
    // 提交表单函数
    async submitForm() {
      let res
      const { form } = this.editOrAddDialogConfig
      if (!form.id) {
        res = await this.$API.movieDetail.addMovieType(form)
      } else {
        res = await this.$API.movieDetail.editMovieType(form)
      }
      if (res.code === 200) {
        this.getPageList()
        this.$message({ message: (!form.id ? '新增' : '修改') + '成功', type: 'success' })
      } else {
        this.$message({ message: (!form.id ? '新增' : '修改') + '失败', type: 'error' })
      }
    },
    async handleExport() {
      const { exportConfig } = this
      const res = await this.$API.reqExport.reqTableExport(this.exportConfig.tableName, exportConfig.form)
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
    initEditForm() {
      this.editOrAddDialogConfig.form = {
        id: '',
        name: ''
      }
    },
    // 处理编辑电影
    handleEdit($index, row) {
      this.resetForm('editOrAddDialogForm')
      this.editOrAddDialogConfig.form = { ...row }
      this.editOrAddDialogConfig.dialogVisible = true
    },
    // 删除电影
    handleDelete($index, row) {
      const id = row.id
      this.deleteMovieType(id)
    },
    // 添加电影
    handleAdd() {
      const { editOrAddDialogConfig } = this
      this.initEditForm()
      this.resetForm('editOrAddDialogForm')
      editOrAddDialogConfig.dialogVisible = true
    },
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
    // 重置表单
    resetForm(formName) {
      if (this.$refs[formName] !== undefined) this.$refs[formName].resetFields()
    },
    // 搜索关键字
    serchMovieTypeByName() {
      const key = this.searchConfig.key
      this.getPageList(key)
    },
    // 重置搜索关键字
    resetSearch() {
      this.searchConfig.key = ''
      this.getPageList()
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

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both
  }
</style>
