import '../utils/check.js'
import themeName from '../hubspot/theme.js'
import { fetchModules } from '../hubspot/fetch.js'
import { loadAuthConfig } from '../hubspot/auth/auth.js'
import * as ui from '../utils/ui.js'

/**
 * #### Fetch only modules from HubSpot theme
 * @async
 * @memberof Commands
 * @example
 * import { fetchModules } from '@resultify/hubspot-cms-lib/fetchModules'
 * fetchModules()
 *
 * // or run with npm by adding to package.json scripts:
 * "scripts": {
 *   "fetchModules": "node -e 'import(`@resultify/hubspot-cms-lib/fetchModules`)'"
 * }
 */
async function hubspotFetchModules () {
  const timeStart = ui.startTaskGroup(`Fetch modules from ${themeName}`)
  const hubAuthData = await loadAuthConfig(themeName)
  await fetchModules(hubAuthData, themeName)
  ui.endTaskGroup({ taskName: `Fetch modules from ${themeName}`, timeStart })
}

export { hubspotFetchModules }
