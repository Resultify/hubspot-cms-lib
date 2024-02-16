import '../utils/check.js'
import { compileFieldsJs } from '../hubspot/fields.js'
import { themeName } from '../hubspot/theme.js'
import * as ui from '../utils/ui.js'
import chalk from 'chalk'

/**
 * #### Compile fields.js to fields.json
 * @async
 * @memberof Commands
 * @example
 * // run with node
 * echo "import '@resultify/hubspot-cms-lib/fields'" > fields.js
 * node fields.js
 *
 *
 * // run with npm by adding to package.json scripts:
 * "scripts": {
 *  "fields": "cmslib --fields",
 * }
 * or
 * "scripts": {
 *   "fields": "node -e 'import(`@resultify/hubspot-cms-lib/fields`)'"
 * }
 * npm run fields
 */
async function fields () {
  const timeStart = ui.startTaskGroup(`Compile fields.js for ${chalk.yellow(themeName)}`)
  await compileFieldsJs()
  ui.endTaskGroup({ taskName: `Compile fields.js for ${chalk.yellow(themeName)}`, timeStart })
}

export { fields }
