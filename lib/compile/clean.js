/** @module lib/clean */

import { deleteAsync } from 'del'
import fsPromises from 'fs/promises'
import { globals } from '../config/globals.js'
import * as utils from '../utils/ui.js'

/**
 * @summary clean all assets/tmp folders
 * @async
 * @returns undefined
 */
async function cleanAssets () {
  try {
    const timeStart = utils.startTask('cleanAssets')

    const themeAssets = globals.THEME_ASSETS
    await fsPromises.mkdir(themeAssets, { recursive: true })
    await deleteAsync([`${themeAssets}/*`], { force: true })

    utils.endTask({ taskName: 'cleanAssets', timeStart })
  } catch (error) {
    console.error(error)
  }
}

export { cleanAssets }
