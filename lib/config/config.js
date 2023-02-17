// local config example
const config = {}
config.js = {}
config.lighthouse = {}
// JS | Rollup config
// external (https://rollupjs.org/guide/en/#external)
config.js.external = [
  '@popperjs/core'
]
// replace (https://github.com/rollup/plugins/tree/master/packages/replace)
config.js.replace = {
  'global.SimpleLightbox': 'window.SimpleLightbox'
}
// globals (https://rollupjs.org/guide/en/#outputglobals)
config.js.globals = {
  '@popperjs/core': 'Popper = () => {}'
}
config.lighthouse.threshold = {
  performance: 85,
  accessibility: 100,
  bestPractices: 100,
  seo: 90
}

export { config }
