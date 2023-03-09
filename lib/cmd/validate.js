import { checkNode, checkPackageThemeConsistent } from '../utils/check.js'
import { marketplaceValidate } from '../hubspot/marketplace-validate.js'
import { globals } from '../config/globals.js'
import { getAuthConfig } from '../hubspot/auth.js'
import { confirmThemeName } from '../hubspot/helpers.js'
import * as utils from '../utils/ui.js'
checkNode()
checkPackageThemeConsistent()

/**
 * @summary Theme Validation
 * @async
 * @memberof Theme_Commands
 * @returns undefined
 * @example
 * node build/validate.js
 */
async function validate () {
  await confirmThemeName()
  const hubAuth = await getAuthConfig()
  const timeStart = utils.startTaskGroup(`Validation for ${globals.THEME_NAME}`)
  await marketplaceValidate(hubAuth)
  utils.endTaskGroup({ taskName: `Validation for ${globals.THEME_NAME}`, timeStart })
}

export { validate }
