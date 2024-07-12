import '../utils/check.js'
import { themeName } from '../hubspot/theme.js'
import { loadAuthConfig } from '../hubspot/auth/auth.js'
import { cleanUploadTheme } from '../hubspot/upload.js'
import { cleanVendorDestFolder } from '../compile/clean.js'
import { compileScss } from '../compile/sass.js'
import { compileCss } from '../compile/css.js'
import { compileJs } from '../compile/js.js'
import { compileFieldsJs } from '../hubspot/fields.js'
import * as ui from '../utils/ui.js'
import chalk from 'chalk'

/**
 * #### Clean Upload theme to HUBSPOT cms portall
 * @async
 * @memberof Commands
 * @example
 * // run with node
 * echo "import '@resultify/hubspot-cms-lib/cleanUpload'" > cleanUpload.js
 * node cleanUpload.js
 *
 *
 * // run with npm by adding to package.json scripts:
 * "scripts": {
 *  "cleanUpload": "cmslib --cleanUpload",
 * }
 * or
 * "scripts": {
 *   "cleanUpload": "node -e 'import(`@resultify/hubspot-cms-lib/cleanUpload`)'"
 * }
 * npm run cleanUpload
 */
async function cleanUpload () {
  const timeStart = ui.startTaskGroup(`Clean upload ${chalk.yellow(themeName)}`)
  const hubAuthData = await loadAuthConfig()
  await cleanVendorDestFolder()
  await compileScss()
  await compileCss()
  await compileJs()
  await compileFieldsJs()
  await cleanUploadTheme(hubAuthData, themeName)
  ui.endTaskGroup({ taskName: `Clean upload ${chalk.yellow(themeName)}`, timeStart })
}

export { cleanUpload }
