/** @module hubspot/marketplaceValidate */

import * as T from '../config/types.js' // eslint-disable-line
import { requestValidation, getValidationStatus, getValidationResults } from '@hubspot/cli-lib/api/marketplaceValidation.js'
import chalk from 'chalk'
import ora from 'ora'
import { globals } from '../config/globals.js'
import * as utils from '../utils/ui.js'
import { loadAuthConfig } from './auth.js'

/**
 * @summary Theme marketplace validation
 * @async
 * @param {T.THEME_HUB_AUTH_CONFIG|string} customAuthConfig - Rusultify custom Hubspot authentication
 * @returns {Promise<Object>} validation results
 */
async function marketplaceValidate (customAuthConfig) {
  try {
    const timeStart = utils.startTask('Marketplace validation')
    const hubconf = await loadAuthConfig(customAuthConfig)
    const portalId = hubconf.portals[0].portalId

    const spinner = ora('Request Marketplace validation').start()

    // request validation
    /**
     * @type {any}
     */
    let requestResult
    const assetType = 'THEME'
    const requestGroup = 'EXTERNAL_DEVELOPER'
    try {
      requestResult = await requestValidation(portalId, {
        path: globals.THEME_NAME,
        assetType,
        requestGroup
      })
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
    // check status
    try {
      const checkValidationStatus = async () => {
        const validationStatus = await getValidationStatus(portalId, {
          validationId: requestResult
        })

        if (validationStatus === 'REQUESTED') {
          await new Promise(resolve => setTimeout(resolve, 2000))
          await checkValidationStatus()
        }
      }
      await checkValidationStatus()
      spinner.succeed()
    } catch (error) {
      console.error(error)
      process.exit(1)
    }
    // get validation Results
    let validationResults
    try {
      validationResults = await getValidationResults(portalId, {
        validationId: requestResult
      })
    } catch (error) {
      console.error(error)
      process.exit(1)
    }

    if (validationResults.errors.length) {
      const { errors } = validationResults
      errors.forEach((/** @type {any} */ err) => {
        console.error(`${chalk.red('[Error]')} ${err.failureReasonType}`)
        console.error(err)
      })
      process.exit(1)
    }

    const showResults = (/** @type {any} */ validationResults) => {
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
            console.error(`\n${chalk.red.bold('[ERROR]')} ${val.message}`)
            showFileInfo(val.file, val.line)
          })

          warningValidations.forEach((/** @type {any} */ val) => {
            console.warn(`\n${chalk.yellow.bold('[WARN]')} ${val.message}`)
            showFileInfo(val.file, val.line)
          })
        }

        if (status === 'PASS') {
          results.forEach((/** @type {any} */ test) => {
            if (test.status === 'WARN') {
              console.warn(`\n${chalk.yellow.bold('[WARN]')} ${test.message}`)
              showFileInfo(test.file, test.line)
            }
          })
        }
      }
    }
    const { status } = validationResults.results.REQUIRED
    if ('REQUIRED' in validationResults.results) {
      console.log(chalk.red('\nRequired changes'))
      showResults(validationResults.results.REQUIRED)
    }
    if ('RECOMMENDED' in validationResults.results) {
      console.log('\nRecommended changes')
      showResults(validationResults.results.RECOMMENDED)
    }
    if (status === 'PASS') {
      console.log(`\n${chalk.green.bold('[PASS]')} no errors found`)
    } else if (status === 'FAIL') {
      console.error(`\n${chalk.red.bold('[FAIL]')} Marketplace Validation failed`)
      process.exitCode = 1
    }
    utils.endTask({ taskName: `Marketplace validation for ${globals.THEME_NAME}`, timeStart })
    return validationResults
  } catch (error) {
    console.error(error)
    process.exit(1)
  }
}

export { marketplaceValidate }