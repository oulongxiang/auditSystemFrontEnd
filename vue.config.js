// 基础路径 注意发布之前要先修改这里
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
module.exports = {
  lintOnSave: true,
  productionSourceMap: false,
  assetsDir: 'static',
  publicPath: '/',

  devServer: {
    port: 8864,
    proxy: {
      '/AuditSystem/admin': { //此处要与 /services/api.js 中的 API_PROXY_PREFIX 值保持一致
        target: 'http://192.168.101.39:8098',
        changeOrigin: false,
        logLevel: 'debug',
      },
    },
  },
  chainWebpack: (config) => {
    //忽略的打包文件
    config.externals({
      'vue': 'Vue',
      'vue-router': 'VueRouter',
      'vuex': 'Vuex',
      'axios': 'axios',
      'element-ui': 'ELEMENT',
    })
    const entry = config.entry('app')
    entry
      .add('babel-polyfill')
      .end()
    entry
      .add('classlist-polyfill')
      .end()
  },
  css: {
    extract: { ignoreOrder: true }
  }
}