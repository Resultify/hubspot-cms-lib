import { CommonFields, CommonContentFields } from './common-properties.js'

// *************
// General fields.
// Fields for content and style tab
// *************

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

/**
 * @summary Choice field
 * @typedef {Object} CHOISE_FIELDS
 * @property {boolean} [multiple] Optional. To allow multiple options to be selected, set the value to true.
 * @property {boolean} [reordering_enabled]
 * @property {'select'|'radio'} [display] Set the field's appearance. When not including multiple, you can set this as either "radio" or "select". When multiple is set to true, you can set this as either "checkbox" or "select".
 * @property {Array<Object>} [choices] Array of value and label pairs. Values listed first.
 * @property {Object} [default] Sets the default selected value from the choice array.
 * @param {string} name
 * @param {string} label
 * @param {COMMON_FIELDS & CHOISE_FIELDS} [fields]
 * @returns {Object}
 */
function choice (name, label, fields) {
  const labelAndName = { name, label }
  const common = new CommonFields({ ...labelAndName, ...fields })
  common.type = 'choice'

  const specific = {}
  specific.multiple = fields?.multiple ?? false
  specific.reordering_enabled = fields?.reordering_enabled ?? true
  specific.display = fields?.display ?? 'select'
  specific.choices = fields?.choices ?? []
  if (typeof fields !== 'undefined' && fields !== null && typeof fields === 'object') {
    if ('default' in fields) specific.default = fields?.default
  }
  return { ...common, ...specific }
}

/**
 * @summary Color field
 * @typedef {Object} COLOR_FIELDS
 * @property {Boolean} [show_opacity] Sets whether opacity input is shown. true: the opacity input is shown. false: the opacity input is hidden. If left undefined, opacity input will not display in email modules, but will display in other module types.
 * @property {Object} [default] Sets the default selected color and opacity.
 * @property {String} [default.color]
 * @property {Number} [default.opacity]
 * @param {string} name
 * @param {string} label
 * @param {COMMON_FIELDS & COLOR_FIELDS} [fields]
 * @returns {Object}
 */
function color (name, label, fields) {
  const labelAndName = { name, label }
  const common = new CommonFields({ ...labelAndName, ...fields })
  common.type = 'color'

  const specific = {}
  specific.show_opacity = fields?.show_opacity ?? undefined
  if (fields?.default) specific.default = fields?.default

  return { ...common, ...specific }
}

export { boolean, choice, number, color, icon, image }
