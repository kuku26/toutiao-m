const express = require('express') // 引入 express 模块（当前文件夹下下载）
const app = express() // 实例化 app 服务器对象
// app.use(express.static(__dirname + '/public'))
app.use(express.static(`${__dirname}/public`)) // 设置服务器静态资源目录（目录下的文件都可以让浏览器直接访问）
// app.use(express.static.path.join(__dirname + '/public')

const http = require('http').Server(app) // 使用 http 模块，再实例化回 http 服务器对象
http.listen(4005) // 设置服务器端口
const io = require('socket.io')(http) // socket.io 要的是 http 对象，不是 express 对象 - 服务器上 socket 服务对象

// io.on('connection') --- 固定的，用于 监测有没有人用 socket 服务连接我，触发后面的函数
io.on('connection', function (socket) { // socket 连接着对象
  // console.log('a user connected');
  socket.on('cTos', data => { // 谁来连接我，我就给谁绑定一个事件叫 cTos(随便), data 接收到的就是前端触发这个事件传递过来的聊天信息
    // io.sockets （拿到当前连接池里所有的 socket 对象 - 连接到我的所有人）， emit() 触发事件(前端事件叫 sToC) --- 广播
    io.sockets.emit('sToC', data) // 把当前收到的聊天信息，发送给所有连接着（前端）
  })
})
