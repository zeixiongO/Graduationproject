<template>
  <RouterView />
</template>

<script setup>
import { RouterView, useRoute } from 'vue-router'
</script>

<style>
html {
  width: 100%;
  font-family: 'Source Sans Pro', sans-serif;
  font-size: 16px;
  color: var(--primary-color);
  min-width: var(--center-width);
  overflow: auto;
}


:root {
  --primary-color: #13227a;
  --center-width: 960px;
  --borderColor: #13227a;

  --el-color-primary: #13227a;
  --el-color-primary-light-3: #1f34ac;
  --el-color-primary-dark-2: #0a1343;
  --el-color-primary-light-5: #8799ff;
  --el-color-primary-light-7: #a1afff;
  --el-color-primary-light-9: #f5f7ff;
  --el-color-primary-light-8: #c1caff;
}

.el-table .cell {
  word-break: keep-all !important;
  white-space: nowrap !important
}

/* 小屏手机 */
@media all and (max-width:320px) {
  html {
    font-size: 12px;
  }
}

/* 中屏手机 375px */
@media all and (min-width:321px) and (max-width:375px) {
  html {
    font-size: 14px;
  }
}

/* 大屏手机 414px */
@media all and (min-width:414px) {
  html {
    font-size: 16px;
  }
}
</style>
