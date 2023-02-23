<template>
  <div>
    <div class="d-flex align-center">
      <label class="mr-12">
        Select a fill color:
        <input type="color" v-model="fillColor" />
      </label>

      <label class="mr-12">
        Select a stroke color:
        <input type="color" v-model="strokeColor" />
      </label>

      <LineOutline font-size="220" :fill="fillColor" :stroke="strokeColor" />
    </div>
  </div>
</template>

<script setup lang="ts">
import LineOutline from '@/icons/line.svg?component'
import { ref } from 'vue'

const fillColor = ref('#f4f0f2')
const strokeColor = ref('#cbbc15')
</script>
