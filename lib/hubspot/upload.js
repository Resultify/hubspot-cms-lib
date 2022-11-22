/** @module hubspot/upload */

import uploadFolder from '@hubspot/cli-lib/lib/uploadFolder.js'
import logger from '@hubspot/cli-lib/logger.js'
import { isAllowedExtension } from '@hubspot/cli-lib/path.js'
import { createIgnoreFilter } from '@hubspot/cli-lib/ignoreRules.js'
import { walk } from '@hubspot/cli-lib/lib/walk.js'
import chalk from 'chalk'
import { globals } from '../config/globals.js'
import * as utils from '../utils/ui.js'
import { loadAuthConfig } from './auth.js'

let cmsMode = 'publish'
if (process.env.MODE === 'draft') {
  cmsMode = 'draft'
}

/**
 * @summary Walks the src folder for files, filters them based on ignore filter.
 * @async
 * @private
 * @param {Object} src - src folder
 * @returns {Promise<Array>} src file list
 */
const getUploadableFileList = async (src) => {
  try {
    const filePaths = await walk(src)
    const allowedFiles = filePaths.filter(file => {
      if (!isAllowedExtension(file)) {
        return false
      }
      return true
    }).filter(createIgnoreFilter())
    return allowedFiles
  } catch (error) {
    console.error(error)
  }
}

/**
 * @summary upload all HubSpot theme files
 * @async
 * @param {THEME_HUB_AUTH_CONFIG|string} customAuthConfig - Rusultify custom Hubspot authentication
 * @returns undefined
 */
async function uploadTheme (customAuthConfig) {
  try {
    const timeStart = utils.startTask('uploadTheme')
    const hubconf = await loadAuthConfig(customAuthConfig)
    const portalId = hubconf.portals[0].portalId
    console.log(`Uploading theme ${chalk.yellow(globals.THEME_NAME)}`)

    // upload files
    logger.setLogLevel(2)
    const uploadableFileList = await getUploadableFileList(globals.THEME)
    await uploadFolder.uploadFolder(
      portalId,
      globals.THEME,
      globals.THEME_NAME,
      { mode: cmsMode },
      { saveOutput: true, processFieldsJs: false },
      uploadableFileList
    )

    utils.endTask({ taskName: `uploadTheme ${globals.THEME_NAME}`, timeStart })
  } catch (error) {
    console.error(error)
    process.exitCode = 1
  }
}

export { uploadTheme }
