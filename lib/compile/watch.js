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
    chokidar.watch(`${options.vendorSrc}/css`, {
      ignored: (path, stats) => Boolean(stats?.isFile() && !path.endsWith('.css')),
      ignoreInitial: true,
      awaitWriteFinish: false
    }).on('all', (event, path) => {
      if (event === 'add' || event === 'change') {
        console.log(`${chalk.red(event)} ${path}`)
        compileCss(true)
      }
    }).on('error', error => console.error(`Watcher error: ${error}`))

    chokidar.watch(`${options.vendorSrc}/js`, {
      ignored: (path, stats) => Boolean(stats?.isFile() && !path.endsWith('.js')),
      ignoreInitial: true,
      awaitWriteFinish: false
    }).on('all', (event, path) => {
      if (event === 'add' || event === 'change') {
        console.log(`${chalk.red(event)} ${path}`)
        compileJs(true)
      }
    }).on('error', error => console.error(`Watcher error: ${error}`))

    chokidar.watch(`${options.vendorSrc}/scss`, {
      ignored: (path, stats) => Boolean(stats?.isFile() && !path.endsWith('.scss')),
      ignoreInitial: true
    }).on('all', (event, path) => {
      if (event === 'add' || event === 'change') {
        console.log(`${chalk.red(event)} ${path}`)
        compileScss(true)
      }
    }).on('error', error => console.error(`Watcher error: ${error}`))

    chokidar.watch(`${process.cwd()}/${options.themeFolder}`, {
      ignored: (path, stats) => Boolean(stats?.isFile() && !path.endsWith('fields.js')),
      ignoreInitial: true,
      awaitWriteFinish: false
    }).on('all', (event, path) => {
      if (event === 'add' || event === 'change') {
        console.log(`${chalk.red(event)} ${path}`)
        compileFieldsJs(path, true)
      }
    }).on('error', error => console.error(`Watcher error: ${error}`))

    chokidar.watch(`${process.cwd()}/${options.themeFolder}/partials`, {
      ignored: (path, stats) => Boolean(stats?.isFile() && !path.endsWith('.js')),
      ignoreInitial: true,
      awaitWriteFinish: false
    }).on('all', (event, path) => {
      if (event === 'add' || event === 'change') {
        console.log(`${chalk.red(event)} ${path}`)
        compileFieldsJs('', true)
      }
    }).on('error', error => console.error(`Watcher error: ${error}`))
  } catch (error) {
    console.error(error)
  }
}

export { watchVendor }
