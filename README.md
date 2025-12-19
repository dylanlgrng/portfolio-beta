# Dylan — Portfolio (React + Vite + Tailwind)

- Router: `HashRouter` (routes compatibles GitHub Pages)
- Thème: light/dark (toggle + auto selon l'heure du navigateur)
- FR/EN (toggle en haut à droite)
- Sections accordéon: À propos / Projets (animations fluides)
- Page projet: sommaire sticky à gauche, contenu au centre, navigation précédent/suivant
- Déploiement: GitHub Pages (workflow fourni)

## Installer / lancer en local
```bash
npm install
npm run dev
```
Puis ouvrir http://localhost:5173

## Build de prod
```bash
npm run build
npm run preview
```

## Déployer sur GitHub Pages
- Pousse sur `main`/`master`: l'action `Deploy to GitHub Pages` construit et publie `dist/`.
- Pour une app servie sous un sous-chemin (ex: `/portfolio-beta/`), la config Vite définit `base: './'`.

## Modifier le contenu
- Tout est dans `src/App.jsx` → objet `CONTENT` (FR/EN, À propos, Projets).
- Images statiques: `public/images/` (ex: `images/portrait.svg`, `images/logomaif.svg`).

## Changer les projets
Chaque projet peut être simple (`summary`, `description`) ou au format "case study":
```js
cs: {
  start: "…",
  problem: "…",
  activities: ["…","…"],
  process: ["…","…"],
  impact: "…"
}
```
S'il n'y a pas `cs`, la page montre le fallback simple.

## Remarques
- Évite les chemins qui commencent par `/` pour les images; préfère `images/...`.
- Le workflow utilise `npm install` (pas de lockfile obligatoire).
