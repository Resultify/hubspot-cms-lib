/** @module hubspot/auth/prompts */

import chalk from 'chalk'
import confirm from '@inquirer/confirm'
import select from '@inquirer/select'

/**
 * #### show prompt with portals and return the selected portal name
 * @async
 * @param {Array<{title:string, value:string}>} portalNames - portal name|names
 * @returns {Promise<string>} portal name
 */
async function choosePortal (portalNames) {
  /**
   * #### prompt to select Portal if more than one name with confirmation
   * @type {{message:string, choices:Array<{title:string, value:string}>}}
   */
  const selectPortal = {
    message: 'HubSpot portal:',
    choices: portalNames
  }

  const confirmSinglePortal = (/** @type {string} */ value) => {
    return {
      message: `Continue with ${chalk.cyan.bold(value)} portal?`
    }
  }
  const confirmPortal = (/** @type {string} */ value) => {
    return {
      message: `Continue with ${chalk.cyan.bold(value)} portal?`
    }
  }
  if (portalNames.length > 1) {
    const portal = await select(selectPortal)
    const confirmed = await confirm(confirmPortal(portal))
    if (!confirmed) {
      process.exit(0)
    }
    return portal
  } else {
    const confirmed = await confirm(confirmSinglePortal(portalNames[0].value))
    if (!confirmed) {
      process.exit(0)
    }
    return portalNames[0].value
  }
}

export { choosePortal }
