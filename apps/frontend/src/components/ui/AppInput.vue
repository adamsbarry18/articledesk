<script setup>
defineProps({
  label: { type: String, required: true },
  id: { type: String, required: true },
  type: { type: String, default: 'text' },
  modelValue: { type: String, default: '' },
  placeholder: { type: String, default: '' },
  required: { type: Boolean, default: false },
  autocomplete: { type: String, default: undefined },
});

defineEmits(['update:modelValue']);
</script>

<template>
  <div>
    <label :for="id" class="label">{{ label }}</label>
    <input
      :id="id"
      class="input"
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :required="required"
      :autocomplete="autocomplete"
      @input="$emit('update:modelValue', $event.target.value)"
    />
  </div>
</template>
