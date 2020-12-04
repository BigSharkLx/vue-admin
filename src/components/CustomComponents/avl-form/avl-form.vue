<template>
  <div class="at-form-search-wrap" v-loading="loading">
    <div class="at-form--search" v-if="!loading">
      <component
        v-for="item in mainConfig"
        :ref="item.propName"
        :key="item.id"
        v-bind:is="item.type"
        v-on="$listeners"
        :configData="item"
        @handleEventChange="handleEventChange"
      >
      </component>
      <!-- 自定义组件 -->
      <!-- 时间选择器 -->
      <slot name="timePicker"></slot>
      <!-- 日期选择器 -->
      <slot name="datePicker"></slot>
      <!-- 日期时间选择器 -->
      <slot name="dateTimePicker"></slot>
      <!-- 默认插槽 -->
      <slot></slot>
      <div class="at-form-right-btn">
        <el-button type="primary" size="small" @click="handleSearchVal"
          >搜索</el-button
        >
        <el-button size="small" @click="resetForm">重置</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import AvlRadioGroup from "./searchFormComponents/AvlRadioGroup";
import AvlCheckboxGroup from "./searchFormComponents/AvlCheckboxGroup";
import AvlInput from "./searchFormComponents/AvlInput";
import AvlSelect from "./searchFormComponents/AvlSelect";
import AvlCascader from "./searchFormComponents/AvlCascader";
import AvlSwitch from "./searchFormComponents/AvlSwitch";
export default {
  name: "AvlForm",
  data() {
    return {
      allPropsVal: {},
      mainConfig: [],
      loading: false,
    };
  },
  props: {
    formConfig: {
      type: Array,
      required: true,
    },
    formConfigAsync: {
      type: Function,
    },
    initPersonForm: {
      type: Boolean,
      default: false,
    },
  },

  components: {
    "avl-radio": AvlRadioGroup,
    "avl-checkbox": AvlCheckboxGroup,
    "avl-input": AvlInput,
    "avl-select": AvlSelect,
    "avl-cascader": AvlCascader,
    "avl-switch": AvlSwitch,
  },
  created() {
    if (!this.initPersonForm) {
      this.regetData();
    }
  },
  methods: {
    handleSearchVal() {
      this.$emit("handleFormSearchVal", this.allPropsVal);
    },
    // 内部接受数据为搜索提供数据来源
    handleEventChange(val) {
      this.allPropsVal = {
        ...this.allPropsVal,
        ...val,
      };
    },
    // 重置数据
    resetForm(formName) {
      for (let k in this.$refs) {
        this.$refs[k][0].clearSearVal();
      }
      this.$emit("resetSlot");
      this.handleSearchVal();
    },
    regetData(data) {
      if (!this.formConfig.length && this.formConfigAsync) {
        this.loading = true;
        this.formConfigAsync(data).then((res) => {
          this.mainConfig = res;
          this.loading = false;
        });
      } else {
        this.mainConfig = this.formConfig;
      }
    },
  },
};
</script>

<style lang="scss">
.at-form-search-wrap {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;

  .at-form--search {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    flex: 1;
    padding: 20px 20px 0 20px;
    background-color: $formBacgroundColor;
  }
  .at-form-component {
    margin-right: 50px;
    margin-bottom: 20px;
  }
  .at-form-right-btn {
    margin-bottom: 20px;
    .el-button--small {
      padding: 9px 33px;
    }
  }
}
</style>