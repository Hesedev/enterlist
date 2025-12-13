import Welcome from '../pages/Welcome.js';
import Dashboard from '../pages/Dashboard.js';
import Error404 from '../pages/404.js';
import UnderConstruction from '../pages/UnderConstruction.js'
import Explore from '../pages/Explore.js';
import Settings from '../pages/Settings.js';
import Lists from '../pages/Lists.js';
import ListPage from '../pages/ListPage.js'
import ItemPage from '../pages/ItemPage.js';
import Search from '../pages/Search.js';

export const routes = [
    {
        path: '/404',
        page: Error404,
        styles: ['/src/styles/error404.css'],
        requiresAuth: false
    },
    {
        path: '/under-construction',
        page: UnderConstruction,
        styles: ['/src/styles/under-construction.css'],
        requiresAuth: false
    },
    {
        path: '/',
        page: Welcome,
        styles: ['/src/styles/welcome.css'],
        requiresAuth: false
    },
    {
        path: '/dashboard',
        page: Dashboard,
        styles: ['/src/styles/swiper-bundle.min.css', '/src/styles/dashboard.css'],
        requiresAuth: true
    },
    {
        path: '/explore',
        page: Error404,
        styles: ['/src/styles/error404.css'],
        requiresAuth: true
    },
    {
        path: '/settings',
        page: Settings,
        styles: ['/src/styles/settings.css'],
        requiresAuth: true
    },
    {
        path: '/explore/movie',
        page: Explore,
        styles: ['/src/styles/swiper-bundle.min.css', '/src/styles/explore.css'],
        requiresAuth: true,
    },
    {
        path: '/explore/tv',
        page: Explore,
        styles: ['/src/styles/swiper-bundle.min.css', '/src/styles/explore.css'],
        requiresAuth: true,
    },
    {
        path: '/explore/book',
        page: Explore,
        styles: ['/src/styles/swiper-bundle.min.css', '/src/styles/explore.css'],
        requiresAuth: true,
    },
    {
        path: '/lists',
        page: Lists,
        styles: ['/src/styles/lists.css'],
        requiresAuth: true
    },
    {
        path: '/list/:listId',
        page: ListPage,
        styles: ['/src/styles/list-page.css'],
        requiresAuth: true
    },
    {
        path: '/list/:listId/item/:itemId',
        page: ItemPage,
        styles: ['/src/styles/item-page.css'],
        requiresAuth: true
    },
    {
        path: '/list/:listId/search',
        page: Error404,
        styles: ['/src/styles/error404.css'],
        requiresAuth: true
    },
    {
        path: '/list/:listId/search/movie',
        page: Search,
        styles: ['/src/styles/swiper-bundle.min.css', '/src/styles/explore.css'],
        requiresAuth: true,
    },
    {
        path: '/list/:listId/search/tv',
        page: Search,
        styles: ['/src/styles/swiper-bundle.min.css', '/src/styles/explore.css'],
        requiresAuth: true,
    },
    {
        path: '/list/:listId/search/book',
        page: Search,
        styles: ['/src/styles/swiper-bundle.min.css', '/src/styles/explore.css'],
        requiresAuth: true,
    },
];
