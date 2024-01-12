/** @module lib/clean */

import { deleteAsync } from 'del'
import fsPromises from 'fs/promises'
import * as ui from '../utils/ui.js'
import { getThemeOptions } from '../utils/options.js'

/**
 * #### clean all vendor folders
 * @async
 * @returns undefined
 */
async function cleanVendorDestFolder () {
  try {
    const timeStart = ui.startTask('cleanVendorDestFolder')
    const options = getThemeOptions()
    await fsPromises.mkdir(options.vendorDest, { recursive: true })
    await deleteAsync([`${options.vendorDest}/*`], { force: true })
    ui.endTask({ taskName: 'cleanVendorDestFolder', timeStart })
  } catch (error) {
    console.error(error)
  }
}

export { cleanVendorDestFolder }
