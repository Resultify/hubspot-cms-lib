import '../utils/check.js'
import { compileFieldsJs } from '../hubspot/fields.js'
import * as ui from '../utils/ui.js'

/**
 * #### 'Compile fields.js to fields.json
 * @async
 * @memberof Theme_Commands
 * @returns undefined
 */
async function fields () {
  const timeStart = ui.startTaskGroup('Compile fields.js')
  await compileFieldsJs()
  ui.endTaskGroup({ taskName: 'Compile fields.js', timeStart })
}

export { fields }
