import { CommonFields, CommonContentFields } from './common-fields.js'

/**
 * @summary Text field
 * @typedef {Object} TEXT_FIELDS
 * @property {string} [validation_regex]
 * @property {true|false} [allow_new_line]
 * @property {true|false} [show_emoji_picker]
 * @property {string} [placeholder]
 * @property {string} [default]
 * @param {string} name
 * @param {string} label
 * @param {COMMON_FIELDS & COMMON_CONTENT_FIELDS & TEXT_FIELDS} [fields]
 * @returns {Object}
 */
function text (name, label, fields) {
  const labelAndName = { name, label }
  const commonFields = new CommonFields({ ...labelAndName, ...fields })
  commonFields.type = 'text'
  const commonContentFields = new CommonContentFields(fields)
  const specific = {}
  specific.allow_new_line = fields?.allow_new_line || false
  specific.show_emoji_picker = fields?.show_emoji_picker || false
  if (fields?.validation_regex) specific.validation_regex = fields.validation_regex
  if (fields?.placeholder) specific.placeholder = fields.placeholder
  return { ...commonFields, ...commonContentFields, ...specific }
}

const fields = {
  text
}

export { fields }
