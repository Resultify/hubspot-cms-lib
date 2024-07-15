/** @module hubspot/fetch */
/// <reference path="../types/types.js" />
import { downloadFileOrFolder } from '@hubspot/local-dev-lib/fileMapper'
import { setLogLevel, LOG_LEVEL } from '@hubspot/local-dev-lib/logger'
import * as ui from '../utils/ui.js'
import { getThemeOptions } from '../utils/options.js'
import { throwErrorIfMissingScope } from './auth/scopes.js'

/**
 * @type {"draft" | "publish"}
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
    setLogLevel(LOG_LEVEL.LOG)
    await downloadFileOrFolder(accountId, src, dest, mode, options)

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
    setLogLevel(LOG_LEVEL.LOG)
    await downloadFileOrFolder(accountId, src, dest, mode, options)

    ui.endTask({ taskName: 'fetch', timeStart })
  } catch (error) {
    console.error(error)
    process.exit(1)
  }
}

export { fetch, fetchModules }
