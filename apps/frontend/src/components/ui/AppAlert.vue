<script setup>
defineProps({
  variant: {
    type: String,
    default: 'error',
    validator: (v) => ['error', 'success', 'info'].includes(v),
  },
});
</script>

<template>
  <div
    class="alert"
    :class="{
      'alert-error': variant === 'error',
      'alert-success': variant === 'success',
      'border-sky-200 bg-sky-50 text-sky-800': variant === 'info',
    }"
    role="alert"
  >
    <slot />
  </div>
</template>
