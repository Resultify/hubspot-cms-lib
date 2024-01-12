import '../utils/check.js'
import themeName from '../hubspot/theme.js'
import { fetch } from '../hubspot/fetch.js'
import { loadAuthConfig } from '../hubspot/auth/auth.js'
import * as ui from '../utils/ui.js'

/**
 * #### Fetch all theme files
 * @async
 * @memberof Theme_Commands
 * @returns undefined
 */
async function hubspotFetchAll () {
  const timeStart = ui.startTaskGroup(`Fetch all from ${themeName}`)
  const hubAuthData = await loadAuthConfig(themeName)
  await fetch(hubAuthData, themeName)
  ui.endTaskGroup({ taskName: `Fetch all from ${themeName}`, timeStart })
}

export { hubspotFetchAll }
