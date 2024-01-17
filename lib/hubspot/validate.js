/** @module hubspot/marketplaceValidate */

import * as TYPES from '../types/types.js' // eslint-disable-line no-unused-vars
import { requestValidation, getValidationStatus, getValidationResults } from '@hubspot/cli-lib/api/marketplaceValidation.js'
import chalk from 'chalk'
import ora from 'ora'
import * as ui from '../utils/ui.js'
import { savedConsoleDebug } from '../utils/console.js'
import { throwErrorIfMissingScope } from './auth/scopes.js'

/**
 * @ignore
 * @typedef {TYPES.HUBSPOT_AUTH_CONFIG} HUBSPOT_AUTH_CONFIG {@link HUBSPOT_AUTH_CONFIG}
 */

/**
 * #### request validation
 * @async
 * @private
 * @param {number} portalId - hubspot account id
 * @param {string} themeName - theme name
 * @param {any} spinner - ora spinner
 * @returns {Promise<any>} portal name|names
 */
async function requestHubspotValidation (portalId, themeName, spinner) {
  try {
    const assetType = 'THEME'
    const requestGroup = 'EXTERNAL_DEVELOPER'
    console.debug = () => {}
    const requestResult = await requestValidation(portalId, {
      path: themeName,
      assetType,
      requestGroup
    })
    console.debug = savedConsoleDebug
    return requestResult
  } catch (error) {
    if (error.statusCode === 409) {
      spinner.fail()
      console.log(error.error.message)
      process.exit(1)
    }
    spinner.fail()
    console.error(error)
    process.exit(1)
  }
}

/**
 * #### check validation status and wait for validation to complete
 * @async
 * @private
 * @param {number} accountId - hubspot account id
 * @param {string} validationId - hubspot validation id
 * @param {any} spinner - ora spinner
 * @returns undefined
 */
async function checkHubspotValidationStatus (accountId, validationId, spinner) {
  try {
    const checkValidationStatus = async () => {
      const validationStatus = await getValidationStatus(accountId, {
        validationId
      })

      if (validationStatus === 'REQUESTED') {
        await new Promise(resolve => setTimeout(resolve, 2000))
        await checkValidationStatus()
      }
    }
    await checkValidationStatus()
  } catch (error) {
    spinner.fail()
    console.error(error)
    process.exit(1)
  }
}

/**
 * #### Fetch validation results
 * @async
 * @private
 * @param {number} accountId - hubspot account id
 * @param {string} validationId - hubspot validation id
 * @returns {Promise<any>} validation results
 */
async function fetchHubspotValidationResults (accountId, validationId) {
  try {
    const validationResults = await getValidationResults(accountId, {
      validationId
    })
    return validationResults
  } catch (error) {
    console.error(error)
    process.exit(1)
  }
}

/**
 * #### Display validation errors
 * @private
 * @param {any} validationResults - validation results
 * @returns undefined
 * @throws {Error} - process.exit(1) if validation errors
 */
function showValidationErrors (validationResults) {
  if (validationResults.errors.length) {
    const { errors } = validationResults
    errors.forEach((/** @type {any} */ error) => {
      console.error(`${chalk.red('[Error]')} ${error.failureReasonType}`)
      console.error(error)
    })
    process.exit(1)
  }
}

/**
 * #### Display validation results
 * @private
 * @param {any} validationResults - validation results
 * @returns undefined
 */
function showValidationResults (validationResults) {
  const showFileInfo = (/** @type {String} */ file, /** @type {String} */ line) => {
    const filePrefix = line ? ` ${chalk.dim('├')}` : ` ${chalk.dim('└')}`
    const fileTemplate = `${filePrefix}${chalk.dim('──')} File: ${chalk.green(file)}`
    const lineTemplate = ` ${chalk.dim('└──')} Line: ${chalk.yellow(line)}`
    if (line) {
      console.log(`${fileTemplate}\n${lineTemplate}`)
    } else if (file) {
      console.log(`${fileTemplate}`)
    }
  }

  if (validationResults) {
    const { status, results } = validationResults
    if (status === 'FAIL') {
      const failedValidations = results.filter(
        (/** @type {{status: string}} */ test) => test.status === 'FAIL'
      )
      const warningValidations = results.filter(
        (/** @type {{status: string}} */ test) => test.status === 'WARN'
      )
      failedValidations.forEach((/** @type {any} */ val) => {
        console.error(`\n${chalk.red.bold('[ERROR]')} ${val.description}`)
        console.warn(`${chalk.dim('doc-link:')} ${val.documentationLink}`)
        showFileInfo(val.file, val.line)
      })
      warningValidations.forEach((/** @type {any} */ val) => {
        console.warn(`\n${chalk.yellow.bold('[WARN]')} ${val.description}`)
        console.warn(`${chalk.dim('doc-link:')} ${val.documentationLink}`)
        showFileInfo(val.file, val.line)
      })
    }
    if (status === 'PASS') {
      results.forEach((/** @type {any} */ test) => {
        if (test.status === 'WARN') {
          console.warn(`\n${chalk.yellow.bold('[WARN]')} ${test.description}`)
          console.warn(`${chalk.dim('doc-link:')} ${test.documentationLink}`)
          showFileInfo(test.file, test.line)
        }
      })
    }
  }
}

/**
 * #### Theme marketplace validation
 * @async
 * @param {HUBSPOT_AUTH_CONFIG} config - hubspot authentication config
 * @param {string} themeName - theme name
 * @returns {Promise<Object>} validation results
 */
async function marketplaceValidate (config, themeName) {
  try {
    const timeStart = ui.startTask('marketplaceValidate')
    const portalId = config.portals[0].portalId

    throwErrorIfMissingScope(config, 'design_manager')
    const spinner = ora('Request Marketplace validation').start()
    const validationId = await requestHubspotValidation(portalId, themeName, spinner)
    await checkHubspotValidationStatus(portalId, validationId, spinner)
    spinner.succeed()
    console.log(`Validation ID: ${validationId}`)
    const validationResults = await fetchHubspotValidationResults(portalId, validationId)
    showValidationErrors(validationResults)

    const { status } = validationResults.results.REQUIRED
    if ('REQUIRED' in validationResults.results) {
      console.log(chalk.dim.red('\nRequired changes'))
      showValidationResults(validationResults.results.REQUIRED)
    }
    if ('RECOMMENDED' in validationResults.results) {
      console.log('\nRecommended changes')
      showValidationResults(validationResults.results.RECOMMENDED)
    }
    if (status === 'PASS') {
      console.log(`\n${chalk.green.bold('[PASS]')} no errors found`)
    } else if (status === 'FAIL') {
      console.error(`\n${chalk.red.bold('[FAIL]')} Marketplace Validation failed`)
      process.exitCode = 1
    }

    ui.endTask({ taskName: 'marketplaceValidate', timeStart })
    return validationResults
  } catch (error) {
    console.error(error)
    process.exit(1)
  }
}

export { marketplaceValidate }
