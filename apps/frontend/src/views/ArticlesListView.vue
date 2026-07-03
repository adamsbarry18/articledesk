<template>
  <div class="page-container">
    <div class="mb-6 flex items-end justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold tracking-tight text-slate-900">
          Liste des articles
        </h1>
        <p class="mt-1 text-sm text-slate-500">
          {{ loading ? 'Chargement…' : `${articles.length} article(s)` }}
        </p>
      </div>
    </div>

    <div
      v-if="loading"
      class="flex items-center justify-center gap-3 py-16 text-sm text-slate-500"
    >
      <LoadingSpinner />
      Chargement des articles…
    </div>

    <AppAlert v-else-if="error">{{ error }}</AppAlert>

    <div
      v-else-if="articles.length === 0"
      class="card flex flex-col items-center px-6 py-16 text-center"
    >
      <div class="mb-4 text-4xl">📭</div>
      <p class="font-medium text-slate-700">Aucun article</p>
      <p class="mt-1 text-sm text-slate-500">
        La liste est vide pour le moment.
      </p>
    </div>

    <div v-else class="space-y-4">
      <article
        v-for="article in articles"
        :key="article.id"
        class="card overflow-hidden transition hover:shadow-md"
      >
        <div class="flex gap-4 p-4 sm:p-5">
          <img
            v-if="article.imgPath"
            :src="article.imgPath"
            :alt="article.title"
            class="size-20 shrink-0 rounded-xl object-cover sm:size-24"
          />
          <div
            v-else
            class="flex size-20 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-2xl sm:size-24"
          >
            📄
          </div>

          <div class="min-w-0 flex-1">
            <h2 class="text-base font-semibold text-slate-900">
              <router-link
                :to="`/articles/${article.id}`"
                class="transition hover:text-brand-600"
              >
                {{ article.title }}
              </router-link>
            </h2>
            <p class="mt-1 line-clamp-2 text-sm text-slate-600">
              {{ article.desc }}
            </p>
            <p class="mt-2 text-xs font-medium text-slate-400">
              Par {{ article.author }}
            </p>

            <div class="mt-4 flex flex-wrap gap-2">
              <router-link
                :to="`/articles/${article.id}`"
                class="btn-secondary btn-sm"
              >
                Détail
              </router-link>
              <router-link
                :to="`/articles/${article.id}/edit`"
                class="btn-ghost btn-sm"
              >
                Modifier
              </router-link>
              <button
                type="button"
                class="btn-danger btn-sm"
                :disabled="deletingId === article.id"
                @click="handleDelete(article)"
              >
                {{ deletingId === article.id ? 'Suppression…' : 'Supprimer' }}
              </button>
            </div>
          </div>
        </div>
      </article>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import log from 'electron-log/renderer';
import {
  electronApi,
  IpcClientError,
} from '../renderer/api/electronApi.js';
import { deleteArticle } from '../composables/useArticleActions.js';
import AppAlert from '../components/ui/AppAlert.vue';
import LoadingSpinner from '../components/ui/LoadingSpinner.vue';

const articles = ref([]);
const loading = ref(true);
const error = ref(null);
const deletingId = ref(null);

async function loadArticles() {
  loading.value = true;
  error.value = null;

  try {
    articles.value = await electronApi.articles.getAll();
    log.info(
      `[Articles] ${articles.value.length} article(s) chargé(s) via IPC`,
    );
  } catch (err) {
    error.value =
      err instanceof IpcClientError
        ? err.message
        : 'Impossible de charger les articles';
    log.error('[Articles] Échec chargement', err);
  } finally {
    loading.value = false;
  }
}

async function handleDelete(article) {
  deletingId.value = article.id;
  try {
    await deleteArticle(article.id, article.title);
    articles.value = articles.value.filter((a) => a.id !== article.id);
  } catch {
    // Erreur déjà affichée dans deleteArticle
  } finally {
    deletingId.value = null;
  }
}

onMounted(loadArticles);
</script>
