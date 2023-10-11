/** @module lib/hubspot/utils/utils */

import { globals } from '../config/globals.js'
import prompts from 'prompts'
import chalk from 'chalk'

if (process.argv.slice(2)[0] === '--themeConfirm=true') {
  const themeConfirmArr = process.argv.slice(2)[0].slice(2).split('=')
  const themeConfirmObj = { [themeConfirmArr[0]]: themeConfirmArr[1] }
  prompts.override(themeConfirmObj)
}

/**
 * #### show prompt to confirm theme name
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
