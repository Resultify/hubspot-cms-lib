/**
 * @summary HUBSPOT COMMON Style FIELDS
 * @typedef {Object} HUBSPOT_COMMON_STYLE_FIELDS
 * @property {string} [label]
 * @property {string} [name]
 * @property {string} [type]
 * @property {boolean} [required]
 * @property {boolean} [locked]
 * @property {string} [inline_help_text]
 * @property {string} [help_text]
 * @property {string} [display_width]
 * @property {'SIMPLE'|'ADVANCED'} [visibility_rules]
 * @property {Object} [visibility]
 * @property {String} [visibility.controlling_field]
 * @property {String} [visibility.controlling_value_regex]
 * @property {'NOT_EQUAL'|'EQUAL'|'EMPTY'|'NOT_EMPTY'|'MATCHES_REGEX'} [visibility.operator]
 * @property {String} [visibility.property]
 * @property {Object} [advanced_visibility]
 * @property {'OR'|'AND'} [advanced_visibility.boolean_operator]
 * @property {Object[]} [advanced_visibility.criteria]
 * @property {String} [advanced_visibility.criteria[].controlling_field]
 * @property {String} [advanced_visibility.criteria[].controlling_value_regex]
 * @property {'NOT_EQUAL'|'EQUAL'|'EMPTY'|'NOT_EMPTY'|'MATCHES_REGEX'} [advanced_visibility.criteria[].operator]
 */

/**
 * @summary Common HubSpot Fields
 * @description Properties used by all fields
 * @private
 * @param {HUBSPOT_COMMON_STYLE_FIELDS} fields
 * @returns {Object}
 */
function CommonFields (fields) {
  this.label = fields.label
  this.name = fields.name
  this.type = fields.type
  this.required = fields.required || false
  this.locked = fields.locked || false
  this.inline_help_text = fields.inline_help_text || ''
  this.help_text = fields.help_text || ''
  this.display_width = fields.display_width || null
  this.visibility = fields.visibility || null
  this.visibility_rules = fields.visibility_rules || 'SIMPLE'
  if (fields.visibility_rules === 'SIMPLE' && fields.visibility) {
    this.visibility = {}
    this.visibility.controlling_field = fields.visibility.controlling_field || ''
    this.visibility.controlling_value_regex = fields.visibility.controlling_value_regex || ''
    this.visibility.operator = fields.visibility.operator || 'EMPTY'
  } else if (fields.visibility_rules === 'ADVANCED' && fields.advanced_visibility) {
    this.advanced_visibility = {}
    this.advanced_visibility.boolean_operator = fields.advanced_visibility.boolean_operator || 'OR'
    this.advanced_visibility.criteria = fields.advanced_visibility.criteria || []
  }
}

/**
 * @summary Alignment field
 * @typedef {Object} ALIGNMENT_FIELDS
 * @property {'HORIZONTAL'|'VERTICAL'|'BOTH'} [alignment_direction]
 * @property {Object} [default]
 * @property {'LEFT'|'CENTER'|'RIGHT'} [default.horizontal_align]
 * @property {'LEFT'|'CENTER'|'RIGHT'} [default.show_emoji_picker]
 * @param {string} label
 * @param {string} name
 * @param {HUBSPOT_COMMON_STYLE_FIELDS & ALIGNMENT_FIELDS} [fields]
 * @returns {Object}
 */
function alignment (label, name, fields) {
  const labelAndName = { label, name }
  const common = new CommonFields({ ...labelAndName, ...fields })
  common.type = 'alignment'
  const specific = {}
  specific.alignment_direction = fields?.alignment_direction || 'HORIZONTAL'
  specific.default = fields?.default || {
    horizontal_align: 'LEFT',
    vertical_align: 'CENTER'
  }
  return { ...common, ...specific }
}

const styleFields = {
  alignment
}

export { styleFields }
