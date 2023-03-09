import { deleteAsync } from 'del'

/**
 * @summary clean all d.ts and d.ts.map files before generate it again
 * @async
 * @returns undefined
 */
async function cleanDTs () {
  try {
    const currentDirPath = process.cwd()
    const currentDirName = currentDirPath.split('/').pop()
    if (currentDirName === 'hubspot-cms-lib') {
      await deleteAsync([`${currentDirPath}/lib/**/*.d{.ts,.ts.map}`, `!${currentDirPath}/lib/config/index.d.ts`])
    }
  } catch (error) {
    console.error(error)
  }
}

export { cleanDTs }
