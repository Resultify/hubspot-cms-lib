/**
 * @summary Additions common options
 * @description Additional options to use locally in functions
 * @exports THEME_BUILD_OPTIONS
 * @typedef THEME_BUILD_OPTIONS
 * @type {object}
 * @property {object} [config] - local theme based config
 * @property {boolean} [hideStatus] - hide task status from showing in console
 * @memberof Theme_Types
 */

/**
 * @summary Hubspot Auth config schema based on personalaccesskey
 * @exports THEME_HUB_AUTH_CONFIG
 * @typedef THEME_HUB_AUTH_CONFIG
 * @type {Object}
 * @property {Object[]} portals
 * @property {string} portals[].authType - auth Type - personalaccesskey
 * @property {string} portals[].portalId
 * @property {string} portals[].personalAccessKey
 * @property {string} portals[].env
 * @memberof Theme_Types
 */
