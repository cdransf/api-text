class ApiText extends HTMLElement {
  static tagName = 'api-text'

  static register(tagName = this.tagName, registry = globalThis.customElements) {
    registry.define(tagName, this)
  }

  static attr = {
    url: 'api-url',
  }

  get url() {
    return this.getAttribute(ApiText.attr.url) || ''
  }

  async connectedCallback() {
    if (this.shadowRoot) return

    this.attachShadow({ mode: 'open' }).appendChild(document.createElement('slot'))

    const loading = this.querySelector('.loading')
    const content = this.querySelector('.content')
    const cacheKey = this.url || 'api-text-cache'
    const cache = sessionStorage?.getItem(cacheKey)
    const loadText = (string) => {
      loading.style.display = string ? 'none' : ''
      content.style.display = string ? 'block' : 'none'
      if (string) content.innerHTML = string
    }

    if (cache) loadText(JSON.parse(cache))

    try {
      const data = await this.data
      const value = data.content
      loadText(value)
      sessionStorage?.setItem(cacheKey, JSON.stringify(value))
    } catch (error) {
      loadText()
    }
  }

  get data() {
    return fetch(this.url).then(response => response.json()).catch(() => ({}))
  }
}

ApiText.register()