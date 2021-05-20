export default {
  data() {
    return {
      searchVal: this.configData.defaultValue
    }
  },
  props: {
    configData: {
      type: Object,
      required: true
    }
  },
  methods: {
    // 每次改变值的触发回调(可用于支持数据改变就触发搜索)
    handleSearch() {
      this.$emit('handleEventChange', {
        [this.configData.propName]: this.searchVal
      })
    },
    // 重置搜索
    clearSearVal() {
      this.searchVal = this.configData.defaultValue
      this.$emit('handleEventChange', {
        [this.configData.propName]: this.configData.defaultValue
      })
    }
  }
}
