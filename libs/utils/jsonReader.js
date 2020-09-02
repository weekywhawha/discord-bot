import { readFile } from 'fs'

function jsonReader(filePath, cb) {
  readFile(filePath, (err, fileData) => {
    if (err) {
      return cb && cb(err)
    }
    try {
      const object = JSON.parse(fileData.toString())
      return cb && cb(null, object)
    } catch (err) {
      return cb && cb(err)
    }
  })
}
export { jsonReader }
