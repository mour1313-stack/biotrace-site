# Mise en ligne du site Biotrace — liste de lancement

Le site est en ligne sur **https://biotrace-montpellier.fr** (hébergé par Vercel) et ouvert aux moteurs de recherche.

## Déjà fait

- [x] Projet sauvegardé dans le dossier `Biotrace-site` du Bureau
- [x] Projet envoyé sur GitHub : `mour1313-stack/biotrace-site`, branche `main`
- [x] Compte Vercel « Biotrace » (offre Hobby, gratuite) relié à GitHub, avec accès au seul dépôt `biotrace-site`
- [x] Site déployé sur Vercel (`biotrace-site.vercel.app`)
- [x] Site adapté aux téléphones (les 8 pages vérifiées à 375 px de large)
- [x] Mentions légales : identification de l'association, directrice de la publication, hébergeur (Vercel Inc.)
- [x] Nom de domaine `biotrace-montpellier.fr` acheté chez one.com au nom de l'association BIO TRACE
- [x] DNS chez one.com : `A` `@` → `216.198.79.1` et `CNAME` `www` → `5f5ffef377ed03f4.vercel-dns-017.com`
      (les enregistrements A standard de one.com sont désactivés)
- [x] Vercel → Domains : `biotrace-montpellier.fr` (principal) et `www.biotrace-montpellier.fr` (redirection 308)
- [x] Vercel → Environment Variables : `NEXT_PUBLIC_SITE_URL` = `https://biotrace-montpellier.fr`
- [x] Interrupteur `ouvertAuxMoteursDeRecherche: true` dans `content/site.ts`

## Encore à décider ou compléter

- [ ] Téléphone de l'hébergeur dans les mentions légales (section 2)
- [ ] Visibilité du dépôt GitHub : actuellement **public** (Settings → Danger Zone → Change visibility pour le passer en privé)
- [ ] Lien d'inscription au congrès : `inscriptionUrl` dans `content/congres.ts`, le jour où les inscriptions ouvrent
- [ ] Google Search Console : ajouter le site, prouver qu'il est à vous, déclarer `sitemap.xml`, demander l'indexation de l'accueil
- [ ] Ajouter le lien du site dans la bio Instagram et sur LinkedIn
- [ ] Vérifier le prix de renouvellement du domaine chez one.com et activer le renouvellement automatique

## À savoir

- Chaque modification envoyée sur la branche `main` de GitHub republie automatiquement le site.
- Pour masquer à nouveau le site aux moteurs de recherche, repasser `ouvertAuxMoteursDeRecherche` à `false`.
