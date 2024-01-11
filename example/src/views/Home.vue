<template>
  <div class="home">
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
.home-body {
  margin: 0 auto;
  width: 1200px;
  padding-top: 60px;
}
</style>
