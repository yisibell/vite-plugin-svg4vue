<template>
  <div class="about">
    <div>
      <h1>This is an about page</h1>

      <h2>svg component</h2>
      <DuiChengSvg font-size="48" />
      <DuiXiangSvg font-size="48" />
      <FangChengXuanZeSvg font-size="48" />
      <FangzhencanshuSvg font-size="48" />
      <PPTSvg fill="red" font-size="48" />
      <WordSvg />

      <h2>svg url</h2>
      <p>
        <img :src="logoSvgUrl" alt="" width="36" />
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import logoSvgUrl from '@/icons/logo.svg?url'
import DuiChengSvg from '@/icons/duicheng.svg?component'
import DuiXiangSvg from '@/icons/duixiang.svg?component'
import FangChengXuanZeSvg from '@/icons/fangchengxuanze.svg?component'
import FangzhencanshuSvg from '@/icons/fangzhencanshu.svg?component'
import PPTSvg from '@/icons/ppt.svg?component'
import WordSvg from '@/icons/word.svg?component'

export default defineComponent({
  components: {
    DuiChengSvg,
    DuiXiangSvg,
    FangChengXuanZeSvg,
    FangzhencanshuSvg,
    PPTSvg,
    WordSvg,
  },
  setup() {
    return {
      logoSvgUrl,
    }
  },
})
</script>

<style lang="scss">
.about {
  min-height: 100vh;
  display: flex;
  align-items: center;

  h2 {
    margin-bottom: 16px;
  }
}
</style>
