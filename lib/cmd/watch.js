import { checkNode, checkPackageThemeConsistent } from '../utils/check.js'
import { watchSrc } from '../compile/watch.js'
import { getAuthConfig } from '../hubspot/auth.js'
import { watchHubspotTheme } from '../hubspot/watch.js'
import { confirmThemeName } from '../hubspot/helpers.js'
checkNode()
checkPackageThemeConsistent()

/**
 * @summary Run watch process with css/js/scss compilation
 * @async
 * @memberof Theme_Commands
 * @param {object} [opt] - local theme based config
 * @returns undefined
 * @example
 * node build/watch.js
 */
async function watch (opt) {
  await confirmThemeName()
  const hubAuth = await getAuthConfig()
  await watchSrc(opt)
  await watchHubspotTheme(hubAuth)
}

export { watch }
