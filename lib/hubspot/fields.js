/** @module hubspot/fieldsJs */

import * as T from '../config/types.js' // eslint-disable-line
import { execa } from 'execa'
import { globals } from '../config/globals.js'
import * as utils from '../utils/ui.js'
import { getFileList } from '../utils/fs.js'

/**
 * @summary Compile fields.js to fields.json
 * @async
 * @param {T.THEME_BUILD_OPTIONS} [opt] - options
 * @param {string} [filePath] - file path
 * @returns undefined
 */
async function compileFieldsJs (opt, filePath = '') {
  try {
    const hideStatus = opt?.hideStatus

    const timeStart = utils.startTask('compileFieldsJs')
    const fileList = []
    if (filePath) {
      await execa('node', [filePath])
      const file = { dist: `${filePath.slice(0, -3)}.json` }
      fileList.push(file)
    } else {
      const files = await getFileList(globals.FIELDSJS_SRC, { objectMode: true })
      if (files !== undefined) {
        for await (const file of files) {
          await execa('node', [file.path])
          file.dist = `${file.path.slice(0, -3)}.json`
          fileList.push(file)
        }
      }
    }
    hideStatus || utils.endTask({ files: fileList, taskName: 'compileFieldsJs', timeStart })
  } catch (error) {
    console.error(error)
  }
}

export { compileFieldsJs }
