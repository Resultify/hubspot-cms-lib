/**
 * @summary HUBSPOT COMMON FIELDS
 * @exports HUBSPOT_COMMON_FIELDS
 * @typedef HUBSPOT_COMMON_FIELDS
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
 * @param {HUBSPOT_COMMON_FIELDS} fields
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
 * @summary Text field
 * @private
 * @memberof fields
 * @param {string} label
 * @param {string} name
 * @param {HUBSPOT_COMMON_FIELDS} [commonField]
 * @param {Object} [specificField]
*  @param {string} [specificField.validation_regex]
 * @param {string} [specificField.allow_new_line]
 * @param {string} [specificField.show_emoji_picker]
 * @param {string} [specificField.default]
 * @param {string} [specificField.placeholder]
 * @returns {Object}
 */
function text (label, name, commonField, specificField) {
  const labelAndName = { label, name }
  const common = CommonFields({ ...labelAndName, ...commonField })
  common.type = 'text'
  const specific = {}
  specific.validation_regex = specificField?.validation_regex || ''
  specific.allow_new_line = specificField?.allow_new_line || true
  specific.show_emoji_picker = specificField?.show_emoji_picker || false
  specific.placeholder = specificField?.placeholder || ''
  specific.default = specificField?.default || ''
  return { ...common, ...specific }
}

const fields = {
  text
}

export { fields }
