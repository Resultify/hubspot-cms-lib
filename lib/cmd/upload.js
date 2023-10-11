import { checkNode, checkPackageThemeConsistent } from '../utils/check.js'
import { uploadTheme } from '../hubspot/upload.js'
import { cleanVendorFolder } from '../compile/clean.js'
import { compileScss } from '../compile/sass.js'
import { compileCss } from '../compile/css.js'
import { compileJs } from '../compile/js.js'
import { globals } from '../config/globals.js'
import { getAuthConfig } from '../hubspot/auth.js'
import { confirmThemeName } from '../hubspot/helpers.js'
import { compileFieldsJs } from '../hubspot/fields.js'
import * as utils from '../utils/ui.js'
checkNode()
checkPackageThemeConsistent()

/**
 * @summary Upload theme to HUBSPOT cms portall
 * @async
 * @memberof Theme_Commands
 * @param {object} [opt] - local theme based config
 * @returns undefined
 * @example
 * node build/upload.js
 */
async function upload (opt) {
  await confirmThemeName()
  const hubAuth = await getAuthConfig()
  const timeStart = utils.startTaskGroup(`Upload ${globals.THEME_NAME}`)
  await cleanVendorFolder()
  await compileScss()
  await Promise.all([compileCss(), compileJs(opt), compileFieldsJs()])
  await uploadTheme(hubAuth)
  utils.endTaskGroup({ taskName: `Upload ${globals.THEME_NAME}`, timeStart })
}

export { upload }
