import { cleanDocs } from './clean.js'
import { jsdocBuild } from './jsdoc.js'

async function docs () {
  await cleanDocs()
  await jsdocBuild()
}

export { docs }
