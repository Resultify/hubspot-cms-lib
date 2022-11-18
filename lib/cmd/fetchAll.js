import { checkNode, checkPackageThemeConsistent } from '../utils/check.js'
import { fetchAll } from '../hubspot/fetch.js'
import { getAuthConfig } from '../hubspot/auth.js'
import { globals } from '../config/globals.js'
import * as utils from '../utils/ui.js'
import { confirmThemeName } from '../hubspot/helpers.js'
checkNode()
checkPackageThemeConsistent()

/**
 * @summary Fetch all theme files from HUBSPOT cms portall
 * @async
 * @memberof Theme_Commands
 * @returns undefined
 * @example
 * node build/fetchAll.js
 */
async function hubspotFetchAll () {
  await confirmThemeName()
  const hubAuth = await getAuthConfig()
  const timeStart = utils.startTaskGroup(`Fetch all from ${globals.THEME_NAME}`)
  await fetchAll(hubAuth)
  utils.endTaskGroup({ taskName: `Fetch all from ${globals.THEME_NAME}`, timeStart })
}

export { hubspotFetchAll }
