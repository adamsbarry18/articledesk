import { createRouter, createWebHashHistory } from 'vue-router';
import { useAuth } from './composables/useAuth.js';
import { PUBLIC_ROUTES } from '@shared/constants/auth.js';

const routes = [
  {
    path: '/',
    redirect: '/articles',
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('./views/LoginView.vue'),
    meta: { public: true },
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('./views/RegisterView.vue'),
    meta: { public: true },
  },
  {
    path: '/articles',
    name: 'Articles',
    component: () => import('./views/ArticlesListView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/articles/:id/edit',
    name: 'ArticleEdit',
    component: () => import('./views/ArticleEditView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/articles/:id',
    name: 'ArticleDetail',
    component: () => import('./views/ArticleDetailView.vue'),
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  // Hash history recommandé pour Electron (pas de dépendance au serveur de fichiers)
  history: createWebHashHistory(),
  routes,
});

router.beforeEach(async (to) => {
  const auth = useAuth();
  const isPublic = PUBLIC_ROUTES.includes(to.path);

  await auth.ensureSessionChecked();

  if (to.meta.requiresAuth && !auth.isAuthenticated.value) {
    return { path: '/login', query: { redirect: to.fullPath } };
  }

  if (isPublic && auth.isAuthenticated.value) {
    return '/articles';
  }

  return true;
});

export default router;
