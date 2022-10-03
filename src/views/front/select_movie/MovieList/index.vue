<template>
  <el-tabs v-model="tabs.activeName" type="border-card" @tab-click="handleClickTab">
    <el-tab-pane label="选择电影" name="movie">
      <h2 style="text-align: center">全部电影</h2>
      <div style="text-align: center">
        <label>选择类型: </label>
        <el-select v-model="otherData.movie_type" filterable clearable placeholder="请选择" @change="handleFilter">
          <el-option
            v-for="item in movieType.list"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <label style="margin-left: 20px">搜索电影: </label>
        <el-input v-model="otherData.movieName" placeholder="请输入搜索的电影名称" style="width: 15vw;" @change="handleFilter"/>
      </div>
      <div v-show="movies.total > 0">
        <ul class="movie layout" style="overflow:auto">
          <el-card v-for="m in movies.list" :key="m.id" class="card">
            <div slot="header" class="clearfix">
              <label>{{ m.name }}</label>
            </div>
            <div class="text item">
              <el-col :span="8">
                <div class="blank">
                  <label>主演：</label>
                  {{ m.stars }}
                </div>
                <div class="blank">
                  <label>地区：</label>
                  {{ m.location }}
                </div>
                <div class="blank">
                  <label>
                    评分：
                    <span class="score">
                      9.1
                    </span>
                  </label>
                </div>
                <div class="options">
                  <el-button type="primary" @click="handleChooseShow(m.id)">购票</el-button>
                </div>
              </el-col>
              <el-col :span="8">
                <label>简介：</label>
                <p>{{ m.info }}</p>
              </el-col>
              <el-col :span="8">
                <img :src="m.image" style="height: 150px; float: right">
              </el-col>
            </div>
          </el-card>
        </ul>
      </div>
    </el-tab-pane>
    <el-tab-pane label="选择场次" name="show">
      <h2 style="text-align: center">选择场次</h2>
      <div v-show="shows.total > 0">
        <ul class="infinite-list movie layout" style="overflow:auto">
          <el-card v-for="m in shows.total" :key="shows.list[m - 1].id" class="infinite-list-item card">
            <div class="text item">
              <el-col :span="24">
                <div class="blank">
                  <label>放映时间：</label>
                  <span>{{ shows.list[m - 1].start_time }}</span>
                </div>
                <div class="blank">
                  <label>
                    票价：
                    <span class="score">
                      {{ shows.list[m - 1].price }}
                    </span>
                  </label>
                </div>
                <div class="blank">
                  <label>
                    放映厅：
                    <span>
                      {{ shows.list[m - 1].roomName }}
                    </span>
                  </label>
                </div>
                <div class="options">
                  <el-button type="primary" @click="handleChooseSeat(shows.list[m - 1].id, shows.list[m - 1].price)">选择座位</el-button>
                </div>
              </el-col>
            </div>
          </el-card>
        </ul>
      </div>
    </el-tab-pane>
    <el-tab-pane label="选择座位" name="seat">
      <h2 style="text-align: center">选择座位</h2>
      <div v-show="chooseForm.form.show_id !== ''">
        <el-card class="layout">
          <div class="text item">
            <div class="">
              <div class="">
                <div class="">
                  <div class="seats-wrapper">
                    <div class="screen" :style="{'width': `${otherData.layout.states.screen_width}px`, 'margin-left': `${otherData.layout.states.offset}px`}" />
                    <div v-for="r in otherData.layout.states.row" :key="r" class="row">
                      <span class="row-id">{{ r }}</span>
                      <span v-for="c in otherData.layout.states.column" :ref="`${r}-${c}`" :key="c" class="seat" :column-id="c" :row-id="r" :state="0" @click="changeSeatState($event)" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </el-card>
        <div>
          <el-tag type="info" style="margin-top: 20px">{{ choose_seat }}</el-tag>
        </div>
        <div>
          <el-tag>总金额: {{ total_price | numFilter }}</el-tag>
          <el-tag type="success" style="margin-left: 10px">票数: {{ num }}</el-tag>
        </div>
        <el-button type="primary" style="float: right" @click="handlePay">确认付款</el-button>
      </div>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
export default {
  name: 'MovieList',
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
      movies: {
        list: [],
        total: 0,
        bk_list: []
      },
      movieType: {
        list: [],
        total: 0
      },
      tabs: {
        activeName: 'movie'
      },
      chooseForm: {
        form: {
          movie_id: '',
          show_id: '',
          choose_seat: '',
          total_price: 0.0,
          user_id: '',
          status: '未完成',
          layout: '',
          num: 0
        }
      },
      shows: {
        list: [],
        total: 0
      },
      otherData: {
        layout: {
          states: {
            column: '',
            offset: '',
            row: '',
            screen_width: '',
            seat_layout: '',
            size: ''
          }
        },
        bk_layout: {
          states: {
            column: '',
            offset: '',
            row: '',
            screen_width: '',
            seat_layout: '',
            size: ''
          }
        },
        movie_type: '',
        movieName: ''
      }
    }
  },
  computed: {
    choose_seat() {
      const { bk_layout } = this.otherData
      const { states } = this.otherData.layout
      const res = []
      for (let r = 0; r < states.row; r++) {
        for (let c = 0; c < states.column; c++) {
          const idx = r * states.column + c
          if (states.seat_layout[idx] === '2' && bk_layout.states.seat_layout[idx] === '0') {
            res.unshift(`${r + 1}排${c + 1}座`)
          }
        }
      }
      return res.toString()
    },
    num() {
      let cnt = 0
      if (this.choose_seat !== '') {
        cnt = this.choose_seat.split(',').length
      }
      return cnt
    },
    total_price() {
      const price = this.chooseForm.form.price
      return this.num * price
    }
  },
  mounted() {
    this.getAllMovie()
    this.getAllType()
  },
  methods: {
    async getAllType() {
      const res = await this.$API.movieDetail.reqMovieType()
      if (res.code === 200) {
        this.movieType.list = res.data
        this.movieType.total = res.data.length
      }
    },
    async getAllMovie() {
      const res = await this.$API.movieDetail.reqMovies()
      if (res.code === 200) {
        this.movies.bk_list = res.data
        this.movies.list = res.data
        this.movies.total = this.movies.list.length
        console.log('@', this.movies.total)
      } else {
        this.$message({ type: 'error', message: '获取电影信息失败' })
      }
    },
    async getAllShow(movie_id) {
      const res = await this.$API.show.getAllShow(movie_id)
      if (res.code === 200) {
        this.shows.list = res.data
        this.shows.total = this.shows.list.length
      } else {
        this.$message({ type: 'error', message: '获取放映场次失败' })
      }
    },
    async remoteGetLayout() {
      console.log(this.chooseForm.form.show_id)
      const res = await this.$API.show.reqSeatLayout(this.chooseForm.form.show_id)
      if (res.code === 200) {
        this.otherData.layout.states = JSON.parse(JSON.stringify(res.data))
        this.otherData.bk_layout.states = JSON.parse(JSON.stringify(res.data))
        const { row, column, seat_layout } = this.otherData.layout.states
        setTimeout(() => {
          let rest = 0
          for (let i = 0; i < row * column; i++) {
            const r = Math.floor(i / column)
            const c = i % column
            if (seat_layout[i] === '0') {
              rest++
              this.$refs[`${r + 1}-${c + 1}`][0].style.backgroundImage = 'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAaCAYAAACgoey0AAAAAXNSR0IArs4c6QAAAY9JREFUSA3tVs1qg0AQ3l1/i5eCFC8+QSC0+BQ999QeC32t9lLovac8RQwk6BOUXLzVitFE0/mEDVIiJsbkUgeM7jjzfd/OjpvlrGZhGL6uVqvnsix5zX3yoxBia5rm22g0etkL5vt+WRTFtm8DJrDrpKI+wExJXd3VyzMw/1axf5YDpe6IqRSPUJZlGdQdmN4eBixgAps4nmRGRUyOCTneXddlnHOWJEkv5CAFFjCBTeOP2Wz2CXI+nU7vqZkmnudVAXBuNptKpWVZGHa2OI4ZdTPTNK3CIB42n89TarYHQWpuHcfJoEqaqqqViFNKDhKUV5ICGxy2bQt6d4cfU1EUQ5LKO4KQ3NWQW5+MxAEXCbraNZd8can7QHypSrOh1EOpz1YBtQkZOw+2zK67V1teI7FhGGy9XjfpavWDWNf1xrhGYtpTGa5z2f/6jmkZFPwff0VR1H0xj1yL5XKJhv3hQRDoaZriILClKz8S5+hwIk3ptHNTHTtowBeLxXWe5/2d8vZIoi4X4/H4myZY/AJMWAAq2pF/7QAAAABJRU5ErkJggg==)'
            } else if (seat_layout[i] === '2') {
              this.$refs[`${r + 1}-${c + 1}`][0].style.backgroundImage = 'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAaCAYAAACgoey0AAAAAXNSR0IArs4c6QAAAeRJREFUSA3tlr9Lw0AUx99dmyZtpRbBX6AOoiAG1KF1EXFUcBMEHRX/LV0EFyfBUhwFJwWdXC2CIKKIttU0TXLPd6kJaaFQz3bSB0kud+99P3ePl7swiNjZ4uz+h+PueAgs0v3rZowBpjXtYPXydi8QiwcN+ZTQlbEBFmNd5YKHyM4fXncJEYJ5FCxX2m2o1JearVlsAkcn0et2CD7NmVt6nMPdu0Up97rGrdY9X1NqFxbN7UDYBxfzs0XO4HCqPwVxzuH6uQIVxw18lJ9VWsDNSwU0EpfaQoijYt48kYKskDfXBIri0mgWaNy3Z8uBUtmC3FAm7GuMdH5HBLh4fIPpbBJGUrofKKjv6qlsuQgbHBnMj/cZdgCVHoNJzS8IyxWdk1o8bSFAi/EQKoclYzitySwvcCbQoKJrTCkSnCAvh4JVzaXlGdHVfAtxYDoCJsPiUgWoxv2DVTP347j/VP84ZaoBfy/VTT8C0bQ5KKDmefBiqe1etB+D3JvbWVvwZCYFj582xan9jSCdEhMZox0X2oKzehzk1Sv7Y8WFLMaR48PTZ93pVUpbde8rNaBjuMpuN83EXUnYVEJIx2e91bHb7/SNWOn08KBfslSBrLA8l9WNhNq30+Hs7Fqdr4/OlNnxsfcFxEaatII5mN4AAAAASUVORK5CYII=)'
            } else {
              this.$refs[`${r + 1}-${c + 1}`][0].style.backgroundImage = 'none'
            }
          }
          if (rest === 0) {
            this.$message({ type: 'warning', message: '无余票' })
          }
        }, 200)
      } else {
        this.otherData.layout.states = ''
      }
    },
    async submitOrder() {
      this.chooseForm.form.num = this.num
      this.chooseForm.form.layout = this.otherData.layout.states.seat_layout
      this.chooseForm.form.user_id = this.$store.state.user.id
      this.chooseForm.form.total_price = this.total_price
      if (this.chooseForm.form.show_id === '' || this.chooseForm.form.layout === '') return
      if (this.choose_seat.length === 0) {
        this.$message({ type: 'info', message: '请选择座位' })
        return
      }
      const res = await this.$API.order.addOrder(this.chooseForm.form)
      if (res.code === 200) {
        this.$message({ type: 'success', message: '下单成功' })
        this.$router.push({ path: '/check_order/index' })
      } else {
        this.$message({ type: 'success', message: '下单失败' })
      }
    },
    handleClickTab(tab, event) {
      if (tab.index === '1') {
        console.log('@1')
        if (this.chooseForm.form.movie_id === '') return
        this.getAllShow(this.chooseForm.form.movie_id)
      } else if (tab.index === '2') {
        if (this.chooseForm.form.show_id === '') return
        console.log('@2')
      }
    },
    handleChangeTab(name) {
      this.tabs.activeName = name
    },
    handleChooseShow(movie_id) {
      this.handleChangeTab('show')
      this.shows.list = []
      this.shows.total = 0
      this.getAllShow(movie_id)
    },
    handleChooseSeat(show_id, price) {
      this.chooseForm.form.show_id = show_id
      this.chooseForm.form.price = price
      this.handleChangeTab('seat')
      this.remoteGetLayout()
    },
    // 手动修改座位布局
    changeSeatState(e) {
      const r = e.target.getAttribute('row-id')
      const c = e.target.getAttribute('column-id')
      const { states } = this.otherData.layout
      const idx = (r - 1) * states.column + (c - 1)
      if (this.otherData.bk_layout.states.seat_layout[idx] !== '0') {
        return
      }
      let state = parseInt(states.seat_layout[idx])
      state = 2 - state
      states.seat_layout = states.seat_layout.slice(0, idx) + state + states.seat_layout.slice(idx + 1)
      if (state === 0) {
        // background-image: none
        this.$refs[`${r}-${c}`][0].style.backgroundImage = 'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAaCAYAAACgoey0AAAAAXNSR0IArs4c6QAAAY9JREFUSA3tVs1qg0AQ3l1/i5eCFC8+QSC0+BQ999QeC32t9lLovac8RQwk6BOUXLzVitFE0/mEDVIiJsbkUgeM7jjzfd/OjpvlrGZhGL6uVqvnsix5zX3yoxBia5rm22g0etkL5vt+WRTFtm8DJrDrpKI+wExJXd3VyzMw/1axf5YDpe6IqRSPUJZlGdQdmN4eBixgAps4nmRGRUyOCTneXddlnHOWJEkv5CAFFjCBTeOP2Wz2CXI+nU7vqZkmnudVAXBuNptKpWVZGHa2OI4ZdTPTNK3CIB42n89TarYHQWpuHcfJoEqaqqqViFNKDhKUV5ICGxy2bQt6d4cfU1EUQ5LKO4KQ3NWQW5+MxAEXCbraNZd8can7QHypSrOh1EOpz1YBtQkZOw+2zK67V1teI7FhGGy9XjfpavWDWNf1xrhGYtpTGa5z2f/6jmkZFPwff0VR1H0xj1yL5XKJhv3hQRDoaZriILClKz8S5+hwIk3ptHNTHTtowBeLxXWe5/2d8vZIoi4X4/H4myZY/AJMWAAq2pF/7QAAAABJRU5ErkJggg==)'
      } else if (state === 2) {
        this.$refs[`${r}-${c}`][0].style.backgroundImage = 'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAaCAYAAACgoey0AAAAAXNSR0IArs4c6QAAAeRJREFUSA3tlr9Lw0AUx99dmyZtpRbBX6AOoiAG1KF1EXFUcBMEHRX/LV0EFyfBUhwFJwWdXC2CIKKIttU0TXLPd6kJaaFQz3bSB0kud+99P3ePl7swiNjZ4uz+h+PueAgs0v3rZowBpjXtYPXydi8QiwcN+ZTQlbEBFmNd5YKHyM4fXncJEYJ5FCxX2m2o1JearVlsAkcn0et2CD7NmVt6nMPdu0Up97rGrdY9X1NqFxbN7UDYBxfzs0XO4HCqPwVxzuH6uQIVxw18lJ9VWsDNSwU0EpfaQoijYt48kYKskDfXBIri0mgWaNy3Z8uBUtmC3FAm7GuMdH5HBLh4fIPpbBJGUrofKKjv6qlsuQgbHBnMj/cZdgCVHoNJzS8IyxWdk1o8bSFAi/EQKoclYzitySwvcCbQoKJrTCkSnCAvh4JVzaXlGdHVfAtxYDoCJsPiUgWoxv2DVTP347j/VP84ZaoBfy/VTT8C0bQ5KKDmefBiqe1etB+D3JvbWVvwZCYFj582xan9jSCdEhMZox0X2oKzehzk1Sv7Y8WFLMaR48PTZ93pVUpbde8rNaBjuMpuN83EXUnYVEJIx2e91bHb7/SNWOn08KBfslSBrLA8l9WNhNq30+Hs7Fqdr4/OlNnxsfcFxEaatII5mN4AAAAASUVORK5CYII=)'
      }
      this.chooseForm.form.choose_seat = this.choose_seat
    },
    handlePay() {
      this.submitOrder()
    },
    handleFilter() {
      console.log(this.otherData.movieName)
      const list = this.movies.bk_list.filter((m) => ((m.category === this.otherData.movie_type || this.otherData.movie_type === '') && m.name.indexOf(this.otherData.movieName) !== -1))
      this.movies.list = list
      this.movies.total = list.length
      console.log(list)
    }
  }
}
</script>

<style>
.movie {
  height: 60vh;
  overflow: auto;
}
.text {
  font-size: 14px;
}
.card {
  margin-bottom: 10px;
}

.item {
  margin-bottom: 18px;
}

.blank {
  margin-bottom: 10px;
}
.score {
  color: #ffb400;
}

.options {
  padding-bottom: 2px;
}
.layout {
  width: 50vw;
  margin-left: 15vw;
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
  width: 480px;
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
  background: url(data:image/png;base64,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) no-repeat;
  background-position-x: center;
  position: relative;
  margin-bottom: 40px
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
</style>
