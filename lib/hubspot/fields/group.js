import { CommonFields, CommonGroupFields } from './common-fields.js'

/**
 * @summary Group Field wrapper
 * @param {string} label
 * @param {string} name
 * @param {COMMON_FIELDS & COMMON_GROUP_FIELDS} [fields]
 * @param {Array} childrens
 * @returns {Object}
 */
function group (name, label, fields, ...childrens) {
  const labelAndName = { name, label }
  const commonFields = new CommonFields({ ...labelAndName, ...fields })
  commonFields.type = 'group'
  const commonGroupFields = new CommonGroupFields(fields)
  const children = { children: [] }
  childrens.forEach(element => {
    children.children.push(element)
  })
  return { ...commonFields, ...commonGroupFields, ...children }
}

/**
 * @summary Main Style group wrapper
 * @param {COMMON_FIELDS & COMMON_GROUP_FIELDS} [fields]
 * @param {Array} childrens
 * @returns {Object}
 */
function styleGroup (fields, ...childrens) {
  const labelAndName = { name: 'style', label: 'Style' }
  const commonFields = new CommonFields({ ...labelAndName, ...fields })
  commonFields.type = 'group'
  const commonGroupFields = new CommonGroupFields(fields)
  commonGroupFields.tab = 'STYLE'
  const children = { children: [] }
  childrens.forEach(element => {
    children.children.push(element)
  })
  return { ...commonFields, ...commonGroupFields, ...children }
}

export { group, styleGroup }
