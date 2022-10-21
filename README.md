# Pio-ts

🎃 一个支持更换 Live2D 模型的 JS 插件 - TypeScript 版本

原版：[Pio](https://github.com/Dreamer-Paul/Pio)

原则上兼容原版，除了最新加的 Message 之外，仅提供 TypeScript 部分，以 Apache 2.0 重新发布

目前还处于开发阶段，有可能会有 bug

#### 兼容性

Paul_Pio 为 Pio 的别名

Pio.init 为 Pio.Init 的别名

可通过 Pio.RenderMessage(string|string[]) 发送消息，相比于原版的 Paul_Pio.message 不支持发送 HTML。

### 新增功能

#### JS 用户轻松创建环境

使用 Paul_Pio.CreateContainerToBody(宽，高) 可直接创建 Pio 所需条件

只需要再使用 let x = new Paul_Pio(/* args */) 即可使用

并且使用该方法会自动解决 canvas 模糊问题。

#### 公开接口

let x = new Paul_Pio(/* args */)

x.RenderMessage(string|string[], number) 发送消息

其中 number 可选参数，表示展示的时间，默认为随机 15 到 25 秒

x.Hide() 隐藏

x.Show() 显示

x.Init() 刷新看板娘

#### 控制按钮显示

在参数内添加

button: {
    info: false,
    home: false,
    totop: false,
    info: false
},

可关闭对应按钮

#### 根据设备大小自动减小大小

该功能需要替换 css 使用：[pio.css](https://github.com/YexuanXiao/Pio/blob/master/static/pio.css)

#### 返回顶部按钮

该功能需要替换 css 使用：[pio.css](https://github.com/YexuanXiao/Pio/blob/master/static/pio.css)

#### 更改原版 loadlive2d 修正错误

该功能需要替换 js 使用：[l2d.js](https://github.com/YexuanXiao/Pio/blob/master/static/l2d.js)

### 声明

该项目是本人学习 TypeScript 的练手项目