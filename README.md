# 原型工具画布 概要设计文档

## 背景

旧的项目由于历史原因用到大量的 class 的继承, 类似于 mixins 的副作用, 伴随使项目变大, 变的极难维护.
再加上项目原始的开发和构建的搭建配置使开发效率过低, 代码规范不明确等等问题.
重构的目的: 重新设计框架底层, 提供更简单易用的接口, 更好的性能.

## 关键业务流程

## 关键技术描述

- 主体框架语言还是 TypeScript + React(hooks);
- 整体数据不可变库使用 Immer 替换 ImmutableJS, Immer 的 api 非常简单, 非常适合 React,性能比 ImmutableJS+toJS 要好. 实际项目中基础组件的开发也不应该受到不可变库的影响. 如果使用 draftJS,需要配合 ImmutableJS, 可以在局部使用.
- css 使用 scss 和 css modules 避免全局污染, .module.scss 后缀使用 css modules, .scss 全局引入. 使用 babel-react-css-modules 自动转化 styleName 成局部 className;

## 模块拆分

- 工具栏(Toolbar)
- 组件列表(ComponentList)
- 画布中心组件的显示(Page)
- 组件详情(DetailPanel)

思维导图描述

## 目录说明

```
root
├── build                 打包文件
├── config                打包文件配置
├── src
│   ├── editor            框架结构
│   ├── items             画布组件
│   ├── style             全局的样式
│   ├── svg               svg文件(可直接引用为组件)
│   └── utils             公共工具方法
└── typings               补充的声明文件

```

## 命名规范

### git commit message

遵循[Angular 约定](https://github.com/angular/angular/blob/22b96b9/CONTRIBUTING.md#-commit-message-guidelines)

```
<type>(<scope>): <subject>
<BLANK LINE>
<body>
<BLANK LINE>
<footer>

```

Samples:

```
fix: A bug fix

feat: A new feature

```

### 组件命名

- `props`中的方法一定要`on`开头

- 处理事件的方法用`handle`开头

- 修改 state 的值的方法一般用`change`开头
