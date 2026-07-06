const express = require('express');
const router = express.Router();
const { httpApiResponse } = require('../core/http-library');
const { middlewareVerifyToken } = require('../core/middlewares');
const { v4: uuidv4 } = require('uuid');

let DB_Articles = [
    {
        id: '1',
        title: 'Premier article',
        desc: 'Introduction à la gestion d\'articles — découvrez les bases de notre plateforme desktop.',
        author: 'Isaac',
        imgPath: 'https://picsum.photos/seed/articledesk-1/400/400',
    },
    {
        id: '2',
        title: 'Deuxième article',
        desc: 'Les bonnes pratiques pour organiser et publier vos contenus efficacement.',
        author: 'Sanchez',
        imgPath: 'https://picsum.photos/seed/articledesk-2/400/400',
    },
    {
        id: '3',
        title: 'Troisième article',
        desc: 'Comment structurer une API REST avec authentification JWT.',
        author: 'Toto',
        imgPath: 'https://picsum.photos/seed/articledesk-3/400/400',
    },
    {
        id: '4',
        title: 'Architecture Electron',
        desc: 'Comprendre la séparation main process / renderer process dans une app desktop.',
        author: 'Isaac',
        imgPath: 'https://picsum.photos/seed/articledesk-4/400/400',
    },
    {
        id: '5',
        title: 'Vue 3 et Composition API',
        desc: 'Construire des interfaces réactives avec Vue 3, composables et Vue Router.',
        author: 'Tata',
        imgPath: 'https://picsum.photos/seed/articledesk-5/400/400',
    },
    {
        id: '6',
        title: 'Communication IPC',
        desc: 'Sécuriser les échanges entre le frontend et le backend via preload et ipcMain.',
        author: 'Sanchez',
        imgPath: 'https://picsum.photos/seed/articledesk-6/400/400',
    },
    {
        id: '7',
        title: 'Tailwind CSS en pratique',
        desc: 'Design system moderne avec utilitaires, composants réutilisables et responsive design.',
        author: 'Toto',
        imgPath: 'https://picsum.photos/seed/articledesk-7/400/400',
    },
    {
        id: '8',
        title: 'Packaging et distribution',
        desc: 'Générer un exécutable multiplateforme avec Electron Forge et GitHub Actions.',
        author: 'Isaac',
        imgPath: 'https://picsum.photos/seed/articledesk-8/400/400',
    },
    {
        id: '9',
        title: 'Tests et validation API',
        desc: 'Valider les endpoints avec Postman, scripts automatisés et health checks.',
        author: 'Tata',
        imgPath: 'https://picsum.photos/seed/articledesk-9/400/400',
    },
    {
        id: '10',
        title: 'Monorepo ArticleDesk',
        desc: 'Organiser backend et frontend dans un même dépôt avec Makefile et scripts d\'installation.',
        author: 'Sanchez',
        imgPath: 'https://picsum.photos/seed/articledesk-10/400/400',
    },
];

// ================================================================== //
// GESTION ARTICLES
// ================================================================== //
/**
 * Route GET : Pour récupèrer tout les articles
 */
router.get("/", async (request, response) => {
    // Récupèrer une liste/tableau d'article
    const articles = DB_Articles;

    // Retourner les articles dans la réponse JSON
    return httpApiResponse(response, "200", `La liste des articles a été récupérée avec succès !`, articles);
});

/**
 * Route GET : Pour récupèrer un article
 */
router.get("/:id", async (request, response) => {
    // Récupérer l'id de l'url
    const idParam = request.params.id;

    // Rechercher un article par son id
    const foundArticle = DB_Articles.find(article => article.id === idParam);

    if (!foundArticle) {
        return httpApiResponse(response, "721", `L'article n'existe pas`, null);
    }

    return httpApiResponse(response, "200", `L'article a été récupéré avec succès`, foundArticle);

});

/**
 * Route POST : Pour ajouter un article
 */
router.post("/save", async (request, response) => {
    // Récupérer l'article qui est envoyé en JSON
    const articleJSON = request.body;

    let foundArticle = null;

    // Est-ce on a un id envoyer dans le json
    if (articleJSON.id != undefined || articleJSON.id) {
        // essayer de trouver un article existant
        foundArticle = DB_Articles.find(article => article.id === articleJSON.id);
    }

    // Si je trouve je modifie les nouvelles valeurs
    if (foundArticle) {
        foundArticle.title = articleJSON.title;
        foundArticle.desc = articleJSON.desc;
        foundArticle.author = articleJSON.author;
        if (articleJSON.imgPath !== undefined) {
            foundArticle.imgPath = articleJSON.imgPath;
        }

        return httpApiResponse(response, "200", `L'article a été modifié avec succès`, foundArticle);
    }

    // Sinon par défaut je créer

    // -- generer l'id
    articleJSON.id = uuidv4();

    DB_Articles.push(articleJSON);

    return httpApiResponse(response, "200", `Article crée avec succès !`, articleJSON);
});


/**
 * Route POST : Pour ajouter supprimer un article
 */
router.delete('/:id', (request, response) => {

    // Il faut l'id en entier
    const id = request.params.id;

    // trouver l'index
    const foundArticleIndex = DB_Articles.findIndex(article => article.id === id);

    // si article trouve erreur
    if (foundArticleIndex < 0) {
        return httpApiResponse(response, "721", `Impossible de supprimer un article inexistant`, null);
    }

    // supprimer grace à l'index
    DB_Articles.splice(foundArticleIndex, 1);

    return httpApiResponse(response, "200", `Article ${id} supprimé avec succès`, null);
});

// Exporter le router
module.exports = router;