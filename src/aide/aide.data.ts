export function getAideData() {
    return {
        bienvenue: "Bienvenue sur l'API Stuff. Voici la documentation complète des routes disponibles.",

        authentification: {
            description: "L'API utilise un système d'authentification par token JWT. Pour accéder à une route protégée, il faut envoyer le token dans l'en-tête HTTP : Authorization: Bearer <token>",

            commentCreerUnCompte: {
                methode: "POST",
                url: "/api/auth/signup",
                description: "Crée un nouveau compte utilisateur et retourne directement un token JWT.",
                corpsAttendu: {
                    email: "string (email valide, obligatoire, doit être unique)",
                    password: "string (obligatoire)"
                },
                exempleCorps: {
                    email: "john.doe@example.com",
                    password: "StrongP@ssw0rd123"
                },
                reponseSucces: {
                    statusCode: 201,
                    body: { token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." }
                },
                reponseErreur: {
                    statusCode: 400,
                    body: { statusCode: 400, message: "Email already exists", error: "Bad Request" }
                }
            },

            commentSeConnecter: {
                methode: "POST",
                url: "/api/auth/login",
                description: "Authentifie un utilisateur existant et retourne un token JWT à utiliser pour les routes protégées.",
                corpsAttendu: {
                    email: "string (obligatoire)",
                    password: "string (obligatoire)"
                },
                reponseSucces: {
                    statusCode: 200,
                    body: {
                        statusCode: 200,
                        message: "Authentication Success",
                        token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                        userId: "507f1f77bcf86cd799439011"
                    }
                },
                reponseErreur: {
                    statusCode: 401,
                    body: { statusCode: 401, message: "Paire login/mot de passe incorrecte", error: "Unauthorized" }
                }
            }
        },

        modeles: [
            {
                nom: "User",
                description: "Représente un utilisateur de l'application. Le mot de passe est toujours stocké hashé (bcrypt), jamais en clair.",
                champs: [
                    { nom: "_id", type: "ObjectId", description: "Généré automatiquement par MongoDB" },
                    { nom: "email", type: "string", description: "Unique, obligatoire" },
                    { nom: "password", type: "string", description: "Obligatoire (hashé)" }
                ]
            },
            {
                nom: "Stuff",
                description: "Représente un article publié par un utilisateur.",
                champs: [
                    { nom: "_id", type: "ObjectId", description: "Généré automatiquement" },
                    { nom: "title", type: "string", description: "Obligatoire" },
                    { nom: "description", type: "string", description: "Obligatoire" },
                    { nom: "imageUrl", type: "string", description: "URL de l'image, obligatoire" },
                    { nom: "price", type: "number", description: "Obligatoire" },
                    { nom: "userId", type: "ObjectId", description: "Référence vers le User propriétaire de l'article" },
                    { nom: "createdAt", type: "number", description: "Timestamp, généré automatiquement" },
                    { nom: "usersLiked", type: "ObjectId[]", description: "Liste des utilisateurs ayant liké cet article" },
                    { nom: "likes", type: "number", description: "Nombre total de likes sur l'article" }
                ]
            },
            {
                nom: "Avis",
                description: "Représente un avis/commentaire laissé sur un article.",
                champs: [
                    { nom: "_id", type: "ObjectId", description: "Généré automatiquement" },
                    { nom: "stuffId", type: "ObjectId", description: "Référence vers l'article concerné" },
                    { nom: "user", type: "string", description: "Nom ou identifiant de l'auteur de l'avis" },
                    { nom: "comment", type: "string", description: "Contenu de l'avis" },
                    { nom: "createdAt", type: "number", description: "Timestamp, généré automatiquement" }
                ]
            }
        ],

        routes: [
            {
                methode: "POST",
                url: "/api/auth/signup",
                authentificationRequise: false,
                description: "Créer un nouveau compte utilisateur.",
                corps: { email: "string", password: "string" },
                reponseSucces: { statusCode: 201, body: { token: "string" } }
            },
            {
                methode: "POST",
                url: "/api/auth/login",
                authentificationRequise: false,
                description: "Se connecter et récupérer un token JWT.",
                corps: { email: "string", password: "string" },
                reponseSucces: { statusCode: 200, body: { statusCode: 200, message: "string", token: "string", userId: "string" } }
            },
            {
                methode: "GET",
                url: "/api/stuff",
                authentificationRequise: false,
                description: "Récupérer la liste de tous les articles.",
                reponseSucces: { statusCode: 200, body: "Stuff[]" }
            },
            {
                methode: "GET",
                url: "/api/stuff/:id",
                authentificationRequise: false,
                description: "Récupérer un article précis par son id.",
                reponseSucces: { statusCode: 200, body: "Stuff" },
                reponseErreur: { statusCode: 404, body: { message: "Object does not exist" } }
            },
            {
                methode: "POST",
                url: "/api/stuff",
                authentificationRequise: true,
                description: "Créer un nouvel article. Le propriétaire est automatiquement l'utilisateur connecté (déduit du token).",
                corps: { title: "string", description: "string", imageUrl: "string", price: "number" },
                reponseSucces: { statusCode: 201, body: { statusCode: 201, message: "Object saved successfully !" } }
            },
            {
                methode: "PUT",
                url: "/api/stuff/:idStuff",
                authentificationRequise: true,
                description: "Modifier un article existant. Seul le propriétaire de l'article peut le modifier.",
                corps: { title: "string", description: "string", imageUrl: "string", price: "number" },
                reponseSucces: { statusCode: 200, body: "Stuff (mis à jour)" },
                reponseErreur: { statusCode: 403, body: { message: "Vous n'avez pas le droit de modifier cette object!" } }
            },
            {
                methode: "DELETE",
                url: "/api/stuff/:idStuff",
                authentificationRequise: true,
                description: "Supprimer un article existant. Seul le propriétaire de l'article peut le supprimer.",
                reponseSucces: { statusCode: 200, body: { statusCode: 200, message: "object deleted successfully !" } },
                reponseErreur: { statusCode: 403, body: { message: "Vous n'avez pas le droit de supprimer cette object!" } }
            },
            {
                methode: "POST",
                url: "/api/stuff/:id/like",
                authentificationRequise: true,
                description: "Liker ou retirer son like (unlike) sur un article. Si l'utilisateur a déjà liké, son like est retiré ; sinon un like est ajouté.",
                reponseSucces: { statusCode: 201, body: "Stuff (mis à jour, avec usersLiked et likes actualisés)" }
            },
            {
                methode: "POST",
                url: "/api/stuff/avis",
                authentificationRequise: true,
                description: "Donner un avis sur un article.",
                corps: { stuffId: "ObjectId", user: "string", comment: "string" },
                reponseSucces: { statusCode: 201, body: { statusCode: 201, message: "Object saved successfully !" } }
            },
            {
                methode: "GET",
                url: "/api/stuff/avis/:id",
                authentificationRequise: false,
                description: "Récupérer tous les avis d'un article donné.",
                reponseSucces: { statusCode: 200, body: "Avis[]" }
            }
        ],

        documentationInteractive: "Une documentation interactive (Swagger) est également disponible sur la route /api-doc, permettant de tester directement les routes depuis le navigateur."
    };
}