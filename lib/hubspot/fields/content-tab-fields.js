// @ts-check
import { CommonFields, CommonContentFields } from './common-properties.js'

// *************
// Only Content Tab fields
// *************

/**
 * @summary Text field
 * @typedef {Object} TEXT_FIELDS
 * @property {string} [validation_regex]
 * @property {true|false} [allow_new_line]
 * @property {true|false} [show_emoji_picker]
 * @property {string} [placeholder]
 * @property {string} [default]
 * @param {string} name
 * @param {string} label
 * @param {COMMON_FIELDS & COMMON_CONTENT_FIELDS & TEXT_FIELDS | undefined} [fields]
 * @returns {Object}
 */
function text (name, label, fields) {
  const labelAndName = { name, label }
  const commonFields = new CommonFields({ ...labelAndName, ...fields })
  commonFields.type = 'text'
  const commonContentFields = new CommonContentFields(fields)

  const specific = {}
  specific.allow_new_line = fields?.allow_new_line ?? false
  specific.show_emoji_picker = fields?.show_emoji_picker ?? false
  specific.validation_regex = fields?.validation_regex ?? ''
  if (typeof fields !== 'undefined' && fields !== null && typeof fields === 'object') {
    if ('placeholder' in fields) specific.placeholder = fields.placeholder
    if ('default' in fields) specific.default = fields.default
  }
  return { ...commonFields, ...commonContentFields, ...specific }
}

/**
 * @summary Link field
 * @typedef {Object} LINK_FIELDS
 * @property {Array<'EXTERNAL'|'CONTENT'|'FILE'|'EMAIL_ADDRESS'|'BLOG'|'CALL_TO_ACTION'>} [supported_types]
 * @property {true|false} [show_advanced_rel_options]
 * @property {Object} [default]
 * @property {Object} [default.url]
 * @property {string} [default.url.content_id]
 * @property {string} [default.url.type]
 * @property {string} [default.url.href]
 * @property {true|false} [default.open_in_new_tab]
 * @property {true|false} [default.no_follow]
 * @property {true|false} [default.sponsored]
 * @property {true|false} [default.user_generated_content]
 * @param {string} name
 * @param {string} label
 * @param {COMMON_FIELDS & COMMON_CONTENT_FIELDS & LINK_FIELDS} [fields]
 * @returns {Object}
 */
function link (name, label, fields) {
  const labelAndName = { name, label }
  const commonFields = new CommonFields({ ...labelAndName, ...fields })
  commonFields.type = 'link'
  const commonContentFields = new CommonContentFields(fields)

  const specific = {}
  specific.show_advanced_rel_options = fields?.show_advanced_rel_options ?? false
  specific.supported_types = fields?.supported_types ?? ['EXTERNAL', 'CONTENT', 'FILE', 'EMAIL_ADDRESS', 'BLOG', 'CALL_TO_ACTION']
  const defaultObj = {
    url: {
      content_id: null,
      type: 'EXTERNAL',
      href: ''
    },
    open_in_new_tab: false,
    no_follow: false
  }
  specific.default = fields?.default ?? defaultObj
  return { ...commonFields, ...commonContentFields, ...specific }
}

/**
 * @summary richtext field
 * @typedef {Object} RICHTEXT_FIELDS
 * @property {Array<string>} [enabled_features]
 * @property {string} [default]
 * @param {string} name
 * @param {string} label
 * @param {COMMON_FIELDS & COMMON_CONTENT_FIELDS & RICHTEXT_FIELDS} [fields]
 * @returns {Object}
 */
function richtext (name, label, fields) {
  const labelAndName = { name, label }
  const commonFields = new CommonFields({ ...labelAndName, ...fields })
  commonFields.type = 'richtext'
  const commonContentFields = new CommonContentFields(fields)

  const specific = {}
  if (typeof fields !== 'undefined' && fields !== null && typeof fields === 'object') {
    if ('enabled_features' in fields) specific.enabled_features = fields.enabled_features
    if ('default' in fields) specific.default = fields.default
  }
  return { ...commonFields, ...commonContentFields, ...specific }
}

/**
 * @summary url field
 * @typedef {Object} URL_FIELDS
 * @property {Array<'EXTERNAL'|'CONTENT'|'FILE'|'EMAIL_ADDRESS'|'BLOG'|'CALL_TO_ACTION'>} [supported_types]
 * @property {Object} [default]
 * @property {string} [default.content_id]
 * @property {string} [default.type]
 * @property {string} [default.href]
 * @param {string} name
 * @param {string} label
 * @param {COMMON_FIELDS & COMMON_CONTENT_FIELDS & URL_FIELDS} [fields]
 * @returns {Object}
 */
function url (name, label, fields) {
  const labelAndName = { name, label }
  const commonFields = new CommonFields({ ...labelAndName, ...fields })
  commonFields.type = 'url'
  const commonContentFields = new CommonContentFields(fields)

  const specific = {}
  specific.supported_types = fields?.supported_types ?? ['EXTERNAL', 'CONTENT', 'FILE', 'EMAIL_ADDRESS', 'BLOG', 'CALL_TO_ACTION']
  const defaultObj = {
    content_id: null,
    href: '',
    type: 'EXTERNAL'
  }
  specific.default = fields?.default ?? defaultObj
  return { ...commonFields, ...commonContentFields, ...specific }
}

export { text, link, richtext, url }
