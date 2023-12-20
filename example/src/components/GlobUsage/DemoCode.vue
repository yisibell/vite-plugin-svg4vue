<template>
  <div class="">See console</div>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue'

const iconsImport = import.meta.glob('@/icons/**.svg', {
  import: 'default',
  eager: true,
  query: {
    component: '', // import SVG as a vue component
    // raw: '', // Or import SVG as a pure text
    // url: '', // or import SVG as a url
  },
})

onMounted(() => {
  console.log(iconsImport)
})
</script>
