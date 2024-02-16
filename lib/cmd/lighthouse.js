import '../utils/check.js'
import { themeName } from '../hubspot/theme.js'
import { lighthouseScore } from '../hubspot/lighthouse.js'
import { loadAuthConfig } from '../hubspot/auth/auth.js'
import * as ui from '../utils/ui.js'
import chalk from 'chalk'

/**
 * #### Get Lighthouse Score for theme
 * @async
 * @memberof Commands
 * @example
 * // run with node
 * echo "import '@resultify/hubspot-cms-lib/lighthouse'" > lighthouse.js
 * node lighthouse.js
 *
 *
 * // run with npm by adding to package.json scripts:
 * "scripts": {
 *  "lighthouse": "cmslib --lighthouse",
 * }
 * or
 * "scripts": {
 *   "lighthouse": "node -e 'import(`@resultify/hubspot-cms-lib/lighthouse`)'"
 * }
 * npm run lighthouse
 */
async function lighthouse () {
  const timeStart = ui.startTaskGroup(`Lighthouse tests for ${chalk.yellow(themeName)}`)
  const hubAuthData = await loadAuthConfig(themeName)
  await lighthouseScore(hubAuthData, themeName)
  ui.endTaskGroup({ taskName: `Lighthouse tests for ${chalk.yellow(themeName)}`, timeStart })
}

export { lighthouse }
