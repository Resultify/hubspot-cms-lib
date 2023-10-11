/** @module lib/watch */

import * as T from '../config/types.js' // eslint-disable-line
import chokidar from 'chokidar'
import chalk from 'chalk'
import { compileCss } from './css.js'
import { compileScss } from './sass.js'
import { compileJs } from './js.js'
import { globals } from '../config/globals.js'
import { compileFieldsJs } from '../hubspot/fields.js'

/**
 * #### Watch task
 * @async
 * @param {T.THEME_BUILD_OPTIONS} [opt] - task options
 * @returns undefined
 */
async function watchSrc (opt) {
  try {
    chokidar.watch(`${globals.CSS_SRC}/**/*.css`, { ignoreInitial: true, awaitWriteFinish: false }).on('all', (event, path) => {
      console.log(`${chalk.red(event)} ${path}`)
      compileCss({ config: opt?.config, hideStatus: true })
    })

    chokidar.watch(`${globals.JS_SRC}/**/*.js`, { ignoreInitial: true, awaitWriteFinish: false }).on('all', (event, path) => {
      console.log(`${chalk.red(event)} ${path}`)
      compileJs({ config: opt?.config, hideStatus: true })
    })

    chokidar.watch(`${globals.SCSS_SRC}/**/*.scss`, { ignoreInitial: true }).on('all', (event, path) => {
      console.log(`${chalk.red(event)} ${path}`)
      compileScss({ config: opt?.config, hideStatus: true })
    })

    chokidar.watch(globals.FIELDSJS_SRC, { ignoreInitial: true, awaitWriteFinish: false }).on('all', (event, path) => {
      console.log(`${chalk.red(event)} ${path}`)
      compileFieldsJs({ hideStatus: true }, path)
    })
  } catch (error) {
    console.error(error)
  }
}

export { watchSrc }
