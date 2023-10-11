/**
 * #### Additions common options
 * @description Additional options to use locally in functions
 * @typedef {Object} THEME_BUILD_OPTIONS
 * @property {Object} [config] - local theme based config
 * @property {Object} [config.js]
 * @property {Object} [config.js.replace]
 * @property {Array<string>} [config.js.external]
 * @property {Object} [config.js.globals]
 * @property {Object} [config.lighthouse]
 * @property {LIGHTHOUSE_THRESHOLD} [config.lighthouse.threshold]
 * @property {boolean} [hideStatus] - hide task status from showing in console
 * @memberof Global_Types
 */

/**
 * #### Hubspot Auth config schema internal object based on personalaccesskey
 * @typedef {Object} THEME_HUB_AUTH_CONFIG_OBJECT
 * @property {string} authType - auth Type - personalaccesskey
 * @property {number} portalId
 * @property {string} personalAccessKey
 * @property {string} env
 * @memberof Global_Types
 */

/**
 * #### Full Hubspot Auth config schema based on personalaccesskey
 * @typedef {Object} THEME_HUB_AUTH_CONFIG
 * @property {Array<THEME_HUB_AUTH_CONFIG_OBJECT>} portals
 * @memberof Global_Types
 */

/**
 * #### glob file list
 * @typedef {Object} FILE_LIST
 * @property {Object} dirnet - dirnet object
 * @property {string} name - file name
 * @property {string} path - file path
 * @property {string} size - file size
 * @property {string} dist - file dist
 * @memberof Global_Types
 */

/**
 * #### glob file list
 * @typedef {Object} LIGHTHOUSE_THRESHOLD
 * @property {number} performance
 * @property {number} accessibility
 * @property {number} bestPractices
 * @property {number} seo
 * @memberof Global_Types
 */

/**
 * #### glob file list
 * @typedef {Object} LIGHTHOUSE_SCORE
 * @property {number} accessibilityScore
 * @property {number} bestPracticesScore
 * @property {number} performanceScore
 * @property {number} seoScore
 * @property {string} templatePath
 * @property {string} link
 * @memberof Global_Types
 */

export default {}
