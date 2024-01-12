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
 * import { watch } from '@resultify/hubspot-cms-lib/watch'
 * watch()
 *
 * // or run with npm by adding to package.json scripts:
 * "scripts": {
 *   "watch": "node -e 'import(`@resultify/hubspot-cms-lib/watch`)'"
 * }
 */
async function watch () {
  const hubAuthData = await loadAuthConfig(themeName)
  await watchVendor()
  await watchHubspotTheme(hubAuthData, themeName)
}

export { watch }
