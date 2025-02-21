<template>
  <div class="d-flex align-center mb-16">
    <label class="mr-12"> ?component&skipsvgo: </label>
    <PPTSvg />
  </div>

  <div class="d-flex align-center">
    <label class="mr-12"> ?raw&skipsvgo: </label>
    <span v-html="PPTSvgRaw"></span>
  </div>

  <div class="d-flex align-center">
    <label class="mr-12"> ?component&skip-monochrome: </label>
    <FacebookIcon font-size="32px" />
  </div>
</template>

<script setup lang="ts">
import PPTSvg from '@/icons/ppt.svg?component&skipsvgo'
import PPTSvgRaw from '@/icons/ppt.svg?raw&skipsvgo'
import FacebookIcon from '@/icons/social/facebook.svg?component&skip-monochrome&skip-responsive'
</script>
