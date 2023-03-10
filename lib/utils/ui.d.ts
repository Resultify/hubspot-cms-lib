export type THEME_FILE_INFO = {
    name?: string | undefined;
    path?: string | undefined;
    dist?: string | undefined;
    size?: string | undefined;
};
export type EndTask = {
    /**
     * - file list
     */
    files?: THEME_FILE_INFO[] | undefined;
    taskName: string;
    timeStart: number;
};
/**
 * @summary Start task message
 * @description Show in console start task message with timestamp
 * @param {string} taskName - task name
 * @returns {number} timestamp
 * @example
 * const timeStart = utils.startTask('Compile CSS')
 */
export function startTask(taskName: string): number;
/**
 * @summary end task/tasks options
 * @typedef EndTask
 * @type {object}
 * @property {Array<THEME_FILE_INFO>} [files] - file list
 * @property {string} taskName
 * @property {number} timeStart
 */
/**
 * @summary End task console message
 * @description End task console message with date, title, time and filelist if present
 * @param {EndTask} options - EndTask options
 * @returns undefined
 * @example
 * utils.endTask({taskName: 'Compile CSS', timeStart: 1663932841247 })
 */
export function endTask(options: EndTask): void;
/**
 * @summary Start task group message
 * @description Show in console start task group message with timestamp
 * @param {string} taskName - Task name
 * @returns {number} timestart timestamp
 * @example
 * const timeStart = utils.startTaskGroup('Build task')
 */
export function startTaskGroup(taskName: string): number;
/**
 * @summary End group of tasks info
 * @description End group of tasks console message with date, title and time
 * @param {EndTask} options - End task options
 * @returns undefined
 * @example
 * utils.endTaskGroup({ taskName: 'Build task', timeStart: 1663932841247 })
 */
export function endTaskGroup(options: EndTask): void;
/**
 * @summary File Info
 * @typedef THEME_FILE_INFO
 * @type {object}
 * @property {string} [name]
 * @property {string} [path]
 * @property {string} [dist]
 * @property {string} [size]
 */
/**
 * @summary convert file size B -> kB/MB
 * @param {number} size - env variables
 * @returns {string} file size B/kB/MB
 * @example
 * convertFileSize(size)
 */
export function convertFileSize(size: number): string;
//# sourceMappingURL=ui.d.ts.map