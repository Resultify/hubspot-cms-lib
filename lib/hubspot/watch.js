/** @module hubspot/watch */

import ora from 'ora'
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
    logger.setLogLevel(2)
    const spinner = ora('Starting watch process').start()
    try {
      await watch.watch(portalId, globals.THEME, globals.THEME_NAME, {
        mode: cmsMode,
        remove: true,
        disableInitial: true,
        notify: false,
        commandOptions: ''
      })
      spinner.succeed()
    } catch (error) {
      spinner.fail()
      console.error(error)
      process.exit(1)
    }
  } catch (error) {
    console.error(error)
    process.exitCode = 1
  }
}

export { watchHubspotTheme }
