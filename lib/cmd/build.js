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
 * @memberof Theme_Commands
 * @returns undefined
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
