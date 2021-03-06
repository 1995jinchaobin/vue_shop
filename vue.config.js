module.exports = {
  chainWebpack: config => {
    //发布模式
    config.when(process.env.NODE_ENV === 'production', config => {
      config
        .entry('app')
        .clear()
        .add('./src/main-prod.js')

        config.set('externals', {
          // 项目使用过的依赖
          vue: 'Vue',
          'vue-router': 'VueRouter',
          axios: 'axios',
          lodash: '_',
          echarts: 'echarts',
          nprogress: 'Nprogress',
          'vue-quill-editor': 'vueQuillEditor'
        })
        config.plugin('html').tap(args => {
          args[0].isProd = true
          return args
        })
    })
    //开发模式
    config.when(process.env.NODE_ENV === 'development', config => {
      config.entry('app').clear().add('./src/main-dev.js')
    })
    config.plugin('html').tap(args => {
      args[0].isProd = false
      return args
    })
  }
}