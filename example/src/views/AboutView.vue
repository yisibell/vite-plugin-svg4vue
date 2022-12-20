<template>
  <div class="about">
    <div>
      <h1>This is an about page</h1>

      <h2>svg component</h2>
      <LogoSvg style="width: 36px" />

      <h2>svg url</h2>
      <p>
        <img :src="logoSvgUrl" alt="" width="36" />
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import LogoSvg from '@/icons/logo.svg?component'
import logoSvgUrl from '@/icons/logo.svg?url'

export default defineComponent({
  components: {
    LogoSvg,
  },
  setup() {
    return {
      logoSvgUrl,
    }
  },
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
