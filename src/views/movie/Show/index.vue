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
        label="放映状态"
        header-align="center"
        align="center"
      >
        <template slot-scope="scope">
          <el-tag
            :type="scope.row.status === '即将上映' ? 'primary' : scope.row.status === '上映中' ? 'danger' : 'success'"
            disable-transitions
          >
            {{ scope.row.status }}
          </el-tag>
        </template>
      </el-table-column>
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
        <el-form-item prop="movie_id" :label="editOrAddDialogConfig.keyValue.movie_id[1]" :label-width="tableConfig.formLabelWidth">
          <el-select v-model="editOrAddDialogConfig.form.movie_id" placeholder="请选择电影名称" filterable>
            <el-option
              v-for="(type, index) in otherData.movies"
              :key="index.id"
              :label="type.text"
              :value="type.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item prop="room_id" :label="editOrAddDialogConfig.keyValue.room_id[1]" :label-width="tableConfig.formLabelWidth">
          <el-select v-model="editOrAddDialogConfig.form.room_id" placeholder="请选择放映厅名称" filterable>
            <el-option
              v-for="(type, index) in otherData.rooms"
              :key="index.id"
              :label="type.text"
              :value="type.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item prop="start_time" :label="editOrAddDialogConfig.keyValue.start_time[1]" :label-width="tableConfig.formLabelWidth">
          <div class="block">
            <el-date-picker
              v-model="editOrAddDialogConfig.form.start_time"
              type="datetime"
              placeholder="选择日期时间"
            />
          </div>
        </el-form-item>
        <el-form-item prop="price" :label="editOrAddDialogConfig.keyValue.price[1]" :label-width="tableConfig.formLabelWidth">
          <el-input v-model="editOrAddDialogConfig.form.price" autocomplete="off" />
        </el-form-item>
        <el-form-item prop="status" :label="editOrAddDialogConfig.keyValue.status[1]" :label-width="tableConfig.formLabelWidth">
          <el-select v-model="editOrAddDialogConfig.form.status" placeholder="请选择上映状态" filterable>
            <el-option
              v-for="(type, index) in otherData.status"
              :key="index.id"
              :label="type.text"
              :value="type.value"
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
            <el-option label=".xlsx" value="xlsx"></el-option>
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
import { validBalance } from '@/utils/validate'
export default {
  name: 'Show',
  data() {
    const validateprice = (rule, value, callback) => {
      if (validBalance(value.toString())) {
        callback()
      } else {
        callback('格式错误')
      }
      // let cnt = 0
      // for (let i = 0; i < value.length; i++) {
      //   if (value[i] === '.') cnt++
      //   if ((value[i] < '0' || value[i] > '9') && value[i] !== '.') {
      //     callback(new Error('输入格式有误'))
      //   }
      // }
      // if (cnt > 1) {
      //   callback(new Error('输入格式有误'))
      // }
      // const c = parseFloat(value)
      // if (isNaN(c)) {
      //   callback(new Error('输入格式有误'))
      // }
      // console.log(value)
      // callback()
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
            label: '放映编号',
            value: 'id'
          },
          {
            label: '电影编号',
            value: 'movie_id'
          },
          {
            label: '电影名称',
            value: 'moviename'
          },
          {
            label: '时长',
            value: 'length'
          },
          {
            label: '放映厅编号',
            value: 'room_id'
          },
          {
            label: '放映厅名称',
            value: 'roomname'
          },
          {
            label: '容纳人数',
            value: 'size'
          },
          {
            label: '座位布局',
            value: 'seat_layout'
          },
          {
            label: '行',
            value: 'row'
          },
          {
            label: '列',
            value: 'column'
          },
          {
            label: '开始时间',
            value: 'start_time'
          },
          {
            label: '价格',
            value: 'price'
          }
          // {
          //   label: '放映状态',
          //   value: 'status'
          // }
        ],
        labels: ['放映编号', '电影编号', '电影名称', '时长', '放映厅编号', '放映厅名称', '容纳人数', '座位布局', '行', '列', '开始时间', '价格', '放映状态'],
        values: ['id', 'movie_id', 'moviename', 'length', 'room_id', 'roomname', 'size', 'seat_layout', 'row', 'column', 'start_time', 'price', 'status'],
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
        rooms: [],
        status: [
          { text: '即将上映', value: '即将上映' },
          { text: '上映中', value: '上映中' },
          { text: '已结束', value: '已结束' }
        ]
      },
      editOrAddDialogConfig: {
        dialogVisible: false,
        // 表格标题宽度
        formLabelWidth: '100',
        form: {
          id: '',
          movie_id: '',
          room_id: '',
          start_time: '',
          price: 0,
          status: ''
        },
        formRules: {
          movie_id: [
            { required: true }
          ],
          room_id: [
            { required: true }
          ],
          start_time: [
            { required: true }
          ],
          price: [
            { required: true },
            { validator: validateprice, trigger: 'change' }
          ]
        },
        keyValue: {
          id: ['id', '放映编号'],
          room_id: ['room_id', '放映厅名称'],
          movie_id: ['length', '电影名称'],
          start_time: ['start_time', '开始时间'],
          price: ['price', '价格'],
          status: ['status', '放映状态']
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
        data: []
      }
    }
  },
  computed: {
    roomSize() {
      const flag = this.editOrAddDialogConfig.setSeat.flag
      console.log(flag)
      const len = this.seat_layout.length
      let size = len
      for (let i = 0; i < len; i++) {
        if (this.seat_layout[i] === '1') size--
      }
      return size
    },
    seat_layout() {
      const { row, column } = this.editOrAddDialogConfig.form
      const flag = this.editOrAddDialogConfig.setSeat.flag
      console.log(flag)
      let str = ''
      for (let i = 0, k = 0; i < row; i++) {
        for (let j = 0; j < column; j++, k++) {
          if (this.states[i][j] === 0) {
            str += '0'
          } else {
            str += '1'
          }
        }
      }
      console.log(str)
      return str
    },
    states() {
      const arr = new Array(this.editOrAddDialogConfig.form.row).fill().map(() => new Array(this.editOrAddDialogConfig.form.column).fill(0))
      return arr
    }
  },
  mounted() {
    // 挂载后获取电影列表
    this.getPageList(1, this.limit)
    this.getAllMovie()
    this.getAllRoom()
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
      const result = await this.$API.show.reqShowList(page, limit, vague, searchParams)
      if (result.code === 200) {
        this.tableConfig.data = result.data.rows
        this.pageConfig.total = result.data.count
      } else {
        this.$message.error('加载数据失败')
      }
    },
    async getAllMovie() {
      const res = await this.$API.movieDetail.reqMovieAll()
      if (res.code === 200) {
        this.otherData.movies = res.data
      } else {
        this.$message({ message: '获取电影信息失败', type: 'error' })
      }
    },
    async getAllRoom() {
      const res = await this.$API.room.reqRoomAll()
      if (res.code === 200) {
        this.otherData.rooms = res.data
      } else {
        this.$message({ message: '获取放映厅信息失败', type: 'error' })
      }
    },
    async deleteShow(id) {
      const res = await this.$API.show.deleteShow(id)
      const { page, limit } = this.pageConfig
      const { vague, searchParams } = this.searchConfig
      if (res.code === 200) {
        this.$message({ message: '删除成功', type: 'success' })
        this.getPageList(this.tableConfig.data.length === 1 ? page - 1 : page, limit, vague, searchParams)
      } else {
        this.$message({ message: '删除失败', type: 'error' })
      }
    },
    async addShow(form) {
      const res = await this.$API.show.addShow(form)
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
      console.log('@time', form.start_time)
      if (!form.id) {
        res = await this.$API.show.addShow(form)
      } else {
        res = await this.$API.show.editShow(form)
      }
      if (res.code === 200) {
        this.getPageList(this.pageConfig.page, this.pageConfig.limit)
        this.$message({ message: (!form.id ? '新增' : '修改') + '成功', type: 'success' })
      } else {
        this.$message({ message: (!form.id ? '新增' : '修改') + '失败', type: 'error' })
      }
    },
    async handleExport() {
      const { exportConfig } = this
      const res = await this.$API.reqExport.reqTableExport('ShowView', exportConfig.form)
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
        movie_id: '',
        room_id: '',
        start_time: '',
        price: 0
      }
    },
    // 处理编辑电影
    handleEdit($index, row) {
      this.resetForm('editOrAddDialogForm')
      console.log(row)
      this.editOrAddDialogConfig.form = { ...row }
      this.editOrAddDialogConfig.dialogVisible = true
      console.log(row.seat_layout)
      // this.updateLayout()
      for (let i = 0, k = 0; i < this.editOrAddDialogConfig.form.row; i++) {
        for (let j = 0; j < this.editOrAddDialogConfig.form.column; j++, k++) {
          if (row.seat_layout[k] === '0') {
            this.states[i][j] = 0
          } else {
            this.states[i][j] = 1
          }
        }
      }
    },
    // 删除电影
    handleDelete($index, row) {
      const id = row.id
      this.deleteShow(id)
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
          'key': 'moviename',
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

  .box-card {
    width: 46vw;
    height: 80vh;
    overflow: auto;
  }
  .row-id {
    font-size: 16px;
    color: #999;
    margin-right: 40px;
    margin-bottom: 0px;
    display: inline-block;
    width: 20px;
    height: 26px;
    line-height: 26px;
    text-align: center
  }
  .seats-wrapper {
    min-width: 580px;
    display: inline-block;
    margin-left: 0px;
  }
  .seat {
    display: inline-block;
    font-size: 0;
    width: 30px;
    height: 26px;
    margin: 0 5px;
    background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAaCAYAAACgoey0AAAAAXNSR0IArs4c6QAAAY9JREFUSA3tVs1qg0AQ3l1/i5eCFC8+QSC0+BQ999QeC32t9lLovac8RQwk6BOUXLzVitFE0/mEDVIiJsbkUgeM7jjzfd/OjpvlrGZhGL6uVqvnsix5zX3yoxBia5rm22g0etkL5vt+WRTFtm8DJrDrpKI+wExJXd3VyzMw/1axf5YDpe6IqRSPUJZlGdQdmN4eBixgAps4nmRGRUyOCTneXddlnHOWJEkv5CAFFjCBTeOP2Wz2CXI+nU7vqZkmnudVAXBuNptKpWVZGHa2OI4ZdTPTNK3CIB42n89TarYHQWpuHcfJoEqaqqqViFNKDhKUV5ICGxy2bQt6d4cfU1EUQ5LKO4KQ3NWQW5+MxAEXCbraNZd8can7QHypSrOh1EOpz1YBtQkZOw+2zK67V1teI7FhGGy9XjfpavWDWNf1xrhGYtpTGa5z2f/6jmkZFPwff0VR1H0xj1yL5XKJhv3hQRDoaZriILClKz8S5+hwIk3ptHNTHTtowBeLxXWe5/2d8vZIoi4X4/H4myZY/AJMWAAq2pF/7QAAAABJRU5ErkJggg==) no-repeat;
    background-position: 0 1px
  }
  .row {
    white-space: nowrap;
    margin-bottom: 10px;
    text-align: center;
    margin-right: 0px;
    margin-left: 0px;
  }
  .screen {
    width: auto;
    padding-top: 50px;
    text-align: center;
    font-size: 16px;
    color: #666;
    background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAj4AAAAnCAYAAAAPdELWAAAAAXNSR0IArs4c6QAADq9JREFUeAHtnVlvFMsZhnuZMfthXwwWRsgxAQkkxJUvIluRAuIHEClSIuU38AOC+TdJkHLLXQIXEUKIWAdFRmDwsTEY2SxiXzzdVXnfz1N9usdj4wU7cPy2NFR3dXd1z2MMj776qiqOvs4Wh2a892FXpQiIgAiIgAiIgAismEAc/6wZK22saGmRDcULic3ly5eL9i5durTIJnWZCIiACIiACIiACLQnALewE/CKeSMrSxGjQlTaP25ObTw4OGj3zCc2V65cqbR54cKFOY2oQgREQAREQAREQATmIwCXqJyCS8wrPbjQL0V8apWW2xwgwlMRmWBe4VKKTllu9u7dW1x///79+Pbt2+FSlSIgAiIgAiIgAiLwRQJwiXlFh1LUKkKl3ig4kGnIvPcXktLyFrN3NfN1QhdWM8pj565duxYPDAxEEJv4zJkz0fDwsNV3dHRY+fjxYyuPHDnS0rQORUAEREAEREAERGB+AmNjY1FXV1chLzMzM/7EiRN2zIDK27dvPRzEjssixOBMuUsMElS0EZ5mchIOmmVrHk/MqA7Fpr+/P9q2bVshOpScnp6ecHtM2UnTNH727Jm1ixdLwkmWe/bsiV69etXumeXLtC8CIiACIiACIrCOCGRZVhEUuIWbmpoyAo1Gw+/fv99PTExEfX19jpUPHjyIRkZGou7ubv/x40ePAAzv9yUJKtprlZ9WCWmVHrYf5IXdVpSeGA+Ma7WafV6+fGnneUzpYVcX5ebNmzfxjh07eH+xJUkSv3v3rvWZxXntiIAIiIAIiIAIrD8CeZ57BFYKWYFHRD/88IMdI5ji4RN+165d3jnnEWSh6DhGhShMjAZRfkIUqCk/JkiBZFl+vpTjY5LCbi1Geqanp01yNm7caCXkJt28eTN8JjHRYbfW5OSkHeNLxBs2bIjev39vbWzdutX2WadNBERABERABERABMoE4BQRnMJkhyV8wT958oQ9Tdx3FBte/+nTJ/f06dMIzuFv3LgRd3Z2+vHxcY/AioevUHh4XQiy2D28L2zhhB2XEplDPaM8yfbt2xN2Y+HBMbuvEFpKYFcpRQcJzClMLMaLJIj6JIj6JDCrmDIUNjb++fPnGMJkz+G+7egPERABERABERCBdUuAchO+PBykss9jBE880mocgikODoGAj/OQIodginv48KFnxOfw4cMZ5MeEB2k5HkEad/369Yg5Qc0k6MqoryAgVjafyX37sGuL0sNurBcvXiSbNm1K8OCUUkPJQTdXDedT9L+llJxm9CdB2MmsB/ZV2A+/GK8JX1ClCIiACIiACIiACJBAvV5nl1W5dBQfSA+7txy7sihA8AoH/8gQQMmRWpMjATpH+g3vdewC6+3tzT98+OAgPSHyQ5kqhAoaMjtUHW2XhaQQH5hTQplhlxZsitGelMKDB9Tw4X4KC0NRQ6AnTWFelCKTINRbiTrrFqP0MBlaP2IREAEREAEREAERaCVA0eGGeivhFg6C4xF0ydi9tWXLlhyClCMKxDKDkzjkAjnITwNOkiMQ44aGhvzRo0ez169fW9dYc+RXIT8UnwVzfNBnFp88eTI+depU9Pz5c4vyIPJTQ9dWgj63BFJTwwvVYFdsJ4GU1dBoihdipCfBi3I/ggRRfmJEhgrxwRdq/c46FgEREAEREAERWGcE4BL2jdmVhRiK4zFLuIWn/GBjyg1FJ2FPEs4xvSbCufzgwYO8lvUeyc4MsDAaE4+OjsYQoECyiPiwomIfnK8H499jJjMjizrhCC2O2qLAMKcHfXEpzCplxAcPqkFk6niRDuyb7OBhHTAx1jPBmYnPMV44xXMsigQZivGFTH5mpS68k0oREAEREAEREIH1SAAK4flBkMS6uygv3IdHOPgGywx+0YBCsJ5iNAMRiuEbCV0FU+V4+EpZluLTp0/HuJc4K9ID95jNueFOEzalxxriTbCvhCJD4UHkJkXoqI7rOhBusi4u3LcBL1NHKKpOGcL1dbwg9azGqA9kiREgy/PBl4pobc3nsAjPLFVpVwREQAREQAREYJ0RgE7MdnHBIUyA4BAZqizPBx7RgD9kkJ4M/tGg+DQ/2c6dOxuI9rArrAEfyTDfTwYfYZmDoUeusuPQdwR2TIA4uWEl4hNAI1va5uiBrHDenQQPosQwyTnFizD6U6fwILLDaE8HXrCO+jpeqoMShHN4d8v1oTQljAAx0sP2ms/A91Cic+CtUgREQAREQATWIwF4QwRfgNc4RmygErCd2S1HPeXFQReYM5xBNRp0EdSZS+A4RneY3Yd7cwhPyrwfXsNE5927dzuk49i1EJ4Cr1XgOYWQ4EyCDGkmLsfoL6thmFiKG+toNEWScx0iswGRH5OdY8eO/Vi0pB0REAEREAEREAERWAMC8Jb/3Lt378+Qowa6xj7BWVhmyEduHDhwgKO++GGekOPwdk6CGIa2M+ITpCfi0hRIBrIlKThvD20KMyXGjx49SmBlNC5LZEY9PYi5O9pEQAREQAREQAREYE0JQHzYC1WD7FhECJLD0V4M2uR0FtQnYebn1hdr29UVLkIfmc3IzFmb0V3F5Sw4MWGC0oath+tUioAIiIAIiIAIiMBaEoCOMN/YUnDoJgjOOOT6JFwuCzM+x+jy4lyEtqB6+b0q4oMwkJ3jkDAMW+cNEXJ8ODGhzcRM8eGGi1iUE5XLbWpfBERABERABERABFaTgHkIeqAiBmaQ32OrR9B/muIz77MlL/Oi0QkREAEREAEREIFvmQClZ6nvJ/FZKjFdLwIiIAIiIAIi8E0QQMSnMk/PYl6q0tXFpdw50yHGvHO2RM+ZETG03cbUY3QZerqQTWQpPrZbWfJ9MQ/TNSIgAiIgAiIgAiLwFQhQRBwiPra+BZOcsc+B8B7LWCzY/IIRn6mpKc+saIyLtxVSkSjk8eEqqTka5/h6bSIgAiIgAiIgAiKw5gToIRhgbut3mfHAhLjsBcUHExt6DNDiTNAeEzNz1Hrxfoz4MExkfWRhjDvm8eEaGB725LFkBaeC5voZOebxyTiLM+bxYQL1gtJUPEE7IiACIiACIiACIvAVCSCzmUtXZJQfRHtyuInDCPQc8/g4zD/IxU1tgdN2j6x0dfECmhGiOtHx48cjTFDoJicnU4aQMD6e6255TgbEcfIQIU61GOG5HOJlbYey3YPa1UHO2lWvuI7tlt9ltZ6z4hddYQO/pO9V/pn9kr7XCn/E383ty/mZlX/m5S+6nLbK92t/fRNo/fvTehz+b2itX9/Ufv72gU+o+ZY4hXdhidHmW+kiiMHkOGbPFLu6PEZ0eU5WiBHpEWZutq9RWqHdjueID2txg6fQMOqDHB9aVcxpnxHpYfdWjiUsuOK6WQuniyao8LFW8UcrvFCvUgRE4MsEwi/4l69cmyv0+7w2nPWU1Sfwrf1urf43XtoTlstntf+NKL8X3ITLVLyB6DSaa3VZBg4jP4j6OEZ/GLjBN+daXeYqWKvLQHDpCgvVoEErcaJ1dfYEMzdzlfVidXY8pIY+M1udHdNC/0TxoSRxC71fBFB+STv5nf2x2j/E7wyHXlcEREAE1i0B/X/w///RB6dgCSdhcOUWlqz4PSI9OVZnn4H0ZEjN4RIV+aFDhxoYnGUru584cYICZBIUvkUl4gMTMjNCWIjn3dWrV7lkhevq6orQb8ZurohLWTCUBOOyUV1IJGKEaE6ER39RAmKVIrA2BPQ7tzac9RQREIG1J8B/35hew2gPgyzsdULZQA4yk5szdG8xv8fcBMEYPzQ05DFKfU4+Ddppvzp7+Erd3d3s8vJ37tyJOjs7ue/QZ8Yl32ucCprX8QX4IniJcJuV+ke4gkMHIiACIiACIiACKyBA30A3lrWAfTqJJTMjOOOYloNIj6Pw0FsoPRyRjovnyI9FfIKkhFBSeC8OX0f4iEPabdEv5PlEjPBAdBooC9NhHZKfrXuLLxbaC+2oFAEREAEREAEREIHlEAhugryesl/QTWbQlZVjJDqHrZv09Pb25uid8pyPEM8qf4pHhyHp4SRPhH2HGx0SmpncbBnTTG7GA7jUu1lWaIWywxfiy5U/4bxKERABERABERABEVgOAQZT+AnRHraBY4e5BvObN296DLjKIEDZ2bNnM0iPm56edkxmLs/dE9qwe1tegiuwl6vYnRVjiHvMFdrRWHL+/Hnm+ZgwIbz0IVzMvjdGfbiFB7DUJgIiIAIiIAIiIALLIRCchMEV9i6Vtn9j/3c3btywVJy7d+9yCLvNO8jh7M15CXm5SQ18pJCbEPEptVXZtQsHBgYsbLRv3z7LjGa2NKNA5SvLUZ9QH144HKsUAREQAREQAREQgcUSCIGUcrSnea8fGxsz0WGUh37CyZbpK+E8yrBfeVy7kMycqA/CRfHw8HDc398fMfKDLrCIx8j/iXt6ekKDMSI+v0bk5xYqauFlFfUJeFSKgAiIgAiIgAgslkAInqD8B5ah+OPExETU19dnI8q5wsTIyEjEQVjMRw45PezeCqtQhOeUoz2saxfx8UFamjd5SA6tiSZleT/cZx8apCfH5EB8CYdr3Pj4+DBe8F/hZXl/eZ/H2kRABERABERABERgMQTgIzO47hKWzMohPZw00NE7kHKTI/WGuT356OioeQjOBV8pIj2t0sNntov4sL7YIC6VazjJIU9y9kNujAbBrmyff6CP7Rju+REPq4wYo0xpEwEREAEREAEREIGFCDBgQmdg7jDKv966detPpS4sS1ou5fCwqUJ0eND0jUod68NWmcAwVJZLNFC+OR4cHCyfDiGlog6THt47d+7cP1FxNlTyJRT5CTRUioAIiIAIiIAILESgKT0zmCPwL0xWxrWFi5SDLaGNpuzwsLgunGstlxqGac3/qbQXokEXL178FUTnvzhZ5PpULtSBCIiACIiACIiACCxM4O+YmPAPHJrOLawu0e6W1RSfds9jXSFQIbKDLq+/Yf83eBnrk8O+JSTN14DqRUAEREAEREAERAAEYo4Ux/w8v8X+TySyFLHh9Qtt/wMAfnVXGyDtwgAAAABJRU5ErkJggg==) no-repeat;
    background-position-x: center;
    position: relative;
    margin-bottom: 40px
  }
  .c-screen-line {
    width: 0px;
    border-left: 1px dashed #e5e5e5;
    position: absolute;
    top: 90px;
    bottom: 0;
    margin-left: 50%;
    text-align: center;
  }
  .seat.empty {
    background-image: none
  }

  .seat.sold {
    background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAaCAYAAACgoey0AAAAAXNSR0IArs4c6QAAAeRJREFUSA3tlr9Lw0AUx99dmyZtpRbBX6AOoiAG1KF1EXFUcBMEHRX/LV0EFyfBUhwFJwWdXC2CIKKIttU0TXLPd6kJaaFQz3bSB0kud+99P3ePl7swiNjZ4uz+h+PueAgs0v3rZowBpjXtYPXydi8QiwcN+ZTQlbEBFmNd5YKHyM4fXncJEYJ5FCxX2m2o1JearVlsAkcn0et2CD7NmVt6nMPdu0Up97rGrdY9X1NqFxbN7UDYBxfzs0XO4HCqPwVxzuH6uQIVxw18lJ9VWsDNSwU0EpfaQoijYt48kYKskDfXBIri0mgWaNy3Z8uBUtmC3FAm7GuMdH5HBLh4fIPpbBJGUrofKKjv6qlsuQgbHBnMj/cZdgCVHoNJzS8IyxWdk1o8bSFAi/EQKoclYzitySwvcCbQoKJrTCkSnCAvh4JVzaXlGdHVfAtxYDoCJsPiUgWoxv2DVTP347j/VP84ZaoBfy/VTT8C0bQ5KKDmefBiqe1etB+D3JvbWVvwZCYFj582xan9jSCdEhMZox0X2oKzehzk1Sv7Y8WFLMaR48PTZ93pVUpbde8rNaBjuMpuN83EXUnYVEJIx2e91bHb7/SNWOn08KBfslSBrLA8l9WNhNq30+Hs7Fqdr4/OlNnxsfcFxEaatII5mN4AAAAASUVORK5CYII=)
  }

  .seat.selected {
    background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAaCAYAAACgoey0AAAAAXNSR0IArs4c6QAAAoxJREFUSA3Fls9LFGEYx78z7rq7WuEiQqEVi1SHwjrVSU9aghURJYa2UUgd+nEuKAg6dK7cQ6FSCYrdosK/oFupFF46CLkFBZm7s+K4P2benmfGHRx3t5nZXdln2Zl5n3me5/O+z/vMMyNhk0RfY0zL4qrQIW1SV3wpyRA+P8ZfRTGcD+bLX/CZoeF9kMiwqiIEpJXvuEZBLbANwSutNpRXIFH+tmbRBq7qMh2CWeDLoxjgnV1bNlLu4Ob+di5txuTYQ+O4lPc0wEOjmNGAicZmUpMmEQfYoVLhGMmflOo6gGPrGiYHx/CW40oE7dUFZpojPDJR6RTNcgVo2mvuj6n1flxeJGALENy54SuAv0tQJR3nZR042hBGOg9lkwAZcpFRlXuSPY1H4JODho+eoxj0zFhQ1tLCgrsgU5Ufk2kQpIkEthJkSg9VomvparuDeye+4vjuqOFDaYVsVZAtTICYoeK3bHbOg66227hw8AmWlE+Y/T3t7EAWrsFXDk+he//dgqCdrbcI+tSAxuZ7sK4lC2yKKVyD6+UGnG1/jL7IIytOZ+tNXDz0jKCfEZs/CTWXsO45Xdha5v+MXy4M4HrHO5yK3Iegn5L5RdARxFOzBO0hKD0GHsQ1OKurePHlDG50vEdv5IGBiKfmMDLX7RnKzq5TzcYMf07whT8fsJj4iFiZUI7lesVszJLV1wh+2hxUcPS04go4Ba41A5dMNXceLUONnVpfWUJdb6P1F3UvCea3ybpS1MedkvpwKFzatCTYHwL4v11Ssz2uFbiOwT8yCjy+ecvfAJU7q8Cq9PAN6r8ljQ8BQbOgOt5eoZpTD7Sjxah4/u4dnETTDj88vPq9T3A1C/mcH0p/P7R/ODnAZaZCuGEAAAAASUVORK5CYII=)
  }
  .main {
    width: 100%;
    border: 1px solid #e5e5e5;
    font-size: 0
}
  .hall {
    width: 820px;
    display: inline-block;
    vertical-align: top
}

.hall .seat-example {
    margin: 30px 0 30px 118px
}

.hall .seat-example .example {
    display: inline-block;
    font-size: 16px;
    color: #666;
    height: 26px;
    line-height: 26px;
    padding-left: 38px;
    background-repeat: no-repeat;
    margin-right: 50px
}

.hall .seat-example .selectable-example {
    background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAaCAYAAACgoey0AAAAAXNSR0IArs4c6QAAAY9JREFUSA3tVs1qg0AQ3l1/i5eCFC8+QSC0+BQ999QeC32t9lLovac8RQwk6BOUXLzVitFE0/mEDVIiJsbkUgeM7jjzfd/OjpvlrGZhGL6uVqvnsix5zX3yoxBia5rm22g0etkL5vt+WRTFtm8DJrDrpKI+wExJXd3VyzMw/1axf5YDpe6IqRSPUJZlGdQdmN4eBixgAps4nmRGRUyOCTneXddlnHOWJEkv5CAFFjCBTeOP2Wz2CXI+nU7vqZkmnudVAXBuNptKpWVZGHa2OI4ZdTPTNK3CIB42n89TarYHQWpuHcfJoEqaqqqViFNKDhKUV5ICGxy2bQt6d4cfU1EUQ5LKO4KQ3NWQW5+MxAEXCbraNZd8can7QHypSrOh1EOpz1YBtQkZOw+2zK67V1teI7FhGGy9XjfpavWDWNf1xrhGYtpTGa5z2f/6jmkZFPwff0VR1H0xj1yL5XKJhv3hQRDoaZriILClKz8S5+hwIk3ptHNTHTtowBeLxXWe5/2d8vZIoi4X4/H4myZY/AJMWAAq2pF/7QAAAABJRU5ErkJggg==)
}

.hall .seat-example .sold-example {
    background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAaCAYAAACgoey0AAAAAXNSR0IArs4c6QAAAeRJREFUSA3tlr9Lw0AUx99dmyZtpRbBX6AOoiAG1KF1EXFUcBMEHRX/LV0EFyfBUhwFJwWdXC2CIKKIttU0TXLPd6kJaaFQz3bSB0kud+99P3ePl7swiNjZ4uz+h+PueAgs0v3rZowBpjXtYPXydi8QiwcN+ZTQlbEBFmNd5YKHyM4fXncJEYJ5FCxX2m2o1JearVlsAkcn0et2CD7NmVt6nMPdu0Up97rGrdY9X1NqFxbN7UDYBxfzs0XO4HCqPwVxzuH6uQIVxw18lJ9VWsDNSwU0EpfaQoijYt48kYKskDfXBIri0mgWaNy3Z8uBUtmC3FAm7GuMdH5HBLh4fIPpbBJGUrofKKjv6qlsuQgbHBnMj/cZdgCVHoNJzS8IyxWdk1o8bSFAi/EQKoclYzitySwvcCbQoKJrTCkSnCAvh4JVzaXlGdHVfAtxYDoCJsPiUgWoxv2DVTP347j/VP84ZaoBfy/VTT8C0bQ5KKDmefBiqe1etB+D3JvbWVvwZCYFj582xan9jSCdEhMZox0X2oKzehzk1Sv7Y8WFLMaR48PTZ93pVUpbde8rNaBjuMpuN83EXUnYVEJIx2e91bHb7/SNWOn08KBfslSBrLA8l9WNhNq30+Hs7Fqdr4/OlNnxsfcFxEaatII5mN4AAAAASUVORK5CYII=)
}

.hall .seat-example .selected-example {
    background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAaCAYAAACgoey0AAAAAXNSR0IArs4c6QAAAoxJREFUSA3Fls9LFGEYx78z7rq7WuEiQqEVi1SHwjrVSU9aghURJYa2UUgd+nEuKAg6dK7cQ6FSCYrdosK/oFupFF46CLkFBZm7s+K4P2benmfGHRx3t5nZXdln2Zl5n3me5/O+z/vMMyNhk0RfY0zL4qrQIW1SV3wpyRA+P8ZfRTGcD+bLX/CZoeF9kMiwqiIEpJXvuEZBLbANwSutNpRXIFH+tmbRBq7qMh2CWeDLoxjgnV1bNlLu4Ob+di5txuTYQ+O4lPc0wEOjmNGAicZmUpMmEQfYoVLhGMmflOo6gGPrGiYHx/CW40oE7dUFZpojPDJR6RTNcgVo2mvuj6n1flxeJGALENy54SuAv0tQJR3nZR042hBGOg9lkwAZcpFRlXuSPY1H4JODho+eoxj0zFhQ1tLCgrsgU5Ufk2kQpIkEthJkSg9VomvparuDeye+4vjuqOFDaYVsVZAtTICYoeK3bHbOg66227hw8AmWlE+Y/T3t7EAWrsFXDk+he//dgqCdrbcI+tSAxuZ7sK4lC2yKKVyD6+UGnG1/jL7IIytOZ+tNXDz0jKCfEZs/CTWXsO45Xdha5v+MXy4M4HrHO5yK3Iegn5L5RdARxFOzBO0hKD0GHsQ1OKurePHlDG50vEdv5IGBiKfmMDLX7RnKzq5TzcYMf07whT8fsJj4iFiZUI7lesVszJLV1wh+2hxUcPS04go4Ba41A5dMNXceLUONnVpfWUJdb6P1F3UvCea3ybpS1MedkvpwKFzatCTYHwL4v11Ssz2uFbiOwT8yCjy+ecvfAJU7q8Cq9PAN6r8ljQ8BQbOgOt5eoZpTD7Sjxah4/u4dnETTDj88vPq9T3A1C/mcH0p/P7R/ODnAZaZCuGEAAAAASUVORK5CYII=)
}

.hall .seat-example .couple-example {
    padding-left: 77px;
    background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEQAAAAaCAYAAAAOl/o1AAAAAXNSR0IArs4c6QAAAfFJREFUWAntmM1qwkAQxzffKV4KEiTgK0iLvkTPPbWv0lN76JMUeu/Jp1BB8Q2KHrzVSkg0pvNPWVnXpD25CWsG8jGThM3/t7uTzRhMsNFo9EzuU5ZljhDW9tQwjC2Jex0MBi+FIglIkqYp8VBri8Uiw6baoBWaRRim6NALOaZ5FBIva3cOrdAsCrNFp6rzMAyravqk3cNwGI/HDyAWxzHb7/cnN+oWgEZohWbS/sj15UAoMKTAW7fbZZRo2Gaz0RoKYEAjtEIz+e+TyeQDUAxKKnc0j4b9fj+/AcHdbpfTa7VacM9uy+Uyb0PV1Fmv18z3feY4v+mD9LPpdBpRkr03idJNp9OJQYubbds5HB2nDsRjmnAY0Azt7XbbpGu3Nu18y7I8DoMfcRMeVmGqRga0QJPY+VwfGBCoq0NS5Rcu/dgAkUZALYAgqfLEKr2fcrcWQJSr/qPBZqUqwWlGSANEIiC5tRghTVKVeqVObmlSxYoOS3cVq9UgCHIm+Ic6t/2npxSI53lsu0WFTS8DENd1S0WVAqG1PcN2adYkVanHawFEeqfKXJpOFuohn6vVqtJkgd9/lSWAIuJU9ccH5NuYz+duFEUoEGW0HZXkix7UNUYwIqoaBnmZjBxjNptdJ0mif3W5oEfpq2P2er0vGhDpD2q0q+oG3RT9AAAAAElFTkSuQmCC)
}

.seats-block {
    font-size: 0;
    overflow: auto;
    margin-left: 20px;
    white-space: nowrap
}

.seats-block .row-id-container {
    width: 20px;
    float: left;
    margin-top: 112px;
    white-space: normal
}

.seats-block .empty-row {
    height: 20px
}

.seats-block .empty-row-id {
    display: inline-block;
    height: 20px;
    width: 20px
}

.seats-block .seats-container {
    margin-left: 50px;
    overflow: auto;
    position: relative;
    padding-top: 112px
}

.seats-block .screen-container {
    display: inline-block;
    position: absolute;
    top: 0;
    bottom: 0;
    z-index: -1;
}

.seats-block .seat.lover {
    background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEQAAAAaCAYAAAAOl/o1AAAAAXNSR0IArs4c6QAAAfFJREFUWAntmM1qwkAQxzffKV4KEiTgK0iLvkTPPbWv0lN76JMUeu/Jp1BB8Q2KHrzVSkg0pvNPWVnXpD25CWsG8jGThM3/t7uTzRhMsNFo9EzuU5ZljhDW9tQwjC2Jex0MBi+FIglIkqYp8VBri8Uiw6baoBWaRRim6NALOaZ5FBIva3cOrdAsCrNFp6rzMAyravqk3cNwGI/HDyAWxzHb7/cnN+oWgEZohWbS/sj15UAoMKTAW7fbZZRo2Gaz0RoKYEAjtEIz+e+TyeQDUAxKKnc0j4b9fj+/AcHdbpfTa7VacM9uy+Uyb0PV1Fmv18z3feY4v+mD9LPpdBpRkr03idJNp9OJQYubbds5HB2nDsRjmnAY0Azt7XbbpGu3Nu18y7I8DoMfcRMeVmGqRga0QJPY+VwfGBCoq0NS5Rcu/dgAkUZALYAgqfLEKr2fcrcWQJSr/qPBZqUqwWlGSANEIiC5tRghTVKVeqVObmlSxYoOS3cVq9UgCHIm+Ic6t/2npxSI53lsu0WFTS8DENd1S0WVAqG1PcN2adYkVanHawFEeqfKXJpOFuohn6vVqtJkgd9/lSWAIuJU9ccH5NuYz+duFEUoEGW0HZXkix7UNUYwIqoaBnmZjBxjNptdJ0mif3W5oEfpq2P2er0vGhDpD2q0q+oG3RT9AAAAAElFTkSuQmCC);
    width: 35px
}

.seats-block .seat.lover.selected {
    background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEQAAAAaCAYAAAAOl/o1AAAAAXNSR0IArs4c6QAAAvVJREFUWAntmMtrE1EUxr+ZyaSTpLEppaDQB1JdiSS2ijsFF9WN6KqojQsXIigKbu3CKAj+AT4Wbd0oXbhzIYIKuhKKSAsqPla1VGorJW2aR5N0Mp4zJSEzNTHJZMBMcmCYuXfunTPf79577kNAkYXHEdEE3NA0yEXZjn0UBGQFDXeeXMStvEhX/oHvDKOzH7IgFuc695kbPjqHMVJYAGKQzgWaBQY3M/UQmEeDAYhz+0LlygpAzk/gDIhYYgXYTFf+gUYtyRqTpJU1hx/hbF6HDiQ8gRcq8NjXBYgSsPbT2VAYBmsUSCtrzqmYGp3EM4YiEYwTOQ2Rrt0QXQog0+VyA/FlQOnYGmd5etXe+/yHcH3oHVY25rCc/Fpt9ZrKV+IzOk8gugEP6XO1Ad4AkIqhL3gSH8QcEPR2Is1dJ29uH4GgvqNm8znV33v9B3E59BKKq4NgfKv+AzXUqMRnbpO00dyq+IsckHZlB0QKsCGRQCgaQJyMJlIljWiVs8O7LoBbxGy9/iFcCb3Ssx/MDmMp+cVcpOa0VZ80PCAWIqfhN9qIhefvrwzlSieG+8dwbfAt9gSOFgptwXhNU5oAhjG//r7wrh4Pdvu0BGT84ymk1TguBZ9jIHAEPe2Des9gGPdn6g+DgdrtUzg3iZsUXCIURwwWW6SgQ3kcZMvZTt8+XD3wBm7JCzWXoZ4h6T3jR2y6XDVL76z45Bkm/hsI9Bh/IRkFNlZx21IP4U/+SnzGvZljyKhJHcbD2eOwE4bdPg17GSOzylOLiU+4O70fkihjNb1QeUULJe3yWRcgrGs9u2RBXm1V7fBpecjUJuX/rdUCYmqbFhATkJIxhFd0aoY2PrTUdZTR6rtol7JNWkkgvAvciG0r3/gZtE/h9VUpKwlE9tCijK5ms1YMMbV4C4gRiMRAFjIxWDj5MH6xUVMp2stAQ1yIPIX7+5p+QKQRHZpXmtMo1qb2DqBbn4HopEgYnUKgXcY/joScCSuehXhaRmxkBOofEssDcdHpkRIAAAAASUVORK5CYII=)
}

.seats-block .seat.lover-left {
    background-position: 1px 0;
    margin-right: 0
}

.seats-block .seat.lover-right {
    background-position: -34px 0;
    margin-left: 0
}

</style>
