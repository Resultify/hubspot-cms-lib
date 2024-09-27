/** @module hubspot/hubdb/prompts */
/// <reference path="../../types/types.js" />
import chalk from 'chalk'
import checkbox from '@inquirer/checkbox'
import confirm from '@inquirer/confirm'

/**
 * #### prepare table choices for prompt
 * @private
 * @param {Array<{name:string, id:string, published:boolean}>} tables - hubdb tables
 * @returns {Array<{name:string, value:{id:string, name:string, published:boolean}}>} table choices
 */
function prepareTableChoices (tables) {
  const tableChoices = []
  for (const table of tables) {
    let status = chalk.grey(` [${chalk.dim.bold.red('draft')}]`)
    if (table.published) status = chalk.grey(` [${chalk.dim.green('published')}]`)
    const tableId = chalk.dim.grey(table.id)
    tableChoices.push({ name: `${table.name} ${status} ${tableId}`, value: { id: table.id, name: table.name, published: table.published } })
  }
  return tableChoices
}

/**
 * #### select tables from account table list
 * @async
 * @param {Array<{name:string, id:string, published:boolean}>} tables - hubdb tables
 * @returns {Promise<Array<any>>} selected tables
 */
async function selectTables (tables) {
  /**
   * #### select tables prompt
   * @type {{message:string, choices:Array<{name:string, value:{id:string, name:string} }>, pageSize:number, loop:boolean}}
   */
  const selectTables = {
    message: 'Pick tables:',
    choices: prepareTableChoices(tables),
    pageSize: 5,
    loop: false
  }
  const confirmPortal = (/** @type {Array<{name:string}>} */ selectedTables) => {
    const tableNamesList = []
    for (const table of selectedTables) {
      tableNamesList.push(table.name)
    }
    if (tableNamesList.length === 1) {
      return {
        message: `Continue with ${chalk.cyan.bold(tableNamesList.join(','))} table?`
      }
    } else {
      return {
        message: `Continue with ${chalk.cyan.bold(tableNamesList.join(','))} tables?`
      }
    }
  }
  // select tables
  let selectedTables = await checkbox(selectTables)
  if (!selectedTables.length) {
    console.log('No tables selected')
    process.exit(0)
  }
  // confirm selection
  let confirmed = await confirm(confirmPortal(selectedTables))
  if (!confirmed) {
    // try again one more time
    selectedTables = await checkbox(selectTables)
    if (!selectedTables.length) {
      console.log('No tables selected')
      process.exit(0)
    }
    confirmed = await confirm(confirmPortal(selectedTables))
    if (!confirmed) {
      process.exit(0)
    }
  }
  return selectedTables
}

/**
 * #### prepare file choices for prompt
 * @private
 * @param {Array<FILE_LIST>} files - hubdb files
 * @returns {Array<{name:string, value:{path:string, name:string, label:string}}>} files choices
 */
function prepareFileChoices (files) {
  const fileChoices = []
  for (const file of files) {
    fileChoices.push({ name: file.name, value: { path: file.path, name: file.name, label: file.name.slice(0, -5) } })
  }
  return fileChoices
}

/**
 * #### select json files to upload as a table to hubdb
 * @async
 * @param {Array<FILE_LIST>} files - files
 * @returns {Promise<Array<{path:string, name:string, label:string}>>} selected files
 */
async function selectFiles (files) {
  /**
   * #### select files prompt
   * @type {{message:string, choices:Array<{name:string, value:{path: string, name: string, label:string} }>, pageSize:number, loop:boolean}}
   */
  const selectFiles = {
    message: 'Pick files:',
    choices: prepareFileChoices(files),
    pageSize: 5,
    loop: false
  }
  const confirmPortal = (/** @type {any} */ selectedFiles) => {
    const filesNameList = []
    for (const file of selectedFiles) {
      filesNameList.push(file.name)
    }
    if (filesNameList.length === 1) {
      return {
        message: `Continue with ${chalk.cyan.bold(filesNameList.join(','))} file?`
      }
    } else {
      return {
        message: `Continue with ${chalk.cyan.bold(filesNameList.join(','))} files?`
      }
    }
  }
  // select files
  let selectedTables = await checkbox(selectFiles)
  if (!selectedTables.length) {
    console.log('No file selected')
    process.exit(0)
  }
  // confirm selection
  let confirmed = await confirm(confirmPortal(selectedTables))
  if (!confirmed) {
    // try again one more time
    selectedTables = await checkbox(selectFiles)
    if (!selectedTables.length) {
      console.log('No file selected')
      process.exit(0)
    }
    confirmed = await confirm(confirmPortal(selectedTables))
    if (!confirmed) {
      process.exit(0)
    }
  }
  return selectedTables
}

/**
 * #### confirm overwrite of existing table
 * @async
 * @param {string} tableName - table name
 * @returns {Promise<boolean>} overwrite confirmation
 */
async function confirmTableOverwrite (tableName) {
  const confirmOverwrite = (/** @type {string} */ tableName) => {
    return {
      message: `Confirm overwriting existing ${chalk.magenta(tableName)} table with a local ${chalk.green(`${tableName}.json`)} file?`
    }
  }
  const confirmed = await confirm(confirmOverwrite(tableName))
  return confirmed
}

export { selectTables, selectFiles, confirmTableOverwrite }
