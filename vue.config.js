module.exports = {
  lintOnSave: false,
  publicPath: './'
}

// 知识点： - 项目打包
// 1.运行 yarn build 打包命令，产生 dist 文件 -> src 下跟 main.js 有引入关系的打包输出到 dist 下
// 2.尝试用 vscode 中 LiveServer 网页运行插件（内置启动：5500 网页浏览服务）
// LiveServer 插件会把工作区（vscode编辑根目录当作服务器根目录）
// 问题：打开的 index.html 网页空白，控制台全是 404 错误
// 原因：打包时，webpack 在 index.html 中引入其他的打包文件路径全是/服务器根路径请求
// 运行时，是在5500 端口下运行，服务器根目录没有 css 和 js 文件夹，而是在 index.html 文件的隔壁(相对路径)

// 解决：让 webpack 打包时，引入其他文件要以 ./ 开头，而不能以 / 开头
// 在 vue.config.js 配置项目中，加入 publicPath: './' 重新打包
// 打包后观察 index.html 中，是看不见有什么变化的，但其实 ./ 是被省略了的
// 最后，只需要把 dist 文件夹，发给后端/运维工程师（专门管理服务器的） -> 上线部署
