import '../utils/check.js'
import { themeName } from '../hubspot/theme.js'
import { fetch } from '../hubspot/fetch.js'
import { loadAuthConfig } from '../hubspot/auth/auth.js'
import * as ui from '../utils/ui.js'

/**
 * #### Fetch all theme files
 * @async
 * @memberof Commands
 * @example
 * // run with node
 * echo "import '@resultify/hubspot-cms-lib/fetch'" > fetch.js
 * node fetch.js
 *
 *
 * // run with npm by adding to package.json scripts:
 * "scripts": {
 *  "fetch": "cmslib --fetch",
 * }
 * or
 * "scripts": {
 *   "fetch": "node -e 'import(`@resultify/hubspot-cms-lib/fetch`)'"
 * }
 * npm run fetch
 */
async function hubspotFetchAll () {
  const timeStart = ui.startTaskGroup(`Fetch all from ${themeName}`)
  const hubAuthData = await loadAuthConfig(themeName)
  await fetch(hubAuthData, themeName)
  ui.endTaskGroup({ taskName: `Fetch all from ${themeName}`, timeStart })
}

export { hubspotFetchAll }
