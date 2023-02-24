/**
 * @summary HUBSPOT COMMON GROUP FIELDS
 * @typedef {Object} HUBSPOT_COMMON_GROUP_FIELDS
 * @property {string} [label]
 * @property {string} [name]
 * @property {string} [type]
 * @property {boolean} [locked]
 * @property {string} [inline_help_text]
 * @property {string} [help_text]
 * @property {string} [display_width]
 * @property {string} [tab]
 * @property {boolean} [expanded]
 * @property {'SIMPLE'|'ADVANCED'} [visibility_rules]
 * @property {Object} [visibility]
 * @property {String} [visibility.controlling_fields]
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
 * @property {Object} [default]
 */

/**
 * @summary Common HubSpot Group Fields
 * @description Properties used by all group fields
 * @private
 * @param {HUBSPOT_COMMON_GROUP_FIELDS} fields
 * @returns {Object}
 */
function CommonGroupFields (fields) {
  this.label = fields.label
  this.name = fields.name
  this.tab = fields.tab
  this.type = fields.type || 'group'
  this.locked = fields.locked || false
  this.inline_help_text = fields.inline_help_text || ''
  this.help_text = fields.help_text || ''
  this.expanded = fields.expanded || false
  this.default = fields.default || {}
  this.visibility_rules = fields.visibility_rules || 'SIMPLE'
  if (fields.visibility_rules === 'SIMPLE' && fields.visibility) {
    this.visibility = {}
    this.visibility.controlling_fields = fields.visibility.controlling_fields || ''
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
 * @summary Group Field wrapper
 * @param {string} label
 * @param {string} name
 * @param {HUBSPOT_COMMON_GROUP_FIELDS} [commonGroupFields]
 * @param {Array} childrens
 * @returns {Object}
 */
function group (label, name, commonGroupFields, ...childrens) {
  const labelAndName = { label, name }
  const common = new CommonGroupFields({ ...labelAndName, ...commonGroupFields })
  const children = { children: [] }
  childrens.forEach(element => {
    children.children.push(element)
  })
  return { ...common, ...children }
}

/**
 * @summary Main Style group wrapper
 * @param {HUBSPOT_COMMON_GROUP_FIELDS} [commonGroupFields]
 * @param {Array} childrens
 * @returns {Object}
 */
function styleGroup (commonGroupFields, ...childrens) {
  const labelAndName = { label: 'Style', name: 'style' }
  const common = new CommonGroupFields({ ...labelAndName, ...commonGroupFields })
  common.tab = 'STYLE'
  const children = { children: [] }
  childrens.forEach(element => {
    children.children.push(element)
  })
  return { ...common, ...children }
}

export { group, styleGroup }
