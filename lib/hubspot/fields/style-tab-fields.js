import { CommonFields } from './common-properties.js'

// *************
// Only Style Tab fields
// *************

/**
 * @summary Alignment field
 * @typedef {Object} ALIGNMENT_FIELDS
 * @property {'HORIZONTAL'|'VERTICAL'|'BOTH'} [alignment_direction] Determines if only horizontal, only vertical, or both alignment controls should be shown
 * @property {Object} [default]
 * @property {'LEFT'|'CENTER'|'RIGHT'} [default.horizontal_align]
 * @property {'LEFT'|'CENTER'|'RIGHT'} [default.show_emoji_picker]
 * @param {string} name
 * @param {string} label
 * @param {COMMON_FIELDS & ALIGNMENT_FIELDS} [fields]
 * @returns {Object}
 */
function alignment (name, label, fields) {
  const labelAndName = { name, label }
  const common = new CommonFields({ ...labelAndName, ...fields })
  common.type = 'alignment'

  const specific = {}
  specific.alignment_direction = fields?.alignment_direction ?? 'HORIZONTAL'
  if (specific.alignment_direction === 'BOTH') {
    specific.default = fields?.default ?? {
      horizontal_align: 'LEFT',
      vertical_align: 'CENTER'
    }
  } else if (specific.alignment_direction === 'HORIZONTAL') {
    specific.default = fields?.default ?? {
      horizontal_align: 'LEFT'
    }
  } else if (specific.alignment_direction === 'VERTICAL') {
    specific.default = fields?.default ?? {
      vertical_align: 'CENTER'
    }
  }
  if (typeof fields !== 'undefined' && fields !== null && typeof fields === 'object') {
    if ('default' in fields) specific.default = fields?.default
  }
  return { ...common, ...specific }
}

/**
 * @summary Spacing field
 * @typedef {Object} SPACING_FIELDS
 * @property {Object} [limits] Sets the guidelines for min and max amount of spacing.
 * @property {Object} [limits.padding]
 * @property {Object} [limits.margin]
 * @property {Object} [default] Sets the default spacing values.
 * @property {Object} [default.padding]
 * @property {Object} [defaultmargin]
 * @param {string} name
 * @param {string} label
 * @param {COMMON_FIELDS & SPACING_FIELDS} [fields]
 * @returns {Object}
 */
function spacing (name, label, fields) {
  const labelAndName = { name, label }
  const common = new CommonFields({ ...labelAndName, ...fields })
  common.type = 'spacing'

  const specific = {}
  if (typeof fields !== 'undefined' && fields !== null && typeof fields === 'object') {
    if ('limits' in fields) specific.limits = fields?.limits
    if ('default' in fields) specific.default = fields?.default
  }
  return { ...common, ...specific }
}

/**
 * @summary font field
 * @typedef {Object} FONT_FIELDS
 * @property {Boolean} [load_external_fonts] HubSpot automatically loads the selected web font to the page if the font is selected and referenced by HubL in a stylesheet or in a module. Set this to false, if you are already loading the font to the page, that way the font won't load twice.
 * @property {Boolean} [variant]
 * @property {Object} [default]
 * @property {Number} [default.size]
 * @property {String} [default.font]
 * @property {String} [default.font_set]
 * @property {String} [default.size_unit]
 * @property {String} [default.color]
 * @property {String} [default.styles]
 * @param {string} name
 * @param {string} label
 * @param {COMMON_FIELDS & FONT_FIELDS} [fields]
 * @returns {Object}
 */
function font (name, label, fields) {
  const labelAndName = { name, label }
  const common = new CommonFields({ ...labelAndName, ...fields })
  common.type = 'font'

  const specific = {}
  specific.load_external_fonts = fields?.load_external_fonts ?? true
  specific.default = fields?.default ?? {}
  if (typeof fields !== 'undefined' && fields !== null && typeof fields === 'object') {
    if ('variant' in fields) specific.variant = fields?.variant
  }
  return { ...common, ...specific }
}

export { alignment, spacing, font }
