/** @module hubspot/auth/scopes */
/// <reference path="../../types/types.js" />
import chalk from 'chalk'

/**
 * #### scope details
 * @typedef {Object} SCOPE_DETAILS
 * @property {boolean} selected - is selected
 * @property {string} title - scope title
 * @property {string} description - scope description
 */

/**
 * #### scopes
 * @typedef {Object} SCOPES
 * @property {SCOPE_DETAILS} cms_pages - View and download website data.
 * @property {SCOPE_DETAILS} crm_objects - Read data from HubSpot objects in the CRM.
 * @property {SCOPE_DETAILS} custom_objects - Create, delete, or make changes to custom objects in the CRM.
 * @property {SCOPE_DETAILS} design_manager - Upload and download templates, modules, and other files that developers need to write the code for websites and emails.
 * @property {SCOPE_DETAILS} developer_projects - Upload and download developer projects.
 * @property {SCOPE_DETAILS} file_manager - Upload and download files that can be used across HubSpot tools when creating content.
 * @property {SCOPE_DETAILS} graphql_data_fetching - Execute GraphQL queries and fetch GraphQL Schema.
 * @property {SCOPE_DETAILS} hubdb - Create, update, and delete HubDB tables.
 * @property {SCOPE_DETAILS} serverless_functions - View logs, manage secrets, and interact with other serverless functionality.
 */

/**
 * #### parse scopes
 * @private
 * @param {HUBSPOT_AUTH_CONFIG} config - hubspot authentication config
 * @returns {SCOPES} scopes
 */
function parseScopes (config) {
  /**
   * @type {SCOPES}
   */
  const scopes = {
    cms_pages: {
      selected: false,
      title: 'CMS Pages',
      description: 'View and download website data.'
    },
    crm_objects: {
      selected: false,
      title: 'CRM Objects',
      description: 'Read data from HubSpot objects in the CRM.'
    },
    custom_objects: {
      selected: false,
      title: 'Custom Objects',
      description: 'Create, delete, or make changes to custom objects in the CRM.'
    },
    design_manager: {
      selected: false,
      title: 'Design Manager',
      description: 'Upload and download templates, modules, and other files that developers need to write the code for websites and emails.'
    },
    developer_projects: {
      selected: false,
      title: 'Developer Projects',
      description: 'Upload and download developer projects.'
    },
    file_manager: {
      selected: false,
      title: 'File Manager',
      description: 'Upload and download files that can be used across HubSpot tools when creating content.'
    },
    graphql_data_fetching: {
      selected: false,
      title: 'GraphQL Data Fetching',
      description: 'Execute GraphQL queries and fetch GraphQL Schema.'
    },
    hubdb: {
      selected: false,
      title: 'HubDB',
      description: 'Create, update, and delete HubDB tables.'
    },
    serverless_functions: {
      selected: false,
      title: 'Serverless functions',
      description: 'View logs, manage secrets, and interact with other serverless functionality.'
    }
  }

  if (config.portals[0].scopeGroups.includes('cms.pages.landing_pages.read') &&
    config.portals[0].scopeGroups.includes('cms.pages.site_pages.read')) {
    scopes.cms_pages.selected = true
  }
  if (config.portals[0].scopeGroups.includes('crm.objects.companies.read') &&
    config.portals[0].scopeGroups.includes('crm.objects.contacts.read') &&
    config.portals[0].scopeGroups.includes('crm.objects.deals.read') &&
    config.portals[0].scopeGroups.includes('crm.objects.owners.read') &&
    config.portals[0].scopeGroups.includes('crm.schemas.companies.read') &&
    config.portals[0].scopeGroups.includes('crm.schemas.contacts.read') &&
    config.portals[0].scopeGroups.includes('crm.schemas.deals.read')) {
    scopes.crm_objects.selected = true
  }
  if (config.portals[0].scopeGroups.includes('crm.objects.custom.read') &&
    config.portals[0].scopeGroups.includes('crm.objects.custom.write') &&
    config.portals[0].scopeGroups.includes('crm.schemas.custom.read') &&
    config.portals[0].scopeGroups.includes('crm.schemas.custom.write')) {
    scopes.custom_objects.selected = true
  }
  if (config.portals[0].scopeGroups.includes('cms.source_code.write') &&
    config.portals[0].scopeGroups.includes('cms.source_code.read')) {
    scopes.design_manager.selected = true
  }
  if (config.portals[0].scopeGroups.includes('developer.projects.write')) {
    scopes.developer_projects.selected = true
  }
  if (config.portals[0].scopeGroups.includes('files')) {
    scopes.file_manager.selected = true
  }
  if (config.portals[0].scopeGroups.includes('collector.graphql_query.execute') &&
    config.portals[0].scopeGroups.includes('collector.graphql_schema.read')) {
    scopes.graphql_data_fetching.selected = true
  }
  if (config.portals[0].scopeGroups.includes('hubdb')) {
    scopes.hubdb.selected = true
  }
  if (config.portals[0].scopeGroups.includes('cms.functions.read') &&
    config.portals[0].scopeGroups.includes('cms.functions.write')) {
    scopes.serverless_functions.selected = true
  }
  return scopes
}

/**
 * #### throw error if missing scopes
 * @param {HUBSPOT_AUTH_CONFIG} config - hubspot authentication config
 * @param {'cms_pages'|'crm_objects'|'custom_objects'|'design_manager'|'developer_projects'|'file_manager'|'graphql_data_fetching'|'hubdb'|'serverless_functions'} scopeName - scope name
 * @returns undefined
 */
function throwErrorIfMissingScope (config, scopeName) {
  const scopes = parseScopes(config)
  if (!scopes[scopeName].selected) {
    const msg = 'This app hasn\'t been granted all required scopes to make this call. Read more about required scopes here: https://developers.hubspot.com/docs/cms/personal-access-key.'
    console.error(`${chalk.red.bold('[MISSING_SCOPES]')} ${msg}`)
    console.error('All of the following scopes are required:')
    console.error(`[${chalk.red(scopes[scopeName].title)}] - ${scopes[scopeName].description}`)
    process.exit(1)
  }
}

export { throwErrorIfMissingScope }
