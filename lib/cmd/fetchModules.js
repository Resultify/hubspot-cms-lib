import { checkNode, checkPackageThemeConsistent } from '../utils/check.js'
import { fetchModules } from '../hubspot/fetch.js'
import { globals } from '../config/globals.js'
import { getAuthConfig } from '../hubspot/auth.js'
import { confirmThemeName } from '../hubspot/helpers.js'
import * as utils from '../utils/ui.js'
checkNode()
checkPackageThemeConsistent()

/**
 * #### Fetch Modules from HUBSPOT cms portall
 * @async
 * @memberof Theme_Commands
 * @returns undefined
 * @example
 * node build/fetchModules.js
 */
async function hubspotFetchModules () {
  await confirmThemeName()
  const hubAuth = await getAuthConfig()
  const timeStart = utils.startTaskGroup(`Fetch modules from ${globals.THEME_NAME}`)
  await fetchModules(hubAuth)
  utils.endTaskGroup({ taskName: `Fetch modules from ${globals.THEME_NAME}`, timeStart })
}

export { hubspotFetchModules }
