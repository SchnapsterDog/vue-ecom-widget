import { createApp, h } from 'vue';
import Widget from './Widget.vue';

function init(config = {}) {
  const selector = config.selector || '#my-ecom-widget';
  const container = document.querySelector(selector);
  if (!container) {
    console.warn('Container not found:', selector);
    return;
  }
  // clear if re-init
  container.innerHTML = '';
  createApp({
    render() {
      return h(Widget, config);
    }
  }).mount(container);
}

if (!window.EcomWidget) window.EcomWidget = {};
window.EcomWidget.init = init;

export default init
