# `<api-text>` web component

A web component to load text from an API and display it.

## Example usage

Add the `api-text.js` to your markup and define the necessary markup within your web component:

```html
<script type="module" src="api-text.js"></script>
<api-text api-url="/api/api-text">
  <p class="loading text--blurred fade">🎧 Loading...</p>
  <p class="content fade" style="opacity:0"></p>
</api-text>
```

**Example CSS:**

```css
.text--blurred {
  color: transparent;
  text-shadow: 0 0 6px var(--text-color);
}

.fade {
  transition-property: opacity;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 300ms;
}
```

---

I use this component to load media data from a Netlify edge function and describe an earlier iteration in [this blog post](https://coryd.dev/posts/2024/building-a-bespoke-now-playing-web-component/).