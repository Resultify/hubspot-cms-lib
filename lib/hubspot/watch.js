/** @module hubspot/watch */
/// <reference path="../types/types.js" />
import chalk from 'chalk'
import { watch } from '@hubspot/local-dev-lib/cms/watch'
import { setLogLevel, LOG_LEVEL } from '@hubspot/local-dev-lib/logger'
import { getThemeOptions } from '../utils/options.js'
import { throwErrorIfMissingScope } from './auth/scopes.js'
import { isAllowedExtension } from '@hubspot/local-dev-lib/path'
import { createIgnoreFilter } from '@hubspot/local-dev-lib/ignoreRules'
import { walk } from '@hubspot/local-dev-lib/fs'

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
 * #### watch and upload all HubSpot theme files
 * @async
 * @param {HUBSPOT_AUTH_CONFIG} config - hubspot authentication config
 * @param {string} themeName - theme name
 * @returns undefined
 */
async function watchHubspotTheme (config, themeName) {
  try {
    const cmslibOptions = getThemeOptions()
    const src = `${process.cwd()}/${cmslibOptions.themeFolder}`
    const dest = themeName
    const portalId = config.portals[0].portalId
    throwErrorIfMissingScope(config, 'design_manager')
    setLogLevel(LOG_LEVEL.WARN)
    const uploadableFileList = await getUploadableFileList(src)
    const watcher = await watch(
      portalId,
      src,
      dest,
      {
        mode: cmsMode,
        remove: true,
        disableInitial: true,
        notify: '',
        commandOptions: { convertFields: false },
        filePaths: uploadableFileList
      },
      undefined,
      undefined,
      undefined,
      (file, dest, accountId) => (/** @type {any} */error) => {
        if (error && error.data) {
          if (error.data.status === 'error') {
            console.error(chalk.red(error.data.message))
          }
          if (Array.isArray(error.data.errors)) {
            error.data.errors.forEach((/** @type {any} */error) => {
              if (!error.severity) {
                console.error(chalk.bold.red('●E'), error.message)
              } else {
                if (error.severity === 'FATAL') {
                  console.error(chalk.bold.red('●F'), error.message)
                }
                if (error.severity === 'WARNING' && process.env.DEBUG_MODE === 'true') {
                  console.warn(chalk.bold.yellow('●W'), error.message)
                }
              }
            })
          }
        }
      }
    )
    watcher
      .on('ready', () => {
        console.log(`\n${chalk.green('●')} Watcher is ready and watching ${chalk.green(`${themeName}/*`)}\nAny changes detected will be automatically uploaded and overwrite the current version in the developer file system.`)
      })
      .on('add', (/** @type {String} */ path) => {
        console.log(`${chalk.yellow('──>')} Added file ${chalk.green(path)}`)
      })
      .on('change', (/** @type {String} */ path) => {
        console.log(`${chalk.yellow('──>')} Changed file ${chalk.green(path)}`)
      })
      .on('unlink', (/** @type {String} */ path) => {
        console.log(`${chalk.red('●──')} Deleted file ${chalk.green(path)}`)
      })
      .on('unlinkDir', (/** @type {String} */ path) => {
        console.log(`${chalk.red('●──')} Deleted folder ${chalk.green(path)}`)
      })
  } catch (error) {
    console.error(error)
    process.exit(1)
  }
}

export { watchHubspotTheme }
