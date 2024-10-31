class ApiText extends HTMLElement {
  static tagName = "api-text";

  static register(
    tagName = this.tagName,
    registry = globalThis.customElements
  ) {
    registry.define(tagName, this);
  }

  static attr = {
    url: "api-url",
    display: "display",
    storage: "storage",
    transition: "transition-duration",
  };

  get url() {
    return this.getAttribute(ApiText.attr.url) || "";
  }

  get display() {
    return this.getAttribute(ApiText.attr.display) || "block";
  }

  get storage() {
    const storageValue = this.getAttribute(ApiText.attr.storage);
    return storageValue === "local" ? localStorage : sessionStorage;
  }

  get transitionDuration() {
    return this.getAttribute(ApiText.attr.transition) || "300ms";
  }

  async connectedCallback() {
    if (this.shadowRoot) return;

    this.attachShadow({ mode: "open" }).appendChild(
      document.createElement("slot")
    );

    const loading = this.querySelector(".loading");
    const content = this.querySelector(".content");
    const cacheKey = this.url || "api-text-cache";
    const cache = this.storage.getItem(cacheKey);

    this.applyTransition(content);
    this.hideAll(loading, content);

    if (cache) {
      this.loadContent(JSON.parse(cache), loading, content);
    } else {
      this.fetchAndSetContent(loading, content, cacheKey);
    }
  }

  hideAll(loading, content) {
    loading.style.display = this.display;
    content.style.opacity = 0;
  }

  applyTransition(content) {
    content.style.transition = `opacity ${this.transitionDuration} ease-in-out`;
  }

  loadContent(string, loading, content) {
    if (string) {
      content.innerHTML = string;
      loading.style.display = "none";
      this.showContent(content);
    } else {
      this.loadFallbackContent(loading, content);
    }
  }

  loadFallbackContent(loading, content) {
    const noscriptContent =
      this.querySelector("noscript")?.innerHTML.trim() || "";

    if (noscriptContent) {
      content.innerHTML = noscriptContent;
      loading.style.display = "none";
      this.showContent(content);
    } else {
      this.style.display = "none";
    }
  }

  showContent(content) {
    content.style.opacity = 1;
    content.style.display = this.display;
  }

  async fetchAndSetContent(loading, content, cacheKey) {
    try {
      const data = await this.data;
      const value = data.content || "";

      if (value) {
        this.storage.setItem(cacheKey, JSON.stringify(value));
      }

      this.loadContent(value, loading, content);
    } catch {
      this.loadFallbackContent(loading, content);
    }
  }

  get data() {
    return fetch(this.url)
      .then((response) => response.json())
      .catch(() => ({}));
  }
}

ApiText.register();
