/** @module hubspot/fieldsJs */

import * as T from '../config/types.js' // eslint-disable-line
import fsPromises from 'fs/promises'
import { globals } from '../config/globals.js'
import * as utils from '../utils/ui.js'
import { getFileList } from '../utils/fs.js'

/**
 * @summary Compile fields.js to fields.json
 * @async
 * @param {T.THEME_BUILD_OPTIONS} [opt] - options
 * @returns undefined
 */
async function compileFieldsJs (opt) {
  try {
    const hideStatus = opt?.hideStatus

    const timeStart = utils.startTask('compileFieldsJs')
    const fileList = []

    const files = await getFileList(globals.FIELDSJS_SRC, { objectMode: true })
    if (files !== undefined) {
      for await (const file of files) {
        const { default: fields } = await import(file.path)
        await fsPromises.writeFile(`${file.path.slice(0, -3)}.json`, JSON.stringify(fields, null, 2), { encoding: 'utf8' })
        file.dist = `${file.path.slice(0, -3)}.json`
        fileList.push(file)
      }
    }
    hideStatus || utils.endTask({ files: fileList, taskName: 'compileFieldsJs', timeStart })
  } catch (error) {
    console.error(error)
  }
}

export { compileFieldsJs }
