import { createRouter, createWebHistory, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import {
    ADDRESS_ROUTE_QUERY,
    ROUTE_NAME,
    Q_TOKEN_DETAILS,
    // Q_BLOCKS_AND_TXS,
    Q_BLOCK_DETAILS,
    Q_TXS_DETAILS,
    Q_ADDRESS_TRANSFERS,
    Q_PORTFOLIO
} from './routesNames'
import configs from '@/configs'
import { tabViewRouteGuard, loadImages } from './helpers'
const ViewHome = () => import('@view/ViewHome.vue')
const ViewBlocks = () => import('@view/ViewBlocks.vue')
const ViewTxDetails = () => import('@view/ViewTxDetails.vue')
const ViewBlockDetails = () => import('@view/ViewBlockDetails.vue')
const ViewUncleDetails = () => import('@view/ViewUncleDetails.vue')
const ViewTokenDetail = () => import('@view/ViewTokenDetails.vue')
const ViewTxs = () => import('@view/ViewTxs.vue')
const ViewAddressTokens = () => import('@view/ViewAddressTokens.vue')
const ViewAddress = () => import('@view/ViewAddress.vue')
const ViewAddressOverview = () => import('@view/ViewAddressOverview.vue')
const ViewAddressEthBalance = () => import('@view/ViewAddressEthBalance.vue')
const ViewTokens = () => import('@view/ViewTokens.vue')
const ViewAddressNfts = () => import('@view/ViewAddressNfts.vue')
const ViewPortfolio = () => import('@view/ViewPortfolio.vue')
const ViewNotFound = () => import('@view/ViewNotFound.vue')
const ViewAbout = () => import('@view/ViewAbout.vue')

const routes: Array<RouteRecordRaw> = [
    {
        path: ROUTE_NAME.HOME.PATH,
        name: ROUTE_NAME.HOME.NAME,
        component: ViewHome,
        beforeEnter: loadImages()
    },
    {
        path: ROUTE_NAME.BLOCKS.PATH,
        name: ROUTE_NAME.BLOCKS.NAME,
        component: ViewBlocks
    },
    // {
    //     path: ROUTE_NAME.ALL_BLOCKS_AND_TXS.PATH,
    //     name: ROUTE_NAME.ALL_BLOCKS_AND_TXS.NAME,
    //     component: BlocksAndTxsView,
    //     props: route => ({ tab: route.query.t }),
    //     beforeEnter: tabViewRouteGuard(Q_BLOCKS_AND_TXS[0])
    // },
    {
        path: ROUTE_NAME.BLOCK_NUMBER.PATH,
        name: ROUTE_NAME.BLOCK_NUMBER.NAME,
        component: ViewBlockDetails,
        props: route => ({ tab: route.query.t, blockRef: route.params.blockRef }),
        beforeEnter: tabViewRouteGuard(Q_BLOCK_DETAILS[0])
    },
    {
        path: ROUTE_NAME.BLOCK_HASH.PATH,
        name: ROUTE_NAME.BLOCK_HASH.NAME,
        component: ViewBlockDetails,
        props: route => ({ tab: route.query.t, blockRef: route.params.blockRef }),
        beforeEnter: tabViewRouteGuard(Q_BLOCK_DETAILS[0])
    },
    {
        path: ROUTE_NAME.UNCLE_HASH.PATH,
        name: ROUTE_NAME.UNCLE_HASH.NAME,
        component: ViewUncleDetails,
        props: true
    },
    {
        path: ROUTE_NAME.TXS.PATH,
        name: ROUTE_NAME.TXS.NAME,
        component: ViewTxs
    },
    {
        path: ROUTE_NAME.TX_HASH.PATH,
        name: ROUTE_NAME.TX_HASH.NAME,
        component: ViewTxDetails,
        props: route => ({ tab: route.query.t, txRef: route.params.txRef }),
        beforeEnter: tabViewRouteGuard(Q_TXS_DETAILS[0])
    },
    {
        path: ROUTE_NAME.TOKEN.PATH,
        name: ROUTE_NAME.TOKEN.NAME,
        component: ViewTokenDetail,
        props: true,
        beforeEnter: tabViewRouteGuard(Q_TOKEN_DETAILS[0])
    },
    {
        path: ROUTE_NAME.ADDRESS.PATH,
        props: true,
        component: ViewAddress,
        children: [
            {
                path: '',
                name: ROUTE_NAME.ADDRESS.NAME,
                component: ViewAddressOverview,
                props: true
            },
            {
                path: ROUTE_NAME.ADDRESS_BALANCE.PATH,
                name: ROUTE_NAME.ADDRESS_BALANCE.NAME,
                component: ViewAddressEthBalance,
                props: route => ({ tab: route.query.t }),
                beforeEnter: tabViewRouteGuard(Q_ADDRESS_TRANSFERS[0])
            },
            {
                path: ROUTE_NAME.ADDRESS_TOKENS.PATH,
                name: ROUTE_NAME.ADDRESS_TOKENS.NAME,
                component: ViewAddressTokens,
                props: route => ({ tab: route.query.t }),
                beforeEnter: tabViewRouteGuard(ADDRESS_ROUTE_QUERY.Q_TOKENS[0])
            },
            {
                path: ROUTE_NAME.ADDRESS_NFTS.PATH,
                name: ROUTE_NAME.ADDRESS_NFTS.NAME,
                component: ViewAddressNfts,
                props: route => ({ tab: route.query.t }),
                beforeEnter: tabViewRouteGuard(ADDRESS_ROUTE_QUERY.Q_NFTS[0])
            }
        ]
    },

    {
        path: ROUTE_NAME.PORTFOLIO.PATH,
        name: ROUTE_NAME.PORTFOLIO.NAME,
        component: ViewPortfolio,
        props: route => ({ tab: route.query.t }),
        beforeEnter: tabViewRouteGuard(Q_PORTFOLIO[0])
    },
    {
        path: ROUTE_NAME.TOKENS.PATH,
        name: ROUTE_NAME.TOKENS.NAME,
        component: ViewTokens
    },
    {
        path: ROUTE_NAME.NOT_FOUND.PATH,
        component: ViewNotFound,
        name: ROUTE_NAME.NOT_FOUND.NAME
    },
    {
        path: ROUTE_NAME.ABOUT.PATH,
        component: ViewAbout,
        name: ROUTE_NAME.ABOUT.NAME
    },

    {
        path: '/:pathMatch(.*)*',
        redirect: ROUTE_NAME.NOT_FOUND.PATH,
        beforeEnter: loadImages()
    }
]

const router = createRouter({
    history: configs.ROUTER_MODE === 'hash' ? createWebHashHistory() : createWebHistory(),
    routes
})

export default router
