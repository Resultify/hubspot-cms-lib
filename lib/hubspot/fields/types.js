/**
 * @summary HubSpot common properties
 * @description Properties used by all fields (content tab fields, style fields, group fields)
 * @exports COMMON_FIELDS
 * @typedef {Object} COMMON_FIELDS
 * @property {string} [name] The field's name, which you'll reference when incorporating the field and its values in the module or theme. Cannot contain spaces or special characters.
 * @property {string} [label] The text the content creator sees describing the field. May contain spaces.
 * @property {boolean} [required] Sets whether the field can be left blank in the editor. If true, content cannot be published without a value in the field.
 * @property {boolean} [locked] Sets whether the field is editable in the content editor. If true, the field will not appear in the content editor.
 * @property {string} [type] The type of field. Field types are unique per field and can be found within the documentation for each field below.
 * @property {string} [inline_help_text] Text that displays inline below field's label (limit 400 characters). Best used for information required to use the field. You can include the following HTML tags (other tags will be ignored on render): a, b, br, em, i, p, small, strong, span.
 * @property {string} [help_text] Text that displays in the editor within a tooltip on hover to assist the content creator (limit 300 characters). Best used for information that is supplementary but not required to use the field. You can include the following HTML tags (other tags will be ignored on render): a, b, br, em, i, p, small, strong, span.
 * @property {null|'half_width'} [display_width]
 * @property {'SIMPLE'|'ADVANCED'} [visibility_rules]
 * @property {Object} [visibility] Sets the field's display conditions. For example, you can set a field to only display when another checkbox field has been selected
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
 * @summary HubSpot common group properties
 * @description Properties used by all group fields on top of common fields
 * @exports COMMON_GROUP_FIELDS
 * @typedef {Object} COMMON_GROUP_FIELDS
 * @property {string} [tab]
 * @property {boolean} [expanded]
 * @property {Object} [occurrence]
 * @property {null|number} [occurrence.min]
 * @property {null|number} [occurrence.max]
 * @property {null|string} [occurrence.sorting_label_field]
 * @property {null|number} [occurrence.default]
 * @property {Object} [default]
 */

/**
 * @summary HubSpot common content-tab properties
 * @description Properties used by all fields in content tab on top of common fields
 * @exports COMMON_CONTENT_FIELDS
 * @typedef {Object} COMMON_CONTENT_FIELDS
 * @property {Object} [occurrence]
 * @property {null|number} [occurrence.min]
 * @property {null|number} [occurrence.max]
 * @property {null|string} [occurrence.sorting_label_field]
 * @property {null|number} [occurrence.default]
 */
