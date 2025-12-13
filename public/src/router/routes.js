export const routes = [
    {
        path: '/404',
        page: () => import('../pages/404.js'),
        styles: ['/src/styles/error404.css'],
        requiresAuth: false
    },
    {
        path: '/under-construction',
        page: () => import('../pages/UnderConstruction.js'),
        styles: ['/src/styles/under-construction.css'],
        requiresAuth: false
    },
    {
        path: '/',
        page: () => import('../pages/Welcome.js'),
        styles: ['/src/styles/welcome.css'],
        requiresAuth: false
    },
    {
        path: '/dashboard',
        page: () => import('../pages/Dashboard.js'),
        styles: ['/src/styles/swiper-bundle.min.css', '/src/styles/dashboard.css'],
        requiresAuth: true
    },
    {
        path: '/explore',
        page: () => import('../pages/404.js'),
        styles: ['/src/styles/error404.css'],
        requiresAuth: true
    },
    {
        path: '/settings',
        page: () => import('../pages/Settings.js'),
        styles: ['/src/styles/settings.css'],
        requiresAuth: true
    },
    {
        path: '/explore/movie',
        page: () => import('../pages/Explore.js'),
        styles: ['/src/styles/swiper-bundle.min.css', '/src/styles/explore.css'],
        requiresAuth: true,
    },
    {
        path: '/explore/tv',
        page: () => import('../pages/Explore.js'),
        styles: ['/src/styles/swiper-bundle.min.css', '/src/styles/explore.css'],
        requiresAuth: true,
    },
    {
        path: '/explore/book',
        page: () => import('../pages/Explore.js'),
        styles: ['/src/styles/swiper-bundle.min.css', '/src/styles/explore.css'],
        requiresAuth: true,
    },
    {
        path: '/lists',
        page: () => import('../pages/Lists.js'),
        styles: ['/src/styles/lists.css'],
        requiresAuth: true
    },
    {
        path: '/list/:listId',
        page: () => import('../pages/ListPage.js'),
        styles: ['/src/styles/list-page.css'],
        requiresAuth: true
    },
    {
        path: '/list/:listId/item/:itemId',
        page: () => import('../pages/ItemPage.js'),
        styles: ['/src/styles/item-page.css'],
        requiresAuth: true
    },
    {
        path: '/list/:listId/search',
        page: () => import('../pages/404.js'),
        styles: ['/src/styles/error404.css'],
        requiresAuth: true
    },
    {
        path: '/list/:listId/search/movie',
        page: () => import('../pages/Search.js'),
        styles: ['/src/styles/swiper-bundle.min.css', '/src/styles/explore.css'],
        requiresAuth: true,
    },
    {
        path: '/list/:listId/search/tv',
        page: () => import('../pages/Search.js'),
        styles: ['/src/styles/swiper-bundle.min.css', '/src/styles/explore.css'],
        requiresAuth: true,
    },
    {
        path: '/list/:listId/search/book',
        page: () => import('../pages/Search.js'),
        styles: ['/src/styles/swiper-bundle.min.css', '/src/styles/explore.css'],
        requiresAuth: true,
    },
];
