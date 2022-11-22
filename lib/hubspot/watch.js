/** @module hubspot/watch */

import chalk from 'chalk'
import watch from '@hubspot/cli-lib/lib/watch.js'
import logger from '@hubspot/cli-lib/logger.js'
import { globals } from '../config/globals.js'
import { loadAuthConfig } from './auth.js'

let cmsMode = 'publish'
if (process.env.MODE === 'draft') {
  cmsMode = 'draft'
}

/**
 * @summary watch and upload all HubSpot theme files
 * @async
 * @param {THEME_HUB_AUTH_CONFIG|string} customAuthConfig - Rusultify custom Hubspot authentication
 * @returns undefined
 */
async function watchHubspotTheme (customAuthConfig) {
  try {
    const hubconf = await loadAuthConfig(customAuthConfig)
    const portalId = hubconf.portals[0].portalId
    logger.setLogLevel(4)
    const watcher = await watch.watch(portalId, globals.THEME, globals.THEME_NAME, {
      mode: cmsMode,
      remove: true,
      disableInitial: true,
      notify: false,
      commandOptions: ''
    })
    watcher
      .on('ready', () => console.log(`\n${chalk.green('●')} Watcher is ready and watching ${globals.THEME} - Any changes detected will be automatically uploaded and overwrite the current version in the developer file system.`))
      .on('add', path => console.log(`${chalk.yellow('──●')} Uploaded file ${chalk.green(path)}`))
      .on('change', path => console.log(`${chalk.yellow('──●')} Uploaded file ${chalk.green(path)}`))
      .on('unlink', path => console.log(`${chalk.red('●──')} Deleted file ${chalk.green(path)}`))
      .on('unlinkDir', path => console.log(`${chalk.red('●──')} Deleted folder ${chalk.green(path)}`))
  } catch (error) {
    console.error(error)
    process.exit(1)
  }
}

export { watchHubspotTheme }
