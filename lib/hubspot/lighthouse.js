/** @module hubspot/lighthouseScore */

import * as TYPES from '../types/types.js' // eslint-disable-line no-unused-vars
import { requestLighthouseScore, getLighthouseScoreStatus, getLighthouseScore } from '@hubspot/cli-lib/api/lighthouseScore.js'
import chalk from 'chalk'
import Table from 'cli-table3'
import ora from 'ora'
import { savedConsoleDebug } from '../utils/console.js'
import { getThemeOptions } from '../utils/options.js'
import * as ui from '../utils/ui.js'
import { cleanUploadThemeTemplates } from '../hubspot/upload.js'

/**
 * @ignore
 * @typedef {TYPES.HUBSPOT_AUTH_CONFIG} HUBSPOT_AUTH_CONFIG {@link HUBSPOT_AUTH_CONFIG}
 * @typedef {TYPES.LIGHTHOUSE_THRESHOLD} LIGHTHOUSE_THRESHOLD {@link LIGHTHOUSE_THRESHOLD}
 * @typedef {TYPES.LIGHTHOUSE_SCORE} LIGHTHOUSE_SCORE {@link LIGHTHOUSE_SCORE}
 */

/**
 * #### get Mobile Lighthouse Score for theme
 * @async
 * @param {HUBSPOT_AUTH_CONFIG} config - hubspot authentication config
 * @param {string} themeName - theme name
 * @returns {Promise<Object>} lighthouse score results for mobile
 */
async function lighthouseScore (config, themeName) {
  try {
    // reupload all templates
    await cleanUploadThemeTemplates(config, themeName)

    const timeStart = ui.startTask('LighthouseScore')

    const cmslibOptions = getThemeOptions()
    const portalId = config.portals[0].portalId

    /**
     * @type {LIGHTHOUSE_THRESHOLD}
     */
    const lighthouseThreshold = cmslibOptions?.lighthouse
    const spinner = ora('Request Lighthouse score').start()

    // Request Lighthouse score
    /**
     * @type {any}
     */
    let requestResult
    console.debug = () => {}
    try {
      requestResult = await requestLighthouseScore(portalId, {
        themePath: themeName
      })
    } catch (error) {
      spinner.fail()
      console.error(error)
      process.exit(1)
    }
    console.debug = savedConsoleDebug
    if (!requestResult || !requestResult.mobileId) {
      console.error('\nFailed to get Lighthouse score')
      process.exit(1)
    }
    // check status
    try {
      const checkScoreStatus = async () => {
        const mobileScoreStatus = await getLighthouseScoreStatus(portalId, { themeId: requestResult.mobileId })
        if (mobileScoreStatus === 'REQUESTED') {
          await new Promise(resolve => setTimeout(resolve, 2000))
          await checkScoreStatus()
        }
      }
      await checkScoreStatus()
      spinner.succeed()
    } catch (error) {
      spinner.fail()
      console.error(error)
      process.exit(1)
    }
    // get Lighthouse score results
    let mobileScoreResult
    let averageMobileScoreResult
    let verbose = false
    if (process.argv.slice(1)[0] === '--verbose') {
      verbose = true
    }
    try {
      averageMobileScoreResult = await getLighthouseScore(portalId, { isAverage: true, mobileId: requestResult.mobileId })
      if (verbose) {
        mobileScoreResult = await getLighthouseScore(portalId, { isAverage: false, mobileId: requestResult.mobileId })
      }
    } catch (error) {
      console.error(error)
      process.exit(1)
    }

    // show trashold numbers in console
    const showTrashold = (/** @type {LIGHTHOUSE_THRESHOLD} */ threshold) => {
      console.log(`${chalk.cyan(themeName)} Lighthouse threshold: Accessibility:${threshold.accessibility}, Best Practices:${threshold.bestPractices}, Performance:${threshold.performance}, SEO:${threshold.seo}`)
    }

    /**
     * #### compare Lighthouse score with threshold
     * @private
     * @param {number} val - env variables
     * @param {number} threshold - env variables
     * @returns {string} portal name|names
     */
    const compareLighthouseThreshold = (val, threshold) => {
      if (val <= threshold) {
        return chalk.red(val)
      }
      return chalk.dim(val)
    }
    // exit with error if Lighthouse score is lower than threshold
    const exitWithErrorIfLighthouseThreshold = (/** @type {LIGHTHOUSE_SCORE} */ scores, /** @type {LIGHTHOUSE_THRESHOLD} */ thresholds) => {
      if (scores.accessibilityScore <= thresholds.accessibility) {
        console.error(`${chalk.dim.red('[Error]')} Lighthouse Accessibility score is lower than ${chalk.yellow(thresholds.accessibility)}`)
        process.exitCode = 1
        return
      }
      if (scores.bestPracticesScore <= thresholds.bestPractices) {
        console.error(`${chalk.dim.red('[Error]')} Lighthouse Best Practices score is lower than ${chalk.yellow(thresholds.bestPractices)}`)
        process.exitCode = 1
        return
      }
      if (scores.performanceScore <= thresholds.performance) {
        console.error(`${chalk.dim.red('[Error]')} Lighthouse Performance score is lower than ${chalk.yellow(thresholds.performance)}`)
        process.exitCode = 1
        return
      }
      if (scores.seoScore <= thresholds.seo) {
        console.error(`${chalk.dim.red('[Error]')} Lighthouse SEO score is lower than ${chalk.yellow(thresholds.seo)}`)
        process.exitCode = 1
      }
    }

    /**
     * ####
     * @private
     * @param {{scores: LIGHTHOUSE_SCORE[]}} results
     * @returns undefined
     */
    const showAverageResults = (results) => {
      const { accessibilityScore, bestPracticesScore, performanceScore, seoScore } = results.scores[0]
      const averageScoreTable = new Table()
      averageScoreTable.push(
        { Accessibility: compareLighthouseThreshold(accessibilityScore, lighthouseThreshold?.accessibility) },
        { 'Best Practices': compareLighthouseThreshold(bestPracticesScore, lighthouseThreshold.bestPractices) },
        { Performance: compareLighthouseThreshold(performanceScore, lighthouseThreshold.performance) },
        { SEO: compareLighthouseThreshold(seoScore, lighthouseThreshold.seo) }
      )
      console.log(averageScoreTable.toString())
    }

    /**
     * ####
     * @private
     * @param {{scores: LIGHTHOUSE_SCORE[]}} results
     * @returns undefined
     */
    const showVerboseResults = results => {
      const templateTableData = results.scores.map(score => {
        return [
          score.templatePath,
          compareLighthouseThreshold(score.accessibilityScore, lighthouseThreshold.accessibility),
          compareLighthouseThreshold(score.bestPracticesScore, lighthouseThreshold.bestPractices),
          compareLighthouseThreshold(score.performanceScore, lighthouseThreshold.performance),
          compareLighthouseThreshold(score.seoScore, lighthouseThreshold.seo)
        ]
      })

      const scoreTable = new Table({
        head: ['Template path', 'Accessibility', 'Best Practices', 'Performance', 'SEO'],
        style: { head: ['yellow'] }
      })
      scoreTable.push(...templateTableData)
      console.log('\nPage template scores')
      console.log(scoreTable.toString())

      console.log('\nLighthouse links')
      results.scores.forEach(score => {
        console.log(`${score.templatePath}: ${chalk.cyan(score.link)}`)
      })
    }

    showTrashold(lighthouseThreshold)

    if (verbose) {
      if ('scores' in averageMobileScoreResult && 'scores' in mobileScoreResult) {
        console.log(`${chalk.cyan(themeName)} Average Mobile Lighthouse scores`)
        showAverageResults(averageMobileScoreResult)
        showVerboseResults(mobileScoreResult)
      }
    } else {
      if ('scores' in averageMobileScoreResult) {
        console.log(`${chalk.cyan(themeName)} Average Mobile Lighthouse scores`)
        showAverageResults(averageMobileScoreResult)
        console.log('This is the average of all theme templates')
        console.log('Use the [-- -- --verbose] option to include individual template scores')
      }
    }

    console.log('Powered by Google Lighthouse')
    console.log(`id:${requestResult.mobileId}`)
    exitWithErrorIfLighthouseThreshold(averageMobileScoreResult.scores[0], lighthouseThreshold)
    ui.endTask({ taskName: 'LighthouseScore', timeStart })
    return mobileScoreResult
  } catch (error) {
    console.error(error)
    process.exit(1)
  }
}

export { lighthouseScore }
