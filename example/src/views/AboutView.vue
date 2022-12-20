<template>
  <div class="about">
    <h1>This is an about page</h1>
    <LogoSvg />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import LogoSvg from '@/icons/logo.svg?component'

export default defineComponent({
  components: {
    LogoSvg,
  },
  setup() {},
})
</script>

<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>
