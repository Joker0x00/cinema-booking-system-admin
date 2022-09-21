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
        v-model="search.movieName"
        class="searchInput"
        prefix-icon="el-icon-search"
        placeholder="请输入检索的电影名"
        @change="serchMovieByName"
      />
      <!-- <el-checkbox v-model="search.vague" class="right-content">模糊搜索</el-checkbox> -->
      <el-checkbox v-model="search.vague" label="模糊搜索" border class="right-content cbox"></el-checkbox>
    </div>
    <el-table :data="data" border style="width: 100%; margin-top: 20px">
      <!-- <el-table-column
        header-align="center"
        align="center"
        type="selection"
        width="55"
      /> -->
      <el-table-column
        header-align="center"
        align="center"
        :prop="props[0]"
        :label="labels[0]"
      />
      <el-table-column
        header-align="center"
        align="center"
        :prop="props[1]"
        :label="labels[1]"
      />
      <el-table-column
        header-align="center"
        align="center"
        :prop="props[2]"
        :label="labels[2]"
      />
      <el-table-column
        header-align="center"
        align="center"
        :prop="props[3]"
        :label="labels[3]"
      />
      <el-table-column
        header-align="center"
        align="center"
        :prop="props[4]"
        :label="labels[4]"
      />
      <el-table-column
        header-align="center"
        align="center"
        :prop="props[5]"
        :label="labels[5]"
      />
      <el-table-column
        header-align="center"
        align="center"
        :prop="props[6]"
        :label="labels[6]"
      >
        <template slot-scope="scope">
          <img :src="scope.row.image" style="height: 56px">
        </template>
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        :prop="props[7]"
        :label="labels[7]"
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
      :current-page="page"
      :page-size="limit"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      :page-sizes="[5, 10, 20, 50]"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />

    <el-dialog title="电影信息" :visible.sync="dialogFormVisible" modal>
      <el-form ref="form" :model="form" status-icon style="width: 80%" :rules="formRules">
        <el-form-item prop="name" :label="labels[1]" :label-width="formLabelWidth">
          <el-input ref="name" v-model="form.name" autocomplete="off" />
        </el-form-item>
        <el-form-item prop="category_id" :label="labels[2]" :label-width="formLabelWidth">
          <el-select ref="category_id" v-model.number="form.category_id" placeholder="请选择电影类型" filterable>
            <el-option
              v-for="(type, index) in movieTypes"
              :key="index.id"
              :label="type.text"
              :value="type.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item prop="stars" :label="labels[3]" :label-width="formLabelWidth">
          <el-input ref="stars" v-model="form.stars" autocomplete="off" />
        </el-form-item>
        <el-form-item prop="length" :label="labels[4]" :label-width="formLabelWidth">
          <el-input ref="length" v-model.number="form.length" type="number" autocomplete="off" />
        </el-form-item>
        <el-form-item prop="info" :label="labels[5]" :label-width="formLabelWidth">
          <el-input ref="info" v-model="form.info" autocomplete="off" />
        </el-form-item>
        <el-form-item prop="image" :label="labels[6]" :label-width="formLabelWidth">
          <el-upload
            ref="image"
            class="avatar-uploader"
            :action="`${baseUrl}/media/img/`"
            :show-file-list="false"
            :auto-upload="true"
            :on-success="handleAvatarSuccess"
            :on-error="handleAvatarError"
            :before-upload="beforeAvatarUpload">
            <img v-if="form.image !== ''" :src="form.image" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon" />
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件, 且不超过500kb</div>
          </el-upload>
        </el-form-item>
        <el-form-item prop="location" :label="labels[7]" :label-width="formLabelWidth">
          <el-input ref="location" v-model="form.location" autocomplete="off" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
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
  name: 'MovieDetail',
  data() {
    const validateMovieName = (rule, value, callback) => {
      if (value.length === 0) {
        callback(new Error('不能为空'))
      } else if (value.length > 50) {
        callback(new Error('长度不超过50'))
      } else {
        callback()
      }
    }
    const validateMovieStars = (rule, value, callback) => {
      if (value.length > 100) {
        callback(new Error('长度不超过100'))
      } else {
        callback()
      }
    }
    const validateMovieLength = (rule, value, callback) => {
      if (value > 60 * 24) {
        callback(new Error('最大不超过24*60'))
      } else {
        callback()
      }
    }
    const validateMovieInfo = (rule, value, callback) => {
      if (value.length > 1000) {
        callback(new Error('长度不超过1000'))
      } else {
        callback()
      }
    }
    const validateMovieLocation = (rule, value, callback) => {
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
    // const validateExportFields = (rule, value, callback) => {
    //   if (value.length > 50) {
    //     callback(new Error('长度不超过50'))
    //   } else {
    //     callback()
    //   }
    // }
    return {
      search: {
        movieName: '',
        searchParams: '[{ "key": "name", "value": "" }]',
        vague: false
      },
      tableConfig: {
        fields: [
          {
            label: '电影编号',
            value: 'id'
          },
          {
            label: '名称',
            value: 'name'
          },
          {
            label: '类型',
            value: 'movietypename'
          },
          {
            label: '主演',
            value: 'stars'
          },
          {
            label: '时长',
            value: 'length'
          },
          {
            label: '简介',
            value: 'info'
          },
          {
            label: '图片',
            value: 'image'
          },
          {
            label: '地区',
            value: 'location'
          }
        ],
        labels: ['电影编号', '名称', '类型', '主演', '时长', '简介', '图片', '地区'],
        values: ['id', 'name', 'movietypename', 'stars', 'length', 'info', 'image', 'location']
      },
      movieTypeConfig: {
        label: 'type.text',
        value: 'type.value'
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
        data: []
      },
      // 表格数据
      data: [],
      // 表格 prop
      props: ['id', 'name', 'movietypename', 'stars', 'length', 'info', 'image', 'location'],
      // 表格列名
      labels: ['电影编号', '名称', '类型', '主演', '时长', '简介', '图片', '地区'],
      // 分页器第几页
      page: 1,
      // 当前页面展示数据条数
      limit: 10,
      // 总共数据条数
      total: 0,
      // 列表展示的数据
      dialogFormVisible: false,
      // 表格标题宽度
      formLabelWidth: '100',
      // 提交表单
      form: {
        id: '',
        name: '',
        category_id: '',
        stars: '',
        length: '',
        info: '',
        image: '',
        location: ''
      },
      // 电影表单数据校验
      formRules: {
        name: [
          { required: true },
          { validator: validateMovieName, trigger: 'change' }
        ],
        category_id: [
          { required: true, trigger: 'blur' }
        ],
        stars: [
          { required: true, trigger: 'blur' },
          { validator: validateMovieStars, trigger: 'change' }
        ],
        length: [
          { required: true, trigger: 'blur' },
          { validator: validateMovieLength, trigger: 'change' }
        ],
        info: [
          // { required: true, trigger: 'blur' },
          { validator: validateMovieInfo, trigger: 'change' }
        ],
        image: [
          // { required: true, trigger: 'blur' }
        ],
        location: [
          // { required: true, trigger: 'blur' },
          { validator: validateMovieLocation, trigger: 'change' }
        ]
      },
      // 上传服务器根地址
      baseUrl: process.env.VUE_APP_BASE_API,
      // 图片url
      imageUrl: '',
      // 电影类型
      movieTypes: ''
    }
  },
  mounted() {
    // 挂载后获取电影列表
    this.getPageList(1, this.limit)
    // 请求电影类型
    this.reqMovieType()
  },
  methods: {
    // 获取品牌列表
    async getPageList(p, size, isVague = false, params = '[{ "key": "name", "value": "" }]') {
      this.page = p
      this.limit = size
      this.search.searchParams = params
      this.search.vague = isVague
      const { page, limit } = this
      const { vague, searchParams } = this.search
      // 获取品牌列表接口
      const result = await this.$API.movieDetail.reqMovieList(page, limit, vague, searchParams)
      if (result.code === 200) {
        this.data = result.data.rows
        this.total = result.data.count
      } else {
        this.$message.error('加载数据失败')
      }
    },
    async deleteMovie(id) {
      const res = await this.$API.movieDetail.deleteMovie(id)
      console.log(id)
      if (res.code === 200) {
        this.$message({ message: '删除成功', type: 'success' })
        this.getPageList(this.data.length === 1 ? this.page - 1 : this.page, this.limit, this.search.vague, this.search.searchParams)
      } else {
        this.$message({ message: '删除失败', type: 'error' })
      }
    },
    // 编辑电影
    handleEdit($index, row) {
      this.form = { ...row }
      console.log(this.form)
      this.form.category_id = this.form.category
      this.dialogFormVisible = true
    },
    // 删除电影
    handleDelete($index, row) {
      const id = row.id
      this.deleteMovie(id)
    },
    // 添加电影
    handleAdd() {
      this.initForm()
      this.resetForm('form')
      this.dialogFormVisible = true
    },
    // 分页器相关
    handleSizeChange(limit) {
      console.log('@changeSize', limit)
      this.getPageList(this.page, limit, this.search.vague, this.search.searchParams)
    },
    // 处理分页
    handleCurrentChange(pager) {
      this.getPageList(pager, this.limit, this.search.vague, this.search.searchParams)
    },

    // 获取电影类型
    async reqMovieType(key = '') {
      const res = await this.$API.movieDetail.reqMovieType(key)
      if (res.code === 200) {
        this.movieTypes = res.data
      } else {
        this.$message('获取电影类型失败')
      }
    },
    // 上传图片校验
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
    // 上传图片失败
    handleAvatarError() {
      this.$message('上传图片失败')
    },
    // 上传成功
    handleAvatarSuccess(res, file) {
      this.form.image = res.url
      // console.log(res)
    },
    // 提交前验证表单
    onSubmit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.dialogFormVisible = false
          this.submitForm()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 重置表单
    resetForm(formName) {
      if (this.$refs.form !== undefined) {
        this.$refs.form.resetFields()
      }
    },
    initForm() {
      this.form = {
        id: '',
        name: '',
        category_id: '',
        stars: '',
        length: '',
        info: '',
        image: '',
        location: ''
      }
    },
    // 提交表单函数
    async submitForm() {
      let res
      console.log(this.form)
      if (!this.form.id) {
        res = await this.$API.movieDetail.addMovie(this.form)
      } else {
        res = await this.$API.movieDetail.editMovie(this.form)
      }
      if (res.code === 200) {
        this.getPageList(this.page, this.limit)
        this.$message({ message: (!this.form.id ? '新增' : '修改') + '成功', type: 'success' })
      } else {
        this.$message({ message: (!this.form.id ? '新增' : '修改') + '失败', type: 'error' })
      }
    },
    serchMovieByName() {
      const name = this.search.movieName
      const searchParams = `[
        {
          'key': 'name',
          'value': '${name}'
        }
      ]`
      this.getPageList(1, this.limit, this.search.vague, searchParams)
    },
    // 重置搜索关键字
    resetSearch() {
      this.search.movieName = ''
      this.getPageList(1, this.limit, this.search.vague)
    },
    // // 筛选
    // filterMovieTypeHandler(value, row, column) {
    //   const property = column['property']
    //   return row[property] === value
    // },
    handleExportSettings() {
      this.exportConfig.dialogExportVisible = true
    },
    sumitAndValidate() {
      this.$refs['exportForm'].validate((valid) => {
        if (valid) {
          this.handleExport()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    async handleExport() {
      const { exportConfig } = this
      const res = await this.$API.reqExport.reqTableExport('MovieView', exportConfig.form)
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
    }
  }
}
</script>

<style>
  .searchInput {
    width: 20%;
    float: right;
  }
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
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
</style>
