import { CommonFields, CommonContentFields } from './common-fields.js'

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
 * @param {COMMON_FIELDS & COMMON_CONTENT_FIELDS & TEXT_FIELDS} [fields]
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
 * @summary number field
 * @typedef {Object} NUMBER_FIELDS
 * @property {'slider'|'text'} [display]
 * @property {number} [step]
 * @property {number} [min]
 * @property {number} [max]
 * @property {string} [prefix]
 * @property {string} [suffix]
 * @property {string} [placeholder]
 * @property {number|null} [default]
 * @param {string} name
 * @param {string} label
 * @param {COMMON_FIELDS & COMMON_CONTENT_FIELDS & NUMBER_FIELDS} [fields]
 * @returns {Object}
 */
function number (name, label, fields) {
  const labelAndName = { name, label }
  const commonFields = new CommonFields({ ...labelAndName, ...fields })
  commonFields.type = 'number'
  const commonContentFields = new CommonContentFields(fields)

  const specific = {}
  specific.display = fields?.display ?? 'text'
  specific.step = fields?.step ?? 1
  if (typeof fields !== 'undefined' && fields !== null && typeof fields === 'object') {
    if ('min' in fields) specific.min = fields.min
    if ('max' in fields) specific.max = fields.max
    if ('prefix' in fields) specific.prefix = fields.prefix
    if ('suffix' in fields) specific.suffix = fields.suffix
    if ('placeholder' in fields) specific.placeholder = fields.placeholder
    if ('default' in fields) specific.default = fields.default
  }
  return { ...commonFields, ...commonContentFields, ...specific }
}

/**
 * @summary richtext field
 * @typedef {Object} RICHTEXT_FIELDS
 * @property {Array} [enabled_features]
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

/**
 * @summary boolean field
 * @typedef {Object} BOOLEAN_FIELDS
 * @property {'toggle'|'checkbox'} [display]
 * @property {boolean} [default]
 * @param {string} name
 * @param {string} label
 * @param {COMMON_FIELDS & COMMON_CONTENT_FIELDS & BOOLEAN_FIELDS} [fields]
 * @returns {Object}
 */
function boolean (name, label, fields) {
  const labelAndName = { name, label }
  const commonFields = new CommonFields({ ...labelAndName, ...fields })
  commonFields.type = 'boolean'
  const commonContentFields = new CommonContentFields(fields)

  const specific = {}
  specific.display = fields?.display ?? 'checkbox'
  specific.default = fields?.default ?? false
  return { ...commonFields, ...commonContentFields, ...specific }
}

/**
 * @summary image field
 * @typedef {Object} IMAGE_FIELDS
 * @property {true|false} [responsive]
 * @property {true|false} [show_loading]
 * @property {true|false} [resizable]
 * @property {Object} [default]
 * @property {string} [default.size_type]
 * @property {string} [default.src]
 * @property {string} [default.alt]
 * @property {string} [default.loading]
 * @property {number} [default.width]
 * @property {number} [default.height]
 * @property {number} [default.max_width]
 * @property {number} [default.max_height]
 * @param {string} name
 * @param {string} label
 * @param {COMMON_FIELDS & COMMON_CONTENT_FIELDS & IMAGE_FIELDS} [fields]
 * @returns {Object}
 */
function image (name, label, fields) {
  const labelAndName = { name, label }
  const commonFields = new CommonFields({ ...labelAndName, ...fields })
  commonFields.type = 'image'
  const commonContentFields = new CommonContentFields(fields)

  const specific = {}
  specific.responsive = fields?.responsive ?? true
  specific.resizable = fields?.resizable ?? true
  specific.show_loading = fields?.show_loading ?? true
  const defaultObj = {
    size_type: 'auto',
    src: '',
    alt: null,
    loading: 'lazy'
  }
  specific.default = fields?.default ?? defaultObj
  return { ...commonFields, ...commonContentFields, ...specific }
}

/**
 * @summary icon field
 * @typedef {Object} ICON_FIELDS
 * @property {'fontawesome-5.14.0'|'fontawesome-5.0.10'} [icon_set]
 * @property {Object} [default]
 * @property {string} [default.name]
 * @property {string} [default.unicode]
 * @property {string} [default.type]
 * @param {string} name
 * @param {string} label
 * @param {COMMON_FIELDS & COMMON_CONTENT_FIELDS & ICON_FIELDS} [fields]
 * @returns {Object}
 */
function icon (name, label, fields) {
  const labelAndName = { name, label }
  const commonFields = new CommonFields({ ...labelAndName, ...fields })
  commonFields.type = 'icon'
  const commonContentFields = new CommonContentFields(fields)

  const specific = {}
  specific.icon_set = fields?.icon_set ?? 'fontawesome-5.14.0'
  specific.default = fields?.default ?? {}
  return { ...commonFields, ...commonContentFields, ...specific }
}

const fields = {
  text,
  link,
  number,
  richtext,
  boolean,
  url,
  image,
  icon
}

export { fields }
