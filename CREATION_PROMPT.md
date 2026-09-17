# Creation Prompt: Sarit Hadad 30th-Anniversary Offline Songbook

Continue and maintain the existing static, installable, offline-first PWA songbook for Sarit Hadad’s 30th-anniversary show.

## Content and copyright boundary

- The supplied `שרית_מאוחד.txt` file is the only authority for lyrics and canonical song titles.
- Match each song to its corresponding lyrics block in that supplied file.
- Never fetch, copy, paraphrase, complete, or invent lyrics from another website.
- Preserve the supplied lyrics exactly, including stanza breaks, punctuation, Hebrew/English text, and the four parenthesized lines in `תלך כפרה עלי`.
- Lyrics must remain available offline.

## Exact performance order

1. מרוץ החיים
2. שב
3. הייתי בגן עדן
4. קרוסלה
5. מחרוזת לטינית: קח את הכל → לעשות מה שבא לי → אני לא מדונה → יאללה לך הביתה מוטי
6. הסוד
7. כשהלב בוכה
8. מחרוזת שקטים: הכאב הזה → ככה בלי שלום → תצא לי מהראש
9. מחרוזת מזרחית: כמו סינדרלה → זה הסוד שלי → בוא → חמותי → הקשיבו חבריי → לילה לילה → ישמח חתני
10. חלק ממני
11. אהבה כמו שלנו
12. מחרוזת: סוף שבוע בפריז → Do You Love Me
13. חיכיתי לו
14. מחרוזת טורקית: רק שתדע את האמת → ניצוץ החיים → שלום חבר
15. קצת משוגעת
16. אלה
17. חגיגה
18. חופשיה
19. הילדה מחדרה
20. מחרוזת: כפרה + חום של תל אביב: תלך כפרה עלי → בחום של תל אביב

Canonical titles must remain exactly as supplied, including `מרוץ החיים`, `הייתי בגן עדן`, `הסוד`, `כשהלב בוכה`, `כמו סינדרלה`, `זה הסוד שלי`, `בוא`, `לילה לילה`, `סוף שבוע בפריז`, `Do You Love Me`, `קצת משוגעת`, `תלך כפרה עלי`, and `בחום של תל אביב`.

## Current product behavior

- The app is a static RTL PWA designed for iPhone portrait screens.
- The home screen shows the complete setlist with collapsible medleys and searchable song rows.
- The reader shows the complete supplied lyrics, canonical title, and previous/next navigation.
- A shared gear settings panel is available from both the home and reader screens.
- The settings panel provides font-size decrease/increase controls, current size, and light/dark mode.
- Font size is persisted under `sarit-font-size`, bounded from 16px to 30px, and defaults to 20px.
- Theme is persisted under `sarit-theme`.
- The settings panel closes with its close button, the gear button, an outside tap, or Escape.
- The reader places Apple Music and Spotify search buttons directly below each canonical title and above the lyrics.
- Search queries use `שרית חדד <canonical title>` and are encoded with `encodeURIComponent`.
- iPhone/iPad uses native `music://music.apple.com/search?term=...` and `spotify:search:...` links; other devices use HTTPS search URLs.
- Preserve RTL wrapping, safe-area spacing, one-handed tap targets, and no horizontal scrolling.

## Icon and responsive-layout rules

- Keep simple interface controls in the local `icons.svg` sprite: home, arrows, close, theme, and font-size controls.
- Render the settings gear and Apple Music logo as normalized inline SVGs with `viewBox="0 0 24 24"` and `currentColor`, because iOS Safari can render external `<use>` references and oversized source viewBoxes inconsistently.
- Use explicit fixed icon sizes, centered flex alignment, and touch containers of at least 44×44px.
- Platform-link content must be centered as a complete label-and-icon group using LTR direction inside the RTL application.
- Medley title, count, and chevron must remain separate flex items; counts such as `4 שירים` must be non-breaking and the chevron must remain anchored at the left.
- Keep icon assets and the SVG sprite local so they continue working offline.

## Anniversary branding

Use the exact non-lyric show copy:

**שרית חוגגת 30 שנות מוזיקה בפארק הירקון**

Use it in the home hero, footer, page metadata, and PWA manifest where appropriate. Do not add it to song lyrics or song-specific content.

The supplied portrait image is the app artwork. Keep it square and unmodified except for resizing into the required local icon assets:

- `favicon.png` — 64×64
- `apple-touch-icon.png` — 180×180
- `icon-192.png` — 192×192
- `icon-512.png` — 512×512

The manifest and Safari metadata must reference the PNG artwork, not the legacy generic SVG icon.

## Offline and deployment requirements

- Keep all HTML, CSS, JavaScript, lyrics, metadata, icons, and fonts local.
- Use the locally bundled Rubik variable font (`rubik-vf.ttf`) for the app UI and lyric reader.
- Keep the valid manifest and service worker.
- Cache all application assets, including the portrait icon assets and the local Rubik font.
- Bump the service-worker cache name whenever application assets change.
- Current cache/versioned asset generation is v14; increment it for every subsequent shipped asset change.
- The deployed target is GitHub Pages at:
  `https://oriashkenazi.github.io/sarit-songbook/`
- The repository is `OriAshkenazi/sarit-songbook`, using the `main` branch as the Pages source.

## Required QA before future changes are published

- Verify the full setlist order and canonical titles remain unchanged.
- Verify no lyrics, canonical titles, or setlist order changed unexpectedly.
- Verify the home hero and document title contain the anniversary branding.
- Verify manifest icon entries, Apple touch icon metadata, and all PNG dimensions.
- Test the settings panel on both home and reader screens.
- Test Apple Music and Spotify buttons under every reader title, including native iOS URL generation and desktop HTTPS fallback.
- Test settings, Apple Music, Spotify, home, close, chevron, theme, and font-size icons visually at desktop and iPhone sizes.
- Confirm platform labels and icons are centered as a group and medley counts remain intact in RTL.
- Test font-size persistence, theme persistence, previous/next navigation, and outside-tap closing.
- Test at 375×812 and 390×844 portrait viewports.
- Confirm `scrollWidth` equals `clientWidth` with no horizontal overflow.
- Confirm the app reloads offline after the service worker has cached it.
- Verify the live GitHub Pages HTTPS URL serves the updated HTML, manifest, icon assets, and service worker before reporting completion.
