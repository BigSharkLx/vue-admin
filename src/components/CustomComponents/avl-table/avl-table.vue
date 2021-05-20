<template>
  <div class="antiy-table">
    <template>
      <el-table
        ref="antiyTable"
        v-loading="tableMsg.loading"
        :data="tableMsg.data"
        :tooltip-effect="tableConfig.tooltipTheme || 'dark'"
        :border="tableConfig.border"
        style="width: 100%"
        :header-row-class-name="tableConfig.headerClassName || ''"
        :row-class-name="rowClassName"
        :row-key="tableConfig.rowKey || ''"
        :max-height="tableConfig.height || '500'"
        @selection-change="handleSelectionChange"
        @row-click="rowClick"
        @sort-change="handleSortChange"
      >
        <el-table-column
          v-if="tableConfig.hasSelect"
          type="selection"
          width="55"
          :reserve-selection="tableConfig.reserveSelection || false"
        />
        <!-- 展开行 -->
        <el-table-column v-if="tableConfig.hasExpand" type="expand">
          <template slot-scope="props">
            <el-form
              label-position="left"
              inline
              class="demo-table-expand"
              @submit.native.prevent
            >
              <el-form-item
                v-for="item in tableConfig.expands"
                :key="item.id"
                :label="item.label"
              >
                <span>{{ props.row[item.prop] }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <template v-for="item in tableConfig.columns">
          <el-table-column
            v-if="showColumns(item)"
            :key="item.id"
            :label="item.label"
            :prop="item.prop"
            :class-name="item.className ? item.className : ''"
            :width="item.width ? item.width : ''"
            :sortable="item.sortable"
            :min-width="item.minWidth ? item.minWidth : ''"
            :show-overflow-tooltip="!item.hideTooltip"
            :fixed="item.fixed"
            :align="item.align"
          >
            <!-- 自定义表头 -->
            <template v-if="item.showHeader" slot="header">
              <slot :name="item.headerProp" />
            </template>
            <template slot-scope="scope">
              <!-- 自定义模板  使用slot -->
              <template
                v-if="item.show === 'template' || item.showType === 'template'"
              >
                <slot :name="item.prop" :scope="scope" />
              </template>
              <!-- 正常渲染数据列 -->
              <template v-else-if="item.show !== 'template'">
                {{
                  item.formatData
                    ? item.formatData(scope.row[item.prop])
                    : scope.row[item.prop]
                }}
              </template>
            </template>
          </el-table-column>
        </template>
        <!-- 操作列 -->
        <el-table-column
          v-if="tableConfig.hasOperation"
          column-key="operation"
          :label="tableConfig.operation.label"
          :width="
            tableConfig.operation.width ? tableConfig.operation.width : ''
          "
          :min-width="
            tableConfig.operation.minWidth ? tableConfig.operation.minWidth : ''
          "
          :class-name="tableConfig.operation.className"
          :fixed="tableConfig.operation.fixed"
        >
          <template slot-scope="scope">
            <slot name="operation" :scope="scope">
              <el-button
                v-for="item in tableConfig.operation.data"
                :key="item.id"
                :class="item.classname ? item.classname : ''"
                :size="item.size || 'small'"
                :type="item.type || ''"
                @click.stop="handleOperation(item, scope.row)"
              >
                {{ item.label }}
              </el-button>
            </slot>
          </template>
        </el-table-column>
      </el-table>
      <div class="clearfix">
        <el-pagination
          v-if="!tableConfig.pagination.hidden"
          class="pagination-right--special"
          :background="
            tableConfig.pagination && tableConfig.pagination.background
          "
          :current-page="requestParamsOrData.page"
          :page-sizes="tableConfig.pageSizeArr"
          :page-size="requestParamsOrData.size"
          layout="total,prev, pager, next,sizes,jumper"
          :total="tableMsg.totalCount"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </template>
  </div>
</template>

<script>
import fieldPermissions from '@/mixin/fieldPermissions'
export default {
  name: 'AvlTable',
  mixins: [fieldPermissions],
  props: {
    //   表格配置
    tableConfig: {
      type: Object,
      required: true,
      default() {
        return {
          pageSizeArr: [10, 20, 50, 100],
          border: false, // 是否带有纵向边框，默认为false
          hasSelect: false, // 有无选中功能
          hasOperation: false, // 有无操作功能
          hasExpand: false, // 有无展开行功能
          rowClick: false, // 是否开启行点击
          columns: [],
          operation: {},
          expands: [],
          searchProp: {},
          formatTableData: (res) => res
        }
      }
    },
    // 请求配置  返回一个·promise
    requestFun: {
      type: Function
    },
    tableDataProp: {
      type: Array,
      default: () => {
        return []
      }
    },
    // 动态配置项(查询参数)
    requestParamsOrData: {
      type: Object,
      default() {
        return {
          page: 1,
          size: 10
        }
      }
    },
    // 初始不发请求（适用于页面初始加载业务组件传参查询的情况）
    initPersonTable: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      tableMsg: {
        data: [],
        totalCount: 0,
        loading: false
      }
    }
  },
  watch: {
    // 查询参数变化就重新请求
    requestParamsOrData(val) {
      this.getData()
    },
    tableDataProp(newValue, oldValue) {
      this.tableMsg.data = newValue
    }
  },
  created() {
    if (this.initPersonTable) {
      return
    }
    this.getData()
  },
  methods: {
    handleSelectionChange(val) {
      this.$emit('onHandleSelectionChange', val)
    },
    handleOperation(item, row) {
      this.$emit('onOperateBtn', {
        item,
        row
      })
    },
    handleSizeChange(val) {
      this.$emit('onHandleSizeChange', val)
    },
    handleCurrentChange(val) {
      this.$emit('onHandleCurrentChange', val)
    },
    clearSelection() {
      this.$refs['antiyTable'].clearSelection()
    },
    toggleRowSelection(...args) {
      if (!args || !args.length) {
        return
      }
      const rows = args[0]
      if (args.length === 2) {
        if (rows && rows.length) {
          rows.forEach((row) => {
            this.$refs.antiyTable.toggleRowSelection(row, args[1])
          })
        } else {
          this.$refs.antiyTable.clearSelection()
        }
      } else if (args.length === 1) {
        if (rows && rows.length) {
          rows.forEach((row) => {
            this.$refs.antiyTable.toggleRowSelection(row)
          })
        }
      }
    },
    // 排序
    handleSortChange(val) {
      this.$emit('onHandleSortChange', val)
    },
    // 点击某一行时触发的函数
    // *** 按下左键然后移动鼠标到其它列放开左键，会有报错 -- 优化：添加点击行参数，
    rowClick(Row, Event, Column) {
      if (
        !Column.rowClick ||
        !Column ||
        Column.type === 'selection' ||
        Column.columnKey === 'operation' ||
        Column.type === 'expand'
      ) {
        return
      }
      const data = {
        row: Row,
        event: Event,
        column: Column
      }
      this.$emit('onRowClick', data)
    },
    // 行类名的回调函数
    // 在表格数据中添加class字段即为表格行类名，配合css可对表格行中的自定义标签进行样式优化
    rowClassName(rowdata) {
      const data = this.tableMsg?.data
      let className = data[rowdata.rowIndex]?.class
        ? data[rowdata.rowIndex].class
        : ''
      if (className?.length === 0) {
        return
      }
      className = className.join(' ')
      return className
    },
    // 格式化请求参数
    formatSearch() {
      let params = {}
      let data = {}
      for (const k in this.requestParamsOrData) {
        if (
          this.tableConfig.searchProp[k] &&
          this.tableConfig.searchProp[k] === 'params'
        ) {
          params = {
            ...params,
            [k]: this.requestParamsOrData[k]
          }
        } else {
          data = {
            ...data,
            [k]: this.requestParamsOrData[k]
          }
        }
      }
      const finalObj =
        JSON.stringify(params) === '{}' ? { data } : { params, data }
      return finalObj
    },
    // 可配置请求数据
    getData() {
      this.tableMsg.loading = true
      const config = this.formatSearch()
      const formatData = this.tableConfig.formatTableData
      if (this.requestFun) {
        this.requestFun(config.data, config.params).then(
          (res) => {
            this.tableMsg.loading = false
            this.tableMsg.data = formatData(res).data
            this.tableMsg.totalCount = formatData(res).totalCount
          },
          () => {
            this.tableMsg.data = []
            this.tableMsg.totalCount = 0
            this.tableMsg.loading = false
            // this.$message.error("获取数据失败!");
          }
        )
      } else if (this.tableDataProp) {
        this.tableMsg.data = [...this.tableDataProp]
        this.tableMsg.totalCount = this.tableMsg.data.length
        this.tableMsg.loading = false
      }
    },
    showColumns(item) {
      // 字段权限
      return (
        !item.alwaysHidden &&
        item.show !== false &&
        !this.hideField(item.prop)
      )
    }
  }
}
</script>

<style>
.pagination-right--special {
  margin-top: 15px;
  float: right;
}
.antiy-table .el-table th,
.el-table td {
  padding: 8px 0;
}
.antiy-table .el-table {
  font-size: 12px;
}
.antiy-table .el-table .el-button {
  font-size: 12px;
}
</style>
