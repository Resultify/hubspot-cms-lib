import prompts from 'prompts'
import chalk from 'chalk'

/**
 * #### show prompt with portals and return the selected portal name
 * @async
 * @param {Array<{title:string, value:string}>} portalNames - portal name|names
 * @param {string} themeName - theme name
 * @returns {Promise<string>} portal name
 */
async function choosePortal (portalNames, themeName) {
  // process.exit(0) if no confirmation for portal name
  // https://github.com/terkelg/prompts#optionsonsubmit
  const onSubmit = async (/** @type {prompts.PromptObject} */ prompt, /** @type {Boolean} */ answer) => {
    if (prompt.name === 'secondConfirm' && answer === false) {
      process.exit(0)
    }
  }
  // process.exit(0) when the user cancels/exits the prompt
  // https://github.com/terkelg/prompts#optionsoncancel
  const onCancel = async () => {
    process.exit(0)
  }
  if (portalNames.length > 1) {
    /**
     * #### prompt to select Portal if more than one name with confirmation
     * @type {Array<prompts.PromptObject<string>>}
     */
    const selectPortal = [
      {
        type: 'select',
        name: 'value',
        message: `HubSpot account for ${chalk.yellow(themeName)} theme:`,
        choices: portalNames,
        initial: 0
      },
      {
        type: 'confirm',
        name: 'firstConfirm',
        message: prev => `Continue with ${chalk.cyan.bold(prev)} portal?`,
        initial: true
      },
      {
        type: prev => prev === false ? 'select' : null,
        name: 'value',
        message: `HubSpot account for ${chalk.yellow(themeName)} theme:`,
        choices: portalNames,
        initial: 0
      },
      {
        type: (_, values) => values.firstConfirm === false ? 'confirm' : null,
        name: 'secondConfirm',
        message: prev => `Continue with ${chalk.cyan.bold(prev)} portal?`,
        initial: true
      }
    ]
    const portal = await prompts(selectPortal, { onSubmit, onCancel })
    return portal.value
  } else {
    /**
     * #### prompt to confirm Portal if one portal name
     * @type {Array<prompts.PromptObject<string>>}
     */
    const confirmPortal = [
      {
        type: 'confirm',
        name: 'secondConfirm',
        message: `${chalk.dim(`[${chalk.yellow(themeName)} theme]`)} Continue with ${chalk.cyan.bold(portalNames[0].value)} portal?`,
        initial: true
      }
    ]
    await prompts(confirmPortal, { onSubmit, onCancel })
    return portalNames[0].value
  }
}

export { choosePortal }
