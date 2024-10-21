import '../utils/check.js'
import { loadAuthConfig } from '../hubspot/auth/auth.js'
import { uploadSelectedModules } from '../hubspot/upload.js'
import * as ui from '../utils/ui.js'

/**
 * #### Upload standalone modules to the root of HUBSPOT cms portall
 * @async
 * @memberof Commands
 * @example
 * // run with node
 * echo "import '@resultify/hubspot-cms-lib/uploadModule'" > uploadModule.js
 * node uploadModule.js
 *
 *
 * // run with npm by adding to package.json scripts:
 * "scripts": {
 *  "uploadModule": "cmslib --uploadModule",
 * }
 * or
 * "scripts": {
 *   "uploadModule": "node -e 'import(`@resultify/hubspot-cms-lib/uploadModule`)'"
 * }
 * npm run uploadModule
 */
async function uploadModule () {
  const timeStart = ui.startTaskGroup('Upload modules to Design Manager root')
  const hubAuthData = await loadAuthConfig()
  await uploadSelectedModules(hubAuthData)
  ui.endTaskGroup({ taskName: 'Upload modules to Design Manager root', timeStart })
}

export { uploadModule }
