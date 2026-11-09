# Dashboard d'administration (`admin/`)

Application séparée du site public : le code du dashboard (connexion, CRUD des projets)
n'est jamais embarqué dans le bundle public, et son URL peut être protégée indépendamment.

## Lancer le dashboard

```bash
# terminal 1 — API
cd backend
npm run start:dev

# terminal 2 — dashboard
cd admin
npm install          # une seule fois
npm run dev          # http://localhost:5175
```

Identifiants = `ADMIN_EMAIL` / `ADMIN_PASSWORD` du fichier `backend/.env`
(le compte est créé au premier démarrage de l'API, ou via `npm run seed:admin`).

Copier `.env.example` en `.env` seulement si l'API n'est pas sur `http://localhost:3001` :

```
VITE_API_URL="https://api.votre-domaine.dev"
```

## Ce que fait le dashboard

- **Page de chargement** dans le style du site (logo AKE.Dev, halo, barre de progression) :
  elle couvre la vérification de la session, l'envoi du formulaire de connexion et le
  premier chargement de la liste. La barre monte jusqu'à 92 % pendant la requête en cours,
  atteint 100 % à la réponse puis le rideau se lève.
- **Connexion** : `POST /auth/connexion` → jeton JWT conservé en `sessionStorage`
  (il disparaît donc à la fermeture de l'onglet, jamais sur un ordinateur partagé).
- **Liste** de tous les projets, publiés ou non, avec leur `ordre` d'affichage.
- **Ajouter / modifier** via une fenêtre d'édition (titre, sous-titre, description, stack
  séparée par des virgules, année, catégorie, image, lien, ordre, publication).
- **Publier / dépublier** en un clic : un projet dépublié reste en base mais disparaît du site.
- **Supprimer** après confirmation du navigateur.
- Toutes les erreurs de l'API (400 de validation, 401 d'expiration) s'affichent dans le bandeau.

## Image des projets

Le champ `image` accepte soit une URL complète, soit **un simple nom de fichier** déjà présent
dans `client/src/assets/Projets/` (`cesaimag.png`, `todoimag.png`, `CarteVisite.png`…).
Le site résout ce nom à la compilation, ce qui évite d'exposer un chemin serveur ou un bucket.
Si le nom est inconnu, la carte publique bascule sur une pastille d'icône.

## Vérifié

Connexion (ok + mauvais mot de passe), déconnexion, création, modification, publication,
suppression et redirection automatique après expiration : tests faits en navigateurs contre
une API de contrôle respectant le même contrat que `backend/`.

## En production

- Servir `admin/dist` sur un sous-domaine dédié (ex. `admin.votre-domaine.dev`) et l'ajouter
  dans `CORS_ORIGINES` côté API.
- Le routeur utilise l'historique HTML5 : prévoir une réécriture SPA
  (`try_files $uri /index.html` côté Nginx, ou la règle équivalente chez l'hébergeur).
- `index.html` déclare `noindex, nofollow`, et l'URL peut en plus être cachée
  (basic-auth Nginx, IP allowlist) pour une protection supplémentaire.
