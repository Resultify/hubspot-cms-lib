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
 * // run with node
 * echo "import '@resultify/hubspot-cms-lib/fetchDb'" > fetchDb.js
 * node fetchDb.js
 *
 *
 * // run with npm by adding to package.json scripts:
 * "scripts": {
 *  "fetchDb": "cmslib --fetchDb",
 * }
 * or
 * "scripts": {
 *   "fetchDb": "node -e 'import(`@resultify/hubspot-cms-lib/fetchDb`)'"
 * }
 * npm run fetchDb
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
 * // run with node
 * echo "import '@resultify/hubspot-cms-lib/uploadDb'" > uploadDb.js
 * node uploadDb.js
 *
 *
 * // run with npm by adding to package.json scripts:
 * "scripts": {
 *  "uploadDb": "cmslib --uploadDb",
 * }
 * or
 * "scripts": {
 *   "uploadDb": "node -e 'import(`@resultify/hubspot-cms-lib/uploadDb`)'"
 * }
 * npm run uploadDb
 */
async function uploadDb () {
  const timeStart = ui.startTaskGroup('Upload HubDB')
  const hubAuthData = await loadAuthConfig(themeName)
  await uploadHubDb(hubAuthData)
  ui.endTaskGroup({ taskName: 'Upload HubDB', timeStart })
}

export { fetchDb, uploadDb }
