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
 * import { validate } from '@resultify/hubspot-cms-lib/validate'
 * validate()
 *
 * // or run with npm by adding to package.json scripts:
 * "scripts": {
 *   "validate": "node -e 'import(`@resultify/hubspot-cms-lib/validate`)'"
 * }
 */
async function validate () {
  const timeStart = ui.startTaskGroup(`Validate ${themeName}`)
  const hubAuthData = await loadAuthConfig(themeName)
  await marketplaceValidate(hubAuthData, themeName)
  ui.endTaskGroup({ taskName: `Validate ${themeName}`, timeStart })
}

export { validate }
