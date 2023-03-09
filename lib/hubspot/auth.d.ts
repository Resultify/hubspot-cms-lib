/**
 * @summary Load and validate Hubspot config
 * @async
 * @param {T.THEME_HUB_AUTH_CONFIG|string} customAuthConfig - Rusultify custom Hubspot authentication
 * @returns {Promise<T.THEME_HUB_AUTH_CONFIG>} Hubspot loaded config
 */
export function loadAuthConfig(customAuthConfig: T.THEME_HUB_AUTH_CONFIG | string): Promise<T.THEME_HUB_AUTH_CONFIG>;
/**
 * @summary add/check/return custom auth config
 * @async
 * @returns {Promise<T.THEME_HUB_AUTH_CONFIG|string>} Hubspot portal auth config
 */
export function getAuthConfig(): Promise<T.THEME_HUB_AUTH_CONFIG | string>;
import * as T from "../config/types.js";
//# sourceMappingURL=auth.d.ts.map