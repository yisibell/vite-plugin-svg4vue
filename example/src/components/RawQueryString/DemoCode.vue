<template>
  <div class="">
    <span v-html="LogoSvgRaw"></span>
  </div>
</template>

<script lang="ts" setup>
import LogoSvgRaw from '@/icons/logo.svg?raw'
</script>

<style lang="scss" scoped>
:deep() svg {
  font-size: 200px;
}
</style>
