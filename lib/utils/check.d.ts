/**
 * @summary Check node version
 * @description Will throw an error if node version is wrong and if no engines config in package,json
 * @returns undefined
 * @throws console.error & process.exit(1) if node version is wrong
 * @example
 * import { checkNode } from './check.js'
 * checkNode()
 */
export function checkNode(): Promise<void>;
/**
 * @summary Check package.json name and theme.json name
 * @description Will throw an error if package.json[name] != theme.json[name]
 * @returns undefined
 * @throws console.error & process.exit(1) if package.json[name] != theme.json[name]
 * @example
 * import { checkPackageThemeConsistent } from './check.js'
 * checkPackageThemeConsistent()
 */
export function checkPackageThemeConsistent(): void;
//# sourceMappingURL=check.d.ts.map