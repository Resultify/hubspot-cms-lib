import '../utils/check.js'
import { themeName } from '../hubspot/theme.js'
import { loadAuthConfig } from '../hubspot/auth/auth.js'
import { ciUploadTheme } from '../hubspot/upload.js'
import { cleanVendorDestFolder } from '../compile/clean.js'
import { compileScss } from '../compile/sass.js'
import { compileCss } from '../compile/css.js'
import { compileJs } from '../compile/js.js'
import { compileFieldsJs } from '../hubspot/fields.js'
import * as ui from '../utils/ui.js'
import chalk from 'chalk'

/**
 * #### CI Upload theme to HUBSPOT cms portall
 * @async
 * @memberof Commands
 * @example
 * // run with node
 * echo "import '@resultify/hubspot-cms-lib/ciUpload'" > ciUpload.js
 * node ciUpload.js
 *
 *
 * // run with npm by adding to package.json scripts:
 * "scripts": {
 *  "ciUpload": "cmslib --ciUpload",
 * }
 * or
 * "scripts": {
 *   "ciUpload": "node -e 'import(`@resultify/hubspot-cms-lib/ciUpload`)'"
 * }
 * npm run ciUpload
 */
async function ciUpload () {
  const timeStart = ui.startTaskGroup(`CI upload ${chalk.yellow(themeName)}`)
  const hubAuthData = await loadAuthConfig()
  await cleanVendorDestFolder()
  await compileScss()
  await compileCss()
  await compileJs()
  await compileFieldsJs()
  await ciUploadTheme(hubAuthData, themeName)
  ui.endTaskGroup({ taskName: `CI upload ${chalk.yellow(themeName)}`, timeStart })
}

export { ciUpload }
