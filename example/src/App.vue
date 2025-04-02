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
    <span v-html="Icon"></span>
    <span v-html="Icon2"></span>

    <Icon3 font-size="60px" />
    <Icon4 font-size="60px" />
    <RouterView />
  </div>
</template>

<script lang="ts" setup>
import { RouterView } from 'vue-router'
import Icon from '@/icons/filter/strapssleeves/hover/long_sleeve.svg?raw'
import Icon4 from '@/icons/filter/strapssleeves/hover/long_sleeve.svg?component'
import Icon2 from '@/icons/filter/strapssleeves/selected/long_sleeves.svg?raw'
import Icon3 from '@/icons/filter/strapssleeves/selected/long_sleeves.svg?component'

import { LINKS } from '@/settings'
</script>
