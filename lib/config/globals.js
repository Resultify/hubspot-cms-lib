import { createRequire } from 'module'
const requireJson = createRequire(import.meta.url)

/**
 * @summary Theme global constants
 * @typedef THEME_GLOBALS
 * @type {Object}
 * @property {string} ROOT_PATH
 * @property {string|undefined} ROOT_DIR_NAME
 * @property {string} SRC
 * @property {string} THEME
 * @property {string} THEME_ASSETS
 * @property {string} THEME_NAME
 * @property {string} CSS_SRC
 * @property {string} CSS_DIST
 * @property {string} SCSS_SRC
 * @property {string} SCSS_DIST
 * @property {string} JS_SRC
 * @property {string} JS_DIST
 * @property {string} DOTENV
 * @property {string} DOTENV_DATA_TMPL
 * @property {string} FIELDSJS_SRC
 */

/**
 * @summary Global constants
 * @type {THEME_GLOBALS}
 */
const globals = {}

if (process.env.MODE === 'test') {
  globals.ROOT_PATH = process.cwd()
  globals.ROOT_DIR_NAME = globals.ROOT_PATH.split('/').pop()
} else {
  globals.ROOT_PATH = process.cwd()
  globals.ROOT_DIR_NAME = globals.ROOT_PATH.split('/').pop()
}

globals.SRC = `${globals.ROOT_PATH}/src`
globals.THEME = `${globals.ROOT_PATH}/theme`
globals.THEME_ASSETS = `${globals.ROOT_PATH}/theme/assets`
globals.THEME_NAME = requireJson(`${globals.THEME}/theme.json`).name

// CSS compilation variables
globals.CSS_SRC = `${globals.SRC}/css`
globals.CSS_DIST = `${globals.THEME_ASSETS}/css`

// SCSS compilation variables
globals.SCSS_SRC = `${globals.SRC}/scss`
globals.SCSS_DIST = `${globals.THEME_ASSETS}/css`

// JS compilation variables
globals.JS_SRC = `${globals.SRC}/js`
globals.JS_DIST = `${globals.THEME_ASSETS}/js`

// .env file and data template
globals.DOTENV = '.env'
globals.DOTENV_DATA_TMPL = `hub_sandbox=personalaccesskey
hub_portal1=personalaccesskey1
`

// field.js compilation variables
globals.FIELDSJS_SRC = `${globals.ROOT_PATH}/theme/**/fields.js`

export { globals }
