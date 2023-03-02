import { CommonFields, CommonGroupFields } from './common-properties.js'

// *************
// Group Fields
// *************

/**
 * @summary Group Field wrapper
 * @param {string} label
 * @param {string} name
 * @param {COMMON_FIELDS & COMMON_GROUP_FIELDS} [fields]
 * @param {Array<Object>} childrens
 * @returns {Object}
 */
function group (name, label, fields, ...childrens) {
  const labelAndName = { name, label }
  const commonFields = new CommonFields({ ...labelAndName, ...fields })
  commonFields.type = 'group'
  const commonGroupFields = new CommonGroupFields(fields)
  /**
   * @type {Array<any>}
   */
  const childrenWrp = []
  const children = { childrenWrp }
  childrens.forEach(element => {
    children.childrenWrp.push(element)
  })
  return { ...commonFields, ...commonGroupFields, ...children }
}

/**
 * @summary Main Style group wrapper
 * @param {COMMON_FIELDS & COMMON_GROUP_FIELDS} [fields]
 * @param {Array<Object>} childrens
 * @returns {Object}
 */
function styleGroup (fields, ...childrens) {
  const labelAndName = { name: 'style', label: 'Style' }
  const commonFields = new CommonFields({ ...labelAndName, ...fields })
  commonFields.type = 'group'
  const commonGroupFields = new CommonGroupFields(fields)
  commonGroupFields.tab = 'STYLE'
  /**
   * @type {Array<Object>}
   */
  const childrenWrp = []
  const children = { childrenWrp }
  childrens.forEach(element => {
    children.childrenWrp.push(element)
  })
  return { ...commonFields, ...commonGroupFields, ...children }
}

export { group, styleGroup }
