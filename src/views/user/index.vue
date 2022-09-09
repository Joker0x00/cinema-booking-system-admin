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
        placeholder="请输入检索的用户名"
        @change="serchRoomByName"
      />
      <!-- <el-checkbox v-model="search.vague" class="right-content">模糊搜索</el-checkbox> -->
      <el-checkbox v-model="searchConfig.vague" label="模糊搜索" border class="right-content cbox" />
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
        header-align="center"
        align="center"
        prop="sex"
        label="性别"
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

    <el-dialog title="放映信息" :visible.sync="editOrAddDialogConfig.dialogVisible" modal width="50vw">
      <el-form ref="editOrAddDialogForm" :model="editOrAddDialogConfig.form" status-icon style="width: 80%" :rules="editOrAddDialogConfig.formRules">
        <el-form-item prop="name" :label="editOrAddDialogConfig.keyValue.name[1]" :label-width="tableConfig.formLabelWidth">
          <el-input v-model="editOrAddDialogConfig.form.name" autocomplete="off" />
        </el-form-item>
        <el-form-item prop="password" :label="editOrAddDialogConfig.keyValue.password[1]" :label-width="tableConfig.formLabelWidth">
          <el-input v-model="editOrAddDialogConfig.form.password" type="password" autocomplete="off" />
        </el-form-item>
        <el-form-item prop="sex" :label="editOrAddDialogConfig.keyValue.sex[1]" :label-width="tableConfig.formLabelWidth">
          <el-select v-model="editOrAddDialogConfig.form.sex" placeholder="请选择性别" filterable>
            <el-option
              v-for="(item, index) in otherData.sexs"
              :key="index.value"
              :label="item.lable"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <!-- <el-form-item prop="birthday" :label="editOrAddDialogConfig.keyValue.birthday[1]" :label-width="tableConfig.formLabelWidth">
          <div class="block">
            <el-date-picker
              v-model="editOrAddDialogConfig.form.birthday"
              type="date"
              placeholder="选择日期">
            </el-date-picker>
          </div>
        </el-form-item> -->
        <el-form-item prop="phone_number" :label="editOrAddDialogConfig.keyValue.phone_number[1]" :label-width="tableConfig.formLabelWidth">
          <el-input v-model="editOrAddDialogConfig.form.phone_number" autocomplete="off" />
        </el-form-item>
        <el-form-item prop="balance" :label="editOrAddDialogConfig.keyValue.balance[1]" :label-width="tableConfig.formLabelWidth">
          <el-input v-model="editOrAddDialogConfig.form.balance" autocomplete="off" />
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

    <!-- 导出文件的对话框 -->
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
  name: 'User',
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

    const validateExportFilename = (rule, value, callback) => {
      if (value.length > 50) {
        callback(new Error('长度不超过50'))
      } else {
        callback()
      }
    }

    return {
      searchConfig: {
        field: 'name',
        key: '',
        searchParams: '[{ "key": "name", "value": "" }]',
        vague: false
      },
      tableConfig: {
        fields: [
          {
            label: '用户编号',
            value: 'id'
          },
          {
            label: '用户名',
            value: 'name'
          },
          {
            label: '密码',
            value: 'password'
          },
          {
            label: '电话号码',
            value: 'phone_number'
          },
          {
            label: '余额',
            value: 'balance'
          }
        ],
        labels: ['用户编号', '用户名', '密码', '性别', '生日', '电话号码'],
        values: ['id', 'name', 'password', 'sex', 'birthday', 'phone_number'],
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
        // 表格标题宽度
        formLabelWidth: '100',
        form: {
          id: '',
          name: '',
          password: '',
          sex: '',
          birthday: '',
          phone_number: '',
          balance: 0
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
        tableName: 'User'
      }
    }
  },
  mounted() {
    // 挂载后获取电影列表
    this.getPageList(1, this.limit)
  },
  methods: {
    // 获取分页数据
    async getPageList(p, size, isVague = false, params = '[{ "key": "name", "value": "" }]') {
      this.page = p
      this.limit = size
      this.searchConfig.searchParams = params
      this.searchConfig.vague = isVague
      const { page, limit } = this
      const { vague, searchParams } = this.searchConfig
      // 获取品牌列表接口
      const result = await this.$API.user.reqUser(page, limit, vague, searchParams)
      if (result.code === 200) {
        this.tableConfig.data = result.data.rows
        this.pageConfig.total = result.data.count
      } else {
        this.$message.error('加载数据失败')
      }
    },
    async deleteRow(id) {
      const res = await this.$API.user.deleteUser(id)
      const { page, limit } = this.pageConfig
      const { vague, searchParams } = this.searchConfig
      if (res.code === 200) {
        this.$message({ message: '删除成功', type: 'success' })
        this.getPageList(this.tableConfig.data.length === 1 ? page - 1 : page, limit, vague, searchParams)
      } else {
        this.$message({ message: '删除失败', type: 'error' })
      }
    },
    async addRow(form) {
      const res = await this.$API.user.addUser(form)
      if (res.code === 200) {
        this.$message({ message: '新增成功', type: 'success' })
        this.getPageList(1, this.pageConfig.pageSize)
      } else {
        this.$message({ message: '新增失败', type: 'error' })
      }
    },
    // 提交表单函数
    async submitForm() {
      let res
      const { form } = this.editOrAddDialogConfig
      console.log(form)
      if (!form.id) {
        res = await this.$API.user.addUser(form)
      } else {
        res = await this.$API.user.editUser(form)
      }
      if (res.code === 200) {
        this.getPageList(this.pageConfig.page, this.pageConfig.limit, this.searchConfig.vague, this.searchConfig.searchParams)
        this.$message({ message: (!form.id ? '新增' : '修改') + '成功', type: 'success' })
      } else {
        this.$message({ message: (!form.id ? '新增' : '修改') + '失败', type: 'error' })
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
    initEditForm() {
      this.editOrAddDialogConfig.form = {
        id: '',
        name: '',
        password: '',
        sex: '',
        birthday: '',
        phone_number: ''
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
      this.deleteRow(id)
    },
    // 添加电影
    handleAdd() {
      const { editOrAddDialogConfig } = this
      this.initEditForm()
      this.resetForm('editOrAddDialogForm')
      editOrAddDialogConfig.dialogVisible = true
    },

    // 分页器相关
    handleSizeChange(limit) {
      console.log('@changeSize', limit)
      this.getPageList(this.page, limit, this.searchConfig.vague, this.searchConfig.searchParams)
    },
    // 处理分页
    handleCurrentChange(pager) {
      this.getPageList(pager, this.limit, this.searchConfig.vague, this.searchConfig.searchParams)
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
    serchRoomByName() {
      const key = this.searchConfig.key
      const searchParams = `[
        {
          'key': '${this.searchConfig.field}',
          'value': '${key}'
        }
      ]`
      this.getPageList(1, this.pageConfig.limit, this.searchConfig.vague, searchParams)
    },
    // 重置搜索关键字
    resetSearch() {
      this.searchConfig.key = ''
      this.getPageList(1, this.limit, this.searchConfig.vague)
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
