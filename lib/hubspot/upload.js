/** @module hubspot/upload */
/// <reference path="../types/types.js" />
import uploadFolder from '@hubspot/local-dev-lib/cms/uploadFolder'
import { deleteFile, getDirectoryContentsByPath } from '@hubspot/local-dev-lib/api/fileMapper'
import { setLogLevel, LOG_LEVEL } from '@hubspot/local-dev-lib/logger'
import { isAllowedExtension } from '@hubspot/local-dev-lib/path'
import { createIgnoreFilter } from '@hubspot/local-dev-lib/ignoreRules'
import { walk } from '@hubspot/local-dev-lib/fs'
import * as ui from '../utils/ui.js'
import { getThemeOptions } from '../utils/options.js'
import { throwErrorIfMissingScope } from './auth/scopes.js'
import ora from 'ora'

/**
 * @type {"draft" | "publish"}
 */
let cmsMode = 'publish'
if (process.env.HUB_MODE === 'draft') {
  cmsMode = 'draft'
}

/**
 * #### Walks the src folder for files, filters them based on ignore filter.
 * @async
 * @private
 * @param {string} src - src folder
 * @returns {Promise<Array<string>>} src file list
 */
const getUploadableFileList = async (src) => {
  /**
   * @type {Array<string>}
   */
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
    // @ts-ignore
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
    setLogLevel(LOG_LEVEL.LOG)
    const uploadableFileList = await getUploadableFileList(src)
    await uploadFolder.uploadFolder(
      portalId,
      src,
      dest,
      { overwrite: false },
      { saveOutput: true, convertFields: false },
      uploadableFileList,
      cmsMode
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
    setLogLevel(LOG_LEVEL.NONE)
    const uploadableFileList = await getUploadableFileList(src)
    const filesToDelete = await getDirectoryContentsByPath(portalId, dest)
    if (filesToDelete !== undefined && filesToDelete.children.length > 0) {
      for await (const file of filesToDelete.children) {
        // @ts-ignore
        if (file.includes('.html')) {
          await deleteFile(portalId, `${dest}/${file}`)
        }
      }
    }
    await uploadFolder.uploadFolder(
      portalId,
      src,
      dest,
      { overwrite: false },
      { saveOutput: true, convertFields: false },
      uploadableFileList,
      cmsMode
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
    setLogLevel(LOG_LEVEL.LOG)
    const uploadableFileList = await getUploadableFileList(src)
    spinner.start()
    const filesToDelete = await getDirectoryContentsByPath(portalId, '/')
    if (filesToDelete !== undefined && filesToDelete.children.length > 0) {
      for await (const file of filesToDelete.children) {
        // @ts-ignore
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
      { overwrite: false },
      { saveOutput: true, convertFields: false },
      uploadableFileList,
      cmsMode
    )
    ui.endTask({ taskName: 'cleanUploadTheme', timeStart })
  } catch (error) {
    spinner.fail()
    console.error(error)
    process.exit(1)
  }
}

export { uploadTheme, cleanUploadThemeTemplates, cleanUploadTheme }
