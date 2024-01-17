import '../utils/check.js'
import * as ui from '../utils/ui.js'
import { cleanVendorDestFolder } from '../compile/clean.js'
import { compileScss } from '../compile/sass.js'
import { compileCss } from '../compile/css.js'
import { compileJs } from '../compile/js.js'
import { compileFieldsJs } from '../hubspot/fields.js'

/**
 * #### Build/compile all src CSS/JS/SCSS files
 * @async
 * @memberof Commands
 * @example
 * // run with node
 * echo "import '@resultify/hubspot-cms-lib/build'" > build.js
 * node build.js
 *
 *
 * // run with npm by adding to package.json scripts:
 * "scripts": {
 *  "build": "cmslib --build",
 * }
 * or
 * "scripts": {
 *   "build": "node -e 'import(`@resultify/hubspot-cms-lib/build`)'"
 * }
 * npm run build
 */
async function build () {
  const timeStart = ui.startTaskGroup('Build')
  await cleanVendorDestFolder()
  await compileScss()
  await compileCss()
  await compileJs()
  await compileFieldsJs()
  ui.endTaskGroup({ taskName: 'Build', timeStart })
}

export { build }
