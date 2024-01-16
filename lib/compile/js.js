/** @module compile/js */

import * as TYPES from '../types/types.js' // eslint-disable-line no-unused-vars
import fsPromises from 'fs/promises'
import { rollup } from 'rollup'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import replace from '@rollup/plugin-replace'
import { getFileList } from '../utils/fs.js'
import * as ui from '../utils/ui.js'
import { getThemeOptions } from '../utils/options.js'

/**
 * @ignore
 * @typedef {TYPES.THEME_OPTIONS} THEME_OPTIONS {@link THEME_OPTIONS}
 */

/**
 * #### Get Rollup input options
 * @private
 * @param {Object} input - rollup input path
 * @param {THEME_OPTIONS} options - theme options
 * @returns {Object} portal name|names
 */
function getRollupInputOptions (input, options) {
  let replaceVal = {
    preventAssignment: false
  }
  replaceVal = { ...replaceVal, ...options?.js?.replace }
  const externalConfig = options?.js?.external || []
  const inputOptions = {
    input,
    external: externalConfig,
    plugins: [
      nodeResolve(),
      replace(replaceVal)
    ]
  }
  return inputOptions
}

/**
 * #### Get Rollup output options
 * @private
 * @param {Object} output - rollup output path
 * @param {THEME_OPTIONS} options - theme options
 * @returns {Object} portal name|names
 */
function getRollupOutputOptions (output, options) {
  const globalsConfig = options?.js?.globals || {}
  const outputOptions = {
    file: output,
    format: 'iife',
    globals: globalsConfig
  }
  return outputOptions
}

/**
 * #### build Rollup bundle
 * @async
 * @private
 * @param {Object} inputOptions - rollup input options
 * @param {Object} outputOptions - rollup output options
 * @returns undefined
 */
async function build (inputOptions, outputOptions) {
  let bundle
  try {
    // create a bundle
    bundle = await rollup(inputOptions)
    await bundle.write(outputOptions)
  } catch (error) {
    console.error(error)
  }
  if (bundle) {
    await bundle.close()
  }
}

/**
 * #### Compile Js task
 * @async
 * @param {boolean} [hideStatus] - hide status messages
 * @returns undefined
 */
async function compileJs (hideStatus) {
  try {
    const timeStart = ui.startTask('compileJs')
    /**
     * ####
     * @type {THEME_OPTIONS}
     */
    const options = getThemeOptions()
    const jsSrc = `${options.vendorSrc}/js`
    const jsDest = `${options.vendorDest}/js`
    const fileList = []

    await fsPromises.mkdir(jsDest, { recursive: true })
    const files = await getFileList(`${jsSrc}/*.js`, { objectMode: true })

    if (files !== undefined) {
      for await (const file of files) {
        const inputOptions = getRollupInputOptions(file.path, options)
        const outputOptions = getRollupOutputOptions(`${jsDest}/${file.name}`, options)
        await build(inputOptions, outputOptions)

        const fileStats = await fsPromises.stat(`${jsDest}/${file.name}`)
        file.size = ui.convertFileSize(fileStats.size)
        file.dist = `${jsDest}/${file.name}`
        fileList.push(file)
      }
    }
    hideStatus || ui.endTask({ files: fileList, taskName: 'compileJs', timeStart })
  } catch (error) {
    console.error(error)
  }
}

export { compileJs }
