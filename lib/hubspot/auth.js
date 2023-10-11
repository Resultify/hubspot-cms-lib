/** @module hubspot/load */

import * as T from '../config/types.js' // eslint-disable-line
import config from '@hubspot/cli-lib/lib/config.js'
import { getAccessToken } from '@hubspot/cli-lib/personalAccessKey.js'
import prompts from 'prompts'
import chalk from 'chalk'
import dotenv from 'dotenv'
import ora from 'ora'
import open from 'open'
import { addFileData, isFileDir } from '../utils/fs.js'
import { globals } from '../config/globals.js'

// The Hubspot authentication configuration .env is disabled by default.
// Will be enabled if the .env file contains the following variables:
// HUBSPOT_PORTAL_ID=***
// HUBSPOT_PERSONAL_ACCESS_KEY=***
let hubSpotDefaultEnvAuthConfig = false

/**
 * #### Get project local environment variables
 * @type {Object}
 */
const localEnv = dotenv.config()

/**
 * #### Create/populate .env file
 * @description Create the .env file if it doesn't exist and add the authentication data template
 * @async
 * @private
 * @returns undefined
 */
async function addAuthDataTmplToDotEnv () {
  try {
    if (!await isFileDir(globals.DOTENV)) {
      await addFileData(globals.DOTENV, globals.DOTENV_DATA_TMPL)
    }
  } catch (error) {
    console.error(error)
  }
}

/**
 * #### Check auth data in .env file
 * @description Check the credentials in the .env file and show more information if the credentials are incorrect
 * @async
 * @private
 * @returns undefined
 */
async function checkAuthDataInDotEnv () {
  try {
    /**
     * #### Get project local environment variables
     * @type {dotenv.DotenvConfigOutput}
    */
    const localEnv = dotenv.config()
    if (typeof localEnv.parsed === 'object' && localEnv.parsed !== null) {
      if (Object.entries(localEnv.parsed).length === 0 || localEnv.parsed?.hub_sandbox === 'personalaccesskey') {
        await showDotEnvSetupInstructions()
      }
      if (Object.keys(localEnv.parsed).length !== 0) {
        let showInstructions = true
        for (const key in localEnv.parsed) {
          if (key.toLowerCase().includes('hub_')) {
            showInstructions = false
            break
          }
          if (key.includes('HUBSPOT_PERSONAL_ACCESS_KEY') || key.includes('HUBSPOT')) {
            showInstructions = false
            hubSpotDefaultEnvAuthConfig = true
            break
          }
        }
        showInstructions && await showDotEnvSetupInstructions()
      }
    }
  } catch (error) {
    console.error(error)
  }
}

/**
 * #### Check global env variables or .env file
 * @description Check global env variables and run checkAuthDataInDotEnv() to check .env if no global HUBSPOT env variables are set
 * @async
 * @private
 * @returns undefined
 */
async function checkEnv () {
  if (process.env.HUBSPOT_PORTAL_ID && process.env.HUBSPOT_PERSONAL_ACCESS_KEY) {
    hubSpotDefaultEnvAuthConfig = true
  } else {
    await addAuthDataTmplToDotEnv()
    await checkAuthDataInDotEnv()
  }
}

/**
 * #### Show .env data setup instructions
 * @description Show .env data setup instructions in terminal with possibility to open a link and get personal-access-key
 * @async
 * @private
 * @returns undefined
 */
async function showDotEnvSetupInstructions () {
  console.log(`Define a ${chalk.cyan('name')} of your Hubspot portal (prefixed by hub_) and add ${chalk.yellow('associated personal access')} key to the ${chalk.green('.env')} file.`)
  console.log('Example:')
  console.log('──────────')
  console.log(`${chalk.yellow('hub_sandbox')}=personal-access-key-value-for-your-sanbox-ifneeded
${chalk.yellow('hub_project2')}=personal-access-key-value-for-project2-ifneeded
${chalk.yellow('hub_project3')}=personal-access-key-value-for-project3-ifneeded
...
  `)
  // process.exit(0) when the user cancels/exits the prompt
  // https://github.com/terkelg/prompts#optionsoncancel
  const onCancel = async () => {
    process.exit(0)
  }
  const confirm = await prompts(
    {
      type: 'confirm',
      name: 'keyConfirm',
      message: 'Open the Personal CMS Access Key page in your default browser?',
      initial: true
    }, { onCancel }
  )
  confirm.keyConfirm && await open('https://app.hubspot.com/l/personal-access-key')
  console.log(`Run the last command again when you finish configuring the ${chalk.green('.env')} file`)
  process.exit(0)
}

/**
 * #### get custom portal names
 * @description get custom (hub_***) portal names from .env file
 * @private
 * @param {dotenv.DotenvConfigOutput} localEnv - local env variables
 * @returns {Array<{title:string, value:string}>} portal name|names
 */
function getPortalsName (localEnv) {
  const portalNames = []
  for (const env in localEnv.parsed) {
    if (env.toLowerCase().includes('hub_')) {
      portalNames.push({
        title: env.replace('hub_', ''),
        value: env.replace('hub_', '')
      })
    }
  }
  return portalNames
}

/**
 * #### save portalNames
 * @type {Array<{title:string, value:string}>}
 */
const portalNames = getPortalsName(localEnv)

/**
 * #### prompt to select Portal if more than one name with confirmation
 * @type {Array<prompts.PromptObject<string>>}
 */
const selectPortal = [
  {
    type: 'select',
    name: 'value',
    message: 'HubSpot account:',
    choices: portalNames,
    initial: 0
  },
  {
    type: 'confirm',
    name: 'firstConfirm',
    message: prev => `Continue with ${chalk.cyan.bold(prev)} HubSpot portal?`,
    initial: true
  },
  {
    type: prev => prev === false ? 'select' : null,
    name: 'value',
    message: 'HubSpot account:',
    choices: portalNames,
    initial: 0
  },
  {
    type: (_, values) => values.firstConfirm === false ? 'confirm' : null,
    name: 'secondConfirm',
    message: prev => `Continue with ${chalk.cyan.bold(prev)} HubSpot portal?`,
    initial: true
  }
]

/**
 * #### prompt to confirm Portal if one portal name
 * @type {Array<prompts.PromptObject<string>>}
 */
const confirmPortal = [
  {
    type: 'confirm',
    name: 'secondConfirm',
    message: `Continue with ${chalk.cyan.bold(portalNames[0]?.value)} HubSpot portal?`,
    initial: true
  }
]

// process.exit(0) if no confirmation for portal name
// https://github.com/terkelg/prompts#optionsonsubmit
const onSubmit = async (/** @type {prompts.PromptObject} */ prompt, /** @type {Boolean} */ answer) => {
  if (prompt.name === 'secondConfirm' && answer === false) {
    process.exit(0)
  }
}
// process.exit(0) when the user cancels/exits the prompt
// https://github.com/terkelg/prompts#optionsoncancel
const onCancel = async () => {
  process.exit(0)
}

/**
 * #### show prompt with portals and return the selected portal name
 * @async
 * @private
 * @returns {Promise<string>} portal name
 */
async function choosePortal () {
  if (portalNames.length > 1) {
    const portal = await prompts(selectPortal, { onSubmit, onCancel })
    return portal.value
  } else {
    await prompts(confirmPortal, { onSubmit, onCancel })
    return portalNames[0].value
  }
}

/**
 * #### Get all auth data from Hubspot only based on PERSONAL_ACCESS_KEY
 * @description Get portalId,accessToken and expiresAt based on PERSONAL_ACCESS_KEY
 * @async
 * @private
 * @param {string} accessKey - HUBSPOT_PERSONAL_ACCESS_KEY
 * @returns {Promise<{portalId: number}>} auth data
 */
async function getAuthData (accessKey) {
  const spinner = ora('Authentication').start()
  try {
    const authData = await getAccessToken(accessKey)
    spinner.succeed()
    return authData
  } catch (error) {
    spinner.fail()
    console.error(`${chalk.red.bold('[Error]')}`)
    console.error(error)
    process.exit(1)
  }
}

/**
 * #### get portalId from authData Object
 * @private
 * @param {Object} authData - auth data
 * @param {number} authData.portalId
 * @returns {number} portalId
 */
function getPortalId (authData) {
  return authData.portalId
}

/**
 * #### Generate Hubspot auth config based on PERSONAL_ACCESS_KEY and chosen portal name
 * @async
 * @private
 * @param {string} portalName - portal name
 * @param {dotenv.DotenvConfigOutput} localEnv - env variables with PERSONAL_ACCESS_KEY
 * @returns {Promise<T.THEME_HUB_AUTH_CONFIG>} Hubspot portal auth config
 */
async function generateAccessConfig (portalName, localEnv) {
  for (const env in localEnv.parsed) {
    if (env.replace('hub_', '') === portalName) {
      return {
        portals: [
          {
            authType: 'personalaccesskey',
            portalId: getPortalId(await getAuthData(localEnv.parsed[env])),
            personalAccessKey: localEnv.parsed[env],
            env: 'prod'
          }
        ]
      }
    }
  }
  throw new Error('No custom portal names found in .env file')
}

/**
 * #### Return custom auth config if it exists
 * @description Hubspot CMS auth based on Rusultify custom local .env file with multiple Hub platforms to choose
 * @async
 * @private
 * @returns {Promise<T.THEME_HUB_AUTH_CONFIG|string>} Custom auth config or defaultConfig string
 */
async function isCustomAuthConfig () {
  if (hubSpotDefaultEnvAuthConfig) {
    return 'defaultConfig'
  } else {
    const hubConfig = await generateAccessConfig(await choosePortal(), localEnv)
    if (hubConfig === undefined) {
      console.error(`${chalk.bold.red(['Error'])} .env authentication configuration is incorrect`)
      process.exit(1)
    } else {
      return hubConfig
    }
  }
}

/**
 * #### Load and validate Hubspot config
 * @async
 * @param {T.THEME_HUB_AUTH_CONFIG|string} customAuthConfig - Rusultify custom Hubspot authentication
 * @returns {Promise<T.THEME_HUB_AUTH_CONFIG>} Hubspot loaded config
 */
async function loadAuthConfig (customAuthConfig) {
  // load HUBSPOT config based on HUBSPOT_PORTAL_ID and HUBSPOT_PERSONAL_ACCESS_KEY env variables
  if (customAuthConfig === 'defaultConfig') {
    const hubConfig = await config.getAndLoadConfigIfNeeded({ silenceErrors: false, useEnv: true })
    await config.validateConfig()
    await getAuthData(hubConfig.portals[0].personalAccessKey)
    return hubConfig

  // load HUBSPOT config based on Rusultify custom env variables
  } else {
    /**
     * fake env variables to run fake loadConfig() function
     * to set environmentVariableConfigLoaded=true in HubSpot cli-lib
     * @hubspot/cli-lib/lib/config.js
     */
    process.env.HUBSPOT_PORTAL_ID = '111'
    process.env.HUBSPOT_PERSONAL_ACCESS_KEY = '222'
    await config.loadConfig(null, { useEnv: true })

    // load real config
    const hubConfig = await config.setConfig(customAuthConfig)
    await config.validateConfig()
    return hubConfig
  }
}

/**
 * #### add/check/return custom auth config
 * @async
 * @returns {Promise<T.THEME_HUB_AUTH_CONFIG|string>} Hubspot portal auth config
 */
async function getAuthConfig () {
  await checkEnv()
  const authData = isCustomAuthConfig()
  return authData
}

export { loadAuthConfig, getAuthConfig }
