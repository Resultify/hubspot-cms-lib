/**
 * #### Hubspot accessToken schema
 * @typedef {Object} HUBSPOT_ACCESSTOKEN_SCHEMA
 * @property {number} portalId
 * @property {string} accessToken
 */

/**
 * #### Hubspot Auth config schema
 * @typedef {Object} HUBSPOT_AUTH_CONFIG
 * @property {string} defaultPortal
 * @property {boolean} allowUsageTracking
 * @property {Array<HUBSPOT_AUTH_PORTALS_CONFIG>} portals
 */

/**
 * #### Hubspot Auth config portals schema
 * @typedef {Object} HUBSPOT_AUTH_PORTALS_CONFIG
 * @property {string} name
 * @property {number} portalId
 * @property {any} env
 * @property {string} authType
 * @property {string} personalAccessKey
 */

/**
 * #### glob file list
 * @typedef {Object} LIGHTHOUSE_THRESHOLD
 * @property {number} performance
 * @property {number} accessibility
 * @property {number} bestPractices
 * @property {number} seo
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
 */

/**
 * #### Custom Theme options
 * @typedef {Object} THEME_OPTIONS
 * @property {string} themeFolder
 * @property {string} vendorSrc
 * @property {string} vendorDest
 * @property {Object} [js]
 * @property {Array<string>} [js.external]
 * @property {Object} [js.replace]
 * @property {Object} [js.globals]
 * @property {LIGHTHOUSE_THRESHOLD} lighthouse
 */

/**
 * #### glob file list
 * @typedef {Object} FILE_LIST
 * @property {Object} dirnet - dirnet object
 * @property {string} name - file name
 * @property {string} path - file path
 * @property {string} size - file size
 * @property {string} dist - file dist
 */

export default {}
