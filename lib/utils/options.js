/** @module utils/options */
/// <reference path="../types/types.js" />
import { createRequire } from 'module'
import chalk from 'chalk'
const require = createRequire(import.meta.url)

/**
 * #### Get theme options from package.json cmslib property
 * @returns {THEME_OPTIONS}
 */
function getThemeOptions () {
  try {
    const packageJson = require(`${process.cwd()}/package.json`)
    if (packageJson.cmslib === undefined) {
      console.warn(`${chalk.dim.red('Warning')}: ${chalk.cyan('package.json')} does not contain any ${chalk.cyan('cmslib')} related options`)
      packageJson.cmslib = {
        lighthouse: {
          threshold: { performance: 85, accessibility: 90, bestPractices: 90, seo: 90 }
        },
        themeFolder: 'theme',
        hubdbFolder: 'hubdb',
        vendorSrc: 'vendor',
        vendorDest: 'theme/vendor'
      }
    }
    if (packageJson.cmslib.themeFolder === undefined) {
      packageJson.cmslib.themeFolder = 'theme'
    }
    if (packageJson.cmslib.hubdbFolder === undefined) {
      packageJson.cmslib.hubdbFolder = 'hubdb'
    }
    if (packageJson.cmslib.vendorSrc === undefined) {
      packageJson.cmslib.vendorSrc = 'vendor'
    }
    if (packageJson.cmslib.vendorDest === undefined) {
      packageJson.cmslib.vendorDest = 'theme/vendor'
    }
    if (packageJson.cmslib.lighthouse === undefined) {
      packageJson.cmslib.lighthouse = {
        performance: 75,
        accessibility: 90,
        bestPractices: 80,
        seo: 80
      }
    }
    return packageJson.cmslib
  } catch (error) {
    console.error(`${chalk.red.bold('ERROR')}: ${chalk.cyan('package.json')} does not exist`)
    process.exit(1)
  }
}

export { getThemeOptions }
