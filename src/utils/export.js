import { saveAs } from 'file-saver'
export const saveAsTxt = (data, filename) => {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'text/plain;charset=utf-8' })
  // 注意：这里要手动写上文件的后缀名
  saveAs(blob, `${filename}.txt`)
}
export const saveAsJson = (data, filename) => {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  // 注意：这里要手动写上文件的后缀名
  saveAs(blob, `${filename}.json`)
}
