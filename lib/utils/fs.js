/** @module utils/fs */

import * as TYPES from '../types/types.js' // eslint-disable-line no-unused-vars
import { globby } from 'globby'
import fsPromises from 'fs/promises'

/**
 * @ignore
 * @typedef {TYPES.FILE_LIST} FILE_LIST {@link FILE_LIST}
 */

/**
 * #### get file list based on glob pattern
 * @async
 * @param {string} glob - glob pattern
 * @param {Object} options - options
 * @returns {Promise<Array<FILE_LIST>>} node file list
 */
async function getFileList (glob, options) {
  /**
   * ####
   * @type {Array<string|any>}
   */
  const files = await globby(glob, options)
  return files
}

/**
 * #### check if file/dir exists
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
    return false
  }
}

export { getFileList, isFileDir }
