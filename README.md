# 中后台前端应用示例

文章系列「[聊聊中后台前端应用](https://ourai.ws/series/talking-about-frontend-of-web-based-management-systems/)」的辅助示例。

## 文章目录

- [前言](https://ourai.ws/posts/reason-for-talking-about-frontend-of-web-based-management-systems)
- [目录结构划分模式](https://ourai.ws/posts/patterns-of-directory-structure-in-frontend-projects)

## 包含功能

- 目录结构划分
  - 「野生」模式（[`structure/wild`](structure/wild) 文件夹）
  - 「分层」模式（[`structure/layered`](structure/layered) 文件夹）
  - 「模块化」模式（[`structure/modularized`](structure/modularized) 文件夹），此模式为本仓库所使用模式
- 模块系统
  - 模块注册与查找
  - 组件动态引用
- 上下文
  - 模块上下文
  - _TODO: 视图上下文_
- 路由配置
  - 生成导航菜单
  - _TODO: 访问权限控制_

## 本地预览

首先，确保 Node.js 的版本在 14，最好是 `14.15.3`。

`npm i` 安装好依赖后 `npm start` 启动。启动成功不会自动打开浏览器，要自己手动输入地址哦！
