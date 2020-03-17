/**
 * @module reel-l
 * @description
 * A custom element for creating a responsive grid using the CSS Grid module
 * @property {string} itemWidth=auto The width of each item (child element) in the Reel
 * @property {string} space=var(--s0) The space between Reel items (child elements)
 * @property {string} height=auto The height of the Reel itself
 * @property {boolean} noBar=false Whether to display the scrollbar
 */
export default class Reel extends HTMLElement {
  constructor() {
    super();
    this.render = () => {
      this.i = `Reel-${[this.itemWidth, this.height, this.space, this.noBar].join('')}`;
      this.dataset.i = this.i;
      if (!document.getElementById(this.i)) {
        let styleEl = document.createElement('style');
        styleEl.id = this.i;
        styleEl.innerHTML = `
          [data-i="${this.i}"] {
            height: ${this.height};
          }
      
          [data-i="${this.i}"] > * {
            flex: 0 0 ${this.itemWidth};
          }
      
          [data-i="${this.i}"] > img {
            height: 100%;
            flex-basis: auto;
            width: auto;
          }
      
          [data-i="${this.i}"] > * + * {
            margin-left: ${this.space};
          }
      
          [data-i="${this.i}"].overflowing {
            ${!this.noBar ?
            `padding-bottom: ${this.space}`
            : ''}
          }
      
          ${this.noBar ? `
          [data-i="${this.i}"] {
            scrollbar-width: none;
          }
          
          [data-i="${this.i}"]::-webkit-scrollbar {
            display: none;
          }
          ` : ''}
        `.replace(/\s\s+/g, ' ').trim();
        document.head.appendChild(styleEl);
      }
    }
  }

  toggleOverflowClass(elem) {
    elem.classList.toggle('overflowing', this.scrollWidth > this.clientWidth);
  }

  get itemWidth() {
    return this.getAttribute('itemWidth') || 'auto';
  }

  set itemWidth(val) {
    return this.setAttribute('itemWidth', val);
  }

  get height() {
    return this.getAttribute('height') || 'auto';
  }

  set height(val) {
    return this.setAttribute('height', val);
  }

  get space() {
    return this.getAttribute('space') || 'var(--s0)';
  }

  set space(val) {
    return this.setAttribute('space', val);
  }

  get noBar() {
    return this.hasAttribute('noBar');
  }

  set noBar(val) {
    if (val) {
      this.setAttribute('noBar', '');
    } else {
      this.removeAttribute('noBar');
    }
  }

  static get observedAttributes() {
    return ['itemWidth', 'height', 'space', 'noBar'];
  }

  connectedCallback() {
    this.render();
    if ('ResizeObserver' in window) {
      new ResizeObserver(entries => {
        console.log('resize');
        this.toggleOverflowClass(entries[0].target);
      }).observe(this);
    }

    if ('MutationObserver' in window) {
      new MutationObserver(entries => {
        this.toggleOverflowClass(entries[0].target);
      }).observe(this, { childList: true });
    }
  }

  attributeChangedCallback() {
    this.render();
  }
}

if ('customElements' in window) {
  customElements.define('reel-l', Reel);
}