import '../utils/check.js'
import themeName from '../hubspot/theme.js'
import { fetchHubDb, uploadHubDb } from '../hubspot/hubdb/hubdb.js'
import { loadAuthConfig } from '../hubspot/auth/auth.js'
import * as ui from '../utils/ui.js'

/**
 * #### Fetch HubDB table/s
 * @async
 * @memberof Commands
 * @example
 * import { fetchDb } from '@resultify/hubspot-cms-lib/hubdb.js'
 * fetchDb()
 *
 * // or run with npm by adding to package.json scripts:
 * "scripts": {
 *   "fetchDb": "node -e 'import(`@resultify/hubspot-cms-lib/fetchDb`)'"
 * }
 */
async function fetchDb () {
  const timeStart = ui.startTaskGroup('Fetch HubDB')
  const hubAuthData = await loadAuthConfig(themeName)
  await fetchHubDb(hubAuthData)
  ui.endTaskGroup({ taskName: 'Fetch HubDB', timeStart })
}

/**
 * #### Upload HubDB table/s
 * @async
 * @memberof Commands
 * @example
 * import { uploadDb } from '@resultify/hubspot-cms-lib/hubdb.js'
 * uploadDb()
 *
 * // or run with npm by adding to package.json scripts:
 * "scripts": {
 *   "uploadDb": "node -e 'import(`@resultify/hubspot-cms-lib/uploadDb`)'"
 * }
 */
async function uploadDb () {
  const timeStart = ui.startTaskGroup('Upload HubDB')
  const hubAuthData = await loadAuthConfig(themeName)
  await uploadHubDb(hubAuthData)
  ui.endTaskGroup({ taskName: 'Upload HubDB', timeStart })
}

export { fetchDb, uploadDb }
