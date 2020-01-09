import AvlTable from './avl-table/avl-table'
import AvlForm from './avl-form/avl-form'
const components = {
  AvlTable,
  AvlForm
};

const install = function (Vue, opts = {}) {
  Object.keys(components).forEach((key) => {
    Vue.component(key, components[key]);
  });
};
export default install;
