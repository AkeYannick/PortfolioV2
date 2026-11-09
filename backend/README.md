# Backend — API du portfolio (NestJS + Prisma 7 + Neon)

API qui alimente le site public (liste des projets) et le dashboard d'administration
(ajout / modification / suppression de projets derrière une connexion JWT).

## Démarrage en 5 commandes

```bash
cd backend
npm install
cp .env.example .env      # puis coller l'URL Neon POOLED dans DATABASE_URL
npm run prisma:migrate    # crée les tables AdminUser + Project dans Neon
npm run seed:admin        # crée le compte admin défini dans .env
npm run start:dev         # API sur http://localhost:3001
```

`npm run prisma:migrate` demande une vraie connexion : c'est l'étape à lancer soi-même
après avoir collé votre chaîne Neon (le fichier `.env` livré ne contient qu'un espace réservé).

## Variables d'environnement

| Variable | Rôle |
| --- | --- |
| `DATABASE_URL` | URL Neon **en mode pooled** (le domaine contient `-pooler`) avec `?sslmode=require`. |
| `JWT_SECRET` | Secret de signature HS256, ≥ 32 caractères. Génération : `node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"` |
| `JWT_TTL` | Durée de vie du jeton (`15m`, `8h`…). Court par défaut : le dashboard se reconnecte souvent. |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Identifiants du compte admin, hachés en base au premier lancement. |
| `CORS_ORIGINES` | Liste séparée par des virgules : origine du dashboard **et** du site public. |
| `PORT` | Port d'écoute (3001 par défaut). |

Le fichier `.env` est ignoré par git ; `.env.example` documente chaque variable.

## Routes

| Méthode | Route | Accès | Description |
| --- | --- | --- | --- |
| `POST` | `/auth/connexion` | public (5 essais/min) | Renvoie `{ token, email }`. |
| `GET` | `/auth/moi` | jeton | Vérifie que la session est toujours valide. |
| `GET` | `/projets` | public | Projets publiés, triés par `ordre` puis date. |
| `GET` | `/projets/admin/tous` | jeton | Tous les projets, `publie: false` inclus. |
| `GET` | `/projets/:id` | jeton | Un projet. |
| `POST` | `/projets` | jeton | Création. |
| `PATCH` | `/projets/:id` | jeton | Modification partielle. |
| `DELETE` | `/projets/:id` | jeton | Suppression. |

Requête typée depuis le dashboard :

```bash
TOKEN=$(curl -s http://localhost:3001/auth/connexion \
  -H 'content-type: application/json' \
  -d '{"email":"vous@exemple.com","motDePasse":"au-moins-12-caracteres"}' | node -pe 'JSON.parse(require("fs").readFileSync(0)).token')

curl -X POST http://localhost:3001/projets -H "authorization: Bearer $TOKEN" \
  -H 'content-type: application/json' \
  -d '{"titre":"Nouveau projet","sousTitre":"Site vitrine","stack":["React","Laravel"],"annee":"2026","categorie":"WEB","ordre":1}'
```

## Choix de sécurité

- **Un seul compte admin**, mot de passe jamais stocké en clair : hash **scrypt** salé
  (natif Node, donc rien à compiler sous Windows), comparaison en temps constant.
- **Jetons courts** (15 min) et vérification `Authorization: Bearer` sur chaque route d'écriture ;
  les routes publiques ne voient que `publie: true`, les brouillons ne fuient donc jamais.
- **Anti-brute-force** : `@nestjs/throttler` global (100 req/min) et 5 tentatives/min sur `/auth/connexion`.
  Un hachage factice est calculé quand l'email n'existe pas : le temps de réponse ne révèle pas l'existence du compte.
- **En-têtes** : `helmet`. **CORS** : liste blanche stricte (`CORS_ORIGINES`), pas de `*`.
- **DTOs validés** : `class-validator` avec `whitelist` + `forbidNonWhitelisted` (les champs inconnus sont rejetés).
- **Démarrage strict** : `JWT_SECRET` et `DATABASE_URL` sont exigés, une valeur d'exemple est refusée en production.

## Scripts

| Commande | Effet |
| --- | --- |
| `npm run build` | Compilation TypeScript dans `dist/`. |
| `npm start` | Démarre `dist/main.js` (production). |
| `npm run start:dev` | Relance automatique (Nest CLI). |
| `npm run prisma:generate` | Régénère le client dans `src/generated/prisma`. |
| `npm run prisma:migrate` | Applique un nouveau schéma en local + Neon (développement). |
| `npm run prisma:deploy` | Applique les migrations enregistrées (déploiement). |
| `npm run seed:admin` | (Re)crée le compte admin depuis `.env`. |

## Note sur Prisma 7

Prisma 7 n'embarque plus de moteur Rust : le schéma ne déclare **pas** `url` dans `datasource`,
l'URL vient de `prisma.config.ts` et l'application passe un adaptateur de pilote
(`@prisma/adapter-pg`, compatible Neon). Le client est généré en TypeScript dans
`src/generated/prisma` (dossier ignoré par git, régénéré par `npm run prisma:generate`).
