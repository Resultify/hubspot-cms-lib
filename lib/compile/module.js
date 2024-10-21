/** @module compile/module */
/// <reference path="../types/types.js" />
import fsPromises from 'fs/promises'
import { getFileList, isFileDir } from '../utils/fs.js'
import * as ui from '../utils/ui.js'
import fs from 'fs'
import path from 'path'
import { pipeline } from 'stream/promises'
import readline from 'readline'
import { copy } from 'fs-extra/esm'
import { deleteAsync } from 'del'

/**
 * #### Read from a file and return a readable stream
 * @private
 * @param {string} filePath - env variables
 * @returns {fs.ReadStream} readable stream
 */
function createReadStream (filePath) {
  return fs.createReadStream(filePath, 'utf8')
}

/**

 * #### insert content into a file using streams
 * @async
 * @private
 * @param {string} destinationFile - destination file
 * @param {string} insertContent - content to insert
 * @param {string} initialContent - initial content
 * @param {number} index - index
 * @returns undefined
 */
async function insertContentIntoFile (destinationFile, insertContent, initialContent, index) {
  // Create a temp file to write the content to
  const tempFilePath = `standalone-modules/temp${index}`
  // Write the content to the temp file
  const writeStream = fs.createWriteStream(tempFilePath, 'utf8')

  writeStream.write(insertContent)
  await pipeline(initialContent, writeStream)
  writeStream.end()

  // Replace the original file with the temp file
  await fsPromises.rename(tempFilePath, destinationFile)
}

/**
 * #### concatenate content from multiple streams
 * @async
 * @private
 * @param {fs.ReadStream[]} streams - list of streams
 * @returns {Promise<string>} concatenated content
 */
async function concatenateStreams (streams) {
  let concatenatedContent = ''
  // add patterns to remove blocks
  const rmblockPattern = /{#.*\[rmstart\] #}[\s\S]*?{#.*\[rmend\] #}/g
  const rmTmplBlockPattern = /<!--[\s\S]*?-->/g
  const importblockPattern = /{%\s*import.*%}/g

  for (const stream of streams) {
    const rl = readline.createInterface({
      input: stream,
      crlfDelay: Infinity
    })

    for await (const line of rl) {
      concatenatedContent += line + '\n'
    }
    concatenatedContent = concatenatedContent.replace(rmblockPattern, '')
    concatenatedContent = concatenatedContent.replace(importblockPattern, '')
    concatenatedContent = concatenatedContent.replace(rmTmplBlockPattern, '')
  }
  return concatenatedContent
}

/**
 * #### files to include during standalone module compilation
 * @typedef {Object} FileIncludes
 * @property {Array<string>} files - list of files to include
 * @property {Array<string>} dirs - list of directories to include
 */

/**
 * #### module initial configuration to be used during standalone module compilation
 * @typedef {Object} InitModuleConfig
 * @property {JSON} meta - module meta data
 * @property {FileIncludes} template - module template data
 * @property {FileIncludes} js - module js data
 * @property {FileIncludes} css - module css data
 */

/**
 * #### Standalone Modules Config
 * @typedef {Object} StandaloneModulesConfig
 * @property {string} moduleSrcConfigFile - path to the config file defining the module source
 * @property {string} moduleSrcName - module source name
 * @property {string} moduleSrcPath - path to the module source
 * @property {string} newModuleName - new module name
 * @property {string} newModulePath - path to the new module
 * @property {JSON} newModuleMeta - module meta data
 * @property {(FILE_LIST | { path: string; name: string; })[]} newModuleTemplateIncludes - path to the module template includes
 * @property {(FILE_LIST | { path: string; name: string; })[]} newModuleJsIncludes - path to the module js includes
 * @property {(FILE_LIST | { path: string; name: string; })[]} newModuleCssIncludes - path to the module css includes
 */

/**
 * #### Collect File Includes
 * @async
 * @private
 * @param {FileIncludes} fileIncludes - files to include
 * @param {string} moduleSrcName - module source name
 * @returns {Promise<(FILE_LIST|{ path: string; name: string;})[]>} list of files to include
 */
async function collectFileIncludes (fileIncludes, moduleSrcName) {
  const files = []
  if (fileIncludes !== undefined) {
    for await (const dir of fileIncludes.dirs) {
      const dirFiles = await getFileList(`${dir}`, { objectMode: true })
      files.push(...dirFiles)
    }
    for await (let file of fileIncludes.files) {
      if (file.includes('module.html')) {
        file = `theme/modules/${moduleSrcName}/${file}`
      } else if (file.includes('module.css')) {
        file = `theme/modules/${moduleSrcName}/${file}`
      } else if (file.includes('module.js')) {
        file = `theme/modules/${moduleSrcName}/${file}`
      }

      if (await isFileDir(`${file}`)) {
        files.push({ path: `${file}`, name: path.basename(file) })
      }
    }
  }
  return files
}

/**
 * #### Parse Standalone Modules Config
 * @async
 * @private
 * @param {FILE_LIST[]} configFiles - env variables
 * @returns {Promise<StandaloneModulesConfig[]>} standalone modules config
 */
async function parseStandaloneModulesConfig (configFiles) {
  /**
   * @type {Array<StandaloneModulesConfig>}
   */
  const config = []
  if (configFiles !== undefined) {
    for await (const file of configFiles) {
      if (await isFileDir(file.path)) {
        const data = await import(file.path)
        const moduleSrcName = file.name.replace('.js', '')
        const moduleSrcPath = `theme/modules/${moduleSrcName}`
        let newModuleName = moduleSrcName
        if (data.default && data.default.name) {
          const newModuleNameVal = data.default.name
          newModuleName = `${newModuleNameVal.toLowerCase()
            .replace(/\s+/g, '-') // Replace spaces with dashes
            .replace(/[^a-z0-9-]/g, '')}.module` // Remove non-alphanumeric characters except dashes
        }
        const newModulePath = `standalone-modules/${newModuleName}`
        if (await isFileDir(moduleSrcPath)) {
          /**
           * @type {StandaloneModulesConfig}
           */
          const moduleConfig = {
            moduleSrcConfigFile: file.path,
            moduleSrcName,
            moduleSrcPath,
            newModuleName,
            newModulePath,
            newModuleMeta: data.default.meta,
            newModuleTemplateIncludes: await collectFileIncludes(data.default.template, moduleSrcName),
            newModuleJsIncludes: await collectFileIncludes(data.default.js, moduleSrcName),
            newModuleCssIncludes: await collectFileIncludes(data.default.css, moduleSrcName)
          }
          config.push(moduleConfig)
        }
      }
    }
  }
  return config
}

/**
 * #### update module meta data
 * @async
 * @private
 * @param {StandaloneModulesConfig} config - module config
 * @returns undefined
 */
async function updateModuleMeta (config) {
  const existingMeta = await fsPromises.readFile(`${config.newModulePath}/meta.json`, 'utf8')
  if (existingMeta !== undefined) {
    const existingMetaObj = JSON.parse(existingMeta || '{}')
    const updatedMeta = JSON.stringify({ ...existingMetaObj, ...config.newModuleMeta }, null, 2)
    await fsPromises.writeFile(`${config.newModulePath}/meta.json`, updatedMeta, 'utf8')
  }
}

/**
 * #### Compile Module
 * @async
 * @param {boolean} [hideStatus] - hide status messages
 * @returns undefined
 */
async function compileModule (hideStatus) {
  try {
    const timeStart = ui.startTask('compileModule')

    const moduleSrcConfigFiles = await getFileList(`${process.cwd()}/standalone-modules/*module.js`, { objectMode: true })
    const config = await parseStandaloneModulesConfig(moduleSrcConfigFiles)
    const fileList = []
    for await (const [index, module] of config.entries()) {
      // create destination directory
      await fsPromises.mkdir(module.newModulePath, { recursive: true })
      // delete all files in the destination directory
      await deleteAsync([`${module.newModulePath}/*`], { force: true })
      // copy source files to destination directory
      await copy(`${module.moduleSrcPath}`, `${module.newModulePath}`)
      // update module meta data
      await updateModuleMeta(module)

      // create readable streams for all source files
      const templateSrcStream = module.newModuleTemplateIncludes.map(filePath => createReadStream(filePath.path))
      const templateDistStream = createReadStream(`${module.newModulePath}/module.html`)
      const jsDistStream = createReadStream(`${module.moduleSrcPath}/module.js`)
      const jsSrcStream = module.newModuleJsIncludes.map(filePath => createReadStream(filePath.path))
      const cssDistStream = createReadStream(`${module.moduleSrcPath}/module.css`)
      const cssSrcStream = module.newModuleCssIncludes.map(filePath => createReadStream(filePath.path))

      // concatenate content from all source streams
      const concatTemplateSrc = await concatenateStreams(templateSrcStream)
      const concatTemplateDist = await concatenateStreams([templateDistStream])
      const concatJsDist = await concatenateStreams([jsDistStream])
      const concatJsSrc = await concatenateStreams(jsSrcStream)
      const concatCssDist = await concatenateStreams([cssDistStream])
      const concatCssSrc = await concatenateStreams(cssSrcStream)

      // insert the concatenated content into the destination file
      await insertContentIntoFile(`${module.newModulePath}/module.html`, concatTemplateSrc, concatTemplateDist, index)
      await insertContentIntoFile(`${module.newModulePath}/module.js`, concatJsSrc, concatJsDist, index)
      await insertContentIntoFile(`${module.newModulePath}/module.css`, concatCssSrc, concatCssDist, index)
      // remove unnecessary files
      await deleteAsync([`${module.newModulePath}/fields.js`], { force: true })

      const file = {
        name: `${module.newModulePath}.js`,
        size: '',
        dist: `${module.moduleSrcPath} --> ${module.newModulePath}`
      }
      fileList.push(file)
    }

    hideStatus || ui.endTask({ files: fileList, taskName: 'compileModule', timeStart })
  } catch (error) {
    console.error(error)
  }
}

export { compileModule }
