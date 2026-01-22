# Dylan — Portfolio (horizontal projects + dark fix + lang/theme FX)

- React + Vite + Tailwind
- HashRouter (GitHub Pages OK)
- FR/EN + Dark/Light (transition-colors)
- Projets : **tous visibles** dans un **scroller horizontal** (scroll-snap)
- Pages projet : **Précédent / Suivant** + **Retour** → `/#/?open=projects`
- Animations : accordéons smooth + fade du contenu au switch de langue

## Modifier le contenu
`src/App.jsx` → objet `CONTENT` (FR & EN).

## Remplacer les images
- MAIF : `public/images/logomaif.svg`
- Autres projets : `public/images/projects/p01.svg … p11.svg`

## Déploiement GitHub Pages
- Push sur `main` → **Actions** build & deploy
- Router : 404.html copié automatiquement
