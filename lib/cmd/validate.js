import '../utils/check.js'
import { themeName } from '../hubspot/theme.js'
import { marketplaceValidate } from '../hubspot/validate.js'
import { loadAuthConfig } from '../hubspot/auth/auth.js'
import * as ui from '../utils/ui.js'
import chalk from 'chalk'

/**
 * #### Theme Validation
 * @async
 * @memberof Commands
 * @example
 * // run with node
 * echo "import '@resultify/hubspot-cms-lib/validate'" > validate.js
 * node validate.js
 *
 *
 * // run with npm by adding to package.json scripts:
 * "scripts": {
 *  "validate": "cmslib --validate",
 * }
 * or
 * "scripts": {
 *   "validate": "node -e 'import(`@resultify/hubspot-cms-lib/validate`)'"
 * }
 * npm run validate
 */
async function validate () {
  const timeStart = ui.startTaskGroup(`Validate ${chalk.yellow(themeName)}`)
  const hubAuthData = await loadAuthConfig()
  await marketplaceValidate(hubAuthData, themeName)
  ui.endTaskGroup({ taskName: `Validate ${chalk.yellow(themeName)}`, timeStart })
}

export { validate }
