/** @module lib/utils/fs */

import { globby } from 'globby'
import fsPromises from 'fs/promises'

/**
 * @summary get file list based on glob pattern
 * @async
 * @param {string} glob - glob pattern
 * @param {Object} options - options
 * @returns {Promise<Array>} node file list
 */
async function getFileList (glob, options) {
  try {
    const files = await globby(glob, options)
    if (files !== undefined) {
      return files
    }
  } catch (error) {
    console.error(`(getFileList ${glob} ${options} ) Error:`, error)
  }
}

/**
 * @summary check if file/dir exists
 * @async
 * @param {string} path - file/dir path
 * @returns {Promise<boolean>}
 */
async function isFileDir (path) {
  try {
    await fsPromises.stat(path)
    return true
  } catch (error) {
    if (error.code === 'ENOENT') {
      return false
    }
    console.error(error)
  }
}

/**
 * @summary Append data to file
 * @async
 * @param {string} path - file/dir path
 * @param {string} data - data info
 * @returns undefined
 */
async function addFileData (path, data) {
  try {
    await fsPromises.appendFile(path, data)
  } catch (error) {
    console.error(error)
  }
}

export { getFileList, addFileData, isFileDir }
