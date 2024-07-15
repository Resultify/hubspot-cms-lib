/** @module hubspot/auth/env */
/// <reference path="../../types/types.js" />
import chalk from 'chalk'
import fsPromises from 'fs/promises'
import { isFileDir } from '../../utils/fs.js'
import { choosePortal } from './prompts.js'
import { getAccessTokenData } from './auth.js'

const DOTENV_FILE = '.env'
const DOTENV_FILE_DATA_TMPL = `# Define a name of your Hubspot portal prefixed by hub_ and add associated personal access key to it.
# hub_portalname=personal-access-key-for-this-portalname
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
      process.exit(0)
    } catch (error) {
      console.error(error)
    }
  }
}

/**
 * #### Check auth data in local environment
 * @private
 * @returns undefined
 */
function checkAuthDataInEnv () {
  const localEnv = process.env
  let showInstructions = true
  for (const key in localEnv) {
    if (key.toLowerCase().includes('hub_')) {
      showInstructions = false
      break
    }
  }
  if (showInstructions) {
    console.warn(`No valid auth config found in ${chalk.green('.env')} file. Correct this and run the command again.`)
    console.warn(`Define a name of your Hubspot portal prefixed by ${chalk.yellow('hub_')} and add associated personal access key to it.`)
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
    checkAuthDataInEnv()
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
  for (const envVar in process.env) {
    if (envVar.toLowerCase().startsWith('hub_')) {
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
 * @returns {Promise<HUBSPOT_AUTH_CONFIG>}> } Hubspot portal auth config
 */
async function getAuthDataFromEnv () {
  let nativeHubSpotEnv = true
  const portalId = process.env.HUBSPOT_PORTAL_ID
  const accessKey = process.env.HUBSPOT_PERSONAL_ACCESS_KEY
  if (!portalId || !accessKey) {
    nativeHubSpotEnv = false
    await initEnvFile()
    const portalName = await choosePortal(getPortalsNames())
    const envConfig = process.env
    let envPortalName = ''
    for (const env in envConfig) {
      if (env.replace('hub_', '') === portalName) {
        envPortalName = env
      }
    }
    const accessTokenData = await getAccessTokenData(envConfig[envPortalName] ?? '')
    return {
      nativeHubSpotEnv,
      defaultPortal: portalName,
      allowUsageTracking: false,
      portals: [
        {
          name: portalName,
          portalId: accessTokenData.portalId,
          env: 'prod',
          authType: 'personalaccesskey',
          personalAccessKey: envConfig[envPortalName] ?? '',
          scopeGroups: accessTokenData.scopeGroups
        }
      ]
    }
  } else {
    const accessTokenData = await getAccessTokenData(accessKey)
    return {
      nativeHubSpotEnv,
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
}

export { getAuthDataFromEnv }
