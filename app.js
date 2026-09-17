(() => {
  const app = document.querySelector('#app');
  const homeButton = document.querySelector('#homeButton');
  const settingsButton = document.querySelector('#settingsButton');
  const settingsPanel = document.querySelector('#settingsPanel');
  const settingsClose = document.querySelector('#settingsClose');
  const themeButton = document.querySelector('#themeButton');
  const songByTitle = new Map(SONGS.map(song => [song.title, song]));
  const flat = SETLIST.flatMap(group => group[1]);
  let query = '';
  let fontSize = Number(localStorage.getItem('sarit-font-size') || 20);
  let currentTitle = null;

  document.documentElement.style.setProperty('--reader-size', `${fontSize}px`);
  applyTheme(localStorage.getItem('sarit-theme') === 'dark');
  settingsButton.addEventListener('click', toggleSettings);
  settingsClose.addEventListener('click', closeSettings);
  themeButton.addEventListener('click', () => applyTheme(!document.body.classList.contains('dark')));
  document.addEventListener('click', event => { if (settingsPanel.classList.contains('open') && !settingsPanel.contains(event.target) && event.target !== settingsButton) closeSettings(); });
  document.addEventListener('keydown', event => { if (event.key === 'Escape') closeSettings(); });
  homeButton.addEventListener('click', renderHome);
  document.querySelector('#fontDown').addEventListener('click', () => changeFont(-1));
  document.querySelector('#fontUp').addEventListener('click', () => changeFont(1));
  updateFontLabel();

  function toggleSettings() { settingsPanel.classList.toggle('open'); const open = settingsPanel.classList.contains('open'); settingsPanel.setAttribute('aria-hidden', String(!open)); settingsButton.setAttribute('aria-expanded', String(open)); }
  function closeSettings() { settingsPanel.classList.remove('open'); settingsPanel.setAttribute('aria-hidden', 'true'); settingsButton.setAttribute('aria-expanded', 'false'); }
  function applyTheme(dark) { document.body.classList.toggle('dark', dark); localStorage.setItem('sarit-theme', dark ? 'dark' : 'light'); document.querySelector('#themeIcon').textContent = dark ? '☾' : '☼'; document.querySelector('#themeValue').textContent = dark ? 'כהה' : 'בהיר'; }

  function renderHome() {
    currentTitle = sessionStorage.getItem('sarit-current-title');
    closeSettings();
    app.innerHTML = `<section class="hero"><p>שרית חוגגת 30 שנות מוזיקה בפארק הירקון</p><h1>שרית חדד</h1><p>סדר הופעה מלא · זמין גם ללא חיבור</p></section><div class="search-wrap"><input class="search" id="search" type="search" placeholder="חיפוש לפי שם השיר" aria-label="חיפוש לפי שם השיר"><button class="icon-button" id="clearSearch" aria-label="ניקוי חיפוש">×</button></div><h2 class="section-title">סדר ההופעה</h2><div id="setlist"></div>`;
    document.querySelector('#search').addEventListener('input', e => { query = e.target.value.trim().toLowerCase(); drawSetlist(); });
    document.querySelector('#clearSearch').addEventListener('click', () => { query = ''; document.querySelector('#search').value = ''; drawSetlist(); });
    drawSetlist();
  }
  function changeFont(delta) { fontSize = Math.max(16, Math.min(30, fontSize + delta)); localStorage.setItem('sarit-font-size', fontSize); document.documentElement.style.setProperty('--reader-size', `${fontSize}px`); updateFontLabel(); }
  function updateFontLabel() { const el = document.querySelector('#fontValue'); if (el) el.textContent = `${fontSize}px`; }
  function drawSetlist() {
    const target = document.querySelector('#setlist'); if (!target) return;
    target.innerHTML = SETLIST.map(([group, titles]) => {
      const visible = titles.filter(title => !query || title.toLowerCase().includes(query));
      if (!visible.length) return '';
      const children = visible.map(title => `<button class="song-row ${currentTitle === title ? 'current' : ''}" data-title="${esc(title)}"><span class="num">${flat.indexOf(title) + 1}</span><span>${esc(title)}${currentTitle === title ? ' · עכשיו' : ''}</span></button>`).join('');
      const isSingle = titles.length === 1;
      return isSingle ? `<div class="medley">${children}</div>` : `<details class="medley" open><summary>${esc(group)} <span class="small-label">${titles.length} שירים</span></summary>${children}</details>`;
    }).join('') || '<p class="section-title">לא נמצאו שירים.</p>';
    target.querySelectorAll('.song-row').forEach(button => button.addEventListener('click', () => renderReader(button.dataset.title)));
  }
  function renderReader(title) {
    const song = songByTitle.get(title); if (!song) return;
    currentTitle = title; sessionStorage.setItem('sarit-current-title', title); const index = flat.indexOf(title); const previous = flat[index - 1]; const next = flat[index + 1]; closeSettings();
    app.innerHTML = `<div class="reader-head"><button class="icon-button back" id="backButton" aria-label="חזרה לרשימת השירים">→</button><h1 class="reader-title">${esc(song.title)}</h1></div><a class="source-link" href="${esc(song.source)}" target="_blank" rel="noopener">מקור: שירונט ↗</a><article class="lyrics" style="font-size:var(--reader-size)">${esc(song.lyrics)}</article><div class="nav-row"><button class="nav-button" id="prev" ${previous ? '' : 'disabled'}>→ ${previous ? esc(previous) : 'תחילת המופע'}</button><button class="nav-button next" id="next" ${next ? '' : 'disabled'}>${next ? esc(next) : 'סוף המופע'} ←</button></div>`;
    document.querySelector('#backButton').addEventListener('click', renderHome);
    if (previous) document.querySelector('#prev').addEventListener('click', () => renderReader(previous));
    if (next) document.querySelector('#next').addEventListener('click', () => renderReader(next));
    app.focus(); window.scrollTo({top: 0, behavior: 'smooth'});
  }
  function esc(value) { return value.replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char])); }
  if ('serviceWorker' in navigator) window.addEventListener('load', () => navigator.serviceWorker.register('./sw.js'));
  renderHome();
})();
