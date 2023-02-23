/**
 * @summary HUBSPOT COMMONGROUP FIELDS
 * @typedef HUBSPOT_COMMON_GROUP_FIELDS
 * @type {Object}
 * @property {string} [label]
 * @property {string} [name]
 * @property {string} [type]
 * @property {boolean} [locked]
 * @property {string} [inline_help_text]
 * @property {string} [help_text]
 * @property {string} [visibility]
 * @property {string} [display_width]
 * @property {string} [tab]
 * @property {boolean} [expanded]
 * @property {Object} [default]
 * @memberof HubSpot_Fields
 */

/**
 * @summary Common HubSpot Group Fields
 * @description Properties used by all group fields
 * @private
 * @memberof fields
 * @param {HUBSPOT_COMMON_GROUP_FIELDS} fields
 * @returns {Object}
 */
function CommonGroupFields (fields) {
  if (!new.target) {
    return new CommonGroupFields(fields)
  }
  this.label = fields.label
  this.name = fields.name
  this.type = fields.type || 'group'
  this.locked = fields.locked || false
  this.inline_help_text = fields.inline_help_text || ''
  this.help_text = fields.help_text || ''
  this.expanded = fields.expanded || false
  this.default = fields.default || {}
}

/**
 * @summary Common Fields
 * @memberof fields
 * @param {string} label
 * @param {string} name
 * @param {HUBSPOT_COMMON_GROUP_FIELDS} [commonGroupField]
 * @param {Array} childrens
 * @returns {Object}
 */
function group (label, name, commonGroupField, ...childrens) {
  const labelAndName = { label, name }
  const common = CommonGroupFields({ ...labelAndName, ...commonGroupField })
  const children = { children: [] }
  childrens.forEach(element => {
    children.children.push(element)
  })
  return { ...common, ...children }
}

/**
 * @summary Common Fields
 * @memberof fields
 * @param {HUBSPOT_COMMON_GROUP_FIELDS} [commonGroupField]
 * @param {Array} childrens
 * @returns {Object}
 */
function styleGroup (commonGroupField, ...childrens) {
  const labelAndName = { label: 'Style', name: 'style' }
  const common = CommonGroupFields({ ...labelAndName, ...commonGroupField })
  common.tab = 'STYLE'
  const children = { children: [] }
  childrens.forEach(element => {
    children.children.push(element)
  })
  return { ...common, ...children }
}

export { group, styleGroup }
