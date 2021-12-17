# 中后台前端应用

本仓库是文章系列「[聊聊中后台前端应用](https://ourai.ws/series/talking-about-frontend-of-web-based-management-systems/)」的辅助示例，同时也是中后台前端应用的样板。

## 主要功能

- 目录结构划分
  - 「[野生](app/structure/wild)」模式
  - 「[分层](app/structure/layered)」模式
  - 「[模块化](app/structure/modularized)」模式（本仓库所使用模式）
- HTTP 请求
  - 响应返回结构统一
- 模块系统
  - 模块注册与查找
  - 组件动态引用
- 上下文
  - 模块上下文
  - 视图上下文
- 路由
  - 导航菜单生成
  - _TODO: 页面/视图标题及面包屑生成_
  - 访问权限控制
- 页面/视图
  - 操作权限控制
  - 表格页面/视图配置化
  - 详情页面/视图配置化
  - 表单页面/视图配置化

## 实践指引

基于本仓库所秉承的思想的实践——

- [目录结构划分模式](cookbook/patterns-of-directory-structure.md)
- _TODO: 如何写部件与视图？_
