/** @module hubspot/auth */
/// <reference path="../../types/types.js" />
import { getAccessToken } from '@hubspot/local-dev-lib/personalAccessKey'
import { validateConfig, getAndLoadConfigIfNeeded, writeConfig, setConfig, createEmptyConfigFile, deleteConfigFile } from '@hubspot/local-dev-lib/config'
import chalk from 'chalk'
import ora from 'ora'
import { getAuthDataFromEnv } from './env.js'

/**
 * #### Get AccessToken and portalId
 * @async
 * @param {string} accessKey
 * @returns {Promise<HUBSPOT_ACCESSTOKEN_SCHEMA>} AccessToken data
 */
async function getAccessTokenData (accessKey) {
  const spinner = ora({ text: 'Authentication', discardStdin: false }).start()
  try {
    const accessTokenData = await getAccessToken(accessKey)
    spinner.succeed()
    return accessTokenData
  } catch (error) {
    spinner.fail()
    await deleteConfigFile()
    if (error.status === 401) {
      const msg = error.message ? error.message : 'Check the personal access key and try again.'
      console.error(`${chalk.red.bold('[Error]')} ${error.category}. ${msg}`)
    } else {
      console.error(error)
    }
    process.exit(1)
  }
}

/**
 * #### Load and validate Hubspot auth config
 * @async
 * @returns {Promise<HUBSPOT_AUTH_CONFIG>} Hubspot auth config
 */
async function loadAuthConfig () {
  const authConfig = await getAuthDataFromEnv()
  if (authConfig.nativeHubSpotEnv) {
    // check if the portal ID and personal access key match
    if (authConfig.portals[0].portalId !== Number(process.env.HUBSPOT_PORTAL_ID)) {
      console.error(`${chalk.red.bold('[Error]')} Portal ID and Personal Access Key do not match`)
      process.exit(1)
    }
    // load Hubspot auth config
    await getAndLoadConfigIfNeeded({ silenceErrors: false, useEnv: true })
    await validateConfig()
    return authConfig
  } else {
    await createEmptyConfigFile()
    // load Hubspot auth config
    // @ts-ignore
    await setConfig(authConfig)
    await validateConfig()
    // add auth data to hubspot.config.yml file
    await writeConfig()
    return authConfig
  }
}

export { loadAuthConfig, getAccessTokenData }
