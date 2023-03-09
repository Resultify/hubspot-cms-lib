import * as T from '../config/types.js' // eslint-disable-line
import { checkNode, checkPackageThemeConsistent } from '../utils/check.js'
import { lighthouseScore } from '../hubspot/lighthouse-score.js'
// import { globals } from '../config/globals.js'
import { getAuthConfig } from '../hubspot/auth.js'
import { confirmThemeName } from '../hubspot/helpers.js'
import * as utils from '../utils/ui.js'
checkNode()
checkPackageThemeConsistent()

/**
 * @summary Get Lighthouse Score for theme
 * @async
 * @memberof Theme_Commands
 * @param {T.THEME_BUILD_OPTIONS} opt - local theme based config
 * @returns undefined
 * @example
 * node build/lighthouseScore.js
 */
async function lighthouse (opt) {
  await confirmThemeName()
  const hubAuth = await getAuthConfig()
  const timeStart = utils.startTaskGroup('Lighthouse')
  await lighthouseScore(hubAuth, opt)
  utils.endTaskGroup({ taskName: 'Lighthouse', timeStart })
}

export { lighthouse }
