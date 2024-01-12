/** @module hubspot/fieldsJs */

import { execa } from 'execa'
import * as ui from '../utils/ui.js'
import { getFileList } from '../utils/fs.js'
import { getThemeOptions } from '../utils/options.js'

/**
 * #### Compile fields.js to fields.json
 * @async
 * @param {boolean} [hideStatus] - hide status messages
 * @param {string} [filePath] - file path
 * @returns undefined
 */
async function compileFieldsJs (filePath = '', hideStatus) {
  try {
    const timeStart = ui.startTask('compileFieldsJs')
    const cmslibOptions = getThemeOptions()
    const fileList = []
    if (filePath) {
      await execa('node', [filePath])
      const file = { dist: `${filePath.slice(0, -3)}.json` }
      fileList.push(file)
    } else {
      const files = await getFileList(`${process.cwd()}/${cmslibOptions.themeFolder}/**/fields.js`, { objectMode: true })
      if (files !== undefined) {
        for await (const file of files) {
          await execa('node', [file.path])
          file.dist = `${file.path.slice(0, -3)}.json`
          fileList.push(file)
        }
      }
    }
    hideStatus || ui.endTask({ files: fileList, taskName: 'compileFieldsJs', timeStart })
  } catch (error) {
    console.error(error)
  }
}

export { compileFieldsJs }
