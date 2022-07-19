// 此处是封装 开发环境 和 生产环境 下 有打印 和 无打印的区别
// 1、开发环境，生产环境，是2套不同的环境
// 开发环境需要 console.log 使用
// 生产环境不需要 console.log 使用
// 让一套代码，在2个环境自动生效
// node.js 打包时执行 main.js 代码时，node内全局内置变量 process(固定)
// console.log(process.env)
// 2、服务器根目录下，可以新建环境变量配置文件（文件名固定）
// 脚手架环境 webpack 内置配好的，文件（可以修改的但是要该配置 - 自行百度）
// .env.development
// .env.production
// 3、环境变量文件中，定义变量名 NODE_ENY(固定)，BASE_URL(固定)，自定义变量名 VUE_APP_开头（也是规定）
// key名必须一致，因为写代码是一套代码.key名，会自动匹配环境变量值
// 4、yarn serve 启动项目，.env.development内变量挂载到 process.env 属性上
// yarn build 打包项目，.env.production内变量挂载到 process.env 属性上
if (process.env.NODE_ENV === 'production') {
  console.log = function () { } // 覆盖所有打印语句
  console.warning = function () { }
  console.dir = function () { }
  console.error = function () { }
}
