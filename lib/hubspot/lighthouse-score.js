/** @module hubspot/lighthouseScore */

import * as T from '../config/types.js' // eslint-disable-line
import { requestLighthouseScore, getLighthouseScoreStatus, getLighthouseScore } from '@hubspot/cli-lib/api/lighthouseScore.js'
import chalk from 'chalk'
import Table from 'cli-table3'
import ora from 'ora'
import { globals } from '../config/globals.js'
import * as utils from '../utils/ui.js'
import { loadAuthConfig } from './auth.js'

/**
 * @type {T.LIGHTHOUSE_THRESHOLD}
 */
const internalLighthouseThreshold = {
  performance: 80,
  accessibility: 90,
  bestPractices: 90,
  seo: 80
}

/**
 * @summary get Mobile Lighthouse Score for theme
 * @async
 * @param {T.THEME_HUB_AUTH_CONFIG|string} customAuthConfig - Rusultify custom Hubspot authentication
 * @param {T.THEME_BUILD_OPTIONS} opt - task options
 * @returns {Promise<Object>} lighthouse score results for mobile
 */
async function lighthouseScore (customAuthConfig, opt) {
  try {
    const timeStart = utils.startTask('Lighthouse Score')
    const hubconf = await loadAuthConfig(customAuthConfig)
    const portalId = hubconf.portals[0].portalId
    /**
     * @type {T.LIGHTHOUSE_THRESHOLD}
     */
    const lighthouseThreshold = opt?.config?.lighthouse?.threshold ?? internalLighthouseThreshold
    const spinner = ora('Request Lighthouse score').start()

    // Request Lighthouse score
    /**
     * @type {any}
     */
    let requestResult
    try {
      requestResult = await requestLighthouseScore(portalId, {
        themePath: globals.THEME_NAME
      })
    } catch (error) {
      spinner.fail()
      console.error(error)
      process.exit(1)
    }
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
    if (process.argv.slice(2)[0] === '--verbose') {
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
    const showTrashold = (/** @type {T.LIGHTHOUSE_THRESHOLD} */ threshold) => {
      console.log(`\nProject Lighthouse threshold: Accessibility:${threshold.accessibility}, Best Practices:${threshold.bestPractices}, Performance:${threshold.performance}, SEO:${threshold.seo}`)
    }

    /**
     * @summary compare Lighthouse score with threshold
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
    const exitWithErrorIfLighthouseThreshold = (/** @type {T.LIGHTHOUSE_SCORE} */ scores, /** @type {T.LIGHTHOUSE_THRESHOLD} */ thresholds) => {
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
     * @summary
     * @private
     * @param {{scores: T.LIGHTHOUSE_SCORE[]}} results
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
     * @summary
     * @private
     * @param {{scores: T.LIGHTHOUSE_SCORE[]}} results
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
        console.log(`\n${chalk.cyan(globals.THEME_NAME)} Average Mobile Lighthouse scores`)
        showAverageResults(averageMobileScoreResult)
        showVerboseResults(mobileScoreResult)
      }
    } else {
      if ('scores' in averageMobileScoreResult) {
        console.log(`\n${chalk.cyan(globals.THEME_NAME)} Average Mobile Lighthouse scores`)
        showAverageResults(averageMobileScoreResult)
        console.log('This is the average of all theme templates')
        console.log('Use the [-- --verbose] option to include individual template scores')
      }
    }

    console.log('Powered by Google Lighthouse\n')
    console.log(`id:${requestResult.mobileId}`)
    exitWithErrorIfLighthouseThreshold(averageMobileScoreResult.scores[0], lighthouseThreshold)
    utils.endTask({ taskName: 'Lighthouse score', timeStart })
    return mobileScoreResult
  } catch (error) {
    console.error(error)
    process.exit(1)
  }
}

export { lighthouseScore }