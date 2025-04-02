<template>
  <div>
    <DemoHeader
      logo-text="SVG"
      title="vite-plugin-svg4vue"
      :title-link="LINKS.repo"
      :right-links="[
        {
          href: LINKS.repo,
          title: 'Documentation',
        },
        {
          href: LINKS.changelog,
          title: 'Changelog',
        },
        { href: LINKS.repo, title: 'Github' },
      ]"
    />

    <RouterView />
  </div>
</template>

<script lang="ts" setup>
import { RouterView } from 'vue-router'

import { LINKS } from '@/settings'
</script>
