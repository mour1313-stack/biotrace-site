# Mise en ligne du site Biotrace — liste de lancement

Tout est prêt pour publier le site. Rien n'est en ligne tant que le bouton **Deploy** de Vercel n'a pas été utilisé.

## Déjà fait

- [x] Projet sauvegardé dans le dossier `Biotrace-site` du Bureau
- [x] Projet envoyé sur GitHub : `mour1313-stack/biotrace-site`, branche `main`
- [x] Compte Vercel « Biotrace » (offre Hobby, gratuite) relié à GitHub, avec accès au seul dépôt `biotrace-site`
- [x] Projet préparé sur Vercel (préréglage Next.js détecté) — **non déployé**
- [x] Site adapté aux téléphones (les 8 pages vérifiées à 375 px de large)
- [x] Interrupteur « invisible pour Google » en place : `ouvertAuxMoteursDeRecherche: false` dans `content/site.ts`
- [x] Mentions légales : identification de l'association, directrice de la publication, hébergeur (Vercel Inc.)

## Encore à décider ou compléter

- [ ] Téléphone de l'hébergeur dans les mentions légales (section 2)
- [ ] Nom de domaine choisi : **`biotrace-montpellier.fr`** (libre au 12/11/2026, `biotrace.fr` est déjà pris) — à acheter
      chez un registraire (OVH, Gandi, Infomaniak…), environ 7 à 10 € par an
- [ ] Visibilité du dépôt GitHub : actuellement **public** (Settings → Danger Zone → Change visibility pour le passer en privé)
- [ ] Lien d'inscription au congrès : `inscriptionUrl` dans `content/congres.ts`, le jour où les inscriptions ouvrent

## Le jour de la mise en ligne

1. Sur Vercel, ouvrir le projet `biotrace-site` et cliquer sur **Deploy**.
2. Dans Vercel → Settings → Domains, ajouter `biotrace-montpellier.fr` (et `www.biotrace-montpellier.fr`), puis recopier
   les réglages DNS affichés par Vercel (enregistrement `A` et `CNAME`) dans la zone DNS chez le registraire.
   Le HTTPS s'active tout seul une fois les DNS pris en compte.
3. Dans Vercel → Settings → Environment Variables, ajouter `NEXT_PUBLIC_SITE_URL` = `https://biotrace-montpellier.fr`, puis redéployer.
4. Passer `ouvertAuxMoteursDeRecherche` à `true` dans `content/site.ts` et envoyer la modification sur GitHub
   (Vercel republie le site tout seul).
5. Google Search Console : ajouter le site, prouver qu'il est à vous, déclarer `sitemap.xml`, demander l'indexation de l'accueil.
6. Ajouter le lien du site dans la bio Instagram et sur LinkedIn.

## À savoir

- Tant que l'interrupteur vaut `false`, le site peut être mis en ligne pour un test : Google ne l'indexera pas,
  mais toute personne qui a le lien peut l'ouvrir.
- Chaque modification envoyée sur la branche `main` de GitHub republie automatiquement le site, une fois Vercel déployé.
