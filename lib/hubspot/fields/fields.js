/**
 * @summary HUBSPOT COMMON FIELDS
 * @typedef {Object} HUBSPOT_COMMON_FIELDS
 * @property {string} [label]
 * @property {string} [name]
 * @property {string} [type]
 * @property {true|false} [required]
 * @property {true|false} [locked]
 * @property {string} [inline_help_text]
 * @property {string} [help_text]
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
 * @property {Object} [occurrence]
 * @property {null|number} [occurrence.min]
 * @property {null|number} [occurrence.max]
 * @property {null|string} [occurrence.sorting_label_field]
 * @property {null|number} [occurrence.default]
 * @property {null|'half_width'} [display_width]
 */

/**
 * @summary Common HubSpot Fields
 * @description Properties used by all fields
 * @private
 * @param {HUBSPOT_COMMON_FIELDS} fields
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
  if (fields.occurrence) {
    this.occurrence = {}
    this.occurrence.min = fields.occurrence.min || null
    this.occurrence.max = fields.occurrence.max || null
    this.occurrence.sorting_label_field = fields.occurrence.sorting_label_field || ''
  }
}

/**
 * @summary Text field
 * @typedef {Object} TEXT_FIELDS
 * @property {string} [validation_regex]
 * @property {true|false} [allow_new_line]
 * @property {true|false} [show_emoji_picker]
 * @property {string} [placeholder]
 * @property {string} [default]
 * @param {string} label
 * @param {string} name
 * @param {HUBSPOT_COMMON_FIELDS & TEXT_FIELDS} [fields]
 * @returns {Object}
 */
function text (label, name, fields) {
  const labelAndName = { label, name }
  const common = new CommonFields({ ...labelAndName, ...fields })
  common.type = 'text'
  const specific = {}
  specific.validation_regex = fields?.validation_regex || ''
  specific.allow_new_line = fields?.allow_new_line || true
  specific.show_emoji_picker = fields?.show_emoji_picker || false
  specific.placeholder = fields?.placeholder || ''
  specific.default = fields?.default || ''
  return { ...common, ...specific }
}

const fields = {
  text
}

export { fields }
