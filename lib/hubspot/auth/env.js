/** @module hubspot/auth/env */

import * as TYPES from '../../types/types.js' // eslint-disable-line no-unused-vars
import chalk from 'chalk'
import dotenv from 'dotenv'
import fsPromises from 'fs/promises'
import { isFileDir } from '../../utils/fs.js'
import { choosePortal } from './prompts.js'
import { getAccessTokenData } from './auth.js'

/**
 * @ignore
 * @typedef {TYPES.HUBSPOT_AUTH_CONFIG} HUBSPOT_AUTH_CONFIG {@link HUBSPOT_AUTH_CONFIG}
 */

const DOTENV_FILE = '.env'
const DOTENV_FILE_DATA_TMPL = `# Define a name of your Hubspot portal prefixed by hub_ and add associated personal access key to it
hub_sandbox=personal-access-key-for-this-sandbox
hub_portalname=personal-access-key-for-this-portalname
`

/**
 * #### Create .env file
 * @description Create the .env file if it doesn't exist and add example configuration
 * @async
 * @private
 * @returns undefined
 */
async function addDotEnvFileIfNotExists () {
  if (!await isFileDir(DOTENV_FILE)) {
    try {
      await fsPromises.appendFile(DOTENV_FILE, DOTENV_FILE_DATA_TMPL)
      console.log(`Check the newly created ${chalk.green('.env')} file in the root of your project and follow the instructions inside the file to configure it for successful authorization.`)
      process.exit(0)
    } catch (error) {
      console.error(error)
    }
  }
}

/**
 * #### Check auth data in .env file
 * @description Check the credentials in the .env file and show more information if the credentials are incorrect
 * @private
 * @returns undefined
 */
function checkAuthDataInDotEnv () {
  /**
   * #### Get project local environment variables
   * @type {dotenv.DotenvConfigOutput}
  */
  const localEnv = dotenv.config()
  if (typeof localEnv.parsed === 'object' && localEnv.parsed !== null && Object.keys(localEnv.parsed).length !== 0) {
    let showInstructions = true
    for (const key in localEnv.parsed) {
      if (key.toLowerCase().includes('hub_')) {
        showInstructions = false
        break
      }
    }
    if (showInstructions) {
      console.warn(`No valid auth config found in ${chalk.green('.env')} file. Correct this and run the command again.`)
      console.warn(`Define a name of your Hubspot portal prefixed by ${chalk.yellow('hub_')} and add associated personal access key to it`)
      console.warn('Example:')
      console.warn('hub_portalname=personal-access-key-for-this-portalname')
      process.exit(0)
    }
  } else {
    console.warn(`Looks like the ${chalk.green('.env')} file is empty. Add the necessary auth config and run the command again`)
    console.warn(`Define a name of your Hubspot portal prefixed by ${chalk.yellow('hub_')} and add associated personal access key to it`)
    console.warn('Example:')
    console.warn('hub_portalname=personal-access-key-for-this-portalname')
    process.exit(0)
  }
}

/**
 * #### Init .env file
 * @async
 * @returns undefined
 */
async function initEnvFile () {
  try {
    await addDotEnvFileIfNotExists()
    checkAuthDataInDotEnv()
  } catch (error) {
    console.error(error)
  }
}

/**
 * #### get portal names from .env file
 * @description get (hub_***) portal names from .env file
 * @private
 * @returns {Array<{title:string, value:string}>} portal name|names
 */
function getPortalsNames () {
  const portalNames = []
  for (const envVar in dotenv.config().parsed) {
    if (envVar.toLowerCase().includes('hub_')) {
      portalNames.push({
        title: envVar.replace('hub_', ''),
        value: envVar.replace('hub_', '')
      })
    }
  }
  return portalNames
}

/**
 * #### Generate Hubspot auth config based on .env file
 * @async
 * @private
 * @param {string} themeName - theme name
 * @returns {Promise<HUBSPOT_AUTH_CONFIG>}> } Hubspot portal auth config
 */
async function getAuthDataFromEnvFile (themeName) {
  await initEnvFile()
  const portalName = await choosePortal(getPortalsNames(), themeName)
  const dotenvConfig = dotenv.config().parsed || {}
  let envPortalName = ''
  for (const env in dotenvConfig) {
    if (env.replace('hub_', '') === portalName) {
      envPortalName = env
    }
  }
  const accessTokenData = await getAccessTokenData(dotenvConfig[envPortalName])
  return {
    defaultPortal: portalName,
    allowUsageTracking: false,
    portals: [
      {
        name: portalName,
        portalId: accessTokenData.portalId,
        env: 'prod',
        authType: 'personalaccesskey',
        personalAccessKey: dotenvConfig[envPortalName],
        scopeGroups: accessTokenData.scopeGroups
      }
    ]
  }
}

/**
 * #### Generate Hubspot auth config from environment variables
 * @description Generate Hubspot auth config from environment variables (HUBSPOT_PORTAL_ID, HUBSPOT_PERSONAL_ACCESS_KEY)
 * @async
 * @returns {Promise<HUBSPOT_AUTH_CONFIG>} AccessToken data
 */
async function getAuthDataFromEnvVars () {
  const portalId = process.env.HUBSPOT_PORTAL_ID
  const accessKey = process.env.HUBSPOT_PERSONAL_ACCESS_KEY
  if (!portalId || !accessKey) {
    process.exit(0)
  }
  const accessTokenData = await getAccessTokenData(accessKey)
  return {
    allowUsageTracking: false,
    portals: [
      {
        portalId: parseInt(portalId),
        env: 'prod',
        authType: 'personalaccesskey',
        personalAccessKey: accessKey,
        scopeGroups: accessTokenData.scopeGroups
      }
    ]
  }
}

export { getAuthDataFromEnvFile, getAuthDataFromEnvVars }
