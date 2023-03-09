import { checkNode, checkPackageThemeConsistent } from '../utils/check.js'
import { cleanAssets } from '../compile/clean.js'
import { compileScss } from '../compile/sass.js'
import { compileCss } from '../compile/css.js'
import { compileJs } from '../compile/js.js'
import { confirmThemeName } from '../hubspot/helpers.js'
import { compileFieldsJs } from '../hubspot/fields.js'
import * as utils from '../utils/ui.js'
checkNode()
checkPackageThemeConsistent()

/**
 * @summary Build/compile all src CSS/JS/SCSS files
 * @async
 * @memberof Theme_Commands
 * @param {Object} [opt] - local theme based config
 * @returns undefined
 * @example
 * node build/build.js
 */
async function build (opt) {
  await confirmThemeName()
  const timeStart = utils.startTaskGroup('Build task')
  await cleanAssets()
  await compileScss()
  await Promise.all([compileCss(), compileJs(opt), compileFieldsJs()])
  utils.endTaskGroup({ taskName: 'Build task', timeStart })
}

export { build }
