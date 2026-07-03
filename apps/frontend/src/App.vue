<template>
  <div class="min-h-screen bg-slate-50">
    <header
      v-if="isAuthenticated"
      class="sticky top-0 z-10 border-b border-slate-200/80 bg-white/90 backdrop-blur"
    >
      <nav class="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6">
        <router-link
          to="/articles"
          class="flex items-center gap-2 text-lg font-bold text-slate-900"
        >
          <span
            class="flex size-8 items-center justify-center rounded-lg bg-brand-600 text-sm text-white"
          >
            A
          </span>
          Gestion Articles
        </router-link>

        <div class="flex items-center gap-3">
          <span
            class="hidden max-w-40 truncate rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 sm:inline"
          >
            {{ email }}
          </span>
          <button type="button" class="btn-secondary btn-sm" @click="handleLogout">
            Déconnexion
          </button>
        </div>
      </nav>
    </header>

    <main>
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { useAuth } from './composables/useAuth.js';

const router = useRouter();
const { isAuthenticated, email, logout } = useAuth();

function handleLogout() {
  logout();
  router.push('/login');
}
</script>
