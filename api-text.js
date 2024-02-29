class ApiText extends HTMLElement {
  static tagName = 'api-text'

  static register(tagName, registry) {
    if(!registry && ('customElements' in globalThis)) {
      registry = globalThis.customElements;
    }
    registry?.define(tagName || this.tagName, this);
  }

  static attr = {
    url: 'api-url'
  }

  get url() {
    return this.getAttribute(ApiText.attr.url) || '';
  }

  async connectedCallback() {
    if (this.shadowRoot) return;
    let shadowroot = this.attachShadow({ mode: 'open' })
    let slot = document.createElement('slot')
    shadowroot.appendChild(slot)

    const data = { ...(await this.data) };
    const loading = this.querySelector('.loading')
    const content = this.querySelector('.content')
    const value = data['content']
    const cacheKey = this.url || 'api-text-cache'
    const cache = sessionStorage?.getItem(cacheKey) || loading.innerHTML
    const loadText = (string) => {
      if (typeof string === 'undefined') {
        loading.style.display = 'none'
        content.style.display = 'none'
      }

      if (string && content.style.opacity !== '1') {
        loading.style.opacity = '0'
        loading.style.display = 'none'
        content.style.opacity = '1'
        content.innerHTML = value
      } else if (string && content.style.opacity === '1') {
        content.innerHTML = value
      }
    }

    loadText(cache);
    loadText(value);

    sessionStorage?.setItem(cacheKey, JSON.stringify(value))
  }

  get data() {
    return fetch(this.url, { type: 'json' }).then((data) => data.json()).catch((e) => {})
  }
}

ApiText.register();