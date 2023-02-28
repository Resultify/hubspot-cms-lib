/**
 * @summary HubSpot common fields
 * @description Properties used by all fields (content tab fields, style fields, group fields)
 * @param {COMMON_FIELDS} fields
 * @returns {Object}
 */
function CommonFields (fields) {
  this.name = fields.name
  this.label = fields.label
  this.type = fields.type
  this.required = fields.required || false
  this.locked = fields.locked || false
  if (fields.inline_help_text) {
    this.inline_help_text = fields.inline_help_text
  }
  if (fields.help_text) {
    this.help_text = fields.help_text
  }
  this.display_width = fields.display_width || null
  if (fields.visibility_rules && fields.visibility_rules === 'ADVANCED') {
    this.visibility_rules = fields.visibility_rules || 'ADVANCED'
  }
  if (!fields.visibility_rules && fields.visibility_rules !== 'ADVANCED' && fields.visibility) {
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
 * @summary HubSpot common group fields
 * @description Properties used by all group fields on top of common fields
 * @param {COMMON_GROUP_FIELDS} fields
 * @returns {Object}
 */
function CommonGroupFields (fields) {
  this.tab = fields.tab
  this.expanded = fields.expanded || false
  if (fields?.occurrence) {
    this.occurrence = {}
    this.occurrence.min = fields.occurrence.min || null
    this.occurrence.max = fields.occurrence.max || null
    this.occurrence.sorting_label_field = fields.occurrence.sorting_label_field || ''
  }
}

/**
 * @summary HubSpot common content-tab fields
 * @description Properties used by all fields in content tab on top of common fields
 * @param {COMMON_CONTENT_FIELDS} fields
 * @returns {Object}
 */
function CommonContentFields (fields) {
  if (fields?.occurrence) {
    this.occurrence = {}
    this.occurrence.min = fields.occurrence.min || null
    this.occurrence.max = fields.occurrence.max || null
    this.occurrence.sorting_label_field = fields.occurrence.sorting_label_field || ''
  }
}

export { CommonFields, CommonGroupFields, CommonContentFields }
