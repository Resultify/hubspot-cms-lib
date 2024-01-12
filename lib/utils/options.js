/** @module utils/options */

import * as TYPES from '../types/types.js' // eslint-disable-line no-unused-vars
import { createRequire } from 'module'
import chalk from 'chalk'
const require = createRequire(import.meta.url)

/**
 * @ignore
 * @typedef {TYPES.THEME_OPTIONS} THEME_OPTIONS {@link THEME_OPTIONS}
 */

/**
 * #### Get theme options from package.json
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
        vendorSrc: 'vendor',
        vendorDest: 'theme/vendor'
      }
    }
    if (packageJson.cmslib.vendorSrc === undefined) {
      packageJson.cmslib.vendorSrc = 'vendor'
    }
    if (packageJson.cmslib.vendorDest === undefined) {
      packageJson.cmslib.vendorDest = 'theme/vendor'
    }
    if (packageJson.cmslib.themeFolder === undefined) {
      packageJson.cmslib.themeFolder = 'theme'
    }
    if (packageJson.cmslib.lighthouse === undefined) {
      packageJson.cmslib.lighthouse = {
        performance: 75,
        accessibility: 90,
        bestPractices: 90,
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
