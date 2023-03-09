/**
 * @summary get file list based on glob pattern
 * @async
 * @param {string} glob - glob pattern
 * @param {Object} options - options
 * @returns {Promise<Array<T.FILE_LIST>>} node file list
 */
export function getFileList(glob: string, options: Object): Promise<Array<T.FILE_LIST>>;
/**
 * @summary Append data to file
 * @async
 * @param {string} path - file/dir path
 * @param {string} data - data info
 * @returns undefined
 */
export function addFileData(path: string, data: string): Promise<void>;
/**
 * @summary check if file/dir exists
 * @async
 * @param {string} path - file/dir path
 * @returns {Promise<boolean>}
 */
export function isFileDir(path: string): Promise<boolean>;
import * as T from "../config/types.js";
//# sourceMappingURL=fs.d.ts.map