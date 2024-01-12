/** @module compile/sass */

import fsPromises from 'fs/promises'
import { pathToFileURL } from 'url'
import * as sass from 'sass'
import { getFileList } from '../utils/fs.js'
import * as ui from '../utils/ui.js'
import { getThemeOptions } from '../utils/options.js'

/**
 * #### Compile Scss task
 * @async
 * @param {boolean} [hideStatus] - hide status messages
 * @returns undefined
 */
async function compileScss (hideStatus) {
  try {
    const timeStart = ui.startTask('compileScss')
    const options = getThemeOptions()
    const scssSrc = `${options.vendorSrc}/scss`
    const scssDest = `${options.vendorDest}/css`
    const fileList = []

    await fsPromises.mkdir(scssDest, { recursive: true })
    const files = await getFileList(`${scssSrc}/*.scss`, { objectMode: true })

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
        await fsPromises.writeFile(`${scssDest}/${fileName}`, scssResult.css)
        const fileStats = await fsPromises.stat(`${scssDest}/${fileName}`)
        file.size = ui.convertFileSize(fileStats.size)
        file.dist = `${scssDest}/${fileName}`
        fileList.push(file)
      }
    }

    hideStatus || ui.endTask({ files: fileList, taskName: 'compileScss', timeStart })
  } catch (error) {
    console.error(error)
  }
}

export { compileScss }
