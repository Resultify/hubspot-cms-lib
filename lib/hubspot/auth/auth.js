/** @module hubspot/auth */

import * as TYPES from '../../types/types.js' // eslint-disable-line no-unused-vars
import { getAccessToken } from '@hubspot/local-dev-lib/personalAccessKey'
import { validateConfig, getAndLoadConfigIfNeeded, writeConfig, setConfig, createEmptyConfigFile, deleteConfigFile } from '@hubspot/local-dev-lib/config'
import chalk from 'chalk'
import ora from 'ora'
import { getAuthDataFromEnvFile, getAuthDataFromEnvVars } from './env.js'
import { savedConsoleDebug } from '../../utils/console.js'

/**
 * @ignore
 * @typedef {TYPES.HUBSPOT_ACCESSTOKEN_SCHEMA} HUBSPOT_ACCESSTOKEN_SCHEMA {@link HUBSPOT_ACCESSTOKEN_SCHEMA}
 * @typedef {TYPES.HUBSPOT_AUTH_CONFIG} HUBSPOT_AUTH_CONFIG {@link HUBSPOT_AUTH_CONFIG}
 */

/**
 * #### Get AccessToken and portalId
 * @async
 * @param {string} accessKey
 * @returns {Promise<HUBSPOT_ACCESSTOKEN_SCHEMA>} AccessToken data
 */
async function getAccessTokenData (accessKey) {
  const spinner = ora({ text: 'Authentication', discardStdin: false }).start()
  try {
    console.debug = () => {}
    const accessTokenData = await getAccessToken(accessKey)
    console.debug = savedConsoleDebug
    spinner.succeed()
    return accessTokenData
  } catch (error) {
    spinner.fail()
    await deleteConfigFile()
    if (error.cause.response.statusText === 'Unauthorized') {
      const msg = error.cause.response.data.message ? error.cause.response.data.message : 'Check the personal access key and try again.'
      console.error(`${chalk.red.bold('[Error]')} ${error.cause.response.statusText}. ${msg}`)
    } else {
      console.error(error)
    }
    process.exit(1)
  }
}

/**
 * #### Load and validate Hubspot auth config
 * @async
 * @param {string} themeName - theme name
 * @returns {Promise<HUBSPOT_AUTH_CONFIG>} Hubspot auth config
 */
async function loadAuthConfig (themeName) {
  if (process.env.HUBSPOT_PORTAL_ID && process.env.HUBSPOT_PERSONAL_ACCESS_KEY) {
    // get access token data from Hubspot
    const authConfig = await getAuthDataFromEnvVars()
    // check if the portal ID and personal access key match
    if (authConfig.portals[0].portalId !== Number(process.env.HUBSPOT_PORTAL_ID)) {
      console.error(`${chalk.red.bold('[Error]')} Portal ID and Personal Access Key do not match`)
      process.exit(1)
    }
    console.debug = () => {}
    // load Hubspot auth config
    await getAndLoadConfigIfNeeded({ silenceErrors: false, useEnv: true })
    console.debug = savedConsoleDebug
    await validateConfig()
    return authConfig
  } else {
    // get auth data from .env file
    const authConfig = await getAuthDataFromEnvFile(themeName)
    console.debug = () => {}
    await createEmptyConfigFile()
    console.debug = savedConsoleDebug
    // load Hubspot auth config
    await setConfig(authConfig)
    await validateConfig()
    console.debug = () => {}
    // add auth data to hubspot.config.yml file
    await writeConfig()
    console.debug = savedConsoleDebug
    return authConfig
  }
}

export { loadAuthConfig, getAccessTokenData }
