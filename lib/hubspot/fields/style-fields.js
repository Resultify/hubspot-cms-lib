/**
 * @summary HUBSPOT COMMON Style FIELDS
 * @exports HUBSPOT_COMMON_STYLE_FIELDS
 * @typedef HUBSPOT_COMMON_STYLE_FIELDS
 * @type {Object}
 * @property {string} [label]
 * @property {string} [name]
 * @property {string} [type]
 * @property {boolean} [required]
 * @property {boolean} [locked]
 * @property {string} [inline_help_text]
 * @property {string} [help_text]
 * @property {string} [visibility]
 * @property {string} [display_width]
 * @memberof HubSpot_Fields
 */

/**
 * @summary Common HubSpot Fields
 * @description Properties used by all fields
 * @private
 * @memberof fields
 * @param {HUBSPOT_COMMON_STYLE_FIELDS} fields
 * @returns {Object}
 */
function CommonFields (fields) {
  if (!new.target) {
    return new CommonFields(fields)
  }
  this.label = fields.label
  this.name = fields.name
  this.type = fields.type
  this.required = fields.required || false
  this.locked = fields.locked || false
  this.inline_help_text = fields.inline_help_text || ''
  this.help_text = fields.help_text || ''
  this.display_width = fields.display_width || null
  this.visibility = fields.visibility || null
}

/**
 * @summary alignment field
 * @private
 * @memberof fields
 * @param {string} label
 * @param {string} name
 * @param {HUBSPOT_COMMON_STYLE_FIELDS} [commonField]
 * @param {Object} [specificField]
 * @param {'HORIZONTAL'|'VERTICAL'|'BOTH'} [specificField.alignment_direction]
 * @param {Object} [specificField.default]
 * @param {'LEFT'|'CENTER'|'RIGHT'} [specificField.default.horizontal_align]
 * @param {'LEFT'|'CENTER'|'RIGHT'} [specificField.default.vertical_align]
 * @returns {Object}
 */
function alignment (label, name, commonField, specificField) {
  const labelAndName = { label, name }
  const common = CommonFields({ ...labelAndName, ...commonField })
  common.type = 'alignment'
  const specific = {}
  specific.alignment_direction = specificField?.alignment_direction || 'HORIZONTAL'
  specific.default = specificField?.default || {
    horizontal_align: 'LEFT',
    vertical_align: 'CENTER'
  }
  return { ...common, ...specific }
}

const styleFields = {
  alignment
}

export { styleFields }
