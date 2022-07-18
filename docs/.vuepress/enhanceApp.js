import './public/prism.js';
import './public/prism.css';

export default ({
  Vue, // VuePress 正在使用的 Vue 构造函数
  options, // 附加到根实例的一些选项
  router, // 当前应用的路由实例
  siteData // 站点元数据
}) => {
  // ...做一些其他的应用级别的优化
  Vue.mixin({
    mounted() {
        import('wisdom-ui').then(function (m) {
            Vue.use(m.default)
        })
    },
  })
}