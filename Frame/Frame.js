/**
 * @module frame-l
 * @description
 * A custom element for augmenting image ratios
 * @property {string} ratio=16:9 The element's aspect ratio
 */
export default class Frame extends HTMLElement {
  constructor() {
    super();
    this.render = () => {
      if (this.children.length !== 1) {
        console.warn('<frame-l> elements should have just one child element');
      }
      this.i = `Frame-${[this.ratio].join('')}`;
      this.dataset.i = this.i;
      if (!document.getElementById(this.i)) {
        let ratio = this.ratio.split(':');
        let styleEl = document.createElement('style');
        styleEl.id = this.i;
        styleEl.innerHTML = `
          [data-i="${this.i}"] {
            padding-bottom: calc(${ratio[1]} / ${ratio[0]} * 100%);
          }
        `.replace(/\s\s+/g, ' ').trim();
        document.head.appendChild(styleEl);
      }
    }
  }

  get ratio() {
    return this.getAttribute('ratio') || '16:9';
  }

  set ratio(val) {
    return this.setAttribute('ratio', val);
  }

  static get observedAttributes() {
    return ['ratio'];
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback() {
    this.render();
  }
}

if ('customElements' in window) {
  customElements.define('frame-l', Frame);
}