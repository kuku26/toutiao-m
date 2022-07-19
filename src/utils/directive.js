// 对 Vue 的全局指令，进行封装
// 封装中间件函数插件
const directiveObj = {
  install (Vue) {
    // 自定义全局指令
    Vue.directive('fofo', {
      inserted (el) {
        fn(el)
      },
      updated (el) {
        fn(el)
      }
    })
  }
}

function fn (el) {
  // 指令所在 van-search 组件中
  // 组件根标签是 div, input 在这个 div 内部
  // 以上都是原生标签对象
  // 搜索页面 el 是 div
  // 以后 el 还可能是 input
  // 知识点：原生DOM.nodeName 拿到标签名字（注意：大写的字符串）
  if (el.nodeName === 'INPUT' || el.nodeName === 'TEXTAREA') {
    el.focus()
  } else {
    // el 本身不是输入框，尝试往里获取一下
    setTimeout(() => {
      const theInput = el.querySelector('input')
      const TheTextArea = el.querySelector('textarea')
      // 判断：不一定能获取得到，需要加判断，有值了，再执行 .focus() 才不报错
      if (theInput) theInput.focus()
      if (TheTextArea) TheTextArea.focus()
    })
  }
}

export default directiveObj
