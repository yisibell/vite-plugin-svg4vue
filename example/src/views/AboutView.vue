<template>
  <div class="about">
    <div>
      <h1>This is an about page</h1>

      <h2>svg component</h2>
      <DuiChengSvg width="48" height="48" />
      <DuiXiangSvg width="48" height="48" />
      <FangChengXuanZeSvg width="48" height="48" />
      <FangzhencanshuSvg width="48" height="48" />
      <PPTSvg />

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

export default defineComponent({
  components: {
    DuiChengSvg,
    DuiXiangSvg,
    FangChengXuanZeSvg,
    FangzhencanshuSvg,
    PPTSvg,
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

  svg {
    path {
      fill: aquamarine;
    }
  }
}
</style>
