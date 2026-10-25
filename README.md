# Site Biotrace Montpellier

Site de l’association étudiante du Master IBION-Tec (Université de Montpellier).
Next.js 16 · TypeScript · Tailwind CSS 4 · shadcn/ui.

## Lancer le site

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # version de production
```

Lors de la mise en ligne, définir `NEXT_PUBLIC_SITE_URL` (ex. `https://…`) pour le référencement.

## Mettre à jour le contenu (sans toucher au design)

Tout le contenu modifiable se trouve dans le dossier `content/` :

| Fichier | Contenu |
| --- | --- |
| `content/site.ts` | Présentation, missions, adresse, e-mail, réseaux, menu |
| `content/equipe.ts` | Bureau, pôles, membres, promotions archivées |
| `content/evenements.ts` | Événements à venir / récurrents / passés, archives du congrès, galerie |
| `content/congres.ts` | Bio Innov 2027 : programme, intervenants, partenaires, lien d’inscription |

Les images se rangent dans `public/images/` (`equipe/<année>/`, `congres/`, `archives/`, `logos/`).

### Nouvelle équipe (rentrée suivante)
1. Créer `public/images/equipe/2027-2028/` et y déposer les portraits.
2. Dans `content/equipe.ts`, ajouter l’ancienne promotion dans `promotionsArchivees` (une photo de groupe suffit).
3. Mettre à jour `promotionActuelle` (année, membres, fonctions, photos).

### Congrès
- Programme, intervenants, partenaires : remplir les listes dans `content/congres.ts`. Tant qu’elles sont vides, le site affiche « Programme à venir ».
- Bouton d’inscription : renseigner `inscriptionUrl` (il n’apparaît que si un lien est fourni).
- Site du congrès : `congres-biotrace.org` ne répondait plus au 19/10/2026. Passer `siteOfficielActif` à `true` quand il sera de nouveau en ligne.

### Règles de contenu
- Aucune date, aucun lieu, aucun intervenant ni partenaire inventé : laisser vide tant que ce n’est pas confirmé.
- Chaque image doit avoir un texte alternatif (`alt`) qui la décrit.

## Composant `components/ui/hero.tsx`

Composant `ShaderShowcase` fourni, ajouté dans `components/ui` (dossier par défaut de shadcn, où vivent les composants réutilisables).
Adaptations nécessaires : props mises à jour pour la version actuelle de `@paper-design/shaders-react`
(`backgroundColor`/`wireframe` retirés, `spotsPerColor` → `spots`) et positions de particules fixes
au lieu de `Math.random()` pendant le rendu. Exemple d’utilisation : `components/demo/hero-demo.tsx`.
Sa technologie de shaders est utilisée, en vert, pour l’en-tête de la page Bio Innov 2027 (`components/ui/shader-fond.tsx`).
