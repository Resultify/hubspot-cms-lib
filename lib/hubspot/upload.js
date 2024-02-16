/** @module hubspot/upload */

import * as TYPES from '../types/types.js' // eslint-disable-line no-unused-vars
import uploadFolder from '@hubspot/cli-lib/lib/uploadFolder.js'
import { deleteFile, getDirectoryContentsByPath } from '@hubspot/cli-lib/api/fileMapper.js'
import logger from '@hubspot/cli-lib/logger.js'
import { isAllowedExtension } from '@hubspot/local-dev-lib/path'
import { createIgnoreFilter } from '@hubspot/local-dev-lib/ignoreRules'
import { walk } from '@hubspot/local-dev-lib/fs'
import * as ui from '../utils/ui.js'
import { getThemeOptions } from '../utils/options.js'
import { throwErrorIfMissingScope } from './auth/scopes.js'
import ora from 'ora'

/**
 * @ignore
 * @typedef {TYPES.HUBSPOT_AUTH_CONFIG} HUBSPOT_AUTH_CONFIG {@link HUBSPOT_AUTH_CONFIG}
 */

let cmsMode = 'publish'
if (process.env.HUB_MODE === 'draft') {
  cmsMode = 'draft'
}

/**
 * #### Walks the src folder for files, filters them based on ignore filter.
 * @async
 * @private
 * @param {Object} src - src folder
 * @returns {Promise<Array<string>>} src file list
 */
const getUploadableFileList = async (src) => {
  let filePaths = []
  try {
    filePaths = await walk(src)
  } catch (error) {
    console.error(error)
  }
  const allowedFiles = filePaths.filter((/** @type {any} */ file) => {
    if (!isAllowedExtension(file)) {
      return false
    }
    return true
  }).filter(createIgnoreFilter())
  return allowedFiles
}

/**
 * #### upload all HubSpot theme files
 * @async
 * @param {HUBSPOT_AUTH_CONFIG} config - hubspot authentication config
 * @param {string} themeName - theme name
 * @returns undefined
 */
async function uploadTheme (config, themeName) {
  try {
    const timeStart = ui.startTask('uploadTheme')
    const cmslibOptions = getThemeOptions()
    const src = `${process.cwd()}/${cmslibOptions.themeFolder}`
    const dest = themeName
    const portalId = config.portals[0].portalId

    throwErrorIfMissingScope(config, 'design_manager')
    logger.setLogLevel(2)
    const uploadableFileList = await getUploadableFileList(src)
    await uploadFolder.uploadFolder(
      portalId,
      src,
      dest,
      { mode: cmsMode },
      { saveOutput: true, convertFields: false },
      uploadableFileList
    )
    ui.endTask({ taskName: 'uploadTheme', timeStart })
  } catch (error) {
    console.error(error)
    process.exit(1)
  }
}

/**
 * #### delete all templates in theme and reupload them
 * @async
 * @param {HUBSPOT_AUTH_CONFIG} config - hubspot authentication config
 * @param {string} themeName - theme name
 * @returns undefined
 */
async function cleanUploadThemeTemplates (config, themeName) {
  const timeStart = ui.startTask('cleanUploadThemeTemplates')
  const spinner = ora('Reupload all templates').start()
  try {
    const cmslibOptions = getThemeOptions()
    const src = `${process.cwd()}/${cmslibOptions.themeFolder}/templates`
    const dest = `${themeName}/templates`
    const portalId = config.portals[0].portalId

    throwErrorIfMissingScope(config, 'design_manager')
    logger.setLogLevel(0)
    const uploadableFileList = await getUploadableFileList(src)
    const filesToDelete = await getDirectoryContentsByPath(portalId, dest)
    if (filesToDelete !== undefined && filesToDelete.children.length > 0) {
      for await (const file of filesToDelete.children) {
        if (file.includes('.html')) {
          await deleteFile(portalId, `${dest}/${file}`)
        }
      }
    }
    await uploadFolder.uploadFolder(
      portalId,
      src,
      dest,
      { mode: cmsMode },
      { saveOutput: true, convertFields: false },
      uploadableFileList
    )
    spinner.succeed()
    ui.endTask({ taskName: 'cleanUploadThemeTemplates', timeStart })
  } catch (error) {
    spinner.fail()
    console.error(error)
    process.exit(1)
  }
}

/**
 * #### clean theme and reupload it
 * @async
 * @param {HUBSPOT_AUTH_CONFIG} config - hubspot authentication config
 * @param {string} themeName - theme name
 * @returns undefined
 */
async function cleanUploadTheme (config, themeName) {
  const timeStart = ui.startTask('cleanUploadTheme')
  const dest = themeName
  const spinner = ora(`Clean ${dest} folder before upload`)
  try {
    const cmslibOptions = getThemeOptions()
    const src = `${process.cwd()}/${cmslibOptions.themeFolder}`
    const portalId = config.portals[0].portalId

    throwErrorIfMissingScope(config, 'design_manager')
    logger.setLogLevel(2)
    const uploadableFileList = await getUploadableFileList(src)
    spinner.start()
    const filesToDelete = await getDirectoryContentsByPath(portalId, '/')
    if (filesToDelete !== undefined && filesToDelete.children.length > 0) {
      for await (const file of filesToDelete.children) {
        if (file === dest) {
          await deleteFile(portalId, file)
        }
      }
    }
    spinner.succeed()
    await uploadFolder.uploadFolder(
      portalId,
      src,
      dest,
      { mode: cmsMode },
      { saveOutput: true, convertFields: false },
      uploadableFileList
    )
    ui.endTask({ taskName: 'cleanUploadTheme', timeStart })
  } catch (error) {
    spinner.fail()
    console.error(error)
    process.exit(1)
  }
}

export { uploadTheme, cleanUploadThemeTemplates, cleanUploadTheme }
