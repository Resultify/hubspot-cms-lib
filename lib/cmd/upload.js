import '../utils/check.js'
import { themeName } from '../hubspot/theme.js'
import { loadAuthConfig } from '../hubspot/auth/auth.js'
import { uploadTheme } from '../hubspot/upload.js'
import { cleanVendorDestFolder } from '../compile/clean.js'
import { compileScss } from '../compile/sass.js'
import { compileCss } from '../compile/css.js'
import { compileJs } from '../compile/js.js'
import { compileFieldsJs } from '../hubspot/fields.js'
import * as ui from '../utils/ui.js'
import chalk from 'chalk'

/**
 * #### Upload theme to HUBSPOT cms portall
 * @async
 * @memberof Commands
 * @example
 * // run with node
 * echo "import '@resultify/hubspot-cms-lib/upload'" > upload.js
 * node upload.js
 *
 *
 * // run with npm by adding to package.json scripts:
 * "scripts": {
 *  "upload": "cmslib --upload",
 * }
 * or
 * "scripts": {
 *   "upload": "node -e 'import(`@resultify/hubspot-cms-lib/upload`)'"
 * }
 * npm run upload
 */
async function upload () {
  const timeStart = ui.startTaskGroup(`Upload ${chalk.yellow(themeName)}`)
  const hubAuthData = await loadAuthConfig()
  await cleanVendorDestFolder()
  await compileScss()
  await compileCss()
  await compileJs()
  await compileFieldsJs()
  await uploadTheme(hubAuthData, themeName)
  ui.endTaskGroup({ taskName: `Upload ${chalk.yellow(themeName)}`, timeStart })
}

export { upload }
