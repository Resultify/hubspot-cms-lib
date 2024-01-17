import chalk from 'chalk'
import minimist from 'minimist'

const argOptions = {
  boolean: [
    'build',
    'watch',
    'fetch',
    'fetchModules',
    'upload',
    'validate',
    'lighthouse',
    'fields',
    'fetchDb',
    'uploadDb'
  ],
  stopEarly: true,
  '--': true,
  unknown: (/** @type {any} */ arg) => {
    console.error(`${chalk.red('Unknown')} or unexpected option: ${arg}`)
    process.exit(1)
  }
}

/**
 * #### parse cli args
 * @returns {any} cli args
 */
function parseArgs () {
  return minimist(process.argv.slice(2), argOptions)
}

export { parseArgs }
