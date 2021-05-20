<template>
  <div class="at-form-component" :class="configData.className||''">
    <el-switch
      v-model="searchVal"
      v-bind="configData.config"
      :disabled="configData.disabled"
      :width="configData.width"
      @change="handleSearch"
    />
  </div>
</template>
<script>
import minxi from './mixin'
export default {
  mixins: [minxi]
}
</script>
