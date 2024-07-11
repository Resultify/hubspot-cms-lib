/** @module hubspot/fetchdb */

import * as TYPES from '../../types/types.js' // eslint-disable-line no-unused-vars
import { downloadHubDbTable, createHubDbTable, updateHubDbTable, clearHubDbTableRows, addRowsToHubDbTable } from '@hubspot/local-dev-lib/hubdb'
import { fetchRows } from '@hubspot/local-dev-lib/api/hubdb'
import http from '@hubspot/local-dev-lib/http'
import chalk from 'chalk'
import * as ui from '../../utils/ui.js'
import { getThemeOptions } from '../../utils/options.js'
import { selectTables, selectFiles, confirmTableOverwrite } from './prompts.js'
import ora, { oraPromise } from 'ora'
import { getFileList } from '../../utils/fs.js'
import { createRequire } from 'module'
import { throwErrorIfMissingScope } from '../auth/scopes.js'
const require = createRequire(import.meta.url)
const cmslibOptions = getThemeOptions()

const HUBDB_API_PATH = 'cms/v3/hubdb'

/**
 * #### fetch HubDB tables
 * @async
 * @private
 * @param {number} accountId - hubspot account id
 * @returns {Promise<any>} hubdb tables
 */
async function fetchTables (accountId) {
  return http.default.get(accountId, {
    url: `${HUBDB_API_PATH}/tables`
  })
}

/**
 * @ignore
 * @typedef {TYPES.HUBSPOT_AUTH_CONFIG} HUBSPOT_AUTH_CONFIG {@link HUBSPOT_AUTH_CONFIG}
 */

/**
 * #### fetch HubDB tables
 * @async
 * @param {HUBSPOT_AUTH_CONFIG} config - hubspot authentication config
 * @returns undefined
 */
async function fetchHubDb (config) {
  try {
    const timeStart = ui.startTask('fetchDb')
    const dest = `${process.cwd()}/${cmslibOptions.hubdbFolder}`
    const accountId = config.portals[0].portalId
    throwErrorIfMissingScope(config, 'hubdb')
    // fetch all tables from the account
    const tables = await fetchTables(accountId)
    // select tables to download
    const selectedTables = await selectTables(tables.results)
    const msg = (/** @type {string} */ tableName) => `Saving HubDB ${chalk.magenta(tableName)} table into ${chalk.dim.green(`${tableName}.json`)} file`
    for await (const table of selectedTables) {
      // download each table into a json file
      await oraPromise(downloadHubDbTable(accountId, table.id, `${dest}/${table.name}.json`), { text: msg(table.name) })
    }
    ui.endTask({ taskName: 'fetchDb', timeStart })
  } catch (error) {
    console.error(error)
    process.exit(1)
  }
}

/**
 * #### upload HubDB tables
 * @async
 * @param {HUBSPOT_AUTH_CONFIG} config - hubspot authentication config
 * @returns undefined
 */
async function uploadHubDb (config) {
  try {
    const timeStart = ui.startTask('uploadDb')
    const hubdbFolder = `${process.cwd()}/${cmslibOptions.hubdbFolder}`
    const accountId = config.portals[0].portalId
    throwErrorIfMissingScope(config, 'hubdb')
    // get all json files from the hubdb folder
    const files = await getFileList(`${hubdbFolder}/*.json`, { objectMode: true })
    if (files === undefined || files.length === 0) {
      console.log('No HubDb files found')
      process.exit(0)
    }
    // select files to upload
    const selectedFiles = await selectFiles(files)
    // fetch all tables from the account
    const tables = await fetchTables(accountId)
    const createMsg = (/** @type {string} */ fileName) => `Creating and publishing ${chalk.magenta(fileName)} table based on ${chalk.dim.green(`${fileName}.json`)} file`
    const overwriteMsg = (/** @type {string} */ fileName) => `Overwriting and publishing ${chalk.magenta(fileName)} table.`
    for (const file of selectedFiles) {
      // check if table already exists
      const table = tables.results.find((/** @type {any} */ t) => t.name === file.label)
      if (table) {
        console.warn(`${chalk.red('[Warning]')} ${chalk.magenta(file.label)} table already exists in the selected account.`)
        const confirm = await confirmTableOverwrite(file.label)
        if (confirm) {
          const spinner = ora(overwriteMsg(file.label)).start()
          try {
            // get table rows from the json file
            const rows = require(file.path).rows
            // update table columns and options
            await updateHubDbTable(accountId, table.id, file.path)
            // check if remote table has rows
            const remoteRows = await fetchRows(accountId, table.id)
            if (remoteRows.results.length) {
              // clear remote table rows if exists
              await clearHubDbTableRows(accountId, table.id)
            }
            // add new rows to the table from the json file
            await addRowsToHubDbTable(accountId, table.id, rows)
            spinner.succeed()
          } catch (error) {
            spinner.fail()
            console.error(error)
            process.exit(1)
          }
        }
      } else {
        // create and publish table if it does not exist
        await oraPromise(createHubDbTable(accountId, file.path), { text: createMsg(file.label) })
      }
    }
    ui.endTask({ taskName: 'uploadDb', timeStart })
  } catch (error) {
    console.error(error)
    process.exit(1)
  }
}

export { fetchHubDb, uploadHubDb }
