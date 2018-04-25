# vue-start-vux

> 一个快速启动项目的脚手架，加入了很多常用的公共类。

### 文档生成
cli执行 `jsdoc -c ./conf.json`

## 以下内容待完善

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report

# run unit tests
npm run unit

# run e2e tests
npm run e2e

# run all tests
npm test
```
```
leancloud demo没有用vue的例子。只有原生和angular。但公司项目使用vue，那就自己根据文档撸一个简易的通信（拉取聊天记录，发、收信息），模式属于N个用户找公司客服唠嗑。此文章仅作为了解leancloud im允许流程作为出发点的例子。具体扩展，请自行拓展，也可留言 互相学习。
```


我对leancloud Im了解的奔跑流程：
1、引入leancloud real sdk
2、配置key appid
3、拉取所有会话
4、根据会话，拉取初始聊天记录
5、建立接收信息
6、发送信息