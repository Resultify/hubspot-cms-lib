# Resultify HubSpot CMS Lib

## Set of tools for HubSpot CMS themes
- JS/CSS/SASS compilers
- HubSpot CLI `upload`, `fetch` and `watch` commands integrated with other scripts
- Custom HubSpot multi-account authentication

## Requirements
1. Should be a part of HubSpot Theme as an NPM dependency
2. HubSpot Theme should have entry points scripts for every task (example: [entry points scripts](https://github.com/Resultify/nimbly-lite/tree/master/build))
3. HubSpot Theme should have tasks added as a script to package.json (example: [package.json](https://github.com/Resultify/nimbly-lite/blob/master/package.json#L9))

## What's inside:

- Commands
  - Watch
  - FetchModules
  - FetchAll
  - Upload
  - Build

- Compilers:
  - SASS
  - JS
  - CSS

- HubSpot
  - Fetch
  - Upload
  - Custom multi-account authentication

## Custom multi-account authentication

1. add `.env` file to your theme
2. add the name of the portal with the prefix `hub_` as the variable name and the `personal access key` as the variable value
3. Run Hubspot Theme commands (fetch, upload, watch)

### `.env` file example

```
hub_sandbox=personal_access_key for sandbox portal
hub_project1=personal_access_key for project1 portal
hub_project2=personal_access_key for project2 portal
```
