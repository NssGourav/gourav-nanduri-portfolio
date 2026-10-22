# Gourav Nanduri — portfolio
A standalone Vite + Three.js portfolio. Terminal-inspired navigation referenced from Prathamesh Jakkula, an interactive Three.js wireframe scene, selected product work, hackathons, organizing, and open-source contributions.

## Local development
```sh
npm ci
npm run dev
```

## Production
```sh
npm run build
npm run preview
```
Build output: `build/`. Relative assets support GitHub Pages project URLs. `.github/workflows/pages.yml` deploys the main branch using GitHub Actions. Fonts are served locally. The 3D scene supports pausing, reduced motion, and a WebGL fallback. It stops rendering when the page is hidden or scene is offscreen.

Update content in `index.html`, appearance in `src/style.css`, interactions and the Three.js scene in `src/main.js`. Résumé: `public/resume.pdf`.

Design direction inspired by Prathamesh Jakkula's command-style portfolio. Original implementation and visual assets; project illustrations are identified as concepts. Career details come from the provided résumé; event details come from Gourav's LinkedIn posts. No event photos or headshot are included.
