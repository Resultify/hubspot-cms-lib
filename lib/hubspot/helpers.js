/** @module lib/hubspot/utils/utils */

import { globals } from '../config/globals.js'
import prompts from 'prompts'
import chalk from 'chalk'

/**
 * @summary show prompt to confirm theme name
 * @async
 * @returns undefined
 */
async function confirmThemeName () {
  // process.exit(0) when the user cancels/exits the prompt
  // https://github.com/terkelg/prompts#optionsoncancel
  const onCancel = async () => {
    process.exit(0)
  }
  await prompts(
    {
      type: 'confirm',
      name: 'themeConfirm',
      message: `Continue with ${chalk.cyan.bold(globals.THEME_NAME)} theme?`,
      initial: true
    }, { onCancel }
  )
}

export { confirmThemeName }
