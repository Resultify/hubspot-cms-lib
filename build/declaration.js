import { execa } from 'execa'
import { cleanDTs } from './clean.js'
/**
 * @summary generate d.ts and d.ts.map files
 * @description npm exec -- tsc -p jsconfig.json --noEmit false --allowJs -d --emitDeclarationOnly --declarationMap
 * @private
 * @async
 * @returns undefined
 */
async function generateTsDeclarations () {
  try {
    const config = [
      '-p',
      'jsconfig.json',
      '--noEmit',
      'false',
      '--allowJs',
      '-d',
      '--emitDeclarationOnly',
      '--declarationMap',
      '--maxNodeModuleJsDepth',
      '0'
    ]
    await execa('npm', ['exec', '--', 'tsc', ...config])
  } catch (error) {
    console.error(error)
  }
}

async function init () {
  await cleanDTs()
  await generateTsDeclarations()
}

init()
