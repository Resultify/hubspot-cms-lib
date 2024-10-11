import { parseArgs } from './utils/arg.js'
import { build } from './cmd/build.js'
import { watch } from './cmd/watch.js'
import { hubspotFetchAll } from './cmd/fetch.js'
import { hubspotFetchModules } from './cmd/fetchModules.js'
import { upload } from './cmd/upload.js'
import { ciUpload } from './cmd/ciUpload.js'
import { cleanUpload } from './cmd/cleanUpload.js'
import { validate } from './cmd/validate.js'
import { lighthouse } from './cmd/lighthouse.js'
import { fields } from './cmd/fields.js'
import { fetchDb, uploadDb } from './cmd/hubdb.js'
import 'dotenv/config'

const args = parseArgs()
function init () {
  if (args.build) {
    build()
  } else if (args.watch) {
    watch()
  } else if (args.fetch) {
    hubspotFetchAll()
  } else if (args.fetchModules) {
    hubspotFetchModules()
  } else if (args.upload) {
    upload()
  } else if (args.ciUpload) {
    ciUpload()
  } else if (args.cleanUpload) {
    cleanUpload()
  } else if (args.validate) {
    validate()
  } else if (args.lighthouse) {
    lighthouse()
  } else if (args.fields) {
    fields()
  } else if (args.fetchDb) {
    fetchDb()
  } else if (args.uploadDb) {
    uploadDb()
  }
}
export { init }
