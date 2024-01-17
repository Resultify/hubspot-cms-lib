/** @module hubspot/watch */

import * as TYPES from '../types/types.js' // eslint-disable-line no-unused-vars
import chalk from 'chalk'
import watch from '@hubspot/cli-lib/lib/watch.js'
import logger from '@hubspot/cli-lib/logger.js'
import { getThemeOptions } from '../utils/options.js'
import { throwErrorIfMissingScope } from './auth/scopes.js'

/**
 * @ignore
 * @typedef {TYPES.HUBSPOT_AUTH_CONFIG} HUBSPOT_AUTH_CONFIG {@link HUBSPOT_AUTH_CONFIG}
 */

let cmsMode = 'publish'
if (process.env.HUB_MODE === 'draft') {
  cmsMode = 'draft'
}

/**
 * #### watch and upload all HubSpot theme files
 * @async
 * @param {HUBSPOT_AUTH_CONFIG} config - hubspot authentication config
 * @param {string} themeName - theme name
 * @returns undefined
 */
async function watchHubspotTheme (config, themeName) {
  try {
    const cmslibOptions = getThemeOptions()
    const src = `${process.cwd()}/${cmslibOptions.themeFolder}`
    const dest = themeName
    const portalId = config.portals[0].portalId
    throwErrorIfMissingScope(config, 'design_manager')
    logger.setLogLevel(4)
    const watcher = await watch.watch(portalId, src, dest, {
      mode: cmsMode,
      remove: true,
      disableInitial: true,
      notify: false,
      commandOptions: '',
      filePaths: ''
    })
    watcher
      .on('ready', () => {
        console.log(`\n${chalk.green('●')} Watcher is ready and watching ${chalk.green(`${themeName}/*`)}\nAny changes detected will be automatically uploaded and overwrite the current version in the developer file system.`)
      })
      .on('add', (/** @type {String} */ path) => {
        console.debug = () => {}
        console.log(`${chalk.yellow('──>')} Uploaded file ${chalk.green(path)}`)
      })
      .on('change', (/** @type {String} */ path) => {
        console.debug = () => {}
        console.log(`${chalk.yellow('──>')} Uploaded file ${chalk.green(path)}`)
      })
      .on('unlink', (/** @type {String} */ path) => {
        console.debug = () => {}
        console.log(`${chalk.red('●──')} Deleted file ${chalk.green(path)}`)
      })
      .on('unlinkDir', (/** @type {String} */ path) => {
        console.debug = () => {}
        console.log(`${chalk.red('●──')} Deleted folder ${chalk.green(path)}`)
      })
  } catch (error) {
    console.error(error)
    process.exit(1)
  }
}

export { watchHubspotTheme }
