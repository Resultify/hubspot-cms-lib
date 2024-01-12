/** @module lib/css */

import fsPromises from 'fs/promises'
import postcss from 'postcss'
import cssimport from 'postcss-import'
import { getFileList } from '../utils/fs.js'
import * as ui from '../utils/ui.js'
import { getThemeOptions } from '../utils/options.js'

/**
 * #### Compile Css
 * @async
 * @param {boolean} [hideStatus] - hide status messages
 * @returns undefined
 */
async function compileCss (hideStatus) {
  try {
    const timeStart = ui.startTask('compileCss')
    const options = getThemeOptions()
    const cssSrc = `${options.vendorSrc}/css`
    const cssDest = `${options.vendorDest}/css`
    const fileList = []

    await fsPromises.mkdir(cssDest, { recursive: true })
    const files = await getFileList(`${cssSrc}/*.css`, { objectMode: true })
    if (files !== undefined) {
      for await (const file of files) {
        const css = await fsPromises.readFile(file.path)
        const postcssResult = await postcss().use(cssimport()).process(css, {
          from: file.path,
          to: `${cssDest}/${file.name}`
        })
        await fsPromises.writeFile(`${cssDest}/${file.name}`, postcssResult.css)

        const fileStats = await fsPromises.stat(`${cssDest}/${file.name}`)
        file.size = ui.convertFileSize(fileStats.size)
        file.dist = `${cssDest}/${file.name}`
        fileList.push(file)
      }
    }
    hideStatus || ui.endTask({ files: fileList, taskName: 'compileCss', timeStart })
  } catch (error) {
    console.error(error)
  }
}

export { compileCss }
