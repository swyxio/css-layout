/**
 * @module grid-l
 * @description
 * A custom element for creating a responsive grid using the CSS Grid module
 * @property {string} min=250px A CSS length value representing x in `minmax(min(x, 100%), 1fr)`
 * @property {string} space=var(--s0) The space between grid cells
 */
export default class Grid extends HTMLElement {
  constructor() {
    super();
    this.render = () => {
      this.i = `Grid-${[this.min, this.space].join('')}`;
      this.dataset.i = this.i;
      if (!document.getElementById(this.i)) {
        let styleEl = document.createElement('style');
        styleEl.id = this.i;
        styleEl.innerHTML = `
          [data-i="${this.i}"] {
            grid-gap: ${this.space};
          }
      
          [data-i="${this.i}"].grid-l--above {
            grid-template-columns: repeat(auto-fit, minmax(${this.min}, 1fr));
          }
      
          @supports (width: min(${this.min}, 100%)) {
            [data-i="${this.i}"] {
              grid-gap: ${this.space};
              grid-template-columns: repeat(auto-fill, minmax(min(${this.min}, 100%), 1fr));
            }
          }
        `.replace(/\s\s+/g, ' ').trim();
        document.head.appendChild(styleEl);
      }
    }
  }

  get min() {
    return this.getAttribute('min') || '250px';
  }

  set min(val) {
    return this.setAttribute('min', val);
  }

  get space() {
    return this.getAttribute('space') || 'var(--s0)';
  }

  set space(val) {
    return this.setAttribute('space', val);
  }

  static get observedAttributes() {
    return ['min', 'space'];
  }

  connectedCallback() {
    if ('ResizeObserver' in window && !CSS.supports('width', `min(${this.min}, 100%)`)) {
      const test = document.createElement('div');
      test.classList.add('test');
      test.style.width = this.min;
      this.appendChild(test);
      const br = test.offsetWidth;
      this.removeChild(test);

      const ro = new ResizeObserver(entries => {
        for (let entry of entries) {
          const cr = entry.contentRect;
          const q = cr.width > br;
          this.classList.toggle('grid-l--above', q);
        }
      });

      ro.observe(this);
    }
    this.render();
  }

  attributeChangedCallback() {
    this.render();
  }
}

if ('customElements' in window) {
  customElements.define('grid-l', Grid);
}