# שרית חדד · ספר שירים

Static offline-first PWA built only from the supplied `שרית_מאוחד.txt` source file.

## Run locally

Serve this folder from a local web server (service workers do not run from `file://`):

```powershell
python -m http.server 4173 --directory .
```

Open `http://localhost:4173/` in a browser. For iPhone installation, deploy the folder to an HTTPS static host, open it in Safari, then choose **Share → Add to Home Screen**. The first successful load caches the app, font, icon, setlist, and all lyrics.

Shironet links remain optional external links and require internet access.
