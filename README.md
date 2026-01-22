# Dylan — Portfolio (h-scroll v2: full-bleed + scramble)

- React + Vite + Tailwind
- HashRouter (GitHub Pages OK)
- FR/EN + Dark/Light with fade
- **Scramble** animation on language change (split‑flap style) for visible texts
- Projets : **horizontal full‑bleed scroller** (cards smaller), scroll-snap
- Pages projet : **Précédent / Suivant** + **Retour** → `/#/?open=projects`

## Modifier le contenu
`src/App.jsx` → objet `CONTENT` (FR & EN).

## Remplacer les images
- MAIF : `public/images/logomaif.svg`
- Autres projets : `public/images/projects/p01.svg … p11.svg`

## Déploiement GitHub Pages
- Push sur `main` → **Actions** build & deploy
- Router : 404.html copié automatiquement
