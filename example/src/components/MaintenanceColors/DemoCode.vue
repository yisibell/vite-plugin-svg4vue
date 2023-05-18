<template>
  <div class="demo">
    <div class="d-flex align-center">
      <div class="mr-16">
        <span class="mr-8">
          1. change color via <code>fill</code> attribute
        </span>
        <input v-model="fillColor" type="color" /> :
      </div>
      <span><PPTSvgIcon :fill="fillColor" /></span>
    </div>

    <div class="">
      <div class="mb-16">
        <span class="mr-8">
          2. change color via <code>fill</code> and
          <code>stroke</code> attribute:
        </span>
      </div>

      <div class="fs-12 pl-16">
        <span>Select a fill color: </span>
        <input v-model="fillColor2" type="color" class="mr-16" />
        <span>Select a stroke color: </span>
        <input v-model="strokeColor" type="color" />
      </div>
      <div><LineOutline :fill="fillColor2" :stroke="strokeColor" /></div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import LineOutline from '@/icons/line.svg?component'
import PPTSvgIcon from '@/icons/ppt.svg?component'

const fillColor = ref('#000000')
const fillColor2 = ref('#f4f0f2')
const strokeColor = ref('#cbbc15')
</script>
