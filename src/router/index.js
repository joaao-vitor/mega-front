import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import CalendarView from '../views/CalendarView.vue'
import VerifyEmailView from '../views/VerifyEmailView.vue'
import AddGameView from '../views/dashboard/AddGameView.vue'
import ListGamesView from '../views/dashboard/ListGamesView.vue'
import EditGameView from '../views/dashboard/EditGameView.vue'
import AddDevView from '../views/dashboard/AddDevView.vue'
import GameView from '../views/GameView.vue'
import UserView from '../views/UserView.vue'
import ConfigView from '../views/ConfigView.vue'
import SearchView from '../views/SearchView.vue'
import DashboardView from '../views/dashboard/DashboardView.vue'
import { useUserStore } from '../stores/UserStore'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'Home',
            component: HomeView,
        },
        {
            path: '/calendar',
            name: 'Calendar',
            component: CalendarView,
        },
        {
            path: '/user/verify-email',
            name: 'verifyEmail',
            component: VerifyEmailView,
        },
        {
            path: '/game/:id',
            name: 'game',
            component: GameView,
            props: true
        },
        {
            path: '/user/:id',
            name: 'user',
            component: UserView,
            props: true
        },
        {
            path: '/search',
            name: 'search',
            component: SearchView,
        },

        {
            path: '/config',
            name: 'config',
            component: ConfigView,
        },
        {
            path: '/dashboard',
            name: 'dashboard',
            component: DashboardView,
            children: [
                {
                    path: 'add-game',
                    name: 'addGame',
                    component: AddGameView,
                },

                {
                    path: 'list-games',
                    name: 'listGames',
                    component: ListGamesView,
                },

                {
                    path: 'add-dev',
                    name: 'addDev',
                    component: AddDevView,
                },

                {
                    path: 'edit-game/:id',
                    name: 'editGame',
                    component: EditGameView,
                    props: true,
                },
            ],
        },
        {},
    ],
})

export default router
