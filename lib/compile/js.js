/** @module lib/rollup */

import fsPromises from 'fs/promises'
import { rollup } from 'rollup'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import replace from '@rollup/plugin-replace'
import { globals } from '../config/globals.js'
import * as utils from '../utils/ui.js'
import { getFileList } from '../utils/fs.js'

/**
 * @summary Compile Js task
 * @async
 * @param {THEME_BUILD_OPTIONS} [opt] - task options
 * @returns undefined
 */
async function compileJs (opt) {
  try {
    const hideStatus = opt?.hideStatus

    const timeStart = utils.startTask('compileJs')
    const fileList = []

    let replaceVal = {
      preventAssignment: false,
      'process.env.NODE_ENV': process.env.NODE_ENV
    }
    replaceVal = { ...replaceVal, ...opt?.config?.js?.replace }
    await fsPromises.mkdir(globals.JS_DIST, { recursive: true })
    const files = await getFileList(`${globals.JS_SRC}/*.js`, { objectMode: true })

    if (files !== undefined) {
      for await (const file of files) {
        /**
         * @type {Array<string>}
         */
        const externalInputOptions = []
        const inputOptions = {
          input: file.path,
          external: externalInputOptions,
          plugins: [
            nodeResolve(),
            replace(replaceVal)
          ]
        }
        const externalConfig = opt?.config?.js?.external || []
        inputOptions.external = [...inputOptions.external, ...externalConfig]

        const outputOptions = {
          file: `${globals.JS_DIST}/${file.name}`,
          format: 'iife',
          globals: {}
        }
        outputOptions.globals = { ...outputOptions.globals, ...opt?.config?.js?.globals }
        const bundle = await rollup(inputOptions)
        // @ts-ignore
        await bundle.write(outputOptions)

        const fileStats = await fsPromises.stat(`${globals.JS_DIST}/${file.name}`)

        file.size = utils.convertFileSize(fileStats.size)
        file.dist = `${globals.JS_DIST}/${file.name}`
        fileList.push(file)
      }
    }
    hideStatus || utils.endTask({ files: fileList, taskName: 'compileJs', timeStart })
  } catch (error) {
    console.error(error)
  }
}

export { compileJs }
