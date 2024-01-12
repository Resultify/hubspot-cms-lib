import '../utils/check.js'
import themeName from '../hubspot/theme.js'
import { lighthouseScore } from '../hubspot/lighthouse.js'
import { loadAuthConfig } from '../hubspot/auth/auth.js'
import * as ui from '../utils/ui.js'

/**
 * #### Get Lighthouse Score for theme
 * @async
 * @memberof Theme_Commands
 * @returns undefined
 */
async function lighthouse () {
  const timeStart = ui.startTaskGroup(`Lighthouse tests for ${themeName}`)
  const hubAuthData = await loadAuthConfig(themeName)
  await lighthouseScore(hubAuthData, themeName)
  ui.endTaskGroup({ taskName: `Lighthouse tests for ${themeName}`, timeStart })
}

export { lighthouse }
