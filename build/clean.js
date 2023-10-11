import { deleteAsync } from 'del'
import path from 'node:path'

/**
 * #### Clean the docs folder
 * @async
 * @returns undefined
 */
async function cleanDocs () {
  try {
    const cwd = process.cwd()
    const dirName = path.parse(cwd).name
    if (dirName === 'hubspot-cms-lib') {
      await deleteAsync([`${cwd}/docs/**/*`])
      console.log('Clean docs folder')
    }
  } catch (error) {
    console.error(error)
  }
}

export { cleanDocs }
