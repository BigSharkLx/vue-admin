<template>
  <div class="at-form-component" :class="configData.className || ''">
    <el-select
      v-if="configData.loadMore"
      v-model="searchVal"
      v-el-select-loadmore="debounce(loadMore)"
      :size="configData.size || ''"
      :placeholder="configData.placeholder || ''"
      v-bind="propAttrs"
      popper-class="form-component-popper"
      @change="handleSearch"
      @remove-tag="filterMethod('')"
      @clear="filterMethod('')"
    >
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="
          configData.getValueObject
            ? {
              value: item.value,
              label: item.label,
            }
            : item.value
        "
        :disabled="item.disabled"
        :title="item.label"
      />
    </el-select>
    <el-select
      v-else
      v-model="searchVal"
      :size="configData.size || ''"
      :placeholder="configData.placeholder || ''"
      v-bind="propAttrs"
      popper-class="form-component-popper"
      @change="handleSearch"
    >
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="
          configData.getValueObject
            ? {
              value: item.value,
              label: item.label,
            }
            : item.value
        "
        :disabled="item.disabled"
        :title="item.label"
      />
    </el-select>
  </div>
</template>
<script>
import minxi from './mixin'
import loadmore from '../directive/elSelectLoadmore/loadmore'
export default {
  directives: {
    'el-select-loadmore': loadmore
  },
  mixins: [minxi],
  data() {
    return {
      options: this.configData.defaultOptions || [],
      page: 1,
      size: this.configData.size || 30,
      totalPage: Infinity,
      filterVal: ''
    }
  },

  computed: {
    propAttrs() {
      let attrs = {}
      if (this.configData.clearable) {
        attrs = {
          ...attrs,
          clearable: true
        }
      }

      if (this.configData.filterable) {
        attrs = {
          ...attrs,
          filterable: true
        }
      }
      if (
        this.configData.filterable &&
        this.configData.getInitData &&
        this.configData.remote
      ) {
        attrs = {
          ...attrs,
          // remote: true,
          'filter-method': this.debounce(this.filterMethod)
        }
      }
      if (this.configData.multiple) {
        attrs = {
          ...attrs,
          multiple: true
        }
      }
      if (this.configData.multiple && this.configData.multipleLimit) {
        attrs = {
          ...attrs,
          'multiple-limit': this.configData.multipleLimit
        }
      }
      if (this.configData.multiple && this.configData.collapseTags) {
        attrs = {
          ...attrs,
          'collapse-tags': true
        }
      }
      return attrs
    }
  },
  async created() {
    //   如果不能给初始值  那就传入一个方法去获取值
    if (!this.configData.defaultOptions) {
      this.configData.defaultOptions = []
    }
    if (
      this.configData.defaultOptions.length === 0 && this.configData.getInitData
    ) {
      const res = await this.searchOptions()
      if (res && res.data) {
        this.options = res.data
        this.totalPage = res.totalPage
      }
    }
  },
  methods: {
    // 下拉加载更多
    async loadMore() {
      this.page++
      if (this.page > this.totalPage) return
      const res = await this.searchOptions()
      this.options = [...this.options, ...res.data]
    },
    // 远程搜索带分页功能
    async filterMethod(query) {
      this.filterVal = query
      this.page = 1
      const res = await this.searchOptions()
      this.options = res.data
      this.totalPage = res.totalPage
    },
    // 远程搜索功能
    async searchOptions() {
      const formatData = this.configData.formatFormData
        ? this.configData.formatFormData
        : (v) => v
      const data = {
        page: this.page,
        searchValue: this.filterVal
      }
      const res = await this.configData.getInitData(data)
      return formatData(res)
    },
    debounce(fn, delay = 500) {
      let timer
      return function(...args) {
        if (timer) {
          clearTimeout(timer)
        }
        timer = setTimeout(() => {
          fn.apply(this, args)
        }, delay)
      }
    },
    // 重置搜索(替换通用mixin)
    async clearSearVal() {
      this.searchVal = this.configData.defaultValue
      this.$emit('handleEventChange', {
        [this.configData.propName]: this.configData.defaultValue
      })
      // 重置还原备选项
      if (
        this.configData.filterable &&
        this.configData.getInitData &&
        this.configData.remote
      ) {
        this.page = 1
        this.filterVal = ''
        const res = await this.searchOptions()
        this.options = res.data
      }
    }
  }
}
</script>

<style lang="scss">
// 修改select框样式
.at-form-component {
  .el-select__tags-text {
    display: inline-block;
    max-width: 150px;
    @include text-ellipsis;
  }
}
.form-component-popper {
  .el-select-dropdown__list {
    max-width: 200px;
  }
}
</style>
