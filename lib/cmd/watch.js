import '../utils/check.js'
import themeName from '../hubspot/theme.js'
import { watchVendor } from '../compile/watch.js'
import { watchHubspotTheme } from '../hubspot/watch.js'
import { loadAuthConfig } from '../hubspot/auth/auth.js'

/**
 * #### Run watch process with css/js/scss compilation
 * @async
 * @memberof Commands
 * @example
 * // run with node
 * echo "import '@resultify/hubspot-cms-lib/watch'" > watch.js
 * node watch.js
 *
 *
 * // run with npm by adding to package.json scripts:
 * "scripts": {
 *  "watch": "cmslib --watch",
 * }
 * or
 * "scripts": {
 *   "watch": "node -e 'import(`@resultify/hubspot-cms-lib/watch`)'"
 * }
 * npm run watch
 */
async function watch () {
  const hubAuthData = await loadAuthConfig(themeName)
  await watchVendor()
  await watchHubspotTheme(hubAuthData, themeName)
}

export { watch }
