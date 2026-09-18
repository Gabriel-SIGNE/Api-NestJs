# Cahier des charges — Front-end de l'application "Stuff"

## 1. Contexte

Une API REST est déjà développée et déployée. Elle permet de gérer des articles (« Stuff ») : consultation, création, modification, suppression, likes, et avis (commentaires). L'authentification se fait par token JWT.

Votre mission : construire l'interface web qui permet à un utilisateur d'interagir avec cette API.

**URL de base de l'API :** `https://api-nest-js-six.vercel.app`
**Documentation complète des routes :** `https://api-nest-js-six.vercel.app/aide`

Consultez cette page `/aide` en premier — elle liste toutes les routes, les corps de requête attendus et les réponses exactes que l'API renvoie. Ce cahier des charges ne fait que reformuler l'essentiel et vous donner les indications techniques pour vous en servir.

---

## 2. Contraintes techniques

- **HTML, CSS et JavaScript natif uniquement.** librairie CSS (Bootstrap, Tailwind...) si posible.
- Les appels réseau se font avec `fetch`.
- Le stockage des informations de session se fait avec `localStorage`.
- Le site doit être responsive (utilisable sur mobile et desktop).

## 3. Design

Le design est **libre**. Vous choisissez la palette de couleurs, la typographie, la mise en page. Il n'y a pas de maquette imposée.

En revanche, le rendu final doit être **soigné et professionnel** :
- Une identité visuelle cohérente sur toutes les pages (mêmes couleurs, mêmes polices, mêmes espacements).
- Une hiérarchie visuelle claire (on doit comprendre en un coup d'œil ce qui est important).
- Des états visuels pour les interactions : survol des boutons, bouton désactivé pendant un chargement, message d'erreur lisible, etc.
- Pas de mise en page « brute » façon formulaire des années 2000. On attend un vrai travail de direction artistique, même simple.

Un site fonctionnel mais moche sera pénalisé autant qu'un site joli mais qui ne fonctionne pas.

---

## 4. Indice important : quand stocker les informations de l'utilisateur

Regardez bien les réponses de l'API pour les deux routes d'authentification :

| Route | Réponse |
|---|---|
| `POST /api/auth/signup` (créer un compte) | `{ token }` |
| `POST /api/auth/login` (se connecter) | `{ statusCode, message, token, userId }` |

**Remarquez la différence : la création de compte ne renvoie pas `userId`, seulement le token. Seule la connexion renvoie `userId`.**

Or, `userId` vous sera indispensable plus tard, pour savoir si l'utilisateur connecté est le propriétaire d'un article (afin d'afficher ou non les boutons « Modifier » / « Supprimer »).

**Conséquence pratique : ne stockez les informations de session (token + userId) dans le `localStorage` qu'après un login, jamais après une création de compte.**

Le flux recommandé est donc :
1. L'utilisateur crée son compte (`/signup`) → on ne stocke rien, on redirige simplement vers la page de connexion (ou on affiche un message « compte créé, connectez-vous »).
2. L'utilisateur se connecte (`/login`) → on stocke `token` et `userId` dans le `localStorage`.

```js
// Après un login réussi
const data = await response.json();
localStorage.setItem('token', data.token);
localStorage.setItem('userId', data.userId);
```

---

## 5. Comment envoyer le token dans une requête `fetch`

Toutes les routes protégées (marquées « 🔒 Authentification requise » sur la page `/aide`) exigent un en-tête HTTP `Authorization` contenant le token, précédé du mot `Bearer`.

### 5.1 — Requête simple, sans authentification (ex : lister les articles)

```js
const response = await fetch('https://api-nest-js-six.vercel.app/api/stuff');
const stuffs = await response.json();
```

### 5.2 — Requête protégée, sans corps (ex : liker un article)

Pas de `body` ici, mais le token est obligatoire dans l'en-tête :

```js
const token = localStorage.getItem('token');

const response = await fetch(`https://api-nest-js-six.vercel.app/api/stuff/${stuffId}/like`, {
    method: 'POST',
    headers: {
        'Authorization': `Bearer ${token}`
    }
});

const updatedStuff = await response.json();
```

### 5.3 — Requête protégée, avec un corps JSON (ex : créer un article)

Ici il faut **deux en-têtes** : `Authorization` pour le token, et `Content-Type` pour dire à l'API qu'on envoie du JSON. Le corps (`body`) doit être transformé en texte avec `JSON.stringify`.

```js
const token = localStorage.getItem('token');

const response = await fetch('https://api-nest-js-six.vercel.app/api/stuff', {
    method: 'POST',
    headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    }
});

if (response.ok) {
    const result = await response.json();
    console.log(result.message); // "Object saved successfully !"
} else {
    const error = await response.json();
    console.error(error.message);
}
```

### 5.4 — Poster un avis (même logique)

```js
const token = localStorage.getItem('token');

const response = await fetch('https://api-nest-js-six.vercel.app/api/stuff/avis', {
    method: 'POST',
    headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    }
});
```

### 5.5 — Toujours vérifier `response.ok`

L'API renvoie un code d'erreur (400, 401, 403, 404...) avec un message dans le corps de la réponse. Ne supposez jamais que la requête a réussi :

```js
if (!response.ok) {
    const error = await response.json();
    // Affichez error.message à l'utilisateur, ne laissez jamais planter silencieusement
}
```

---

## 6. Fonctionnalités attendues

### 6.1 — Pages d'authentification

- **Page d'inscription** : formulaire email + mot de passe → `POST /api/auth/signup`. Après succès, redirigez l'utilisateur vers la page de connexion (voir indice section 4 : on ne stocke rien ici).
- **Page de connexion** : formulaire email + mot de passe → `POST /api/auth/login`. Après succès, stockez `token` et `userId`, puis redirigez vers la page d'accueil.
- Gérez les erreurs (email déjà pris, identifiants invalides) avec un message clair affiché à l'utilisateur.

### 6.2 — Page d'accueil (liste des articles)

- Accessible **avec ou sans connexion**.
- Affiche tous les articles (`GET /api/stuff`) : image, titre, prix, nombre de likes.
- Un visiteur non connecté voit la liste mais ne peut interagir avec aucun article (pas de like, pas d'avis, pas de création).
- Si l'utilisateur est connecté, affichez clairement son état de connexion (ex : « Connecté » + bouton déconnexion, qui vide simplement le `localStorage`) et un bouton pour créer un nouvel article.

### 6.3 — Page de détail d'un article

Récupérée via `GET /api/stuff/:id`, et les avis via `GET /api/stuff/avis/:id`.

**Comportement selon le statut de l'utilisateur, à gérer précisément :**

| Utilisateur | Peut liker | Peut poster un avis | Peut modifier | Peut supprimer |
|---|:---:|:---:|:---:|:---:|
| Non connecté | ❌ | ❌ | ❌ | ❌ |
| Connecté, non-propriétaire de l'article | ✅ | ✅ | ❌ | ❌ |
| Connecté, propriétaire de l'article | ✅ | ✅ | ✅ | ✅ |

Pour déterminer si l'utilisateur est propriétaire : comparez le `userId` stocké dans le `localStorage` avec le champ `userId` renvoyé dans l'objet `stuff` (`GET /api/stuff/:id`).

```js
const isOwner = localStorage.getItem('userId') === stuff.userId;
```

- Si l'utilisateur n'est pas connecté, remplacez les boutons d'action par une invitation à se connecter (n'affichez pas des boutons qui échoueraient silencieusement).
- Le bouton « Like » doit refléter l'état courant (ex : cœur plein si déjà liké, vide sinon) et le nombre de likes doit se mettre à jour après le clic, sans recharger toute la page si possible.
- Les boutons « Modifier » et « Supprimer » n'apparaissent que si `isOwner` est vrai.

### 6.4 — Page de création / modification d'article

- Formulaire : titre, description, URL d'image, prix.
- Utilisée à la fois pour créer (`POST /api/stuff`) et pour modifier (`PUT /api/stuff/:idStuff`, pré-rempli avec les données existantes, accessible uniquement au propriétaire).
- Accessible uniquement aux utilisateurs connectés (redirigez vers la page de connexion sinon).

### 6.5 — Suppression

- Bouton « Supprimer » visible uniquement pour le propriétaire, avec une confirmation avant l'appel à `DELETE /api/stuff/:idStuff`.

---

## 7. Gestion des erreurs et de la session

- Si une requête protégée renvoie un `401 Unauthorized` (token expiré ou invalide), videz le `localStorage` et redirigez l'utilisateur vers la page de connexion, avec un message expliquant pourquoi.
- N'affichez jamais une erreur technique brute (`undefined`, stack trace) à l'utilisateur final. Traduisez les messages d'erreur de l'API en phrases compréhensibles.

---

## 8. Livrables attendus

- Le code source complet (HTML, CSS, JS), organisé en dossiers clairs (`/pages` ou `/css`, `/js`, etc. — structure libre mais lisible).
- Un fichier `README.md` expliquant comment lancer le projet en local (ouverture directe des fichiers, ou serveur local type Live Server).
- Le projet doit fonctionner directement contre l'API déployée sur Vercel, sans configuration supplémentaire de votre part (l'URL de base peut être une simple constante en haut d'un fichier JS).

---

## 9. Points d'attention pour l'évaluation

- Respect strict des contraintes techniques (pas de framework).
- Gestion correcte de l'authentification (token bien envoyé, session bien gérée).
- Distinction correcte entre les trois profils d'utilisateur (non connecté / connecté non-propriétaire / propriétaire) sur la page de détail.
- Qualité et cohérence du design.
- Gestion des erreurs (formulaires, requêtes échouées) — un projet qui ne gère que le cas idéal sera pénalisé.
- Code JavaScript lisible et organisé (évitez de tout mettre dans un seul fichier de 500 lignes sans structure).
