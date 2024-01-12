/** @module compile/watch */

import chokidar from 'chokidar'
import chalk from 'chalk'
import { compileCss } from './css.js'
import { compileScss } from './sass.js'
import { compileJs } from './js.js'
import { compileFieldsJs } from '../hubspot/fields.js'
import { getThemeOptions } from '../utils/options.js'

/**
 * #### Watch task
 * @async
 * @returns undefined
 */
async function watchVendor () {
  try {
    const options = getThemeOptions()
    chokidar.watch(`${options.vendorSrc}/css/**/*.css`, { ignoreInitial: true, awaitWriteFinish: false }).on('all', (event, path) => {
      console.log(`${chalk.red(event)} ${path}`)
      compileCss(true)
    })

    chokidar.watch(`${options.vendorSrc}/js/**/*.js`, { ignoreInitial: true, awaitWriteFinish: false }).on('all', (event, path) => {
      console.log(`${chalk.red(event)} ${path}`)
      compileJs(true)
    })

    chokidar.watch(`${options.vendorSrc}/scss/**/*.scss`, { ignoreInitial: true }).on('all', (event, path) => {
      console.log(`${chalk.red(event)} ${path}`)
      compileScss(true)
    })

    chokidar.watch(`${process.cwd()}/${options.themeFolder}/**/fields.js`, { ignoreInitial: true, awaitWriteFinish: false }).on('all', (event, path) => {
      console.log(`${chalk.red(event)} ${path}`)
      compileFieldsJs(path, true)
    })
  } catch (error) {
    console.error(error)
  }
}

export { watchVendor }
