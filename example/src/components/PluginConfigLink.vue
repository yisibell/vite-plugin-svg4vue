<template>
  <a
    href="https://github.com/yisibell/vite-plugin-svg4vue#options"
    target="_blank"
  >
    <slot name="default">{{ text }}</slot>
  </a>
</template>

<script setup lang="ts">
defineProps({
  text: {
    type: String,
    default: 'Configuration',
  },
})
</script>
