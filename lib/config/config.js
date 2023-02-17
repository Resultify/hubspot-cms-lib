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
  performance: 80,
  accessibility: 90,
  bestPractices: 90,
  seo: 80
}

export { config }
