self.addEventListener('fetch', (event) => {
  const url = event.request.url;
  // Expressões regulares para APIs do Google Maps e Fontes que devem evitar
  // o Workbox devido ao bug de "no-response" / interrupção de stream no iOS Safari (WebKit PWA).
  if (
    url.includes('maps.googleapis.com') ||
    url.includes('maps.gstatic.com') ||
    url.includes('fonts.googleapis.com') ||
    url.includes('fonts.gstatic.com')
  ) {
    // event.stopImmediatePropagation() previne os listeners de fetch do Workbox
    // de sequer verem o request, deixando o navegador lidar de forma 100% nativa.
    event.stopImmediatePropagation();
  }
});
