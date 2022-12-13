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
        placeholder="请输入检索用户名"
        @change="serchAdminByName"
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

    <el-dialog title="管理员信息" :visible.sync="editOrAddDialogConfig.dialogVisible" modal width="50vw">
      <el-form ref="editOrAddDialogForm" :model="editOrAddDialogConfig.form" status-icon style="width: 80%" :rules="editOrAddDialogConfig.formRules">
        <el-form-item prop="name" :label="editOrAddDialogConfig.keyValue.name[1]" :label-width="tableConfig.formLabelWidth">
          <el-input
            v-model="editOrAddDialogConfig.form.name"
          />
        </el-form-item>
        <el-form-item prop="password" :label="editOrAddDialogConfig.keyValue.password[1]" :label-width="tableConfig.formLabelWidth">
          <el-input
            v-model="editOrAddDialogConfig.form.password"
            type="password"
          />
        </el-form-item>
        <el-form-item prop="role" :label="editOrAddDialogConfig.keyValue.role[1]" :label-width="tableConfig.formLabelWidth">
          <el-select v-model="editOrAddDialogConfig.form.role" multiple placeholder="请选择权限">
            <el-option
              v-for="item in otherData.roles"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
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
            <el-option label=".txt" value="txt"></el-option>
            <el-option label=".json" value="json"></el-option>
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
import { saveAsTxt, saveAsJson } from '@/utils/export'
import { validUsername, validPassword } from '@/utils/validate'
export default {
  name: 'Admin',
  data() {
    const validateName = (rule, value, callback) => {
      if (validUsername(value)) {
        callback()
      } else {
        callback(new Error('用户名格式错误'))
      }
    }

    const validatePassword = (rule, value, callback) => {
      if (value === undefined || validPassword(value)) {
        callback()
      } else {
        callback(new Error('密码格式错误'))
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
        key: ''
      },
      tableConfig: {
        fields: [
          {
            label: '管理员编号',
            value: 'id'
          },
          {
            label: '管理员用户名',
            value: 'name'
          },
          // {
          //   label: '管理员密码',
          //   value: 'password'
          // },
          {
            label: '创建时间',
            value: 'create_time'
          },
          {
            label: '角色',
            value: 'role'
          }
        ],
        labels: ['管理员编号', '管理员用户名', '管理员密码', '创建时间', '角色'],
        values: ['id', 'name', 'password', 'create_time', 'role'],
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
        roles: [
          {
            label: '超级管理员',
            value: 'superAdmin'
          },
          {
            label: '电影放映管理员',
            value: 'film show manager'
          },
          {
            label: '售票员',
            value: 'ticket seller'
          },
          {
            label: '评论管理员',
            value: 'Comment manager'
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
          role: '',
          create_time: ''
        },
        formRules: {
          name: [
            { required: true },
            { validator: validateName }
          ],
          password: [
            { validator: validatePassword }
          ],
          role: [
            { required: true }
          ]
        },
        keyValue: {
          id: ['id', '管理员编号'],
          name: ['name', '管理员用户名'],
          password: ['password', '管理员密码'],
          create_time: ['create_time', '创建时间'],
          role: ['role', '角色']
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
        tableName: 'Admin'
      }
    }
  },
  mounted() {
    // 挂载后获取电影列表
    this.getPageList()
  },
  methods: {
    // 获取数据
    async getPageList(k = '') {
      this.searchConfig.key = k
      const { key } = this.searchConfig
      const result = await this.$API.admin.reqAdmin(key)
      if (result.code === 200) {
        this.tableConfig.data = result.data.rows
        this.pageConfig.total = result.data.count
      } else {
        this.$message.error('加载数据失败')
      }
    },
    async deleteAdmin(id) {
      const res = await this.$API.admin.deleteAdmin(id)
      if (res.code === 200) {
        this.$message({ message: '删除成功', type: 'success' })
        this.getPageList(this.searchConfig.key)
      } else {
        this.$message({ message: '删除失败', type: 'error' })
      }
    },
    // 提交表单函数
    async submitForm() {
      let res
      const { form } = this.editOrAddDialogConfig
      console.log(form)
      if (!form.id) {
        res = await this.$API.admin.addAdmin(form)
      } else {
        res = await this.$API.admin.editAdmin(form)
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
      const res = await this.$API.reqExport.reqTableExport(exportConfig.tableName, exportConfig.form)
      if (res.code === 200) {
        exportConfig.data = res.data
        if (exportConfig.form.fields === []) {
          this.$message({ message: '请至少选择一个字段', type: 'error' })
          return
        }
        // console.log(exportConfig.form.bookType)
        if (exportConfig.form.bookType === 'txt') {
          saveAsTxt(res.data, exportConfig.form.filename)
        } else if (exportConfig.form.bookType === 'json') {
          saveAsJson(res.data, exportConfig.form.filename)
        } else if (exportConfig.form.bookType === 'xlsx') {
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
        }
      } else {
        this.$message({ message: '获取文件失败', type: 'error' })
      }
    },
    initEditForm() {
      this.editOrAddDialogConfig.form = {
        id: '',
        name: '',
        password: '',
        create_time: '',
        role: 0
      }
    },
    // 处理编辑电影
    handleEdit($index, row) {
      this.resetForm('editOrAddDialogForm')
      this.editOrAddDialogConfig.form = { ...row }
      const role = row.role.split(',')
      this.editOrAddDialogConfig.form.role = role
      console.log(this.editOrAddDialogConfig.form)
      this.editOrAddDialogConfig.dialogVisible = true
    },
    // 删除电影
    handleDelete($index, row) {
      const id = row.id
      this.deleteAdmin(id)
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
    serchAdminByName() {
      const key = this.searchConfig.key
      this.getPageList(key)
    },
    // 重置搜索关键字
    resetSearch() {
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
