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
  const ICON_SPRITE = 'icons.svg?v=12';

  document.documentElement.style.setProperty('--reader-size', `${fontSize}px`);
  applyTheme(localStorage.getItem('sarit-theme') !== 'light');
  settingsButton.addEventListener('click', toggleSettings);
  settingsClose.addEventListener('click', closeSettings);
  themeButton.addEventListener('click', () => applyTheme(!document.body.classList.contains('dark')));
  document.addEventListener('click', event => { if (settingsPanel.classList.contains('open') && !settingsPanel.contains(event.target) && !settingsButton.contains(event.target)) closeSettings(); });
  document.addEventListener('keydown', event => { if (event.key === 'Escape') closeSettings(); });
  homeButton.addEventListener('click', renderHome);
  document.querySelector('#fontDown').addEventListener('click', () => changeFont(-1));
  document.querySelector('#fontUp').addEventListener('click', () => changeFont(1));
  updateFontLabel();

  function toggleSettings() { settingsPanel.classList.toggle('open'); const open = settingsPanel.classList.contains('open'); settingsPanel.setAttribute('aria-hidden', String(!open)); settingsButton.setAttribute('aria-expanded', String(open)); }
  function closeSettings() { settingsPanel.classList.remove('open'); settingsPanel.setAttribute('aria-hidden', 'true'); settingsButton.setAttribute('aria-expanded', 'false'); }
  function icon(name, className = 'ui-icon') { return `<svg class="${className}" aria-hidden="true" focusable="false"><use href="${ICON_SPRITE}#${name}" xlink:href="${ICON_SPRITE}#${name}"></use></svg>`; }
  settingsButton.innerHTML = inlineIcon('settings', 'settings-icon');
  homeButton.innerHTML = icon('home');
  settingsClose.innerHTML = icon('close');
  function inlineIcon(name, className) {
    if (name === 'settings') return `<svg class="${className}" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="12" cy="12" r="8.2" fill="none" stroke="currentColor" stroke-width="1.8" stroke-dasharray="2.4 2.4" stroke-linecap="round"/><path d="M12 2.2v2M12 19.8v2M2.2 12h2M19.8 12h2M5.1 5.1l1.4 1.4M17.5 17.5l1.4 1.4M18.9 5.1l-1.4 1.4M6.5 17.5l-1.4 1.4" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>`;
    if (name === 'apple') return `<svg class="${className}" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M18.71 19.5C17.88 20.74 17 21.95 15.66 21.97 14.32 22 13.89 21.18 12.37 21.18 10.84 21.18 10.37 21.95 9.1 22 7.79 22.05 6.8 20.68 5.96 19.47 4.25 17 2.94 12.45 4.7 9.39 5.57 7.87 7.13 6.91 8.82 6.88 10.1 6.86 11.32 7.75 12.11 7.75c.78 0 2.26-1.07 3.81-.91 1.65.07 2.9.84 3.67 1.7-3.47 1.9-2.9 6.96.53 8.23-.03.07-.42 1.44-1.41 2.73ZM13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42C11.8 5.46 12.36 4.26 13 3.5Z"/></svg>`;
    return icon(name, className);
  }
  function applyTheme(dark) { document.body.classList.toggle('dark', dark); localStorage.setItem('sarit-theme', dark ? 'dark' : 'light'); document.querySelector('#themeIcon').innerHTML = icon(dark ? 'moon' : 'sun'); document.querySelector('#themeValue').textContent = dark ? 'כהה' : 'בהיר'; }
  function isIOSDevice() { return /iPhone|iPad|iPod/i.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1); }
  function getPlatformUrls(title) {
    const searchTerm = encodeURIComponent(`שרית חדד ${title}`);
    if (isIOSDevice()) return { appleMusicUrl: `music://music.apple.com/search?term=${searchTerm}`, spotifyUrl: `spotify:search:${searchTerm}` };
    return { appleMusicUrl: `https://music.apple.com/il/search?term=${searchTerm}`, spotifyUrl: `https://open.spotify.com/search/${searchTerm}` };
  }

  function renderHome() {
    currentTitle = sessionStorage.getItem('sarit-current-title');
    closeSettings();
    app.innerHTML = `<section class="hero"><p>שרית חוגגת 30 שנות מוזיקה בפארק הירקון</p><h1>שרית חדד</h1><p>סדר הופעה מלא · זמין גם ללא חיבור</p></section><div class="search-wrap"><input class="search" id="search" type="search" placeholder="חיפוש לפי שם השיר" aria-label="חיפוש לפי שם השיר"><button class="icon-button" id="clearSearch" aria-label="ניקוי חיפוש">${icon('close')}</button></div><h2 class="section-title">סדר ההופעה</h2><div id="setlist"></div>`;
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
      return isSingle ? `<div class="medley">${children}</div>` : `<details class="medley" open><summary><span class="summary-chevron">${icon('chevron-down')}</span><span class="small-label">${titles.length}&nbsp;שירים</span><span class="summary-title">${esc(group)}</span></summary>${children}</details>`;
    }).join('') || '<p class="section-title">לא נמצאו שירים.</p>';
    target.querySelectorAll('.song-row').forEach(button => button.addEventListener('click', () => renderReader(button.dataset.title)));
  }
  function renderReader(title) {
    const song = songByTitle.get(title); if (!song) return;
    currentTitle = title; sessionStorage.setItem('sarit-current-title', title); const index = flat.indexOf(title); const previous = flat[index - 1]; const next = flat[index + 1]; closeSettings();
    const { appleMusicUrl, spotifyUrl } = getPlatformUrls(song.title);
    app.innerHTML = `<div class="reader-head"><button class="icon-button back" id="backButton" aria-label="חזרה לרשימת השירים">${icon('chevron-right')}</button><h1 class="reader-title">${esc(song.title)}</h1></div><div class="platform-links" aria-label="חיפוש השיר בשירותי מוזיקה"><a class="platform-link apple" href="${appleMusicUrl}" target="_blank" rel="noopener noreferrer">${inlineIcon('apple','platform-icon')}<span>Apple Music</span></a><a class="platform-link spotify" href="${spotifyUrl}" target="_blank" rel="noopener noreferrer">${icon('spotify','platform-icon')}<span>Spotify</span></a></div><article class="lyrics" style="font-size:var(--reader-size)">${esc(song.lyrics)}</article><div class="nav-row"><button class="nav-button" id="prev" ${previous ? '' : 'disabled'}>${icon('chevron-right')}<span>${previous ? esc(previous) : 'תחילת המופע'}</span></button><button class="nav-button next" id="next" ${next ? '' : 'disabled'}><span>${next ? esc(next) : 'סוף המופע'}</span>${icon('chevron-left')}</button></div>`;
    document.querySelector('#backButton').addEventListener('click', renderHome);
    if (previous) document.querySelector('#prev').addEventListener('click', () => renderReader(previous));
    if (next) document.querySelector('#next').addEventListener('click', () => renderReader(next));
    app.focus(); window.scrollTo({top: 0, behavior: 'smooth'});
  }
  function esc(value) { return value.replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char])); }
  if ('serviceWorker' in navigator) window.addEventListener('load', () => navigator.serviceWorker.register('./sw.js?v=12'));
  renderHome();
})();
