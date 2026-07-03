<template>
  <div class="page-container">
    <router-link
      to="/articles"
      class="mb-6 inline-flex items-center gap-1 text-sm font-medium text-slate-500 transition hover:text-brand-600"
    >
      ← Retour à la liste
    </router-link>

    <div
      v-if="loading"
      class="flex items-center justify-center gap-3 py-16 text-sm text-slate-500"
    >
      <LoadingSpinner />
      Chargement de l'article…
    </div>

    <AppAlert v-else-if="error">{{ error }}</AppAlert>

    <article v-else-if="article" class="card overflow-hidden">
      <img
        v-if="article.imgPath"
        :src="article.imgPath"
        :alt="article.title"
        class="h-56 w-full object-cover sm:h-64"
      />

      <div class="p-6 sm:p-8">
        <h1 class="text-2xl font-bold tracking-tight text-slate-900">
          {{ article.title }}
        </h1>
        <p class="mt-2 text-sm font-medium text-slate-400">
          Par {{ article.author }}
        </p>

        <div class="mt-6 leading-relaxed text-slate-700">
          <p class="whitespace-pre-wrap">{{ article.desc }}</p>
        </div>

        <div class="mt-8 flex flex-wrap gap-3">
          <router-link
            :to="`/articles/${article.id}/edit`"
            class="btn-primary btn-sm"
          >
            Modifier
          </router-link>
          <button
            type="button"
            class="btn-danger btn-sm"
            :disabled="deleting"
            @click="handleDelete"
          >
            {{ deleting ? 'Suppression…' : 'Supprimer' }}
          </button>
        </div>

        <p class="mt-8 text-xs text-slate-300">Réf. {{ article.id }}</p>
      </div>
    </article>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import log from 'electron-log/renderer';
import {
  electronApi,
  IpcClientError,
} from '../renderer/api/electronApi.js';
import { deleteArticle } from '../composables/useArticleActions.js';
import { getRouteParam } from '@shared/utils/route.js';
import AppAlert from '../components/ui/AppAlert.vue';
import LoadingSpinner from '../components/ui/LoadingSpinner.vue';

const route = useRoute();
const router = useRouter();

const article = ref(null);
const loading = ref(true);
const deleting = ref(false);
const error = ref(null);

async function loadArticle(id) {
  loading.value = true;
  error.value = null;
  article.value = null;

  try {
    article.value = await electronApi.articles.getById(id);
    log.info(`[ArticleDetail] Article ${id} chargé via IPC`);
  } catch (err) {
    error.value =
      err instanceof IpcClientError
        ? err.message
        : "Impossible de charger l'article";
    log.error(`[ArticleDetail] Échec chargement ${id}`, err);
  } finally {
    loading.value = false;
  }
}

async function handleDelete() {
  if (!article.value) return;

  deleting.value = true;
  try {
    await deleteArticle(article.value.id, article.value.title);
    router.push('/articles');
  } catch {
    // Erreur déjà affichée dans deleteArticle
  } finally {
    deleting.value = false;
  }
}

onMounted(() => {
  loadArticle(getRouteParam(route, 'id'));
});

watch(
  () => getRouteParam(route, 'id'),
  (newId) => {
    if (newId) {
      loadArticle(newId);
    }
  },
);
</script>
