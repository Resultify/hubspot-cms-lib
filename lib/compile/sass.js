/** @module lib/sass */

import * as T from '../config/types.js' // eslint-disable-line
import fsPromises from 'fs/promises'
import { pathToFileURL } from 'url'
import sass from 'sass'
import { globals } from '../config/globals.js'
import * as utils from '../utils/ui.js'
import { getFileList } from '../utils/fs.js'

/**
 * @summary Compile Scss task
 * @async
 * @param {T.THEME_BUILD_OPTIONS} [opt] - options
 * @returns undefined
 */
async function compileScss (opt) {
  const hideStatus = opt?.hideStatus

  try {
    const timeStart = utils.startTask('compileScss')
    const fileList = []

    await fsPromises.mkdir(globals.TMP, { recursive: true })
    const files = await getFileList(`${globals.SCSS_SRC}/*.scss`, { objectMode: true })

    if (files !== undefined) {
      for await (const file of files) {
        const scssResult = await sass.compileAsync(file.path, {
          importers: [{
            // an importer that redirects relative URLs starting with "~" to
            // `node_modules`.
            findFileUrl (url) {
              if (!url.startsWith('~')) return null
              return new URL(url.substring(1), pathToFileURL('node_modules/'))
            }
          }]
        })

        const fileName = `${file.name.slice(0, -5)}.css`
        await fsPromises.writeFile(`${globals.TMP}/${fileName}`, scssResult.css)
        const fileStats = await fsPromises.stat(`${globals.TMP}/${fileName}`)
        file.size = utils.convertFileSize(fileStats.size)
        file.dist = `${globals.TMP}/${fileName}`
        fileList.push(file)
      }
    }

    hideStatus || utils.endTask({ files: fileList, taskName: 'compileScss', timeStart })
  } catch (error) {
    console.error(error)
  }
}

export { compileScss }
