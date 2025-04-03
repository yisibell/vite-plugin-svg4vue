<template>
  <div class="">
    <span v-html="Icon1" style="font-size: 60px"></span>
    <span v-html="Icon2" style="font-size: 60px"></span>
    <Icon3 font-size="60px" />
    <Icon4 font-size="60px" />
  </div>
</template>

<script lang="ts" setup>
import Icon1 from '@/icons/filter/strapssleeves/hover/long_sleeve.svg?raw'
import Icon2 from '@/icons/filter/strapssleeves/selected/long_sleeve.svg?raw'
import Icon3 from '@/icons/filter/strapssleeves/selected/cap_sleeves.svg?component'
import Icon4 from '@/icons/filter/strapssleeves/hover/cap_sleeves.svg?component'
</script>
