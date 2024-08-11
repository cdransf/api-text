# `<api-text>` web component

A web component to load text from an API and display it.

```
npm i @cdransf/api-text
```

## Example usage

Add the `api-text.js` to your markup and define the necessary markup within your web component:

```html
<script type="module" src="api-text.js"></script>
<api-text api-url="/api/now-playing">
  <p class="loading">🎧 Loading...</p>
  <p class="content"></p>
  <noscript>
    <!-- Fallback content if JavaScript is disabled; also used as fallback content in the event of an API error. -->
  </noscript>
</api-text>
```

---

I use this component to load media data from a Netlify edge function and describe an earlier iteration in [this blog post](https://coryd.dev/posts/2024/building-a-bespoke-now-playing-web-component/).
