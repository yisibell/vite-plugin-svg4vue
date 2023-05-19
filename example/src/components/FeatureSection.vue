<template>
  <div class="feature-section" :style="styleVars">
    <div class="feature-desc">
      <div class="feature-desc__heading">FEATURES</div>
      <h1 class="feature-desc__title">
        <slot name="title"></slot>
      </h1>
      <p class="feature-desc__sub-title">
        <slot name="sub-title" />
      </p>

      <div class="feature-desc__demo">
        <div class="feature-desc__demo__title">Example:</div>
        <slot name="demo" />
      </div>
    </div>

    <div class="feature-code">
      <pre class="language-markup"><code><slot name="code" /></code></pre>
    </div>
  </div>
</template>

<script lang="ts" setup>
import 'prismjs'
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    reverse?: boolean
  }>(),
  {
    reverse: false,
  }
)

const styleVars = computed(() => ({
  '--flex-direction': props.reverse ? 'row-reverse' : 'row',
}))
</script>

<style lang="scss" scoped>
.feature-section {
  display: flex;
  justify-content: space-between;
  margin-bottom: 250px;
  flex-direction: var(--flex-direction);
  flex-wrap: wrap;
}

.feature-desc,
.feature-code {
  padding: 0 16px;
}

.feature-desc {
  width: 45%;

  &__heading {
    color: #e7585c;
    text-transform: uppercase;
    font-weight: bold;
    font-size: 0.9em;
  }

  &__title {
    font-size: 28px;
    color: var(--theme-title-color);
    margin-bottom: 26px;
  }

  &__sub-title {
    color: var(--theme-text-color);
    font-size: 14px;
  }

  &__demo {
    margin-top: 20px;

    &__title {
      margin-bottom: 16px;
      color: var(--theme-primary-color);
    }
  }
}

.feature-code {
  flex: 1;
}
</style>
