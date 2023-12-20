<template>
  <div class="home">
    <div class="home-header">
      <div class="home-header__left">
        <div class="logo">
          <span>SVG4</span>
          <span>Vue</span>
        </div>
        <div class="about">
          <a :href="LINKS.changelog" target="_blank">Changelog</a>
        </div>
        <div class="documentation">
          <a :href="LINKS.repo" target="_blank">Documentation</a>
        </div>
      </div>

      <div class="home-header__right">
        <a :href="LINKS.repo" target="_blank">Github</a>
      </div>
    </div>

    <div class="home-body">
      <div class="features">
        <ComponentQueryString />
        <UrlQueryString />
        <RawQueryString />
        <MaintenanceColors />
        <MaintenanceSize />
        <SkipsvgoQueryString />
        <GlobUsage />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { LINKS } from '@/settings'
import ComponentQueryString from '@/components/ComponentQueryString/index.vue'
import UrlQueryString from '@/components/UrlQueryString/index.vue'
import RawQueryString from '@/components/RawQueryString/index.vue'
import SkipsvgoQueryString from '@/components/SkipsvgoQueryString/index.vue'
import MaintenanceColors from '@/components/MaintenanceColors/index.vue'
import MaintenanceSize from '@/components/MaintenanceSize/index.vue'
import GlobUsage from '@/components/GlobUsage/index.vue'
</script>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'HomePage',
})
</script>

<style lang="scss" scoped>
.home-header {
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 120px;

  .logo {
    width: 40px;
    height: 40px;
    background: linear-gradient(180deg, #f36c45 20%, #e75755);
    border-radius: 2px;
    color: #fff;
    display: flex;
    flex-direction: column;
    font-size: 12px;
    justify-content: center;
    align-items: center;
    line-height: 1.2em;
    font-weight: bold;
    font-family: fantasy;
    font-style: italic;
  }

  a {
    &:any-link {
      color: var(--theme-text-color);
      text-decoration: none;
      font-family: var(--theme-font-family);
    }

    &:hover {
      text-decoration: underline;
    }
  }

  &__left {
    display: flex;
    align-items: center;

    .about,
    .documentation {
      margin-left: 20px;
    }
  }
}

.home-body {
  margin: 0 auto;
  width: 1200px;
}
</style>
