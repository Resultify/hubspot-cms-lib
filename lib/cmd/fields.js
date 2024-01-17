import '../utils/check.js'
import { compileFieldsJs } from '../hubspot/fields.js'
import * as ui from '../utils/ui.js'

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
  const timeStart = ui.startTaskGroup('Compile fields.js')
  await compileFieldsJs()
  ui.endTaskGroup({ taskName: 'Compile fields.js', timeStart })
}

export { fields }
