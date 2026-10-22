# Agentic Universe — Gourav Nanduri
An immersive Three.js portfolio on `codex/portfolio-development`. The main branch retains the terminal-style portfolio deployed to GitHub Pages.

## Run
```sh
npm ci
npm run dev
```
```sh
npm run build
npm run preview
```

## Experience
- Full-screen 3D agent network with an orchestrator core, six interactive agents, orbital rings, signal packets, stars and a circuit floor.
- Orbit and zoom using pointer/touch controls. Select 3D nodes or keyboard-accessible dock buttons to explore.
- Projects, AI systems, hackathons, open source, journey and contact panels.
- “Follow the signal” tours each agent. Escape, manual navigation, closing a panel or resetting the camera ends the tour.
- Pause controls and automatic reduced-motion support. Navigation and portfolio content remain available if WebGL cannot initialize.
- Responsive desktop panels and mobile sheets; fonts and résumé served locally.

## Source
- `src/main.js`: Three.js scene, camera controls, postprocessing, raycasting, animation and interface behavior.
- `src/content.js`: portfolio content, based on the provided résumé and Gourav’s LinkedIn posts.
- `src/style.css`: overlay interface and responsive layouts.
- `public/resume.pdf`: résumé.

The agents are a visual navigation metaphor, not remotely executing AI services. No API keys, analytics, model calls or backend are needed.

The GitHub Pages workflow deploys only pushes to `main`. Development-branch pushes do not change the live site. Build output: `build/`, with relative asset paths for GitHub Pages.
