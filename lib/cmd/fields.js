
import { checkNode, checkPackageThemeConsistent } from '../utils/check.js'
import { compileFieldsJs } from '../hubspot/fields.js'
import { confirmThemeName } from '../hubspot/helpers.js'
import * as utils from '../utils/ui.js'
checkNode()
checkPackageThemeConsistent()

/**
 * @summary 'Compile fields.js to fields.json
 * @async
 * @memberof Theme_Commands
 * @param {Object} [opt] - local theme based config
 * @returns undefined
 */
async function fields (opt) {
  await confirmThemeName()
  const timeStart = utils.startTaskGroup('Compile fields.js to fields.json')
  await compileFieldsJs()
  utils.endTaskGroup({ taskName: 'Compile fields.js to fields.json', timeStart })
}

export { fields }
