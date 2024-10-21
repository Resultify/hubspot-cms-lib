import '../utils/check.js'
import * as ui from '../utils/ui.js'
import { compileModule } from '../compile/module.js'

/**
 * #### Build/compile standalone hubspot module
 * @async
 * @memberof Commands
 * @example
 * // run with node
 * echo "import '@resultify/hubspot-cms-lib/buildModule'" > buildModule.js
 * node buildModule.js
 *
 *
 * // run with npm by adding to package.json scripts:
 * "scripts": {
 *  "buildModule": "cmslib --buildModule",
 * }
 * or
 * "scripts": {
 *   "buildModule": "node -e 'import(`@resultify/hubspot-cms-lib/buildModule`)'"
 * }
 * npm run buildModule
 */
async function buildModule () {
  const timeStart = ui.startTaskGroup('Build standalone module')
  await compileModule()
  ui.endTaskGroup({ taskName: 'Build standalone module', timeStart })
}

export { buildModule }
