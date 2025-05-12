// src/main.js
import { createApp, h } from 'vue'
import Widget from './Widget.vue'

// 1) Define init
export function init(config = {}) {
  const selector = config.selector || '#my-ecom-widget'
  const container = document.querySelector(selector)
  if (!container) return console.warn('Container not found:', selector)

  // clear previous
  container.innerHTML = ''
  createApp({ render: () => h(Widget, config) }).mount(container)
}

// 2) Attach to window for any non-module loaders
if (!window.EcomWidget) window.EcomWidget = {}
window.EcomWidget.init = init

// 3) Default export must be an object with init
export default { init }
