# Relais de retour de Posts Manager

Meta n'enregistre que des adresses de retour en **https** (essai réel du 2026-11-12) ; Posts Manager, lui, tourne en **http** sur l'ordinateur de chaque personne. Ce relais comble l'écart : une page https statique reçoit le retour de Meta et renvoie le navigateur vers `http://localhost:<port>/connexion/retour`, sur le même ordinateur.

## Ce qu'il fait, et ce qu'il ne fait pas
- Il lit le port au début du paramètre `state` (`<port>.<aléatoire>`, posé par Posts Manager) et renvoie vers `localhost` **uniquement**, sur le chemin `/connexion/retour`, avec `code`, `state` et les paramètres d'erreur de Meta.
- Il ne stocke rien, ne contacte aucun service, n'a aucun script tiers, n'écrit rien dans l'historique du navigateur (`location.replace`) et n'envoie pas de référent (`no-referrer`).
- Le **code d'autorisation** passe dans l'adresse. Sans la **clé secrète** de l'application de la personne, il ne sert à rien : Posts Manager l'échange localement.
- Tout le code est `relais.js` (une trentaine de lignes) : lis-le avant de lui faire confiance. Sa logique est testée sans navigateur (`tests/relais.test.mjs` dans Posts Manager).

## Fichiers
`retour.html` (la page de retour), `relais.js`, `index.html` (une page d'explication), `.nojekyll`.

## Adresse à coller chez Meta
Dans l'application Meta de la personne : « Facebook Login for Business > Settings > Valid OAuth Redirect URIs » : l'adresse de `retour.html` (par exemple `https://archecodev.github.io/posts-manager-relais/retour.html`). La même pour tous les projets et tous les ports.

## Héberger le tien
Fork ce dépôt, active GitHub Pages (branche `main`, dossier racine), puis dis à Posts Manager d'utiliser ton adresse : variable `POSTS_MANAGER_RELAIS=https://…/retour.html` au lancement. Ne change pas l'adresse d'un relais déjà utilisé : chaque personne l'a collée chez Meta.

---

# Posts Manager return relay (English)
Meta only keeps **https** redirect URIs; Posts Manager runs on **http** on each person's computer. This static https page receives Meta's sign-in return and sends the browser straight to `http://localhost:<port>/connexion/retour` on the same computer. It reads the port from the start of the `state` parameter, only ever redirects to `localhost`, stores nothing, contacts nothing and sends no referrer. The authorization code only passes through the address; without the person's app secret it is useless. The whole logic is `relais.js`: read it before trusting it.
