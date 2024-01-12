import chalk from 'chalk'
import { getThemeOptions } from '../utils/options.js'
import { createRequire } from 'module'
const require = createRequire(import.meta.url)
const cmslibOptions = getThemeOptions()

/**
 * #### Get theme name from theme.json
 * @returns {string}
 * @throws console.error & process.exit(1) if theme.json does not exist
 */
function getThemeName () {
  try {
    const themeName = require(`${process.cwd()}/${cmslibOptions.themeFolder}/theme.json`).name
    return themeName
  } catch (error) {
    console.error(`${chalk.red.bold('ERROR')}: ${chalk.cyan(`${cmslibOptions.themeFolder}/theme.json`)} does not exist`)
    process.exit(1)
  }
}

const themeName = getThemeName()

/**
 * #### Check package.json name and theme.json name
 * @description Will throw an error if package.json[name] != theme.json[name]
 * @returns undefined
 * @throws console.error & process.exit(1) if package.json[name] != theme.json[name]
 */
function checkPackageThemeConsistent () {
  if (require(`${process.cwd()}/package.json`).name !== themeName) {
    console.error(`${chalk.red.bold('ERROR')}: ${chalk.cyan('package.json')} name should be equal to ${chalk.cyan(`${cmslibOptions.themeFolder}/theme.json`)} name`)
    process.exit(1)
  }
}
checkPackageThemeConsistent()

export default themeName
