/** @module hubspot/upload */
/// <reference path="../types/types.js" />
import fsPromises from 'fs/promises'
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
import chalk from 'chalk'
import checkbox from '@inquirer/checkbox'
import confirm from '@inquirer/confirm'
import { getFileList, isFileDir } from '../utils/fs.js'

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
 * #### Reads the .cihsignore file and returns the list of files to ignore.
 * @private
 * @async
 * @returns {Promise<string[]>} List of files to ignore.
 */
async function readCihsIgnore () {
  try {
    if (await isFileDir(`${process.cwd()}/.cihsignore`)) {
      const ignoreContent = await fsPromises.readFile(`${process.cwd()}/.cihsignore`, 'utf8')
      return ignoreContent.split('\n').map(line => line.trim()).filter(line => line && !line.startsWith('#'))
    } else {
      return []
    }
  } catch (error) {
    console.error('Error reading .cihsignore file:', error)
    return []
  }
}

/**
 * #### Walks the src folder for files, filters them based on ignore filter and CI .cihsignore file.
 * @async
 * @private
 * @param {string} src - src folder
 * @returns {Promise<Array<string>>} src file list
 */
const getCiUploadableFileList = async (src) => {
  /**
   * @type {Array<string>}
   */
  let filePaths = []
  try {
    filePaths = await walk(src)
  } catch (error) {
    console.error(error)
  }
  let allowedFiles = filePaths.filter((/** @type {any} */ file) => {
    if (!isAllowedExtension(file)) {
      return false
    }
    return true
    // @ts-ignore
  }).filter(createIgnoreFilter())

  async function filterFiles (/** @type {any} */ files) {
    const ignoredPaths = await readCihsIgnore()
    return files.filter((/** @type {any} */ file) => !ignoredPaths.some(ignoredPath => file.includes(ignoredPath)))
  }
  allowedFiles = await filterFiles(allowedFiles)
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
    console.error(chalk.red('uploadTheme error:'), error.message)
    if (process.env.DEBUG_MODE === 'debug') {
      console.error(error)
    }
    process.exitCode = 1
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
    if (filesToDelete !== undefined && filesToDelete.data.children.length > 0) {
      for await (const file of filesToDelete.data.children) {
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
    console.error(chalk.red('cleanUploadThemeTemplates error:'), error.message)
    if (process.env.DEBUG_MODE === 'debug') {
      console.error(error)
    }
    process.exitCode = 1
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
    if (filesToDelete !== undefined && filesToDelete.data.children.length > 0) {
      for await (const file of filesToDelete.data.children) {
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
    console.error(chalk.red('cleanUploadTheme error:'), error.message)
    if (process.env.DEBUG_MODE === 'debug') {
      console.error(error)
    }
    process.exitCode = 1
  }
}

/**
 * #### CI clean theme upload
 * @async
 * @param {HUBSPOT_AUTH_CONFIG} config - hubspot authentication config
 * @param {string} themeName - theme name
 * @returns undefined
 */
async function ciUploadTheme (config, themeName) {
  const timeStart = ui.startTask('ciUpload')
  const dest = themeName
  const spinner = ora(`Clean ${dest} folder before upload`)
  try {
    const cmslibOptions = getThemeOptions()
    const src = `${process.cwd()}/${cmslibOptions.themeFolder}`
    const portalId = config.portals[0].portalId

    throwErrorIfMissingScope(config, 'design_manager')
    setLogLevel(LOG_LEVEL.LOG)
    const uploadableFileList = await getCiUploadableFileList(src)
    spinner.start()
    const filesToDelete = await getDirectoryContentsByPath(portalId, '/')
    if (filesToDelete !== undefined && filesToDelete.data.children.length > 0) {
      for await (const file of filesToDelete.data.children) {
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
    ui.endTask({ taskName: 'ciUpload', timeStart })
  } catch (error) {
    spinner.fail()
    console.error(chalk.red('ciUploadTheme error:'), error.message)
    if (process.env.DEBUG_MODE === 'debug') {
      console.error(error)
    }
    process.exitCode = 1
  }
}

/**
 * #### prepare file choices for prompt
 * @private
 * @param {Array<FILE_LIST>} files - hubdb files
 * @returns {Array<{name:string, value:{path:string, name:string, label:string}}>} files choices
 */
function prepareFileChoices (files) {
  const fileChoices = []
  for (const file of files) {
    fileChoices.push({ name: file.name, value: { path: file.path, name: file.name, label: file.name.slice(0, -7) } })
  }
  return fileChoices
}

/**
 * #### select standalome modules to upload
 * @async
 * @private
 * @param {Array<FILE_LIST>} dirs - files
 * @returns {Promise<Array<{path:string, name:string, label:string}>>} selected files
 */
async function selectModules (dirs) {
  const selectFiles = {
    message: 'Pick modules:',
    choices: prepareFileChoices(dirs),
    pageSize: 5,
    loop: false
  }
  const confirmPortal = (/** @type {any} */ selectedFiles) => {
    const filesNameList = []
    for (const file of selectedFiles) {
      filesNameList.push(file.name)
    }
    if (filesNameList.length === 1) {
      return {
        message: `Continue with ${chalk.cyan.bold(filesNameList.join(','))} module?`
      }
    } else {
      return {
        message: `Continue with ${chalk.cyan.bold(filesNameList.join(','))} modules?`
      }
    }
  }
  // select files
  let selectedTables = await checkbox(selectFiles)
  if (!selectedTables.length) {
    console.log(chalk.yellow('No modules selected'))
    process.exit(0)
  }
  // confirm selection
  let confirmed = await confirm(confirmPortal(selectedTables))
  if (!confirmed) {
    // try again one more time
    selectedTables = await checkbox(selectFiles)
    if (!selectedTables.length) {
      console.log(chalk.yellow('No modules selected'))
      process.exit(0)
    }
    confirmed = await confirm(confirmPortal(selectedTables))
    if (!confirmed) {
      process.exit(0)
    }
  }
  return selectedTables
}

/**
 * #### upload module to HubSpot
 * @async
 * @param {HUBSPOT_AUTH_CONFIG} config - hubspot authentication config
 * @returns undefined
 */
async function uploadSelectedModules (config) {
  try {
    const timeStart = ui.startTask('uploadModules')
    const modulesToUpload = await getFileList('standalone-modules/*.module', { objectMode: true, onlyDirectories: true, deep: 1 })
    const selectedModules = await selectModules(modulesToUpload)
    const portalId = config.portals[0].portalId
    throwErrorIfMissingScope(config, 'design_manager')
    setLogLevel(LOG_LEVEL.LOG)

    for (const module of selectedModules) {
      const src = module.path
      const dest = module.name

      if (await isFileDir(src) === false) {
        throw new Error(`${chalk.red('Error')}: Module ${chalk.green(src)} does not exist`)
      }
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
    }
    ui.endTask({ taskName: 'uploadModules', timeStart })
  } catch (error) {
    console.error(chalk.red('uploadSelectedModules error:'), error.message)
    if (process.env.DEBUG_MODE === 'debug') {
      console.error(error)
    }
    process.exitCode = 1
  }
}

export { uploadTheme, cleanUploadThemeTemplates, cleanUploadTheme, ciUploadTheme, uploadSelectedModules }
