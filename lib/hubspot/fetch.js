/** @module hubspot/fetch */
import * as TYPES from '../types/types.js' // eslint-disable-line no-unused-vars
import { downloadFileOrFolder } from '@hubspot/cli-lib/fileMapper.js'
import logger from '@hubspot/cli-lib/logger.js'
import * as ui from '../utils/ui.js'
import { savedConsoleDebug } from '../utils/console.js'
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
const cmslibOptions = getThemeOptions()

/**
 * #### fetch all HubSpot theme Modules
 * @async
 * @param {HUBSPOT_AUTH_CONFIG} config - hubspot authentication config
 * @param {string} themeName - theme name
 * @returns undefined
 */
async function fetchModules (config, themeName) {
  try {
    const timeStart = ui.startTask('fetchModules')
    const src = `${themeName}/modules`
    const dest = `${process.cwd()}/${cmslibOptions.themeFolder}/modules`
    const accountId = config.portals[0].portalId
    const mode = cmsMode
    const options = {
      overwrite: true
    }
    throwErrorIfMissingScope(config, 'design_manager')
    logger.setLogLevel(2)
    console.debug = () => {}
    await downloadFileOrFolder({ accountId, src, dest, mode, options })
    console.debug = savedConsoleDebug

    ui.endTask({ taskName: 'fetchModules', timeStart })
  } catch (error) {
    console.error(error)
    process.exit(1)
  }
}

/**
 * #### fetch all HubSpot theme files
 * @async
 * @param {HUBSPOT_AUTH_CONFIG} config - hubspot authentication config
 * @param {string} themeName - theme name
 * @returns undefined
 */
async function fetch (config, themeName) {
  try {
    const timeStart = ui.startTask('fetch')
    const src = themeName
    const dest = `${process.cwd()}/${cmslibOptions.themeFolder}`
    const accountId = config.portals[0].portalId
    const mode = cmsMode
    const options = {
      overwrite: true
    }
    throwErrorIfMissingScope(config, 'design_manager')
    logger.setLogLevel(2)
    console.debug = () => {}
    await downloadFileOrFolder({ accountId, src, dest, mode, options })
    console.debug = savedConsoleDebug

    ui.endTask({ taskName: 'fetch', timeStart })
  } catch (error) {
    console.error(error)
    process.exit(1)
  }
}

export { fetch, fetchModules }
