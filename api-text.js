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

    const hideElement = () => { this.style.display = 'none' }

    const loadText = (string) => {
      if (!string) {
        hideElement()
        return
      }
      loading.style.display = 'none'
      content.style.display = 'block'
      content.innerHTML = string
    }

    if (cache) {
      loadText(JSON.parse(cache))
    } else {
      loading.style.display = 'block'
      content.style.display = 'none'
    }

    try {
      const data = await this.data
      const value = data.content
      if (value) {
        loadText(value)
        sessionStorage?.setItem(cacheKey, JSON.stringify(value))
      } else {
        hideElement()
      }
    } catch (error) {
      hideElement()
    }
  }

  get data() {
    return fetch(this.url).then(response => response.json()).catch(() => ({}))
  }
}

ApiText.register()