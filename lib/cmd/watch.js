import '../utils/check.js'
import themeName from '../hubspot/theme.js'
import { watchVendor } from '../compile/watch.js'
import { watchHubspotTheme } from '../hubspot/watch.js'
import { loadAuthConfig } from '../hubspot/auth/auth.js'

/**
 * #### Run watch process with css/js/scss compilation
 * @async
 * @memberof Theme_Commands
 * @returns undefined
 */
async function watch () {
  const hubAuthData = await loadAuthConfig(themeName)
  await watchVendor()
  await watchHubspotTheme(hubAuthData, themeName)
}

export { watch }
