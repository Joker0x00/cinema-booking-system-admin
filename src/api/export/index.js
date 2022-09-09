import request from '@/utils/request'

export const reqTableExport = (tableName, exportConfig) => request({
  url: `/export/table/${tableName}/`,
  method: 'post',
  data: {
    exportConfig
  }
})
