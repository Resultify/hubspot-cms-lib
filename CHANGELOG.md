### v3.4.5 `July 19, 2024`
* **[TASK]** update npm deps, update @hubspot/local-dev-lib to v1.9.0 [`6e6560f`](https://github.com/Resultify/hubspot-cms-lib/commit/6e6560f) (dmh)
* **[TASK]** update error handling for watch and upload command [`6f8a9d8`](https://github.com/Resultify/hubspot-cms-lib/commit/6f8a9d8) (dmh)

***

### v3.4.4 `July 18, 2024`
* **[TASK]** include also global env variables for the auth process [`2227a5e`](https://github.com/Resultify/hubspot-cms-lib/commit/2227a5e) (dmh)

***

### v3.4.3 `July 16, 2024`
* **[BUGFIX]** check only local .env file and variable which only starts from hub_ [`dea95c1`](https://github.com/Resultify/hubspot-cms-lib/commit/dea95c1) (dmh)

***

### v3.4.2 `July 16, 2024`
* **[BUGFIX]** fix native HubSpot Env auth [`188ff60`](https://github.com/Resultify/hubspot-cms-lib/commit/188ff60) (dmh)

***

### v3.4.1 `July 15, 2024`
* **[BUGFIX]** fix fetchHubDb functionality [`22ad184`](https://github.com/Resultify/hubspot-cms-lib/commit/22ad184) (dmh)

***

### v3.4.0 `July 15, 2024`
* **[TASK]** update npm deps, update @hubspot/local-dev-lib to v1.7.0 [`0c412a2`](https://github.com/Resultify/hubspot-cms-lib/commit/0c412a2) (dmh)
* **[TASK]** update reference for js types [`77bc854`](https://github.com/Resultify/hubspot-cms-lib/commit/77bc854) (dmh)
* **[TASK]** update hubspot auth functionality [`5f7c85d`](https://github.com/Resultify/hubspot-cms-lib/commit/5f7c85d) (dmh)
* **[TASK]** remove deprecated @hubspot/cli-lib and use instead @hubspot/local-dev-lib #2 [`96ca444`](https://github.com/Resultify/hubspot-cms-lib/commit/96ca444) (dmh)
* **[TASK]** remove deprecated @hubspot/cli-lib and use instead @hubspot/local-dev-lib [`5a35608`](https://github.com/Resultify/hubspot-cms-lib/commit/5a35608) (dmh)

***

### v3.3.0 `July 5, 2024`
* **[TEST]** fix test github action [`c457848`](https://github.com/Resultify/hubspot-cms-lib/commit/c457848) (dmh)
* **[TASK]** update github actions [`92e50f7`](https://github.com/Resultify/hubspot-cms-lib/commit/92e50f7) (dmh)
* **[TASK]** update child theme hubspot marketplace validation [`389e853`](https://github.com/Resultify/hubspot-cms-lib/commit/389e853) (dmh)
* **[TASK]** update npm deps [`d6505b0`](https://github.com/Resultify/hubspot-cms-lib/commit/d6505b0) (dmh)

***

### v3.2.1 `March 8, 2024`
* **[TASK]** update default template data for new .env file to use it with CI [`48234de`](https://github.com/Resultify/hubspot-cms-lib/commit/48234de) (dmh)

***

### v3.2.0 `February 16, 2024`
* **[BUGFIX]** do not upload hubdb without confirmation [`a092a3b`](https://github.com/Resultify/hubspot-cms-lib/commit/a092a3b) (dmh)
* **[TASK]** exclude inherits_brand_color check from child theme validation [`31fcc1e`](https://github.com/Resultify/hubspot-cms-lib/commit/31fcc1e) (dmh)
* **[TASK]** update cli ui [`246f868`](https://github.com/Resultify/hubspot-cms-lib/commit/246f868) (dmh)
* **[TASK]** add cleanUpload cmd, update npm deps [`16b339c`](https://github.com/Resultify/hubspot-cms-lib/commit/16b339c) (dmh)
* **[BUGFIX]** uso only hubspot related personal-keys prefixed by hub_ [`2746094`](https://github.com/Resultify/hubspot-cms-lib/commit/2746094) (dmh)

***

### v3.1.2 `January 18, 2024`
* **[TASK]** add check isChildTheme, adopt validation process for child themes [`ad10736`](https://github.com/Resultify/hubspot-cms-lib/commit/ad10736) (dmh)

***

### v3.1.1 `January 18, 2024`
* **[TASK]** decrease lighthouse best Practices default threshold to 80 since testing environment using http links not https [`dd1df12`](https://github.com/Resultify/hubspot-cms-lib/commit/dd1df12) (dmh)

***

### v3.1.0 `January 17, 2024`
* **[DOC]** update docs [`c551291`](https://github.com/Resultify/hubspot-cms-lib/commit/c551291) (dmh)
* **[TASK]** create cmslib cli alias and make it executable [`13081e0`](https://github.com/Resultify/hubspot-cms-lib/commit/13081e0) (dmh)
* **[TASK]** add add error handler for access-key missing access scopes [`e900602`](https://github.com/Resultify/hubspot-cms-lib/commit/e900602) (dmh)
* **[FEATURE]** add hubdb fetch and upload functionality (#2) [`5ebec38`](https://github.com/Resultify/hubspot-cms-lib/commit/5ebec38) (Dmytro Hrynevych)
* **[TASK]** use inquirer.js instead of prompts.js for cli prompts, some refactoring [`08cbd8f`](https://github.com/Resultify/hubspot-cms-lib/commit/08cbd8f) (dmh)

***

### v3.0.1 `January 12, 2024`
* **[BUGFIX]** add missed execa dependency [`e1432f9`](https://github.com/Resultify/hubspot-cms-lib/commit/e1432f9) (dmh)
* **[BUGFIX]** fix PublishNPM github action [`7614acb`](https://github.com/Resultify/hubspot-cms-lib/commit/7614acb) (dmh)

***

### v3.0.0 `January 12, 2024`
* **[DOC]** update documentation [`117e3a4`](https://github.com/Resultify/hubspot-cms-lib/commit/117e3a4) (dmh)
* **[TASK]** big refactoring, update dependencies [`2702457`](https://github.com/Resultify/hubspot-cms-lib/commit/2702457) (dmh)
* **[TASK]** add 30m timeout for all github actions [`2efe942`](https://github.com/Resultify/hubspot-cms-lib/commit/2efe942) (dmh)
* **[TASK]** update npm deps [`2b04299`](https://github.com/Resultify/hubspot-cms-lib/commit/2b04299) (dmh)
* **[DOC]** add API documentation using jsdoc [`0396c08`](https://github.com/Resultify/hubspot-cms-lib/commit/0396c08) (dmh)
* **[TASK]** implement vendor folder concept, to store all third party files inside vendor folder [`1b329d3`](https://github.com/Resultify/hubspot-cms-lib/commit/1b329d3) (dmh)
* **[TASK]** add build task to exports field, remove tmp folder config, compile scss directly to theme/assets/css [`887f72c`](https://github.com/Resultify/hubspot-cms-lib/commit/887f72c) (dmh)
* **[TASK]** export lib commands to import and execute them separately [`317458a`](https://github.com/Resultify/hubspot-cms-lib/commit/317458a) (dmh)

***

### v2.1.0 `June 30, 2023`
* **[TASK]** add quick-release config [`f41bcfb`](https://github.com/Resultify/hubspot-cms-lib/commit/f41bcfb) (dmh)
* **[TASK]** update npm dep-s, update editorconfig [`ae80a66`](https://github.com/Resultify/hubspot-cms-lib/commit/ae80a66) (dmh)
* **[DOC]** update readme file [`a154d76`](https://github.com/Resultify/hubspot-cms-lib/commit/a154d76) (dmh)
* **[TASK]** update npm deps [`f57a547`](https://github.com/Resultify/hubspot-cms-lib/commit/f57a547) (dmh)
* **[TASK]** remove unneeded ts declarations, remove dts scripts [`7dafd01`](https://github.com/Resultify/hubspot-cms-lib/commit/7dafd01) (dmh)
* **[TASK]** update fields task to run it externally using node, in watch process compile only one changed file instead all of them [`7c0ef7d`](https://github.com/Resultify/hubspot-cms-lib/commit/7c0ef7d) (dmh)
* **[TASK]** add ts types [`9258167`](https://github.com/Resultify/hubspot-cms-lib/commit/9258167) (dmh)
* **[TASK]** add generateTsDeclarations build task [`7ab7c3a`](https://github.com/Resultify/hubspot-cms-lib/commit/7ab7c3a) (dmh)
* **[TASK]** add proper import for global jsdoc types [`eb4a3a7`](https://github.com/Resultify/hubspot-cms-lib/commit/eb4a3a7) (dmh)
* **[TASK]** add generateTsDeclarations build task, update npm deps [`abbc76b`](https://github.com/Resultify/hubspot-cms-lib/commit/abbc76b) (dmh)
* **[TASK]** add compileFieldsJs functionality [`2cceaca`](https://github.com/Resultify/hubspot-cms-lib/commit/2cceaca) (dmh)
* **[TASK]** show DotEnv setup instructions if empty [`d4d9e7d`](https://github.com/Resultify/hubspot-cms-lib/commit/d4d9e7d) (dmh)
* **[TASK]** refactor, add tsconfig instead of jsconfig, add more types, add TypeScript lint, fix lint errors [`627358c`](https://github.com/Resultify/hubspot-cms-lib/commit/627358c) (dmh)

***


#### v2.0.1 `February 20, 2023`

- **[TASK]** improve error handling for lighthouse and marketplace validation scripts ([27c56d9](https://github.com/Resultify/hubspot-cms-lib/commit/27c56d9))

***

#### v2.0.0 `February 17, 2023`

- **[TASK]** decrease lighthouse threshold score ([1e21927](https://github.com/Resultify/hubspot-cms-lib/commit/1e21927))
- **[TASK]** update npm deps ([732e708](https://github.com/Resultify/hubspot-cms-lib/commit/732e708))
- **[FEATURE]** add Mobile Lighthouse test for all page templates in themes ([1b5869e](https://github.com/Resultify/hubspot-cms-lib/commit/1b5869e))
- **[FEATURE]** add a possibility to execute fetch commands directly from npm ([811b423](https://github.com/Resultify/hubspot-cms-lib/commit/811b423))
- **[FEATURE]** add theme marketplace validation command ([471ccaa](https://github.com/Resultify/hubspot-cms-lib/commit/471ccaa))

***

#### v1.0.3 `January 6, 2023`

- **[TASK]** check global env variables not only .env file (#1) ([f4c0dc1](https://github.com/Resultify/hubspot-cms-lib/commit/f4c0dc1))

***

#### v1.0.2 `January 5, 2023`

- **[TASK]** add github action for publish-npm ([d8a95e6](https://github.com/Resultify/hubspot-cms-lib/commit/d8a95e6))
- **[TASK]** add the possibility to override themeConfirm prompt to use for automations ([acabe00](https://github.com/Resultify/hubspot-cms-lib/commit/acabe00))
- **[TEST]** update github action tests, use checkout@v3 and setup-node@v3 with cache enabled ([35b54bc](https://github.com/Resultify/hubspot-cms-lib/commit/35b54bc))

***

#### v1.0.1 `January 4, 2023`

- **[TASK]** update npm dependencies and node/npm engines ([7e5472f](https://github.com/Resultify/hubspot-cms-lib/commit/7e5472f))

***

#### v1.0.0 `December 5, 2022`

- **[TASK]** use theme.name (theme.json) to identify theme name instead of theme.label ([a971955](https://github.com/Resultify/hubspot-cms-lib/commit/a971955))
- **[TASK]** update npm deps ([eef6c0b](https://github.com/Resultify/hubspot-cms-lib/commit/eef6c0b))

***

#### v0.0.2 `November 28, 2022`

- **[TASK]** remove build process from watch cmd ([6eb1448](https://github.com/Resultify/hubspot-cms-lib/commit/6eb1448))
- **[TASK]** update watch process logger ([7dd9f21](https://github.com/Resultify/hubspot-cms-lib/commit/7dd9f21))
- **[TASK]** update @hubspot/cli-lib, fix upload and watch cmd, improve performance ([99eea4a](https://github.com/Resultify/hubspot-cms-lib/commit/99eea4a))

***

#### v0.0.1 `November 18, 2022`

- **[TASK]** update README file ([0472636](https://github.com/Resultify/hubspot-cms-lib/commit/0472636))

***
