/** @module lib/clean */

import { deleteAsync } from 'del'
import fsPromises from 'fs/promises'
import { globals } from '../config/globals.js'
import * as utils from '../utils/ui.js'

/**
 * @summary clean all vendor folders
 * @async
 * @returns undefined
 */
async function cleanVendorFolder () {
  try {
    const timeStart = utils.startTask('cleanVendorFolder')

    const themeVendor = globals.THEME_VENDOR
    await fsPromises.mkdir(themeVendor, { recursive: true })
    await deleteAsync([`${themeVendor}/*`], { force: true })

    utils.endTask({ taskName: 'cleanVendorFolder', timeStart })
  } catch (error) {
    console.error(error)
  }
}

export { cleanVendorFolder }
