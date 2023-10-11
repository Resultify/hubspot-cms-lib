import { execa } from 'execa'

/**
 * #### run jsdoc build
 * @async
 * @returns undefined
 */
async function jsdocBuild () {
  try {
    const jsdocConfig = [
      '-c',
      'jsdoc.json'
    ]
    const { stdout } = await execa('npm', ['exec', '--', 'jsdoc', ...jsdocConfig])
    console.log(stdout)
  } catch (error) {
    console.error(error)
  }
}

export { jsdocBuild }
