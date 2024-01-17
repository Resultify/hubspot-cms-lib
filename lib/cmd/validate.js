import '../utils/check.js'
import themeName from '../hubspot/theme.js'
import { marketplaceValidate } from '../hubspot/validate.js'
import { loadAuthConfig } from '../hubspot/auth/auth.js'
import * as ui from '../utils/ui.js'

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
  const timeStart = ui.startTaskGroup(`Validate ${themeName}`)
  const hubAuthData = await loadAuthConfig(themeName)
  await marketplaceValidate(hubAuthData, themeName)
  ui.endTaskGroup({ taskName: `Validate ${themeName}`, timeStart })
}

export { validate }
