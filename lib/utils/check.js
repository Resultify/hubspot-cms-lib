/** @module lib/check */

import { createRequire } from 'module'
import semver from 'semver'
import chalk from 'chalk'
const require = createRequire(import.meta.url)

/**
 * @summary Check node version
 * @description Will throw an error if node version is wrong and if no engines config in package,json
 * @returns undefined
 * @throws console.error & process.exit(1) if node version is wrong
 * @example
 * import { checkNode } from './check.js'
 * checkNode()
 */
async function checkNode () {
  let nodeEngine = require(`${process.cwd()}/package.json`)
  if (!nodeEngine.engines || !nodeEngine?.engines?.node) {
    console.error(`${chalk.red.bold('ERROR')}: The engine config in the ${chalk.cyan('packaje.json')} file does not specify a node version`)
    process.exit(1)
  }
  nodeEngine = nodeEngine.engines.node
  if (!semver.satisfies(process.version, nodeEngine)) {
    console.error(`${chalk.red.bold('ERROR')}: Required node version ${chalk.cyan(nodeEngine)} not satisfied with current version ${process.version}`)
    process.exit(1)
  }
}

/**
 * @summary Check package.json name and theme.json name
 * @description Will throw an error if package.json[name] != theme.json[name]
 * @returns undefined
 * @throws console.error & process.exit(1) if package.json[name] != theme.json[name]
 * @example
 * import { checkPackageThemeConsistent } from './check.js'
 * checkPackageThemeConsistent()
 */
function checkPackageThemeConsistent () {
  if (require(`${process.cwd()}/package.json`).name !== require(`${process.cwd()}/theme/theme.json`).name) {
    console.error(`${chalk.red.bold('ERROR')}: ${chalk.cyan('package.json')} name should be equal to ${chalk.cyan('theme/theme.json')} name`)
    process.exit(1)
  }
}

export { checkNode, checkPackageThemeConsistent }
