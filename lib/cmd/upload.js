import '../utils/check.js'
import themeName from '../hubspot/theme.js'
import { loadAuthConfig } from '../hubspot/auth/auth.js'
import { uploadTheme } from '../hubspot/upload.js'
import { cleanVendorDestFolder } from '../compile/clean.js'
import { compileScss } from '../compile/sass.js'
import { compileCss } from '../compile/css.js'
import { compileJs } from '../compile/js.js'
import { compileFieldsJs } from '../hubspot/fields.js'
import * as ui from '../utils/ui.js'

/**
 * #### Upload theme to HUBSPOT cms portall
 * @async
 * @memberof Theme_Commands
 * @returns undefined
 */
async function upload () {
  const timeStart = ui.startTaskGroup(`Upload ${themeName}`)
  const hubAuthData = await loadAuthConfig(themeName)
  await cleanVendorDestFolder()
  await compileScss()
  await compileCss()
  await compileJs()
  await compileFieldsJs()
  await uploadTheme(hubAuthData, themeName)
  ui.endTaskGroup({ taskName: `Upload ${themeName}`, timeStart })
}

export { upload }
