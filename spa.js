// Simple SPA loader: intercept top menu clicks and swap <main> content
(function(){
  function log(){/* silent */}

  async function fetchDoc(url){
    const res = await fetch(url, {cache:'no-store'});
    if (!res.ok) throw new Error('Fetch failed: '+res.status);
    const text = await res.text();
    return new DOMParser().parseFromString(text, 'text/html');
  }

  function runScripts(fromDoc){
    // Run scripts found in the fetched document's <main>
    const scripts = fromDoc.querySelectorAll('script');
    scripts.forEach(s => {
      try{
        if (s.src){
          const scr = document.createElement('script');
          scr.src = new URL(s.src, location.href).href;
          scr.defer = true; document.head.appendChild(scr);
        } else {
          const inline = document.createElement('script');
          inline.textContent = s.textContent; document.body.appendChild(inline);
        }
      }catch(e){console.warn('script run failed',e)}
    });
  }

  async function loadUrl(href, push=true){
    try{
      const doc = await fetchDoc(href);
      const newMain = doc.querySelector('main');
      if (!newMain) { window.location.href = href; return; }

      const curMain = document.querySelector('main');
      if (!curMain) { console.warn('No current <main> to replace'); return; }

      // Replace main while keeping header intact
      const cloned = newMain.cloneNode(true);
      curMain.replaceWith(cloned);

      // Update title
      if (doc.title) document.title = doc.title;

      // Run scripts from fetched doc (so inline module scripts execute)
      runScripts(doc);

      // update history
      if (push) history.pushState({url:href}, doc.title||'', href);

      // scroll to top of content area (below fixed header)
      window.scrollTo(0,0);
    }catch(err){
      console.error('SPA load failed, falling back to normal navigation', err);
      window.location.href = href;
    }
  }

  document.addEventListener('click', function(e){
    const a = e.target.closest('a');
    if (!a) return;
    // only intercept top menu links
    if (a.classList.contains('top-btn')){
      const href = a.getAttribute('href');
      if (!href || href.startsWith('#')) return;
      e.preventDefault();
      const url = new URL(href, location.href).href;
      if (url === location.href) return; // noop
      loadUrl(url, true);
    }
  }, false);

  window.addEventListener('popstate', function(){
    loadUrl(location.href, false);
  });

  // On initial load, nothing needed. Expose for debugging.
  window.__spa_load = loadUrl;
})();
