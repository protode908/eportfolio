// Simple navigation and module UI logic (vanilla JS)
document.addEventListener('DOMContentLoaded', function () {
  // Top nav links
  document.querySelectorAll('.nav-link').forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault();
      const target = a.dataset.target;
      showView(target);
    });
  });

  // Module buttons on MSc main page
  document.querySelectorAll('.module-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const module = btn.dataset.module;
      openModule(module);
    });
  });

  // Back buttons in left menus
  document.querySelectorAll('.back-btn').forEach(b => {
    b.addEventListener('click', () => {
      // Close module and go back to MSc main page
      document.querySelectorAll('.module-page').forEach(mp => mp.style.display = 'none');
      showView('msc');
    });
  });

  // Left menu navigation within module
  document.querySelectorAll('.left-nav a').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const section = link.dataset.section;
      const container = link.closest('.module-page');
      if (!container) return;
      container.querySelectorAll('.content-panel').forEach(p => p.style.display = 'none');
      const panel = container.querySelector('.content-panel[data-section="' + section + '"]');
      if (panel) panel.style.display = 'block';
    });
  });

  // helper functions
  function showView(name) {
    // hide top-level views (about, msc, contact)
    document.querySelectorAll('[data-view]').forEach(el => el.style.display = 'none');
    const el = document.querySelector('[data-view="' + name + '"]');
    if (el) el.style.display = 'block';
  }

  function openModule(moduleKey) {
    // hide top-level views
    document.querySelectorAll('[data-view]').forEach(el => el.style.display = 'none');
    // hide other modules
    document.querySelectorAll('.module-page').forEach(mp => mp.style.display = 'none');
    const selector = '.module-page[data-module="' + moduleKey + '"]';
    const page = document.querySelector(selector);
    if (!page) return;
    // show first panel (general)
    page.querySelectorAll('.content-panel').forEach(p => p.style.display = 'none');
    const general = page.querySelector('.content-panel[data-section="general"]');
    if (general) general.style.display = 'block';
    page.style.display = 'block';
  }

  // initial state: show About
  showView('about');
});
